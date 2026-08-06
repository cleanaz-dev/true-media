import { prisma } from "../prisma";

export async function getAdminDashboardData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalUsers,
    newUsersThisMonth,
    usersLastMonth,
    totalRooms,
    bookingsByStatus,
    recentBookings,
    monthlyRevenueTransactions,
    totalRevenueAgg,
    bookingsLast30Days,
    bookingsPrevious30Days,
    recentTransactions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    prisma.room.count(),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        room: { select: { name: true, rate: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.transaction.findMany({
      where: {
        status: "SUCCEEDED",
        createdAt: { gte: startOfMonth },
      },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.transaction.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amount: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        createdAt: {
          gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
          lt: thirtyDaysAgo,
        },
      },
      select: { id: true },
    }),
    prisma.transaction.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        booking: { select: { id: true } },
      },
    }),
  ]);

  const statusCounts = bookingsByStatus.reduce(
    (acc, group) => {
      acc[group.status] = group._count.status;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalRevenue = totalRevenueAgg._sum.amount ?? 0;
  const monthlyRevenue = monthlyRevenueTransactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  );

  // Group revenue by day for the area chart
  const revenueByDay = monthlyRevenueTransactions.reduce(
    (acc, t) => {
      const date = t.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const revenueChartData = Object.entries(revenueByDay).map(
    ([date, amount]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: amount / 100,
    }),
  );

  // Group bookings by day for the last 7 days
  const bookingsByDay = bookingsLast30Days
    .filter((b) => b.createdAt >= sevenDaysAgo)
    .reduce(
      (acc, b) => {
        const date = b.createdAt.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const bookingChartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    return {
      date: d.toLocaleDateString("en-US", { weekday: "short" }),
      bookings: bookingsByDay[dateStr] || 0,
    };
  });

  // Status data for pie chart
  const statusChartData = bookingsByStatus.map((s) => ({
    name: s.status,
    value: s._count.status,
  }));

  const activeBookings =
    (statusCounts.BOOKED ?? 0) + (statusCounts.ONGOING ?? 0);
  const userGrowth = newUsersThisMonth - usersLastMonth;
  const bookingGrowth = bookingsLast30Days.length - bookingsPrevious30Days.length;

  return {
    totalUsers,
    newUsersThisMonth,
    userGrowth,
    totalRooms,
    statusCounts,
    activeBookings,
    bookingGrowth,
    recentBookings,
    totalRevenue,
    monthlyRevenue,
    revenueChartData,
    bookingChartData,
    statusChartData,
    recentTransactions,
  };
}

export type AdminDashboardData = Awaited<
  ReturnType<typeof getAdminDashboardData>
>;