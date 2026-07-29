import { AdminTenantsPage } from "@/components/admin/tenants/admin-tenants-page";
import { getAllTenants } from "@/lib/actions/get-all-tenants";

export default async function Page() {
  const tenants = await getAllTenants();

  return (
    <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm">
      <AdminTenantsPage tenants={tenants} />
    </div>
  );
}
