"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TransactionsWithRelations } from "./admin-transactions-page";

function formatCurrency(amountInCents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  SUCCEEDED: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

const providerLabel: Record<string, string> = {
  STRIPE: "Stripe",
  CASH: "Cash",
  ETRANSFER: "E-Transfer",
};

export const columns: ColumnDef<TransactionsWithRelations>[] = [
  {
    accessorKey: "user",
    header: "Tenant",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      );
    },
    filterFn: (row, _columnId, filterValue: string) => {
      const user = row.original.user;
      const search = filterValue.toLowerCase();
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      formatCurrency(row.original.amount, row.original.currency),
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) =>
      providerLabel[row.original.provider] ?? row.original.provider,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusVariant[status] ?? "secondary"}>{status}</Badge>
      );
    },
  },
  {
    accessorKey: "bookingId",
    header: "Booking",
    cell: ({ row }) => {
      const booking = row.original.booking;
      if (!booking) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-sm">
          {format(new Date(booking.date), "MMM d, yyyy")}
        </span>
      );
    },
  },
  {
    accessorKey: "externalId",
    header: "Reference",
    cell: ({ row }) =>
      row.original.externalId ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy p"),
  },
  {
    id: "receipt",
    header: "Receipt",
    cell: ({ row }) => {
      const url = row.original.receiptUrl;
      if (!url) return null;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm underline"
        >
          View
        </a>
      );
    },
  },
];