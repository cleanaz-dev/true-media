import { prisma } from "../prisma";

export async function getRoomById(roomId:string) {
    const room = await prisma.room.findUnique({
        where: {
            id: roomId
        },
        include: {
            bookings: {
                include: {
                    transactions: true
                }
            }
        }
    })
    return room
}