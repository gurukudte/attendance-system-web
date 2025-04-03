"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export interface IProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProvidersProps) {
  return (
    <>
      <>{children}</>
      <Toaster />
    </>
  );
}
