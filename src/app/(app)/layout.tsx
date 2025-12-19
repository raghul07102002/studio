
'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { AppProvider } from "@/contexts/app-provider";
import { FirebaseClientProvider } from "@/firebase";
import { AuthProvider } from "@/components/auth/auth-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AuthProvider>
        <AppProvider>
            <MainLayout>{children}</MainLayout>
        </AppProvider>
      </AuthProvider>
    </FirebaseClientProvider>
  );
}
