"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  ArrowLeft,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Tag,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/mobilhomes", label: "Mobil-homes", icon: Home },
  { href: "/admin/mobilhomes?status=AVAILABLE", label: "Disponibles", icon: Tag, matchQuery: "AVAILABLE" },
  { href: "/admin/mobilhomes?status=RESERVED", label: "Réservés", icon: Warehouse, matchQuery: "RESERVED" },
  { href: "/admin/mobilhomes?status=SOLD", label: "Vendus", icon: ShieldCheck, matchQuery: "SOLD" },
  { href: "/admin/leads", label: "Prospects", icon: Users },
  { href: "/admin/reprises", label: "Demandes de reprise", icon: Truck },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut(getFirebaseAuth());
    router.replace("/admin/login");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="rounded-lg bg-white/95 px-3 py-2 shadow-sm">
          <Image
            src="/brand/logo-trimmed.png"
            alt="Euro Distri Mobilhome"
            width={Math.round(36 * (449 / 334))}
            height={36}
          />
        </span>
      </div>

      <div className="px-3 pb-2">
        <Link
          href={`/${DEFAULT_LOCALE}`}
          target="_blank"
          className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href.split("?")[0]);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                isActive && !item.matchQuery && "bg-white/10 text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
