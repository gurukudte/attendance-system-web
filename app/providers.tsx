"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { store } from "@/redux/store";
// import { ThemeProvider } from "@/components/theme-provider";

export interface IProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProvidersProps) {
  return (
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme="system"
    //   enableSystem
    //   disableTransitionOnChange
    // >
    // </ThemeProvider>
    <SessionProvider>
      <Provider store={store}>
        <>{children}</>
        <Toaster />
      </Provider>
    </SessionProvider>
  );
}
