"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { store } from "@/redux/store";
import { useAppDispatch } from "@/redux/hooks/useAppSelector";
import { useEffect } from "react";

export interface IProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProvidersProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <>{children}</>
        <Toaster />
      </Provider>
    </SessionProvider>
  );
}
