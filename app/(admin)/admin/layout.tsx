import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-admin-sans",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-admin-mono",
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${fontSans.variable} ${fontMono.variable} font-[family-name:var(--font-admin-sans)]`}
    >
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <main className="p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}