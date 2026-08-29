import { useRouterState, Link } from "@tanstack/react-router";
import { Bell, Search, PanelLeft, Moon, Sun, ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function Crumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  const items = [{ label: "Home", to: "/" }];
  let acc = "";
  for (const p of parts) {
    acc += `/${p}`;
    items.push({
      label: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " "),
      to: acc,
    });
  }
  return (
    <nav className="flex items-center gap-1 text-[13px] text-muted-foreground">
      {items.map((it, i) => (
        <span key={it.to} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground/40">/</span>}
          {i === items.length - 1 ? (
            <span className="font-medium text-foreground">{it.label}</span>
          ) : (
            <Link to={it.to} className="hover:text-foreground transition-colors">
              {it.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [dark, setDark] = useState(false);
  const [company, setCompany] = useState("GDA");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8">
        <PanelLeft className="h-4 w-4" />
      </Button>

      <div className="hidden md:block">
        <Crumbs />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Global search */}
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search assets, orders, people…"
            className="h-9 w-[320px] rounded-md border border-input bg-background pl-8 pr-14 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        {/* Company selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 font-medium">
              <span className="hidden sm:inline max-w-[140px] truncate">{company}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch company</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["GDA ", "Org 2", "ORG 3"].map((c) => (
              <DropdownMenuItem key={c} onClick={() => setCompany(c)}>
                {c}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:inline-flex">
          <HelpCircle className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-surface" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-[10px]">
                3 new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { t: "Warranty expiring", d: "PHY-1023 · Forklift 4T · in 12 days" },
              { t: "Maintenance overdue", d: "PHY-1041 · HVAC unit · 3 days" },
              { t: "Insurance renewal", d: "8 vehicles pending renewal" },
            ].map((n) => (
              <DropdownMenuItem key={n.t} className="flex flex-col items-start py-2">
                <span className="text-sm font-medium">{n.t}</span>
                <span className="text-xs text-muted-foreground">{n.d}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  AN
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left leading-tight">
                <div className="text-xs font-medium">Khan</div>
                <div className="text-[10px] text-muted-foreground">Asset Manager</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
