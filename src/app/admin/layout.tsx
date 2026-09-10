import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Administration | Euro Distri Mobilhome",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-muted/40 text-foreground">
        <AuthProvider>
          <TooltipProvider delay={200}>{children}</TooltipProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
