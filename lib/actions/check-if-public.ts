import { prisma } from "../prisma";

export async function checkIfPublic(bookingId: string) {
    const isPublic = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            isPublic: true
        }
    })

    return isPublic
}