"use client";

import { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) return null;

  if (!session?.user) {
    return (
      <a
        href="/sign-in"
        className="fixed right-4 top-4 z-50 rounded-md border border-zinc-300 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        Sign in
      </a>
    );
  }

  const { user } = session;
  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  };

  return (
    <div className="fixed right-4 top-4 z-50" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-sm font-medium text-white ring-2 ring-white ring-offset-2 ring-offset-zinc-200 focus:outline-none transition-all duration-300 hover:scale-105 hover:ring-zinc-300 hover:shadow-lg"
      >
        {user.image ? (
          <img 
            src={user.image} 
            alt={user.name || "User"} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        ) : (
          initials
        )}

        {/* Glimmer / Light Sweep Overlay */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-zinc-200 bg-white py-1 shadow-lg">
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-zinc-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-zinc-500">{user.email}</p>
          </div>

          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Profile
          </a>

          {(user as any).role === "ADMIN" && (
            <a
              href="/admin"
              className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Admin dashboard
            </a>
          )}

          <button
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-zinc-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}