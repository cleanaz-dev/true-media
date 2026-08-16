import { AdminContractForm } from "@/components/admin/contracts/admin-contract-form";
import { getAllContractTemplates } from "@/lib/actions/contracts/get-all-templates";

export default async function NewContractPage() {
  const templates = await getAllContractTemplates();

  return (
    <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Contract</h1>
          <p className="text-gray-600">
            Enter the contract details and requirements. This will invoke the AI
            Lambda function to generate the document.
          </p>
        </div>

        <AdminContractForm templates={templates} />
      </div>
    </div>
  );
}