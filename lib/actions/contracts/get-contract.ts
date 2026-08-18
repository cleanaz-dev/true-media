"use server";

import { prisma } from "@/lib/prisma";

export async function getContract(contractId: string) {
  const contract = await prisma.contract.findUnique({
    where: {
      id: contractId,
    },
    include: {
      signers: true,
    },
  });

  return contract;
}

// Extracted type representing the contract with signers (excluding null)
export type ContractWithSigners = NonNullable<
  Awaited<ReturnType<typeof getContract>>
>;