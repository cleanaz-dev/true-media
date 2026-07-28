import { prisma } from "../prisma";

export async function getRooms() {
    const data = await prisma.room.findMany();

    return data;
}