import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '@/models/auth';
import { useEffect, Suspense } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingFallback } from '@/components/loading-fallback';

export default function Layout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col flex-1">
          <header className="flex items-center h-15 p-2 border-b">
            <SidebarTrigger />
          </header>
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
