import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, signAccessToken, signRefreshToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const cleanPhone = email.replace(/\D/g, "");

    // Search user by email or by phone matching criteria
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phone: email },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          ...(cleanPhone.length === 10 ? [{ phone: { endsWith: cleanPhone } }] : [])
        ]
      },
      include: { role: true, company: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session tokens
      const payload = {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role?.name || '',
        companyId: user.companyId || undefined,
      };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        description: "User logged in",
        module: "AUTH",
      },
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        roleId: user.roleId,
        roleName: user.role?.name || '',
        companyId: user.companyId,
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
  } catch (error: any) {
    console.error("Login error full details:", error);
    if (error instanceof Error) {
      console.error("Login error stack:", error.stack);
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Login failed: ${errorMsg}` }, { status: 500 });
  }
}
