import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import { Button } from "@/components/ui/button";
import { assets, fmtCurrency } from "@/lib/erp-data";
import {
  Boxes,
  Wrench,
  ShieldAlert,
  Trash2,
  Landmark,
  Building2,
  Cpu,
  FileDigit,
  Package,
  ArrowRight,
  MapPin,
  Users2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

export const Route = createFileRoute("/assets/")({
  head: () => ({
    meta: [
      { title: "Assets Dashboard · Meridian ERP" },
      {
        name: "description",
        content:
          "Real-time overview of all corporate assets across categories, sites and custodians.",
      },
    ],
  }),
  component: AssetsDashboard,
});

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "warning" | "success" | "destructive";
}) {
  const toneCls = {
    default: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <div className="erp-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className={`grid h-7 w-7 place-items-center rounded-md ${toneCls}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function AssetsDashboard() {
  const totalValue = assets.reduce((s, a) => s + a.bookValue, 0);
  const purchaseValue = assets.reduce((s, a) => s + a.purchaseValue, 0);
  const byCat = {
    physical: assets.filter((a) => a.category === "physical").length,
    inventory: assets.filter((a) => a.category === "inventory").length,
    financial: assets.filter((a) => a.category === "financial").length,
    intangible: assets.filter((a) => a.category === "intangible").length,
  };
  const underMaint = assets.filter((a) => a.status === "Under Maintenance").length;
  const catData = [
    { name: "Physical", value: byCat.physical, color: "var(--color-chart-1)" },
    { name: "Inventory", value: byCat.inventory, color: "var(--color-chart-2)" },
    { name: "Financial", value: byCat.financial, color: "var(--color-chart-3)" },
    { name: "Intangible", value: byCat.intangible, color: "var(--color-chart-4)" },
  ];

  const byDept = Object.entries(
    assets.reduce<Record<string, number>>((acc, a) => {
      acc[a.department] = (acc[a.department] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([dept, count]) => ({ dept, count }));

  const byLoc = Object.entries(
    assets.reduce<Record<string, number>>((acc, a) => {
      acc[a.location] = (acc[a.location] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([loc, count]) => ({ loc, count }));

  const depSeries = Array.from({ length: 12 }, (_, i) => ({
    m: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    Depreciation: Math.round(120 + i * 8 + Math.sin(i) * 20),
    Maintenance: Math.round(60 + Math.cos(i / 2) * 25 + i * 3),
  }));

  const recent = assets.slice(0, 6);

  return (
    <>
      <PageHeader
        title="Assets Overview"
        description="Answers the five essential asset questions in one screen"
        actions={
          <>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button asChild size="sm">
              <Link to="/assets/register">
                Open Register
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />
      <PageBody>
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <Kpi
            label="Total Assets"
            value={assets.length.toString()}
            hint={`Across 4 categories`}
            icon={Boxes}
          />
          <Kpi
            label="Physical"
            value={byCat.physical.toString()}
            hint="Property · Plant · Equipment"
            icon={Building2}
          />
          <Kpi
            label="Inventory"
            value={byCat.inventory.toString()}
            hint="Raw · WIP · Finished"
            icon={Package}
          />
          <Kpi
            label="Financial"
            value={byCat.financial.toString()}
            hint="Cash · Investments"
            icon={Landmark}
          />
          <Kpi
            label="Intangible"
            value={byCat.intangible.toString()}
            hint="Licenses · IP · Goodwill"
            icon={FileDigit}
          />

          <Kpi
            label="Under Maintenance"
            value={underMaint.toString()}
            tone="warning"
            icon={Wrench}
          />
          <Kpi
            label="Warranty Expiring"
            value="12"
            hint="Next 60 days"
            tone="warning"
            icon={ShieldAlert}
          />
          <Kpi
            label="Insurance Expiring"
            value="8"
            hint="Next 90 days"
            tone="warning"
            icon={ShieldAlert}
          />
          <Kpi label="Pending Disposal" value="5" tone="destructive" icon={Trash2} />
          <Kpi
            label="Total Book Value"
            value={fmtCurrency(totalValue)}
            hint={`Purchase: ${fmtCurrency(purchaseValue)}`}
            tone="success"
            icon={Landmark}
          />
        </div>

        {/* Charts row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="erp-card p-5">
            <h3 className="text-sm font-semibold">Assets by Type</h3>
            <p className="text-xs text-muted-foreground">Distribution across the four categories</p>
            <div className="mt-4 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {catData.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="erp-card p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold">Depreciation vs Maintenance</h3>
            <p className="text-xs text-muted-foreground">
              Cost trend across the fiscal year (in $K)
            </p>
            <div className="mt-4 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={depSeries}>
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
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="Depreciation"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Maintenance"
                    stroke="var(--color-chart-4)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="erp-card p-5">
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Assets by Department</h3>
            </div>
            <div className="mt-4 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDept}>
                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="dept"
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="erp-card p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Assets by Location</h3>
            </div>
            <div className="mt-4 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byLoc} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                    horizontal={false}
                  />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="loc"
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="erp-card p-5">
            <h3 className="text-sm font-semibold">Recent Acquisitions</h3>
            <p className="text-xs text-muted-foreground">Last 6 assets onboarded</p>
            <ul className="mt-4 divide-y divide-border">
              {recent.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.code} · {a.department} · {a.location}
                    </div>
                  </div>
                  <div className="text-right text-xs tabular-nums">
                    <div className="font-medium">{fmtCurrency(a.purchaseValue)}</div>
                    <div className="text-muted-foreground">{a.purchaseDate}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="erp-card p-5">
            <h3 className="text-sm font-semibold">Recent Activities</h3>
            <p className="text-xs text-muted-foreground">
              Transfers, disposals and audits across the register
            </p>
            <ol className="relative mt-4 space-y-4 border-l border-border pl-4">
              {[
                {
                  i: ArrowUpRight,
                  t: "Transfer completed",
                  d: "PHY-1041 · Plant A → Warehouse 3",
                  when: "2h ago",
                  tone: "text-info",
                },
                {
                  i: Wrench,
                  t: "Maintenance scheduled",
                  d: "PHY-1023 · Forklift 4T · Nov 18",
                  when: "5h ago",
                  tone: "text-warning",
                },
                {
                  i: ArrowDownRight,
                  t: "Disposal approved",
                  d: "INV-1088 · Scrap batch #12",
                  when: "Yesterday",
                  tone: "text-destructive",
                },
                {
                  i: FileDigit,
                  t: "License renewed",
                  d: "INT-1102 · Autodesk Enterprise · 250 seats",
                  when: "2d ago",
                  tone: "text-success",
                },
              ].map((e, i) => (
                <li key={i} className="relative">
                  <span
                    className={`absolute -left-[22px] top-1 grid h-4 w-4 place-items-center rounded-full bg-background ring-2 ring-border ${e.tone}`}
                  >
                    <e.i className="h-2.5 w-2.5" />
                  </span>
                  <div className="text-sm font-medium">{e.t}</div>
                  <div className="text-xs text-muted-foreground">{e.d}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground/70">{e.when}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </PageBody>
    </>
  );
}
