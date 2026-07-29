import { prisma } from "../prisma";

export async function getAllBookings() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      room: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
}
