import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";
import { HapioProvider } from "@/context/hapio-contex";
import { Toaster } from "@/components/ui/toast";
import { LayoutProvider } from "@/context/layout-context";
import { GlobalModals } from "@/components/admin/global-modals";

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

function getMainAppUrl(host: string) {
  const mainHost = host.replace(/^admin\./, "");

  if (process.env.NODE_ENV === "development") {
    return `http://${mainHost}`;
  }

  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || `https://${mainHost}`
  );
}

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const appUrl = getMainAppUrl(host);

  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect(`${appUrl}/sign-in`);
  }

  if (session.user.role !== "ADMIN") {
    redirect(appUrl);
  }

  return (
    <div
      className={`${fontSans.variable} ${fontMono.variable} font-[family-name:var(--font-admin-sans)]`}
    >
      <LayoutProvider>
        <HapioProvider>
          <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="h-svh flex flex-col bg-slate-100">
              <main className="flex-1 overflow-hidden p-4 md:p-6">
                {children}
              </main>
              <Toaster />
            </SidebarInset>

            {/* Mount all global modals here! */}
            <GlobalModals />
          </SidebarProvider>
        </HapioProvider>
      </LayoutProvider>
    </div>
  );
}
