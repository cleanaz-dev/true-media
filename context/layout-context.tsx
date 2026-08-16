// context/layout-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AdminModalKey =
  | "UPLOAD_CONTRACT_TEMPLATE"
  | "CREATE_CONTRACT"
  | "INVITE_CUSTOMER"
  | null;

type LayoutContextType = {
  activeModal: AdminModalKey;
  modalData: any;
  openModal: (type: AdminModalKey, data?: any) => void;
  closeModal: () => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<AdminModalKey>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: AdminModalKey, data?: any) => {
    setActiveModal(type);
    if (data) setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => setModalData(null), 300); // Clear data after animation
  };

  return (
    <LayoutContext.Provider
      value={{
        activeModal,
        modalData,
        openModal,
        closeModal,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useAdminLayout must be used inside LayoutProvider");
  return ctx;
}