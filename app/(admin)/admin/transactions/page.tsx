import { AdminTransactionsPage } from "@/components/admin/transactions/admin-transactions-page";
import { getAllTransactions } from "@/lib/actions/get-all-transactions";


export default async function Page() {
  const transactions = await getAllTransactions();
  return (
    <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm">
     <AdminTransactionsPage transactions={transactions}/>
    </div>
  );
}
