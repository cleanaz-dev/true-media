"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";

export interface PageHeaderAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface UsePageHeaderOptions {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: PageHeaderAction;
}

const TITLE_MAP: Record<string, string> = {
  admin: "Dashboard",
  bookings: "Bookings",
  tenants: "Tenants",
  rooms: "Rooms",
  transactions: "Transactions",
  settings: "Settings",
  profile: "Profile",
  users: "Users",
};

function formatSegment(segment: string): string {
  return (
    TITLE_MAP[segment] ||
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function deriveTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const start = segments[0] === "admin" ? 1 : 0;
  const relevant = segments.slice(start);

  if (relevant.length === 0) return "Dashboard";

  const last = relevant[relevant.length - 1];
  const parent = relevant[relevant.length - 2];

  // /admin/rooms/new → "New Room"
  if (last === "new" && parent) {
    return `New ${formatSegment(parent).replace(/s$/, "")}`;
  }

  // /admin/rooms/edit → "Edit Room"
  if (last === "edit" && parent) {
    return `Edit ${formatSegment(parent).replace(/s$/, "")}`;
  }

  // /admin/rooms/[id] or UUID/nanoid → "Room Details"
  if (
    parent &&
    (/^\d+$/.test(last) || /^[a-z0-9_-]{8,}$/i.test(last))
  ) {
    return `${formatSegment(parent).replace(/s$/, "")} Details`;
  }

  return formatSegment(last);
}

export function usePageHeader(options?: UsePageHeaderOptions) {
  const pathname = usePathname();

  return useMemo(
    () => ({
      title: options?.title ?? deriveTitle(pathname),
      description: options?.description,
      icon: options?.icon,
      action: options?.action,
    }),
    [pathname, options]
  );
}