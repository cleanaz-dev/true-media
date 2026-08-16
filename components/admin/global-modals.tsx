// components/admin/global-modals.tsx
"use client";

import { UploadContractTemplateModal } from "./contracts/upload-contract-template-modal";
// Import future modals here...
// import { InviteCustomerModal } from "./invite-customer-modal";
// import { CreateContractModal } from "./contracts/create-contract-modal";

export function GlobalModals() {
  return (
    <>
      <UploadContractTemplateModal />
      {/* <InviteCustomerModal /> */}
      {/* <CreateContractModal /> */}
    </>
  );
}