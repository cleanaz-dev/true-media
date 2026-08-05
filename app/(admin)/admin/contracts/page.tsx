import { AdminContractsPage } from "@/components/admin/contracts/admin-contract-page";
import { getAllContracts } from "@/lib/actions/get-all-contracts";

export default async function Page() {

    const contracts = await getAllContracts()
    return (
        <AdminContractsPage contracts={contracts} />
    )
}