import { AdminContractsPage } from "@/components/admin/contracts/admin-contract-page";
import { getAllContracts } from "@/lib/actions/get-all-contracts";

export default async function Page() {
  const contracts = await getAllContracts();
  return (
    <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm">
      <AdminContractsPage contracts={contracts} />
    </div>
  );
}
