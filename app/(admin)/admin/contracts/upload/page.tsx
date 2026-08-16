import { UploadContractTemplateForm } from "@/components/admin/contracts/upload-contract-template-form";

export default async function Page() {
  return (
    <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Upload Template</h1>
          <p className="text-gray-600">
            Upload contract templates to significantly improve the accuracy
            and quality of contracts generated for your use.
          </p>
        </div>
        <UploadContractTemplateForm />
      </div>
    </div>
  );
}