import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getContract } from "@/lib/actions/contracts/get-contract";
import { getPresignedUrl } from "@/lib/aws/s3";
import { SingleContractPage } from "@/components/admin/contracts/single-contract-page";

interface Params {
  params: Promise<{
    contractId: string;
  }>;
}

export default async function Page({ params }: Params) {
  const { contractId } = await params;
  const contract = await getContract(contractId);

  if (!contract) {
    return notFound();
  }

  let pdfUrl: string | null = null;
  if (contract.originalS3Key) {
    pdfUrl = await getPresignedUrl(contract.originalS3Key);
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen">
      <AdminPageHeader
        title={`Contract: ${contract.title || "Untitled"}`}
        description="View contract details and manage signers"
      />
      <SingleContractPage contract={contract} pdfUrl={pdfUrl} />
    </div>
  );
}