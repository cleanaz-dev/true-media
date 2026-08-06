import { AdminDashboardPage } from "@/components/admin/admin-dashboard-page";
import { getAdminDashboardData } from "@/lib/actions/get-admin-dashboard-data";

export default async function Page() {
  const data = await getAdminDashboardData();
  return <AdminDashboardPage data={data} />
}