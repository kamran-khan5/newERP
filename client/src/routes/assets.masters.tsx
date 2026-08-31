import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/assets/masters")({
  head: () => ({ meta: [{ title: "Asset Masters · GDA ERP" }] }),
  component: MastersPage,
});

const MASTERS = [
  { name: "Categories", icon: LayoutGrid, count: 18, desc: "Category tree for all asset types." },
  { name: "Asset Types", icon: Tags, count: 46, desc: "Fine-grained type taxonomy." },
  { name: "Locations", icon: MapPin, count: 32, desc: "Sites, plants, warehouses & offices." },
  { name: "Departments", icon: Users, count: 24, desc: "Organizational units & cost centers." },
  { name: "Warehouses", icon: Warehouse, count: 12, desc: "Storage & fulfilment nodes." },
  { name: "Suppliers", icon: Truck, count: 214, desc: "Vendor master with performance scores." },
  { name: "Currency", icon: DollarSign, count: 9, desc: "Enabled currencies & FX rates." },
  { name: "Units of Measure", icon: Ruler, count: 21, desc: "UoM conversions per commodity." },
  { name: "GL Accounts", icon: BookOpen, count: 148, desc: "Finance chart of accounts mapping." },
  { name: "Users", icon: UserCog, count: 312, desc: "System users, roles & responsibilities." },
];

function MastersPage() {
  return (
    <>
      <PageHeader
        title="Asset Masters"
        description="Master data that powers every workflow across the Assets module"
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MASTERS.map((m) => (
            <button
              key={m.name}
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
