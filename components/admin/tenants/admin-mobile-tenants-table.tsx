"use client";

import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { TenantsWithRelations } from "./admin-tenants-page";
import { Card, CardContent } from "@/components/ui/card";

interface AdminMobileTenantsTableProps {
  table: TanstackTable<TenantsWithRelations>;
}

export function AdminMobileTenantsTable({ table }: AdminMobileTenantsTableProps) {
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <div className="flex p-8 items-center justify-center text-sm text-muted-foreground border rounded-xl">
        No tenants found.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {rows.map((row) => (
        <Card key={row.id} className="overflow-hidden">
          <CardContent className="p-4 flex flex-col gap-4">
            {/* Header: Name, Email & Actions */}
            <div className="flex items-center justify-between">
              {/* We render the "Name" cell directly which includes Avatar */}
              <div className="flex items-center gap-3">
                {flexRender(
                  row.getVisibleCells().find((c) => c.column.id === "name")?.column.columnDef.cell,
                  row.getVisibleCells().find((c) => c.column.id === "name")?.getContext()!
                )}
              </div>
              
              {/* Actions Dropdown */}
              <div>
                {flexRender(
                  row.getVisibleCells().find((c) => c.column.id === "actions")?.column.columnDef.cell,
                  row.getVisibleCells().find((c) => c.column.id === "actions")?.getContext()!
                )}
              </div>
            </div>

            {/* Grid for Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Phone</span>
                <span className="font-medium truncate">
                  {row.original.phone || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Status</span>
                <div className="mt-1">
                  {flexRender(
                    row.getVisibleCells().find((c) => c.column.id === "banned")?.column.columnDef.cell,
                    row.getVisibleCells().find((c) => c.column.id === "banned")?.getContext()!
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Bookings</span>
                <span className="font-medium">
                  {row.original.bookings?.length || 0}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Total Spent</span>
                <span className="font-medium">
                  {/* Reuse the spent cell formatter */}
                  {flexRender(
                    row.getVisibleCells().find((c) => c.column.id === "spent")?.column.columnDef.cell,
                    row.getVisibleCells().find((c) => c.column.id === "spent")?.getContext()!
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}