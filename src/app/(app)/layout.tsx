
'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { AppProvider } from "@/contexts/app-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
        <MainLayout>{children}</MainLayout>
    </AppProvider>
  );
}
