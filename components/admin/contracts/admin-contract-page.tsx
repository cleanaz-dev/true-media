"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminPageHeader } from "../admin-page-header";
import {  ScrollText } from "lucide-react";
import { AdminContractTable } from "./admin-contract-table";
import { getAllContracts } from "@/lib/actions/get-all-contracts";

export type ContractsWIthRelations = Awaited<
  ReturnType<typeof getAllContracts>
>[number];

interface AdminContractsPageProps {
  contracts: ContractsWIthRelations[];
}

export function AdminContractsPage({ contracts }: AdminContractsPageProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pt-8">
        <AdminPageHeader
          title="Contracts"
          description="View and manage all contracts here."
          icon={ScrollText}
        />
      </div>

      <ScrollArea className="flex-1 px-4 md:px-8 pb-8 mt-6">
        <AdminContractTable contracts={contracts} />
      </ScrollArea>
    </div>
  );
}
