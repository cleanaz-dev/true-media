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
      <SidebarHeader className="p-4 border-b flex h-16 items-center justify-center">
        {/* Hide the full logo when collapsed using group-data attributes */}
        <Link
          href="/admin"
          className="flex items-center gap-2 overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden"
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
        {/* Optional: Show a tiny icon ONLY when collapsed */}
        <div className="bg-primary p-2">
          <p className="font-bold text-white">TS</p>
        </div>
      </SidebarHeader>

      <SidebarContent
        className="bg-primary"
      >
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4 mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Added gap-2 for better vertical spacing between items */}
            <SidebarMenu className="gap-2 px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    className="
                      group py-5 px-3 rounded-lg transition-all duration-300 ease-in-out
                      hover:bg-muted/50 hover:translate-x-2 hover:text-primary 
                      hover:shadow-[inset_2px_0_0_0_hsl(var(--primary))]
                    "
                  >
                    {/* The icon scales slightly and matches the primary color on hover */}
                    <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
                    <span className="text-sm font-medium tracking-wide">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t mt-auto">
        <AdminUserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
