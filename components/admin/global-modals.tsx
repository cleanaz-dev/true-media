// components/admin/global-modals.tsx
"use client";

import { useAdminLayout } from "@/context/layout-context";
import { UploadContractTemplateModal } from "./contracts/upload-contract-template-modal";

export function GlobalModals() {
  const { activeModal, modalData, closeModal } = useAdminLayout();

  return (
    <>
      <UploadContractTemplateModal
        open={activeModal === "UPLOAD_CONTRACT_TEMPLATE"}
        onOpenChange={(open) => !open && closeModal()}
      />
      {/* Future modals go here */}
    </>
  );
}
