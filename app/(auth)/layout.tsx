import { ReactNode } from "react";
import { HapioProvider } from "@/context/hapio-contex";

export default function HapioLayout({ children }: { children: ReactNode }) {
  return <HapioProvider>{children}</HapioProvider>;
}