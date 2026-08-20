// app/admin/contracts/page.tsx
"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminPageHeader } from "../admin-page-header";
import type { PageHeaderAction } from "@/components/admin/admin-page-header";
import { ScrollText, Plus, Upload } from "lucide-react";
import { AdminContractTable } from "./admin-contract-table";
import { getAllContracts } from "@/lib/actions/get-all-contracts";
import { TestContractModal } from "./test-contract-modal"; // ← changed

export type ContractsWithRelations = Awaited<
  ReturnType<typeof getAllContracts>
>[number];

interface AdminContractsPageProps {
  contracts: ContractsWithRelations[];
}

export function AdminContractsPage({ contracts }: AdminContractsPageProps) {
  const [isTestOpen, setIsTestOpen] = useState(false);

  const actions: PageHeaderAction[] = [
    {
      label: "Upload Template",
      href:"/admin/contracts/upload",
      variant: "outline",
      icon: Upload,
    },
    {
      label: "New Contract",
      href: "/admin/contracts/new",
      variant: "default",
      icon: Plus,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="md:px-8 md:pt-4 px-4 pt-2">
        <AdminPageHeader
          title="Contracts"
          description="View and manage all contracts here."
          icon={ScrollText}
          actions={actions}
        />
      </div>

      <ScrollArea className="flex-1 px-4 md:px-8 pb-8 mt-6">
        <AdminContractTable contracts={contracts} />
      </ScrollArea>

      <TestContractModal open={isTestOpen} onOpenChange={setIsTestOpen} />
    </div>
  );
}
