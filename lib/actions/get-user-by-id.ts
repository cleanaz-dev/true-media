import { prisma } from "../prisma";

export async function getUserById(id:string) {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        include: {
            accounts: true,
            
        }
    })
    return user
}