"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Menu } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && isFirebaseConfigured) {
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />
      </div>
    );
  }

  if (!user && isFirebaseConfigured) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {!isFirebaseConfigured && (
        <div className="fixed inset-x-0 top-0 z-50 bg-status-reserved px-4 py-2 text-center text-xs font-medium text-white">
          Mode démo : Firebase n&apos;est pas configuré. Les données affichées sont fictives et
          les actions ne seront pas enregistrées.
        </div>
      )}

      <aside className="hidden w-64 shrink-0 bg-brand-anthracite md:block">
        <div className="sticky top-0 h-screen">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-white px-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <SheetContent side="left" className="w-64 border-none bg-brand-anthracite p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-heading text-sm font-semibold text-brand-anthracite">
            Administration
          </span>
        </header>

        <main className={`flex-1 p-4 md:p-8 ${!isFirebaseConfigured ? "mt-8" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
