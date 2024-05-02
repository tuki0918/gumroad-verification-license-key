"use client";

import SettingsProvider from "@/components/providers/SettingsProvider";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const ClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </SessionProvider>
  );
};

export default ClientProvider;
