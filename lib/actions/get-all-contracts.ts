import { prisma } from "../prisma";

export async function getAllContracts() {
    const contracts = await prisma.contract.findMany({
        include: {
            createdBy: true,
            template: true,
            signers: true,
        }
    })
    return contracts
}