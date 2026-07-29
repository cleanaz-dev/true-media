import { prisma } from "../prisma";

export async function getAllTenants() {
  const tenants = await prisma.user.findMany({
    where: {
      role: "TENANT",
    },
    omit: {
        passwordHash: true
    },
    include: {
        bookings: true,
        tenantDetails: true,
        transactions: true
    }
  });
  return tenants;
}
