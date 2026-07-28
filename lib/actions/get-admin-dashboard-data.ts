import { prisma } from "../prisma";

export async function getAdminDashboardData() {
  const [totalUsers, totalRooms, bookingsByStatus, recentBookings] =
    await prisma.$transaction([
      prisma.user.count(),
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
    ]);

  const statusCounts = bookingsByStatus.reduce(
    (acc, group) => {
      acc[group.status] = group._count.status;
      return acc;
    },
    {} as Record<string, number>,
  );

  const revenue = recentBookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.room.rate, 0);

  return {
    totalUsers,
    totalRooms,
    statusCounts,
    recentBookings,
    revenue,
  };
}