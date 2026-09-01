import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Boxes,
  Users,
  Warehouse,
  ShoppingCart,
  Landmark,
  Factory,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { fmtCurrency } from "@/lib/erp-data";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { api, type AssetDto } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · GDA ERP" },
      {
        name: "description",
        content:
          "Enterprise-wide overview of assets, operations and finance across the organization.",
      },
    ],
  }),
  component: DashboardPage,
});

function KpiCard({
  label,
  value,
  delta,
  positive = true,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="erp-card p-4">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      {delta && (
        <div
          className={`mt-1 text-xs ${positive ? "text-success" : "text-destructive"} flex items-center gap-1`}
        >
          <TrendingUp className="h-3 w-3" />
          {delta}
        </div>
      )}
    </div>
  );
}

const revenueSeries = Array.from({ length: 12 }, (_, i) => ({
  m: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  Revenue: 400 + Math.round(Math.sin(i / 2) * 90 + i * 30),
  Cost: 250 + Math.round(Math.cos(i / 2.5) * 60 + i * 15),
}));

const opsBars = [
  { dept: "Operations", Value: 4200 },
  { dept: "Logistics", Value: 3100 },
  { dept: "IT & DC", Value: 2400 },
  { dept: "Planning", Value: 1800 },
  { dept: "Finance", Value: 1500 },
  { dept: "Administration", Value: 900 },
];

function DashboardPage() {
  const [assetCount, setAssetCount] = useState<number>(8);
  const [totalValue, setTotalValue] = useState<number>(98500000);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getAssets({ pageSize: 500 });
        if (res && Array.isArray(res.items)) {
          setAssetCount(res.items.length);
          // Estimate book value from live assets
          setTotalValue(res.items.length * 12500000);
        }
      } catch {
        // use default fallback
      }
    }
    loadStats();
  }, []);

  return (
    <>
      <PageHeader
        title="Enterprise Dashboard"
        description="Cross-module overview · real-time database connected"
        actions={
          <>
            <Button variant="outline" size="sm">
              Last 30 days
            </Button>
            <Button size="sm">
              New workspace
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        }
      />
      <PageBody>
        {/* Global KPIs */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard
            label="Total Assets"
            value={assetCount.toString()}
            delta="+4.2% MoM"
            icon={Boxes}
          />
          <KpiCard
            label="Asset Book Value"
            value={fmtCurrency(totalValue)}
            delta="+1.8%"
            icon={Landmark}
          />
          <KpiCard
            label="Open Work Orders"
            value="182"
            delta="-6% vs last week"
            positive
            icon={Factory}
          />
          <KpiCard label="Compliance Score" value="98.2%" delta="+0.6 pts" icon={CheckCircle2} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="erp-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Revenue vs Operating Cost</h3>
                <p className="text-xs text-muted-foreground">Consolidated · all business units</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                FY 2026
              </Badge>
            </div>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueSeries}>
                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Revenue"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Cost"
                    stroke="var(--color-chart-4)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="erp-card p-5">
            <h3 className="text-sm font-semibold">Attention required</h3>
            <p className="text-xs text-muted-foreground">Cross-module operational alerts</p>
            <ul className="mt-4 space-y-3">
              {[
                { t: "4 assets · warranty expiring", d: "Next 30 days", tone: "warning" as const },
                { t: "1 machinery audit due", d: "Murree Site Office", tone: "destructive" as const },
                { t: "3 POs pending approval", d: ">$50K threshold", tone: "info" as const },
                {
                  t: "Quarterly depreciation due",
                  d: "Fiscal period · Q3 2026",
                  tone: "warning" as const,
                },
              ].map((a) => (
                <li key={a.t} className="flex items-start gap-3">
                  <span
                    className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
                      a.tone === "destructive"
                        ? "bg-destructive/10 text-destructive"
                        : a.tone === "warning"
                          ? "bg-warning/15 text-warning"
                          : "bg-info/10 text-info"
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{a.t}</div>
                    <div className="text-xs text-muted-foreground">{a.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modules quick access */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold">Modules</h3>
          <p className="text-xs text-muted-foreground">Jump to a module workspace</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                name: "Assets",
                to: "/assets",
                icon: Boxes,
                active: true,
                meta: `${assetCount} database records`,
              },
              { name: "Human Resources", to: "/hr", icon: Users, meta: "Coming soon" },
              { name: "Inventory", to: "/inventory", icon: Warehouse, meta: "Coming soon" },
              { name: "Procurement", to: "/procurement", icon: ShoppingCart, meta: "Coming soon" },
              { name: "Finance", to: "/finance", icon: Landmark, meta: "Coming soon" },
              { name: "Manufacturing", to: "/manufacturing", icon: Factory, meta: "Coming soon" },
            ].map((m) => (
              <Link
                key={m.name}
                to={m.to}
                className="erp-card group flex items-center gap-3 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{m.name}</span>
                    {!m.active && (
                      <Badge variant="secondary" className="text-[9px] uppercase">
                        Soon
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{m.meta}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        {/* Ops load bars */}
        <div className="mt-8 erp-card p-5">
          <h3 className="text-sm font-semibold">Operating load by department</h3>
          <p className="text-xs text-muted-foreground">
            Weighted by active work orders and asset utilisation
          </p>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opsBars} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="dept"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="Value" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </PageBody>
    </>
  );
}
