"use client";

import { useState } from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { columns } from "./admin-transaction-column";
import { AdminMobileTransactionsTable } from "./admin-mobile-transactions.table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionsWithRelations } from "./admin-transactions-page";

interface AdminTransactionsTableProps {
  data: TransactionsWithRelations[];
}

export function AdminTransactionTable({ data }: AdminTransactionsTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");

  const filteredData = data.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (providerFilter !== "ALL" && t.provider !== providerFilter) return false;
    return true;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const searchValue =
    (table.getColumn("user")?.getFilterValue() as string) ?? "";

  const statusItems = [
    { label: "All statuses", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Succeeded", value: "SUCCEEDED" },
    { label: "Failed", value: "FAILED" },
    { label: "Refunded", value: "REFUNDED" },
  ];

  const providerItems = [
    { label: "All providers", value: "ALL" },
    { label: "Stripe", value: "STRIPE" },
    { label: "Cash", value: "CASH" },
    { label: "E-Transfer", value: "ETRANSFER" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by tenant name or email..."
          value={searchValue}
          onChange={(e) =>
            table.getColumn("user")?.setFilterValue(e.target.value)
          }
          className="sm:max-w-sm"
        />

        <Select
          items={statusItems}
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value ?? "ALL")}
        >
          <SelectTrigger className="sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {statusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          items={providerItems}
          value={providerFilter}
          onValueChange={(value) => setProviderFilter(value ?? "ALL")}
        >
          <SelectTrigger className="sm:w-[160px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Provider</SelectLabel>
              {providerItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <div className="hidden rounded-md border md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        <AdminMobileTransactionsTable transactions={filteredData} />
      </div>
    </div>
  );
}
