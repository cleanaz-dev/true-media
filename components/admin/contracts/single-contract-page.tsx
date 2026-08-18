import { ContractWithSigners } from "@/lib/actions/contracts/get-contract";
import { ContractPdfViewer } from "@/components/admin/contracts/contract-pdf-viewer";
import { InviteSigneesDrawer } from "./invite-signee-drawer";
import { ContractSigneesList } from "./contract-signee-list";

interface SingleContractPageProps {
  contract: ContractWithSigners;
  pdfUrl: string | null;
}

export function SingleContractPage({
  contract,
  pdfUrl,
}: SingleContractPageProps) {
  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-mono">
          ID: {contract.id}
        </p>
        <InviteSigneesDrawer contractId={contract.id} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PDF Viewer */}
        <div className="lg:col-span-8 h-[800px] rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
          <ContractPdfViewer
            pdfUrl={pdfUrl}
            title={contract.title ?? undefined}
          />
        </div>

        {/* Signers List sidebar */}
        <div className="lg:col-span-4">
          <ContractSigneesList
            contractId={contract.id}
            signers={contract.signers}
          />
        </div>
      </div>
    </div>
  );
}