// lib/actions/contracts/get-all-templates.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getAllContractTemplates() {
  return prisma.contractTemplate.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}