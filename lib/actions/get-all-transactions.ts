import { prisma } from "../prisma";

export async function getAllTransactions() {
    const transactions = await prisma.transaction.findMany({
        include: {
            booking: true,
            user: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return transactions
}
