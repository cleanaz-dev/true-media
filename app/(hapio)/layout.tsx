import { ReactNode, Suspense } from "react";
import { HapioProvider } from "@/context/hapio-contex";

export default function HapioLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <HapioProvider>{children}</HapioProvider>
    </Suspense>
  );
}