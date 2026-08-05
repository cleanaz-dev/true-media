import { ReactNode, Suspense } from "react";
import { HapioProvider } from "@/context/hapio-contex";
import UserMenu from "@/components/auth/user-menu";

export default function HapioLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <HapioProvider>
        <div className="font-[family-name:var(--font-fraunces)]">
          {/* Removed the extra div wrapper that was pushing the screen down */}
          <UserMenu />
          
          {children}
        </div>
      </HapioProvider>
    </Suspense>
  );
}