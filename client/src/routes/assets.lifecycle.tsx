import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import {
  PackagePlus,
  ArrowLeftRight,
  Wrench,
  TrendingDown,
  Scale,
  AlertOctagon,
  ShieldCheck,
  Trash2,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assets/lifecycle")({
  head: () => ({ meta: [{ title: "Asset Lifecycle · Meridian ERP" }] }),
  component: LifecyclePage,
});

const EVENTS = [
  {
    key: "Acquisition",
    icon: PackagePlus,
    tone: "primary",
    desc: "Onboard new assets · capture invoice, tag & assign.",
  },
  {
    key: "Transfer",
    icon: ArrowLeftRight,
    tone: "info",
    desc: "Move assets between departments or locations.",
  },
  {
    key: "Maintenance",
    icon: Wrench,
    tone: "warning",
    desc: "Preventive & corrective work orders.",
  },
  {
    key: "Depreciation",
    icon: TrendingDown,
    tone: "primary",
    desc: "Post period-end depreciation runs.",
  },
  { key: "Valuation", icon: Scale, tone: "info", desc: "Revalue assets against market or index." },
  {
    key: "Impairment",
    icon: AlertOctagon,
    tone: "destructive",
    desc: "Record impairment losses & reversals.",
  },
  {
    key: "Insurance",
    icon: ShieldCheck,
    tone: "success",
    desc: "Policies, renewals & claims tracking.",
  },
  {
    key: "Disposal",
    icon: Trash2,
    tone: "destructive",
    desc: "Retire, sell or scrap end-of-life assets.",
  },
  {
    key: "Audit",
    icon: ClipboardCheck,
    tone: "success",
    desc: "Physical verification & reconciliation.",
  },
];

const toneMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/15 text-success",
};

function LifecyclePage() {
  return (
    <>
      <PageHeader
        title="Asset Lifecycle"
        description="Every stage of an asset's life, from acquisition to disposal"
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((e) => (
            <button
              key={e.key}
              className="erp-card group flex items-start gap-4 p-5 text-left transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-md",
                  toneMap[e.tone],
                )}
              >
                <e.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{e.key}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{e.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 erp-card p-6">
          <h3 className="text-sm font-semibold">Lifecycle timeline · organization-wide</h3>
          <p className="text-xs text-muted-foreground">
            Latest 6 lifecycle events across all assets
          </p>
          <ol className="relative mt-5 space-y-5 border-l border-border pl-5">
            {[
              {
                t: "PHY-1041 · Transfer completed",
                d: "Plant A → Warehouse 3 · signed by A. Nasser",
                w: "2h ago",
                icon: ArrowLeftRight,
                tone: "info",
              },
              {
                t: "INV-1088 · Disposal approved",
                d: "Scrap batch #12 · $3,240 write-off",
                w: "Yesterday",
                icon: Trash2,
                tone: "destructive",
              },
              {
                t: "PHY-1023 · Maintenance scheduled",
                d: "Forklift 4T · service window Nov 18",
                w: "5h ago",
                icon: Wrench,
                tone: "warning",
              },
              {
                t: "INT-1102 · Insurance renewed",
                d: "12-month policy · $18,400 premium",
                w: "2d ago",
                icon: ShieldCheck,
                tone: "success",
              },
              {
                t: "FIN-1005 · Valuation posted",
                d: "Investment portfolio · +$126K unrealised",
                w: "3d ago",
                icon: Scale,
                tone: "info",
              },
              {
                t: "PHY-1077 · Depreciation run",
                d: "Fiscal Oct 2026 · 320 records",
                w: "1w ago",
                icon: TrendingDown,
                tone: "primary",
              },
            ].map((e, i) => (
              <li key={i} className="relative">
                <span
                  className={cn(
                    "absolute -left-[26px] top-0.5 grid h-5 w-5 place-items-center rounded-full ring-2 ring-background",
                    toneMap[e.tone],
                  )}
                >
                  <e.icon className="h-3 w-3" />
                </span>
                <div className="text-sm font-medium">{e.t}</div>
                <div className="text-xs text-muted-foreground">{e.d}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground/70">{e.w}</div>
              </li>
            ))}
          </ol>
        </div>
      </PageBody>
    </>
  );
}
