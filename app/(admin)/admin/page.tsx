import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminDashboardData } from "@/lib/actions/get-admin-dashboard-data";
import { AdminDashbordPage } from "@/components/admin/admin-dashboard-page";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const adminDashboardData = await getAdminDashboardData();

  return <AdminDashbordPage data={adminDashboardData} />;
}