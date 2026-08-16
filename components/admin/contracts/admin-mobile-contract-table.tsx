"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ContractStatus } from "@/lib/generated/prisma/client";
import { ContractsWithRelations } from "./admin-contract-page";

const statusStyles: Record<ContractStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  SENT: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  PARTIALLY_SIGNED: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  COMPLETED: "bg-green-100 text-green-700 hover:bg-green-100",
  VOIDED: "bg-red-100 text-red-700 hover:bg-red-100",
};

interface AdminMobileContractsTableProps {
  contracts: ContractsWithRelations[];
}

export function AdminMobileContractsTable({
  contracts,
}: AdminMobileContractsTableProps) {
  if (!contracts.length) {
    return (
      <div className="flex h-24 items-center justify-center rounded-md border text-sm text-muted-foreground">
        No contracts found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {contracts.map((contract) => {
        const signed = contract.signers.filter(
          (s) => s.status === "SIGNED",
        ).length;

        return (
          <Link
            key={contract.id}
            href={`/admin/contracts/${contract.id}`}
            className="flex flex-col gap-2 rounded-md border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{contract.title}</span>
              <Badge
                className={statusStyles[contract.status]}
                variant="secondary"
              >
                {contract.status.replace("_", " ")}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              {contract.createdBy?.name ?? "Unknown"} ·{" "}
              {contract.template?.name ?? "No template"}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {signed}/{contract.signers.length} signed
              </span>
              <span>{format(new Date(contract.createdAt), "MMM d, yyyy")}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}