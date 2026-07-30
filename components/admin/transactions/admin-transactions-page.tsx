"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminPageHeader } from "../admin-page-header";
import { Receipt } from "lucide-react";
import { getAllTransactions } from "@/lib/actions/get-all-transactions";
import { AdminTransactionTable } from "./admin-transaction-table";

export type TransactionsWithRelations = Awaited<
  ReturnType<typeof getAllTransactions>
>[number];

interface AdminTransactionsPageProps {
  transactions: TransactionsWithRelations[];
}

export function AdminTransactionsPage({ transactions }: AdminTransactionsPageProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pt-8">
        <AdminPageHeader
          description="View and manage all transactions here."
          icon={Receipt}
        />
      </div>

      <ScrollArea className="flex-1 px-4 md:px-8 pb-8 mt-6">
        <AdminTransactionTable data={transactions} />
      </ScrollArea>
    </div>
  );
}