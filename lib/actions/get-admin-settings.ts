import { prisma } from "../prisma";

export async function getAdminSettings() {
    return await prisma.adminSettings.findFirst()
}