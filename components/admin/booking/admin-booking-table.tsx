"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  DoorOpen,
  Eye,
  MoreHorizontal,
  Pencil,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookingWithRelations } from "./admin-booking-page";

type BookingStatus = BookingWithRelations["status"];

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "border-amber-200 bg-amber-100 text-amber-700",
  BOOKED: "border-blue-200 bg-blue-100 text-blue-700",
  ONGOING: "border-purple-200 bg-purple-100 text-purple-700",
  COMPLETED: "border-emerald-200 bg-emerald-100 text-emerald-700",
  CANCELLED: "border-red-200 bg-red-100 text-red-700",
};

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

const columns: ColumnDef<BookingWithRelations>[] = [
  {
    accessorKey: "hapioBookingId",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-600">
        {row.original.hapioBookingId}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.user.name,
    id: "guestName",
    header: "Guest",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.user.name}</span>
        <span className="text-xs text-slate-500">
          {row.original.user.email}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.room.name,
    id: "roomName",
    header: "Room",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DoorOpen className="h-4 w-4 text-slate-400" />
        <span>{row.original.room.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.original.date), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "isPublic",
    header: "Visibility",
    cell: ({ row }) => (
      <Badge variant={row.original.isPublic ? "default" : "secondary"}>
        {row.original.isPublic ? "Public" : "Private"}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="h-8 w-8 p-0" />}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(booking.id)}
            >
              Copy booking ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit booking
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface AdminBookingTableProps {
  bookings: BookingWithRelations[];
}

export function AdminBookingTable({ bookings }: AdminBookingTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: bookings,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search reference, guest, room..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-slate-500">
          {table.getFilteredRowModel().rows.length} booking
          {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="rounded-md border">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  className="h-24 text-center text-slate-500"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm text-slate-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
