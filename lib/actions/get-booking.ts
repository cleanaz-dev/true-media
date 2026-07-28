import { prisma } from "../prisma";

export async function getBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        },
        include: {
            room: true,
            thread: true,
            user: {
                
            }
        }
    })
}