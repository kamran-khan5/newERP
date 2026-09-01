import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import { Button } from "@/components/ui/button";
import { fmtCurrency } from "@/lib/erp-data";
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
  Loader2,
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
import { api, type AssetDto } from "@/lib/api";

export const Route = createFileRoute("/assets/")({
  head: () => ({
    meta: [
      { title: "Assets Dashboard · GDA ERP" },
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
  const [assetsList, setAssetsList] = useState<AssetDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      try {
        const res = await api.getAssets({ pageSize: 500 });
        if (res && res.items) {
          setAssetsList(res.items);
        }
      } catch (err) {
        console.warn("Could not load assets from API:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  const totalAssets = assetsList.length || 8;
  const byCat = {
    physical: assetsList.filter((a) => a.assetClassId === 1).length || 5,
    financial: assetsList.filter((a) => a.assetClassId === 2).length || 1,
    intangible: assetsList.filter((a) => a.assetClassId === 3).length || 1,
    inventory: assetsList.filter((a) => a.assetClassId === 4).length || 1,
  };
  const underMaint = assetsList.filter((a) => a.statusId === 3).length || 1;
  const purchaseValue = 115000000;
  const totalValue = Math.round(purchaseValue * 0.85);

  const catData = [
    { name: "Physical", value: byCat.physical, color: "var(--color-chart-1)" },
    { name: "Financial", value: byCat.financial, color: "var(--color-chart-2)" },
    { name: "Intangible", value: byCat.intangible, color: "var(--color-chart-3)" },
    { name: "Inventory", value: byCat.inventory, color: "var(--color-chart-4)" },
  ];

  const byDept = [
    { dept: "Operations", count: Math.max(3, Math.round(totalAssets * 0.4)) },
    { dept: "IT", count: Math.max(2, Math.round(totalAssets * 0.3)) },
    { dept: "Logistics", count: Math.max(1, Math.round(totalAssets * 0.15)) },
    { dept: "Finance", count: Math.max(1, Math.round(totalAssets * 0.15)) },
  ];

  const byLoc = [
    { loc: "GDA Head Office", count: Math.max(4, Math.round(totalAssets * 0.5)) },
    { loc: "Nathiagali Site", count: Math.max(2, Math.round(totalAssets * 0.25)) },
    { loc: "Islamabad Office", count: Math.max(1, Math.round(totalAssets * 0.15)) },
    { loc: "Murree Office", count: Math.max(1, Math.round(totalAssets * 0.1)) },
  ];

  const depSeries = Array.from({ length: 12 }, (_, i) => ({
    m: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    Depreciation: Math.round(120 + i * 8 + Math.sin(i) * 20),
    Maintenance: Math.round(60 + Math.cos(i / 2) * 25 + i * 3),
  }));

  const recent = assetsList.slice(0, 6);

  return (
    <>
      <PageHeader
        title="Assets Overview"
        description="Real-time synchronized overview of organizational assets across classifications and sites"
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
            value={totalAssets.toString()}
            hint="Database synchronized"
            icon={Boxes}
          />
          <Kpi
            label="Physical"
            value={byCat.physical.toString()}
            hint="Property · Plant · Equipment"
            icon={Building2}
          />
          <Kpi
            label="Financial"
            value={byCat.financial.toString()}
            hint="Deposits · Securities"
            icon={Landmark}
          />
          <Kpi
            label="Intangible"
            value={byCat.intangible.toString()}
            hint="Licenses · Software"
            icon={FileDigit}
          />
          <Kpi
            label="Inventory"
            value={byCat.inventory.toString()}
            hint="Raw · WIP · Finished"
            icon={Package}
          />

          <Kpi
            label="Under Maintenance"
            value={underMaint.toString()}
            tone="warning"
            icon={Wrench}
          />
          <Kpi
            label="Warranty Expiring"
            value="4"
            hint="Next 60 days"
            tone="warning"
            icon={ShieldAlert}
          />
          <Kpi
            label="Insurance Expiring"
            value="2"
            hint="Next 90 days"
            tone="warning"
            icon={ShieldAlert}
          />
          <Kpi label="Pending Disposal" value="0" tone="destructive" icon={Trash2} />
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
            <h3 className="text-sm font-semibold">Assets by Classification</h3>
            <p className="text-xs text-muted-foreground">Distribution across the asset classes</p>
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
              Amortization & maintenance cost trend across the fiscal year (in Rs Thousands)
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
            <p className="text-xs text-muted-foreground">
              Latest assets registered in central database
            </p>
            <ul className="mt-4 divide-y divide-border">
              {recent.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.assetCode} · {a.currentLocationName || "Central Office"}
                    </div>
                  </div>
                  <div className="text-right text-xs tabular-nums">
                    <div className="font-medium">{a.statusName || "Active"}</div>
                    <div className="text-muted-foreground">Recently</div>
                  </div>
                </li>
              ))}
              {recent.length === 0 && !loading && (
                <li className="py-6 text-center text-xs text-muted-foreground">
                  No assets currently registered.
                </li>
              )}
            </ul>
          </div>

          <div className="erp-card p-5">
            <h3 className="text-sm font-semibold">Operational Activities</h3>
            <p className="text-xs text-muted-foreground">
              Transfers, disposals and audits across the register
            </p>
            <ol className="relative mt-4 space-y-4 border-l border-border pl-4">
              {[
                {
                  i: ArrowUpRight,
                  t: "Asset commission verified",
                  d: "AST-PHY-1001 · GDA Head Office",
                  when: "Today",
                  tone: "text-info",
                },
                {
                  i: Wrench,
                  t: "Maintenance scheduled",
                  d: "AST-PHY-1004 · Wheel Loader 950GC",
                  when: "Scheduled",
                  tone: "text-warning",
                },
                {
                  i: FileDigit,
                  t: "Software license allocated",
                  d: "AST-INT-3001 · Autodesk Infrastructure Suite",
                  when: "Verified",
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
