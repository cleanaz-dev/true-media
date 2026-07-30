"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TransactionsWithRelations } from "./admin-transactions-page";

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

function formatCurrency(amountInCents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

interface AdminMobileTransactionsTableProps {
  transactions: TransactionsWithRelations[];
}

export function AdminMobileTransactionsTable({
  transactions,
}: AdminMobileTransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium">{transaction.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {transaction.user.email}
              </span>
            </div>
            <Badge variant={statusVariant[transaction.status] ?? "secondary"}>
              {transaction.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">
              {formatCurrency(transaction.amount, transaction.currency)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Provider</span>
            <span>{providerLabel[transaction.provider] ?? transaction.provider}</span>
          </div>

          {transaction.booking && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Booking date</span>
              <span>{format(new Date(transaction.booking.date), "MMM d, yyyy")}</span>
            </div>
          )}

          {transaction.externalId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="max-w-[60%] truncate">{transaction.externalId}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span>{format(new Date(transaction.createdAt), "MMM d, yyyy p")}</span>
          </div>

          {transaction.receiptUrl && (
            <a
              href={transaction.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start text-sm text-primary underline"
            >
              View receipt
            </a>
          )}
        </div>
      ))}
    </div>
  );
}