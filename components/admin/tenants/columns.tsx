"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TenantsWithRelations } from "./admin-tenants-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<TenantsWithRelations>[] = [
  {
    id: "name", // Changed from accessorKey
    accessorFn: (row) => `${row.name} ${row.email}`, // This makes BOTH searchable!
    header: "Tenant",
    cell: ({ row }) => {
      const tenant = row.original;
      const initials = tenant.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={tenant.avatarUrl || ""} alt={tenant.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{tenant.name}</span>
            <span className="text-xs text-muted-foreground">{tenant.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.phone || "N/A"}
      </span>
    ),
  },
  {
    id: "stats",
    header: "Bookings",
    cell: ({ row }) => {
      const count = row.original.bookings?.length || 0;
      return <span className="text-sm font-medium">{count}</span>;
    },
  },
  {
    id: "spent",
    header: "Total Spent",
    cell: ({ row }) => {
      const totalCents = (row.original.transactions || [])
        .filter((t) => t.status === "SUCCEEDED")
        .reduce((sum, t) => sum + t.amount, 0);

      const formatted = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(totalCents / 100);

      return <span className="text-sm text-muted-foreground">{formatted}</span>;
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const isBanned = row.original.banned;
      return isBanned ? (
        <Badge variant="destructive" className="flex w-fit items-center gap-1">
          <ShieldAlert className="h-3 w-3" /> Banned
        </Badge>
      ) : (
        <Badge variant="default" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 flex w-fit items-center gap-1 border-0">
          <CheckCircle2 className="h-3 w-3" /> Active
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tenant = row.original;

      return (
        <DropdownMenu>
          {/* UPDATED: Using the new render prop for the trigger */}
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            {/* UPDATED: Using render={<button />} for click actions */}
            <DropdownMenuItem 
              render={<button onClick={() => navigator.clipboard.writeText(tenant.id)} />}
            >
              Copy Tenant ID
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* UPDATED: Using render={<Link />} for navigation */}
            <DropdownMenuItem render={<Link href={`/admin/tenants/${tenant.id}`} />}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`/admin/tenants/${tenant.id}/bookings`} />}>
              View Bookings
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              render={<button />}
              className={tenant.banned ? "text-emerald-600" : "text-destructive"}
            >
              {tenant.banned ? "Unban Tenant" : "Ban Tenant"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];