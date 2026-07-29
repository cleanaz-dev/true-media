import { prisma } from "../prisma";

export async function getAllRooms() {
  const rooms = await prisma.room.findMany({
    include: {
      bookings: {
        include: {
          transactions: true,
        },
      },
    },
    orderBy: {
        name: "desc"
    }
  });

  return rooms
}
