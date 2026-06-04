import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import { z } from "zod";

const invoiceSchema = z.object({
  type: z.enum(["FREIGHT", "GENERAL"]).default("FREIGHT"),
  partyName: z.string().min(1),
  partyGstin: z.string().optional(),
  partyAddress: z.string().optional(),
  dueDate: z.string().optional(),
  items: z.array(z.object({
    biltyId: z.string().optional(),
    description: z.string(),
    quantity: z.number().default(1),
    rate: z.number(),
    amount: z.number(),
    hsnCode: z.string().optional(),
    gstRate: z.number().default(0),
  })),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

function generateInvoiceNumber(): string {
  const prefix = "INV";
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}${year}${random}`;
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const skip = (page - 1) * limit;

    const where: any = { companyId: payload.companyId };
    if (status) where.status = status;
    if (search) where.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { partyName: { contains: search, mode: "insensitive" } },
    ];

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: "desc" },
        include: { items: true, payments: true },
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({ invoices, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const data = invoiceSchema.parse(body);

    const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
    const totalTax = data.items.reduce((sum, item) => sum + (item.amount * item.gstRate) / 100, 0);
    const totalAmount = subtotal + totalTax;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        type: data.type,
        partyName: data.partyName,
        partyGstin: data.partyGstin,
        partyAddress: data.partyAddress,
        dueDate: (data.dueDate && data.dueDate.trim() !== "") ? new Date(data.dueDate) : null,
        subtotal,
        taxableAmount: subtotal,
        totalTax,
        cgst: totalTax / 2,
        sgst: totalTax / 2,
        totalAmount,
        notes: data.notes,
        terms: data.terms,
        companyId: payload.companyId!,
        createdById: payload.userId,
        items: { create: data.items },
      },
      include: { items: true },
    });

    await prisma.activityLog.create({
      data: { userId: payload.userId, description: `Created Invoice ${invoice.invoiceNumber}`, module: "INVOICE" },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
