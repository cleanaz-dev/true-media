"use client";

import { usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";

export type HeaderButtonVariant = VariantProps<typeof buttonVariants>["variant"];
export type HeaderButtonSize = VariantProps<typeof buttonVariants>["size"];

export interface PageHeaderAction {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: HeaderButtonVariant;
  size?: HeaderButtonSize;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface PageHeaderBadge {
  label: ReactNode;
  icon?: LucideIcon;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export interface UsePageHeaderOptions {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  /** Accepts a single action object (old way) OR an array (new way) */
  action?: PageHeaderAction | PageHeaderAction[];
  /** Read-only item (e.g. "124 Customers", status pill, etc.) */
  badge?: PageHeaderBadge | PageHeaderBadge[];
  /** Optional custom JSX rendered in the header */
  children?: ReactNode;
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
  customers: "Customers",
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

  if (last === "new" && parent) {
    return `New ${formatSegment(parent).replace(/s$/, "")}`;
  }

  if (last === "edit" && parent) {
    return `Edit ${formatSegment(parent).replace(/s$/, "")}`;
  }

  if (parent && (/^\d+$/.test(last) || /^[a-z0-9_-]{8,}$/i.test(last))) {
    return `${formatSegment(parent).replace(/s$/, "")} Details`;
  }

  return formatSegment(last);
}

export function usePageHeader(options?: UsePageHeaderOptions) {
  const pathname = usePathname();

  return useMemo(() => {
    const actions = options?.action
      ? Array.isArray(options.action)
        ? options.action
        : [options.action]
      : [];

    const badges = options?.badge
      ? Array.isArray(options.badge)
        ? options.badge
        : [options.badge]
      : [];

    return {
      title: options?.title ?? deriveTitle(pathname),
      description: options?.description,
      icon: options?.icon,
      actions,
      badges,
      children: options?.children,
    };
  }, [pathname, options]);
}