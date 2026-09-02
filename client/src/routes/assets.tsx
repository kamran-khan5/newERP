import { Outlet, createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Dashboard", to: "/assets" },
  { label: "Asset Register", to: "/assets/register" },
  { label: "Asset Lifecycle", to: "/assets/lifecycle" },
  { label: "Configuration", to: "/assets/configuration" },
  { label: "Reports", to: "/assets/reports" },
];

export const Route = createFileRoute("/assets")({
  component: AssetsLayout,
});

function AssetsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1600px] items-end gap-1 overflow-x-auto px-6">
          {TABS.map((t) => {
            const active = pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn(
                  "relative border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
