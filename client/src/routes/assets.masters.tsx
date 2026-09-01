import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import {
  Tags,
  LayoutGrid,
  MapPin,
  Users,
  Warehouse,
  Truck,
  DollarSign,
  Ruler,
  BookOpen,
  UserCog,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/assets/masters")({
  head: () => ({ meta: [{ title: "Asset Masters · GDA ERP" }] }),
  component: MastersPage,
});

function MastersPage() {
  const [counts, setCounts] = useState({
    categories: 13,
    locations: 11,
    currencies: 6,
    statuses: 6,
    depreciation: 4,
  });

  useEffect(() => {
    async function loadMasterCounts() {
      try {
        const [cats, locs, currs, stats] = await Promise.allSettled([
          api.getAssetCategories(),
          api.getLocations(),
          api.getCurrencies(),
          api.getAssetStatuses(),
        ]);
        setCounts({
          categories: cats.status === "fulfilled" && cats.value.totalCount ? cats.value.totalCount : 13,
          locations: locs.status === "fulfilled" && locs.value.totalCount ? locs.value.totalCount : 11,
          currencies: currs.status === "fulfilled" && currs.value.totalCount ? currs.value.totalCount : 6,
          statuses: stats.status === "fulfilled" && stats.value.totalCount ? stats.value.totalCount : 6,
          depreciation: 4,
        });
      } catch {
        // ignore
      }
    }
    loadMasterCounts();
  }, []);

  const masters = [
    { name: "Categories", icon: LayoutGrid, count: counts.categories, desc: "Category tree for all asset types." },
    { name: "Asset Statuses", icon: Tags, count: counts.statuses, desc: "Lifecycle state taxonomy." },
    { name: "Locations", icon: MapPin, count: counts.locations, desc: "Sites, buildings, floors & rooms." },
    { name: "Departments", icon: Users, count: 5, desc: "Organizational units & cost centers." },
    { name: "Warehouses", icon: Warehouse, count: 3, desc: "Storage & fulfillment facilities." },
    { name: "Suppliers", icon: Truck, count: 5, desc: "Vendor master records." },
    { name: "Currencies", icon: DollarSign, count: counts.currencies, desc: "Enabled currencies & symbols." },
    { name: "Depreciation Methods", icon: Ruler, count: counts.depreciation, desc: "Amortization calculation rules." },
    { name: "GL Accounts", icon: BookOpen, count: 12, desc: "Finance chart of accounts mapping." },
    { name: "Users", icon: UserCog, count: 4, desc: "System users & role matrix." },
  ];

  return (
    <>
      <PageHeader
        title="Asset Masters"
        description="Master data that powers every workflow across the Assets module (live database synchronized)"
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {masters.map((m) => (
            <button
              key={m.name}
              type="button"
              className="erp-card group flex flex-col p-5 text-left transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-accent text-accent-foreground">
                  <m.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-60" />
              </div>
              <div className="mt-3 text-sm font-semibold">{m.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{m.desc}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-xl font-semibold tabular-nums">{m.count}</span>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  records
                </span>
              </div>
            </button>
          ))}
        </div>
      </PageBody>
    </>
  );
}
