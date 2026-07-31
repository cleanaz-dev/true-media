import { AdminSettingsPage } from "@/components/admin/settings/admin-settings-page";
import { getAdminSettings } from "@/lib/actions/get-admin-settings";

export default async function Page() {
  const adminSettings = await getAdminSettings();
  return (
    <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm">
      <AdminSettingsPage adminSettings={adminSettings} />
    </div>
  );
}
