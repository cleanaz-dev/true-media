"use client"

import { useState, useRef, useEffect } from "react";
import {
  ChevronsUpDown,
  LogOut,
  Settings,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AdminUserMenu() {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  if (isPending) {
    return (
      <div className="h-10 w-full max-w-xs animate-pulse rounded-md bg-neutral-200" />
    );
  }

  const user = session?.user;
  if (!user?.name || !user?.email) return null;

  const initials = getInitials(user.name);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs font-sans">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`cursor-pointer flex w-full items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left transition-colors hover:bg-neutral-50 ${
          open ? "bg-neutral-100 ring-1 ring-neutral-300" : ""
        }`}
      >
        <Avatar image={user.image} name={user.name} initials={initials} />
        <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold text-neutral-900">
            {user.name}
          </span>
          <span className="truncate text-xs text-neutral-500">
            {user.email}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-neutral-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-[14rem] overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <Avatar image={user.image} name={user.name} initials={initials} />
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-neutral-900">
                {user.name}
              </span>
              <span className="truncate text-xs text-neutral-500">
                {user.email}
              </span>
            </div>
          </div>

          <div className="my-1 h-px bg-neutral-200" />

          <MenuItem
            icon={UserIcon}
            label="Profile"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            icon={Settings}
            label="Settings"
            onClick={() => setOpen(false)}
          />

          <div className="my-1 h-px bg-neutral-200" />

          <MenuItem
            icon={LogOut}
            label="Log out"
            destructive
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          />
        </div>
      )}
    </div>
  );
}

function Avatar({
  image,
  name,
  initials,
}: {
  image?: string | null;
  name: string;
  initials: string;
}) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-900 text-xs font-semibold text-white">
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        initials
      )}
    </span>
  );
}

function MenuItem({ icon: Icon, label, onClick, destructive }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-neutral-700 hover:bg-neutral-50"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}