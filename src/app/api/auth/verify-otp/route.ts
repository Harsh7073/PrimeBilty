import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP code are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if OTP matches and is not expired
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json({ error: "OTP code has expired" }, { status: 400 });
    }

    // Verify account and clear OTP
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null
      },
      include: { role: true }
    });

    // Create session tokens
    const payload = {
      userId: updatedUser.id,
      email: updatedUser.email,
      roleId: updatedUser.roleId,
      roleName: updatedUser.role.name,
      companyId: updatedUser.companyId || undefined,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Log verification activity
    await prisma.activityLog.create({
      data: {
        userId: updatedUser.id,
        description: "User verified account via OTP",
        module: "AUTH",
      },
    });

    const response = NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        roleId: updatedUser.roleId,
        roleName: updatedUser.role.name,
        companyId: updatedUser.companyId,
      },
      token: accessToken,
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
