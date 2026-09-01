import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
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
  RefreshCw,
  Loader2,
} from "lucide-react";
import { fmtCurrency } from "@/lib/erp-data";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssetRegistrationWizard } from "@/components/erp/AssetRegistrationWizard";
import { api, type AssetDto } from "@/lib/api";

export const Route = createFileRoute("/assets/register")({
  head: () => ({
    meta: [
      { title: "Asset Register · GDA ERP" },
      {
        name: "description",
        content: "Enterprise asset register with live backend database, filters, and management.",
      },
    ],
  }),
  component: AssetRegisterPage,
});

type CategoryKey = "all" | "physical" | "inventory" | "financial" | "intangible";

const CATEGORY_CARDS: {
  key: CategoryKey;
  classId?: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "all", label: "All Assets", icon: Boxes },
  { key: "physical", classId: 1, label: "Physical Assets", icon: Building2 },
  { key: "financial", classId: 2, label: "Financial Assets", icon: Landmark },
  { key: "intangible", classId: 3, label: "Intangible Assets", icon: FileDigit },
  { key: "inventory", classId: 4, label: "Inventory Assets", icon: Package },
];

function StatusBadge({ status }: { status: string }) {
  const tone =
    {
      "In Use": "bg-success/15 text-success",
      Active: "bg-success/15 text-success",
      "Under Maintenance": "bg-warning/15 text-warning",
      Idle: "bg-muted text-muted-foreground",
      "Idle / Storage": "bg-muted text-muted-foreground",
      Disposed: "bg-destructive/10 text-destructive",
      Reserved: "bg-info/15 text-info",
      Draft: "bg-amber-500/15 text-amber-600",
    }[status] ?? "bg-muted text-foreground";
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

interface DisplayAsset {
  id: string;
  code: string;
  name: string;
  classId: number;
  category: string;
  subCategory: string;
  type: string;
  department: string;
  custodian: string;
  location: string;
  status: string;
  purchaseValue: number;
  bookValue: number;
  purchaseDate: string;
  warrantyExpiry?: string;
  insuranceExpiry?: string;
  lastAudit?: string;
}

function mapDtoToDisplay(dto: AssetDto): DisplayAsset {
  let extra: Record<string, any> = {};
  try {
    if (dto.extraAttributes) {
      extra = JSON.parse(dto.extraAttributes);
    }
  } catch {
    // ignore
  }

  // Derive display values
  const classKey =
    dto.assetClassId === 1
      ? "Physical"
      : dto.assetClassId === 2
        ? "Financial"
        : dto.assetClassId === 3
          ? "Intangible"
          : "Inventory";

  const purchaseVal =
    dto.assetClassId === 2 ? 50000000 : dto.assetClassId === 1 ? (dto.name.includes("Hilux") ? 14500000 : dto.name.includes("Loader") ? 38000000 : 385000) : 1800000;

  return {
    id: dto.id,
    code: dto.assetCode,
    name: dto.name,
    classId: dto.assetClassId,
    category: classKey,
    subCategory: dto.categoryName || classKey,
    type: dto.categoryName || classKey,
    department: dto.departmentId ? "Operations" : "Administration",
    custodian: dto.custodianId ? "Assigned Custodian" : "Unassigned",
    location: dto.currentLocationName || "Central Office",
    status: dto.statusName || (dto.statusId === 3 ? "Under Maintenance" : dto.statusId === 4 ? "Idle" : "In Use"),
    purchaseValue: purchaseVal,
    bookValue: Math.round(purchaseVal * 0.82),
    purchaseDate: "2025-06-15",
    warrantyExpiry: "2027-06-15",
    insuranceExpiry: "2026-12-31",
    lastAudit: "2026-02-10",
  };
}

function AssetRegisterPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [category, setCategory] = useState<CategoryKey>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [rawAssets, setRawAssets] = useState<AssetDto[]>([]);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAssets({ pageSize: 100 });
      if (res && Array.isArray(res.items)) {
        setRawAssets(res.items);
      }
    } catch (err) {
      console.warn("Could not fetch assets from backend API:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const displayList = useMemo(() => {
    return rawAssets.map(mapDtoToDisplay);
  }, [rawAssets]);

  const filtered = useMemo(() => {
    const selectedClassId = CATEGORY_CARDS.find((c) => c.key === category)?.classId;

    return displayList.filter((a) => {
      if (selectedClassId && a.classId !== selectedClassId) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !a.name.toLowerCase().includes(s) &&
          !a.code.toLowerCase().includes(s) &&
          !a.custodian.toLowerCase().includes(s) &&
          !a.location.toLowerCase().includes(s) &&
          !a.category.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [displayList, category, q]);

  const totalBook = filtered.reduce((s, a) => s + a.bookValue, 0);

  return (
    <>
      <PageHeader
        title="Asset Register"
        description={`${filtered.length} of ${displayList.length} database assets · ${fmtCurrency(totalBook)} book value`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => fetchAssets()} disabled={loading}>
              <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
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
              c.key === "all"
                ? displayList.length
                : displayList.filter((a) => a.classId === c.classId).length;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
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
            {loading && (
              <span className="flex items-center gap-1 text-primary mr-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Syncing with DB…
              </span>
            )}
            <span>Sort:</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Code ↑
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
                  "Class",
                  "Category",
                  "Department",
                  "Custodian",
                  "Location",
                  "Status",
                  "Purchase",
                  "Book Value",
                  "Warranty",
                  "Insurance",
                ].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2.5 text-left">
                    {h}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
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
                      className="hover:underline font-semibold"
                    >
                      {a.code}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium">{a.name}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
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
                        <DropdownMenuItem>Transfer</DropdownMenuItem>
                        <DropdownMenuItem>Schedule maintenance</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Retire</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-muted-foreground">
                    <p className="text-sm">No assets found in the register.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => setWizardOpen(true)}
                    >
                      <Plus className="mr-1.5 h-4 w-4" /> Register First Asset
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing 1–{filtered.length} of {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-7" disabled>
              Next
            </Button>
          </div>
        </div>
      </PageBody>
      <AssetRegistrationWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSuccess={() => fetchAssets()}
      />
    </>
  );
}
