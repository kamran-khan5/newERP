import { Link, useRouterState } from "@tanstack/react-router";

import {
  LayoutDashboard,
  Boxes,
  Users,
  Warehouse,
  ShoppingCart,
  Landmark,
  Contact,
  BadgeDollarSign,
  Factory,
  FolderKanban,
  Wallet,
  ShieldCheck,
  Settings,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
  children?: { label: string; to: string }[];
};

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  {
    label: "Assets",
    to: "/assets",
    icon: Boxes,
    children: [
      { label: "Dashboard", to: "/assets" },
      { label: "Asset Register", to: "/assets/register" },
      { label: "Asset Lifecycle", to: "/assets/lifecycle" },
      { label: "Configuration", to: "/assets/configuration" },
      { label: "Reports", to: "/assets/reports" },
    ],
  },
  { label: "Human Resources", to: "/hr", icon: Users, soon: true },
  { label: "Inventory", to: "/inventory", icon: Warehouse, soon: true },
  { label: "Procurement", to: "/procurement", icon: ShoppingCart, soon: true },
  { label: "Finance", to: "/finance", icon: Landmark, soon: true },
  { label: "CRM", to: "/crm", icon: Contact, soon: true },
  { label: "Sales", to: "/sales", icon: BadgeDollarSign, soon: true },
  { label: "Manufacturing", to: "/manufacturing", icon: Factory, soon: true },
  { label: "Projects", to: "/projects", icon: FolderKanban, soon: true },
  { label: "Payroll", to: "/payroll", icon: Wallet, soon: true },
  { label: "Administration", to: "/administration", icon: ShieldCheck, soon: true },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openGroup, setOpenGroup] = useState<string | null>("Assets");

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(to + "/");
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[64px]" : "w-[260px]",
      )}
    >
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-sidebar-primary-foreground">
          <img src="/GDA.svg" alt="GDA Logo" className="h-8 w-8" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight">ERP</div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">Enterprise Suite</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = isActive(item.to);
            const hasChildren = !!item.children?.length;
            const open = openGroup === item.label && !collapsed;
            return (
              <li key={item.label}>
                <div className="flex items-center">
                  <Link
                    to={item.to}
                    onClick={() => hasChildren && setOpenGroup(open ? null : item.label)}
                    className={cn(
                      "group flex flex-1 items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.soon && (
                          <span className="rounded bg-sidebar-accent/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/70">
                            Soon
                          </span>
                        )}
                        {hasChildren && (
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50 transition-transform",
                              open && "rotate-90",
                            )}
                          />
                        )}
                      </>
                    )}
                  </Link>
                </div>

                {hasChildren && open && !collapsed && (
                  <ul className="mt-0.5 ml-8 space-y-0.5 border-l border-sidebar-border/60 pl-2">
                    {item.children!.map((c) => {
                      const cActive = pathname === c.to;
                      return (
                        <li key={c.to}>
                          <Link
                            to={c.to}
                            className={cn(
                              "block rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                              cActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                            )}
                          >
                            {c.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="text-[11px] text-sidebar-foreground/50">v2026.1 · Production</div>
        ) : (
          <div className="h-2 w-2 rounded-full bg-success mx-auto" />
        )}
      </div>
    </aside>
  );
}
