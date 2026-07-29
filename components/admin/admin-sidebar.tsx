import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BedDouble,
  CreditCard,
  Settings,
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

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { title: "Tenants", href: "/admin/tenants", icon: Users },
  { title: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="flex h-16 items-center justify-center border-b p-4">
        {/* Full logo: visible when expanded, hidden when collapsed */}
        <Link
          href="/admin"
          className="flex items-center gap-2 overflow-hidden transition-all group-data-[collapsible=icon]:hidden"
        >
          <Image
            src="/images/logo-white.png"
            alt="Logo"
            width={140}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* Collapsed icon: hidden when expanded, visible when collapsed */}
        <div className="hidden items-center justify-center rounded-md bg-white/10 p-2 group-data-[collapsible=icon]:flex">
          <span className="text-lg font-bold text-primary rounded-sm">TS</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-4 px-4 text-xs font-semibold uppercase tracking-wider text-white">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    className="rounded-lg px-3 py-5 hover:bg-muted/50 transition-all duration-150 ease-in-out "
                  >
                    <div className="text-white transition-all duration-300  hover:translate-x-2 flex items-center gap-2">
                    <item.icon className="h-5 w-5 transition-all duration-300 text-white "/>
                    <span className="text-sm font-medium tracking-wide">
                      {item.title}
                    </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto bg-primary p-2">
        <AdminUserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}