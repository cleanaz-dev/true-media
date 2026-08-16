"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
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

export const columns: ColumnDef<ContractsWithRelations>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
    filterFn: "includesString",
  },
  {
    id: "createdBy",
    accessorFn: (row) => row.createdBy?.name ?? row.createdBy?.email ?? "",
    header: "Created By",
    cell: ({ row }) =>
      row.original.createdBy ? (
        <div className="flex flex-col">
          <span>{row.original.createdBy.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.createdBy.email}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "template",
    accessorFn: (row) => row.template?.name ?? "",
    header: "Template",
    cell: ({ row }) =>
      row.original.template?.name ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "signers",
    header: "Signers",
    cell: ({ row }) => {
      const signers = row.original.signers;
      const signed = signers.filter((s) => s.status === "SIGNED").length;
      return (
        <span>
          {signed}/{signers.length} signed
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={statusStyles[status]} variant="secondary">
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "MMM d, yyyy"),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/admin/contracts/${row.original.id}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        View
      </Link>
    ),
  },
];