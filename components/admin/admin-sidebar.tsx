import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BedDouble,
  CreditCard,
  Settings,
  Hotel
} from "lucide-react"
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
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { title: "Tenants", href: "/admin/tenants", icon: Users },
  { title: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 px-2">
          <Hotel className="w-6 h-6" />
          <span className="font-bold text-lg tracking-tight">Admin Portal</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/*
                    Base UI style: use `render` (not asChild) to swap
                    the rendered element. Children stay as-is and get
                    merged into the Link.
                  */}
                  <SidebarMenuButton render={<Link href={item.href} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">v2.0.1 Admin</p>
      </SidebarFooter>
    </Sidebar>
  )
}