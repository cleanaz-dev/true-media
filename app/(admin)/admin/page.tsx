import { getAdminDashboardData } from "@/lib/actions/get-admin-dashboard-data";
import { AdminDashbordPage } from "@/components/admin/admin-dashboard-page";

export default async function Page() {
  const data = await getAdminDashboardData();
  return <AdminDashbordPage data={data} />;
}