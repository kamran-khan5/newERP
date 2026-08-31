import { useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export function ErpLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/login") {
    return <div className="min-h-screen w-full bg-background text-foreground">{children}</div>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1600px] px-6 py-6">{children}</div>;
}
