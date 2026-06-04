import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = inquirySchema.parse(body);

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        message: data.message,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been submitted successfully!",
      inquiryId: inquiry.id,
    }, { status: 201 });
  } catch (error) {
    console.error("Public inquiry error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
  }
}
