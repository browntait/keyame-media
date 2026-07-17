import { Outlet } from "react-router-dom";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import Sidebar from "./_components/Sidebar.tsx";
import TopBar from "./_components/TopBar.tsx";
import OverdueNotifier from "./_components/OverdueNotifier.tsx";

export default function AppLayout() {
  return (
    <>
      <AuthLoading>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="space-y-4 w-64">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <LoginPage />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedLayout />
      </Authenticated>
    </>
  );
}

function AuthenticatedLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <OverdueNotifier />
    </div>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-card rounded-2xl shadow-2xl p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
              <span className="text-3xl text-white font-bold">K</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Keyame Media</h1>
            <p className="text-muted-foreground text-sm">Photo Studio Management System</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
            <SignInButton className="w-full" />
          </div>
          <p className="text-xs text-muted-foreground">Secure access • Role-based permissions</p>
        </div>
      </div>
    </div>
  );
}
