import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NewAssetWizard } from "@/components/erp/NewAssetWizard";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Boxes,
  Building2,
  Package,
  Landmark,
  FileDigit,
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";
import {
  assets,
  categoryLabels,
  fmtCurrency,
  subCategoriesByCategory,
  type AssetCategory,
} from "@/lib/erp-data";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryItemWizard } from "@/components/erp/InventoryItemWizard";

export const Route = createFileRoute("/assets/register")({
  head: () => ({
    meta: [
      { title: "Asset Register · GDA ERP" },
      {
        name: "description",
        content: "Enterprise asset register with filters, saved views and bulk actions.",
      },
    ],
  }),
  component: AssetRegisterPage,
});

const CATEGORY_CARDS: {
  key: "all" | AssetCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "all", label: "All Assets", icon: Boxes },
  { key: "physical", label: "Physical Assets", icon: Building2 },
  { key: "inventory", label: "Inventory Assets", icon: Package },
  { key: "financial", label: "Financial Assets", icon: Landmark },
  { key: "intangible", label: "Intangible Assets", icon: FileDigit },
];

function StatusBadge({ status }: { status: string }) {
  const tone =
    {
      "In Use": "bg-success/15 text-success",
      "Under Maintenance": "bg-warning/15 text-warning",
      Idle: "bg-muted text-muted-foreground",
      Disposed: "bg-destructive/10 text-destructive",
      Reserved: "bg-info/15 text-info",
    }[status] ?? "bg-muted";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function AssetRegisterPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [category, setCategory] = useState<"all" | AssetCategory>("all");
  const [sub, setSub] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const subs = category !== "all" ? subCategoriesByCategory[category] : [];

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (sub && a.subCategory !== sub) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !a.name.toLowerCase().includes(s) &&
          !a.code.toLowerCase().includes(s) &&
          !a.custodian.toLowerCase().includes(s) &&
          !a.location.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [category, sub, q]);

  const totalBook = filtered.reduce((s, a) => s + a.bookValue, 0);

  return (
    <>
      <PageHeader
        title="Asset Register"
        description={`${filtered.length} of ${assets.length} assets · ${fmtCurrency(totalBook)} book value`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Bookmark className="mr-1.5 h-4 w-4" />
              Saved views
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setWizardOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              New asset
            </Button>
          </>
        }
      />
      <PageBody>
        {/* Category filter cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {CATEGORY_CARDS.map((c) => {
            const active = category === c.key;
            const count =
              c.key === "all" ? assets.length : assets.filter((a) => a.category === c.key).length;
            return (
              <button
                key={c.key}
                onClick={() => {
                  setCategory(c.key);
                  setSub(null);
                }}
                className={cn(
                  "erp-card group flex items-center gap-3 p-4 text-left transition-all",
                  active
                    ? "border-primary ring-2 ring-primary/20 bg-primary/[0.04]"
                    : "hover:border-primary/40 hover:bg-accent/40",
                )}
              >
                <div
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-md",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground",
                  )}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                    {count} records
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-category chips */}
        {subs.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-1">
              {categoryLabels[category as AssetCategory]}
            </span>
            <button
              onClick={() => setSub(null)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                sub === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-foreground hover:bg-accent",
              )}
            >
              All
            </button>
            {subs.map((s) => (
              <button
                key={s}
                onClick={() => setSub(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  sub === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground hover:bg-accent",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-t-lg border border-b-0 border-border bg-surface px-3 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search code, name, custodian, location…"
              className="h-8 w-[280px] pl-8 text-sm"
            />
          </div>
          <Button variant="ghost" size="sm" className="h-8">
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            Advanced filters
          </Button>
          {selected.size > 0 && (
            <>
              <span className="mx-2 h-4 w-px bg-border" />
              <Badge variant="secondary" className="text-[10px]">
                {selected.size} selected
              </Badge>
              <Button variant="outline" size="sm" className="h-8">
                Transfer
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Assign custodian
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-destructive">
                Retire
              </Button>
            </>
          )}
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <span>Sort:</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Purchase date ↓
            </Button>
          </div>
        </div>

        {/* Data grid */}
        <div className="overflow-x-auto rounded-b-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-surface-muted text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-8 px-3 py-2.5">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-border"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={(e) =>
                      setSelected(new Set(e.target.checked ? filtered.map((a) => a.id) : []))
                    }
                  />
                </th>
                {[
                  "Asset Code",
                  "Asset Name",
                  "Category",
                  "Type",
                  "Department",
                  "Custodian",
                  "Location",
                  "Status",
                  "Purchase",
                  "Book Value",
                  "Warranty",
                  "Insurance",
                  "Last Audit",
                ].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2.5 text-left">
                    {h}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 40).map((a) => (
                <tr key={a.id} className="group hover:bg-accent/30">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-border"
                      checked={selected.has(a.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(a.id);
                        else next.delete(a.id);
                        setSelected(next);
                      }}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-[12px] text-primary">
                    <Link
                      to="/assets/register/$id"
                      params={{ id: a.id }}
                      className="hover:underline"
                    >
                      {a.code}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium">{a.name}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground capitalize">
                    {a.category}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{a.type}</td>
                  <td className="whitespace-nowrap px-3 py-2">{a.department}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                    {a.custodian}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                    {a.location}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                    {fmtCurrency(a.purchaseValue)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums font-medium">
                    {fmtCurrency(a.bookValue)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                    {a.warrantyExpiry ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                    {a.insuranceExpiry ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                    {a.lastAudit ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/assets/register/$id" params={{ id: a.id }}>
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Transfer</DropdownMenuItem>
                        <DropdownMenuItem>Schedule maintenance</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Retire</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing 1–{Math.min(40, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-7">
              Next
            </Button>
          </div>
        </div>
      </PageBody>
      <InventoryItemWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </>
  );
}
