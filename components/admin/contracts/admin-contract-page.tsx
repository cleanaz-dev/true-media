// app/admin/contracts/page.tsx
"use client";

import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminPageHeader } from "../admin-page-header";
import { ScrollText, Plus, Upload } from "lucide-react";
import { AdminContractTable } from "./admin-contract-table";
import { getAllContracts } from "@/lib/actions/get-all-contracts";
import { useAdminLayout } from "@/context/layout-context";
import type { PageHeaderAction } from "@/hooks/use-page-header";

export type ContractsWithRelations = Awaited<
  ReturnType<typeof getAllContracts>
>[number];

interface AdminContractsPageProps {
  contracts: ContractsWithRelations[];
}

export function AdminContractsPage({ contracts }: AdminContractsPageProps) {
  const { openModal } = useAdminLayout();

  const actions: PageHeaderAction[] = useMemo(() => [
    {
      label: "Upload Template",
      variant: "outline",
      icon: Upload,
      onClick: () => openModal("UPLOAD_CONTRACT_TEMPLATE"), // Use standard openModal here
    },
    {
      label: "New Contract",
      href: "/admin/contracts/new",
      variant: "default",
      icon: Plus,
    },
  ], [openModal]);

  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pt-8">
        <AdminPageHeader
          title="Contracts"
          description="View and manage all contracts here."
          icon={ScrollText}
          action={actions} 
        />
      </div>

      <ScrollArea className="flex-1 px-4 md:px-8 pb-8 mt-6">
        <AdminContractTable contracts={contracts} />
      </ScrollArea>
    </div>
  );
}