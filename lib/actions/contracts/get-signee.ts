"use server";

import { prisma } from "@/lib/prisma";

export async function getSignee(tokenId: string) {
  const signee = await prisma.contractSigner.findFirst({
    where: {
      signToken: tokenId,
    },
    include: {
      contract: true,
    },
  });
  return signee;
}

// Extracted type representing the contract with signers (excluding null)
export type SigneeWithContract = NonNullable<
  Awaited<ReturnType<typeof getSignee>>
>;
