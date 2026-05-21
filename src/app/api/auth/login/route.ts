import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, signAccessToken, signRefreshToken, generateOTP, getOTPExpiry } from "@/lib/auth";
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

    // Generate a fresh OTP for login (2-Factor Authentication)
    const { generateOTP, getOTPExpiry } = require("@/lib/auth");
    const { sendSMSOTP } = require("@/lib/communication");
    const newOtp = generateOTP();
    const expiry = getOTPExpiry();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: newOtp,
        otpExpiry: expiry
      }
    });

    if (user.phone) {
      await sendSMSOTP(user.phone, newOtp);
    }

    return NextResponse.json({
      error: "Verification code sent. Please enter the OTP to login.",
      verified: false,
      email: user.email,
      phone: user.phone
    }, { status: 403 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
