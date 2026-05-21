import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const companyId = payload.companyId;
    const isSuperAdmin = payload.roleName === "SUPER_ADMIN";
    const filter = isSuperAdmin ? {} : { companyId };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalVehicles,
      activeVehicles,
      totalBilties,
      activeBilties,
      inTransitBilties,
      deliveredBilties,
      monthlyBilties,
      lastMonthBilties,
      pendingInvoices,
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      recentBilties,
      recentActivities,
      totalUsers,
      totalCompanies,
    ] = await Promise.all([
      prisma.vehicle.count({ where: filter }),
      prisma.vehicle.count({ where: { ...filter, status: "ACTIVE" } }),
      prisma.bilty.count({ where: filter }),
      prisma.bilty.count({ where: { ...filter, status: "ACTIVE" } }),
      prisma.bilty.count({ where: { ...filter, status: "IN_TRANSIT" } }),
      prisma.bilty.count({ where: { ...filter, status: "DELIVERED" } }),
      prisma.bilty.count({ where: { ...filter, createdAt: { gte: startOfMonth } } }),
      prisma.bilty.count({ where: { ...filter, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.invoice.count({ where: { ...filter, status: "UNPAID" } }),
      prisma.invoice.aggregate({ where: filter, _sum: { totalAmount: true } }),
      prisma.invoice.aggregate({ where: { ...filter, createdAt: { gte: startOfMonth } }, _sum: { totalAmount: true } }),
      prisma.invoice.aggregate({ where: { ...filter, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { totalAmount: true } }),
      prisma.bilty.findMany({ where: filter, orderBy: { createdAt: "desc" }, take: 5, include: { vehicle: true, consignor: true, consignee: true } }),
      prisma.activityLog.findMany({ where: isSuperAdmin ? {} : { user: { companyId } }, orderBy: { createdAt: "desc" }, take: 10, include: { user: true } }),
      prisma.user.count(),
      prisma.company.count(),
    ]);

    // Monthly chart data (last 6 months)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const [biltyCount, revenue] = await Promise.all([
        prisma.bilty.count({ where: { ...filter, createdAt: { gte: monthStart, lte: monthEnd } } }),
        prisma.invoice.aggregate({ where: { ...filter, createdAt: { gte: monthStart, lte: monthEnd } }, _sum: { totalAmount: true } }),
      ]);
      chartData.push({
        month: monthStart.toLocaleDateString("en-IN", { month: "short" }),
        bilties: biltyCount,
        revenue: revenue._sum.totalAmount || 0,
      });
    }

    return NextResponse.json({
      isSuperAdmin,
      stats: {
        totalVehicles,
        activeVehicles,
        vehicleUtilization: totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0,
        totalBilties,
        activeBilties,
        inTransitBilties,
        deliveredBilties,
        monthlyBilties,
        biltyGrowth: lastMonthBilties > 0 ? Math.round(((monthlyBilties - lastMonthBilties) / lastMonthBilties) * 100) : 0,
        pendingInvoices,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
        lastMonthRevenue: lastMonthRevenue._sum.totalAmount || 0,
        revenueGrowth: (lastMonthRevenue._sum.totalAmount || 0) > 0
          ? Math.round((((monthlyRevenue._sum.totalAmount || 0) - (lastMonthRevenue._sum.totalAmount || 0)) / (lastMonthRevenue._sum.totalAmount || 1)) * 100)
          : 0,
        totalUsers,
        totalCompanies,
      },
      chartData,
      recentBilties,
      recentActivities,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
