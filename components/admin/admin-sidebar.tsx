"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  CreditCard,
  Settings,
  DoorOpen,
  MailIcon,
  ScrollText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AdminUserMenu } from "./admin-user-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { title: "Tenants", href: "/admin/tenants", icon: Users },
  { title: "Rooms", href: "/admin/rooms", icon: DoorOpen },
  { title: "Emails", href: "/admin/emails", icon: MailIcon },
  { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
  {title: "Contracts", href: "/admin/contracts", icon: ScrollText},
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-slate-950"
    >
      <SidebarHeader className="flex h-16 items-center justify-center border-b border-white/10 bg-slate-950 p-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 overflow-hidden transition-all group-data-[collapsible=icon]:hidden"
        >
          <Image
            src="/images/menu-logo.png"
            alt="Logo"
            width={140}
            height={40}
            className="object-contain "
            priority
          />
        </Link>

        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 group-data-[collapsible=icon]:flex">
          <span className="text-sm font-bold text-white">TS</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-950">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-4 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      tooltip={item.title}
                      className={cn(
                        "group/nav relative overflow-hidden rounded-lg px-3 py-5 transition-all duration-200",
                        "text-slate-400 hover:bg-white/[0.05] hover:text-white",
                        isActive &&
                          "bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-[18px] w-[18px] transition-transform duration-200",
                          !isActive && "group-hover/nav:scale-110",
                        )}
                      />
                      <span className="text-sm font-medium tracking-wide">
                        {item.title}
                      </span>

                      {isActive && (
                        <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-white/10 bg-slate-950 p-2">
        <AdminUserMenu />
      </SidebarFooter>

      <SidebarRail className="border-r border-white/10" />
    </Sidebar>
  );
}
