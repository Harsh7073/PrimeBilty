import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAccessToken, signRefreshToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  companyName: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Get or create admin role
    let adminRole = await prisma.role.findFirst({ where: { name: "ADMIN" } });
    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: "ADMIN", description: "System Administrator", isSystem: true },
      });
    }

    // Ensure other system roles exist
    let managerRole = await prisma.role.findFirst({ where: { name: "MANAGER" } });
    if (!managerRole) {
      await prisma.role.create({
        data: { name: "MANAGER", description: "Manager with access to bills, reports and payments", isSystem: true },
      });
    }

    let staffRole = await prisma.role.findFirst({ where: { name: "STAFF" } });
    if (!staffRole) {
      await prisma.role.create({
        data: { name: "STAFF", description: "Staff member for entry-level operations", isSystem: true },
      });
    }

    // Create company
    const company = await prisma.company.create({
      data: { name: data.companyName },
    });

    // Create user (verified by default)
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        roleId: adminRole.id,
        companyId: company.id,
        emailVerified: true,
        otp: null,
        otpExpiry: null
      },
      include: { role: true },
    });

    try {
      // Seed default vehicle types
      const defaultVehicleTypes = ["Open Body", "Close Body", "Flat Bed", "Trailer", "Container", "Tanker"];
      await prisma.vehicleType.createMany({
        data: defaultVehicleTypes.map(name => ({ name })),
      });
    } catch(e) {}

    try {
      // Seed default units
      const defaultUnits = [
        { name: "Bale", symbol: "Bale" },
        { name: "Ton", symbol: "T" },
        { name: "Metric Ton", symbol: "MT" },
        { name: "Pallet", symbol: "Plt" },
        { name: "Box", symbol: "Box" },
        { name: "Set", symbol: "Set" },
        { name: "Vehicle", symbol: "Veh" },
        { name: "Kg", symbol: "Kg" },
        { name: "Litre", symbol: "Ltr" },
      ];
      await prisma.unit.createMany({
        data: defaultUnits,
      });
    } catch(e) {}

    try {
      // Seed subscription plans
      const plans = [
        { name: "Starter", price: 999, yearlyPrice: 9990, maxUsers: 2, maxVehicles: 10, maxBranches: 1, features: JSON.stringify(["10 Vehicles", "2 Users", "Bilty Module", "Basic Reports"]) },
        { name: "Standard", price: 1999, yearlyPrice: 19990, maxUsers: 5, maxVehicles: 50, maxBranches: 3, features: JSON.stringify(["50 Vehicles", "5 Users", "All Modules", "Advanced Reports", "Invoice Module"]), isPopular: true },
        { name: "Advanced", price: 3999, yearlyPrice: 39990, maxUsers: 15, maxVehicles: 200, maxBranches: 10, features: JSON.stringify(["200 Vehicles", "15 Users", "All Modules", "Custom Reports", "Multi-Branch", "Priority Support"]) },
        { name: "Enterprise", price: 9999, yearlyPrice: 99990, maxUsers: 999, maxVehicles: 9999, maxBranches: 999, features: JSON.stringify(["Unlimited Vehicles", "Unlimited Users", "Custom Development", "Dedicated Support", "SLA"]) },
      ];
      await prisma.subscriptionPlan.createMany({ data: plans });
    } catch(e) {}

    // Create session tokens
    const payload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
      companyId: user.companyId || undefined,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        description: "User registered and logged in",
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
        roleName: user.role.name,
        companyId: user.companyId,
      },
      token: accessToken,
    }, { status: 201 });

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
    console.error("Register error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Registration failed: ${errorMsg}` }, { status: 500 });
  }
}
