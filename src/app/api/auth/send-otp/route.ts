import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, getOTPExpiry } from "@/lib/auth";
import { sendEmailOTP, sendSMSOTP } from "@/lib/communication";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new OTP & Expiry
    const newOtp = generateOTP();
    const expiry = getOTPExpiry();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: newOtp,
        otpExpiry: expiry
      }
    });

    // Send code via SMS only
    if (user.phone) {
      await sendSMSOTP(user.phone, newOtp);
    }

    return NextResponse.json({ message: "Verification OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Failed to resend verification OTP" }, { status: 500 });
  }
}
