import { prisma } from "../prisma";

export async function getRoomDetailsById(roomId: string) {
    const details = await prisma.room.findUnique({
        where: {
            id: roomId
        },
        include: {
            bookings: true
        }
    })

    return details
}