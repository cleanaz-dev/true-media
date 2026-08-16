"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminPageHeader } from "../admin-page-header";
import { UsersRound, Plus } from "lucide-react";
import { getAllTenants } from "@/lib/actions/get-all-tenants";
import { AdminTenantsTable } from "./admin-tenants-table";

export type TenantsWithRelations = Awaited<
  ReturnType<typeof getAllTenants>
>[number];

interface AdminTenantsPageProps {
  tenants: TenantsWithRelations[];
}

export function AdminTenantsPage({ tenants }: AdminTenantsPageProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pt-8">
        <AdminPageHeader
          title="Tenants"
          description="View and manage all tenants here."
          icon={UsersRound}
          actions={[
            {
              label: "New Tenant",
              href: "/new",
              icon: Plus,
            },
          ]}
        />
      </div>

      <ScrollArea className="flex-1 px-4 md:px-8 pb-8 mt-6">
        <AdminTenantsTable data={tenants} />
      </ScrollArea>
    </div>
  );
}