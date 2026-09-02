import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  FolderTree,
  Layers3,
  MapPin,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  SlidersHorizontal,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  api,
  type AssetCategoryDto,
  type AssetClassDto,
  type AssetStatusDto,
  type CategoryAttributeDto,
  type CategoryAttributeOptionDto,
  type CurrencyDto,
  type DepreciationMethodDto,
  type LifecycleEventTypeDto,
  type LocationDto,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ConfigSection =
  | "classes"
  | "categories"
  | "attributes"
  | "statuses"
  | "locations"
  | "currencies"
  | "depreciation"
  | "lifecycle";

const DATA_TYPES = [
  ["0", "TEXT"],
  ["1", "INTEGER"],
  ["2", "DECIMAL"],
  ["3", "BOOLEAN"],
  ["4", "DATE"],
  ["5", "DATETIME"],
  ["6", "SELECT"],
  ["7", "MULTISELECT"],
  ["8", "JSON"],
] as const;
const LIFECYCLE_STAGES = [
  "ACQUISITION",
  "ASSIGNMENT",
  "MAINTENANCE",
  "DEPRECIATION",
  "VALUATION",
  "DISPOSAL",
];
const LOCATION_TYPES = ["SITE", "BUILDING", "FLOOR", "ROOM", "OTHER"];

const nav: { key: ConfigSection; label: string; icon: typeof Layers3; description: string }[] = [
  {
    key: "classes",
    label: "Asset Classes",
    icon: Layers3,
    description: "Top-level asset classification",
  },
  {
    key: "categories",
    label: "Categories",
    icon: FolderTree,
    description: "Hierarchical category taxonomy",
  },
  {
    key: "attributes",
    label: "Attributes",
    icon: SlidersHorizontal,
    description: "Dynamic registration fields",
  },
  { key: "statuses", label: "Statuses", icon: Tags, description: "Asset lifecycle states" },
  {
    key: "locations",
    label: "Locations",
    icon: MapPin,
    description: "Sites, buildings, floors and rooms",
  },
  {
    key: "currencies",
    label: "Currencies",
    icon: Settings2,
    description: "ISO 4217 currency lookup",
  },
  {
    key: "depreciation",
    label: "Depreciation Methods",
    icon: MoreHorizontal,
    description: "Available accounting methods",
  },
  {
    key: "lifecycle",
    label: "Lifecycle Events",
    icon: RefreshCw,
    description: "Configurable event types by stage",
  },
];

function normalizeError(error: unknown) {
  return error instanceof Error
    ? error.message.replace(/^API request.*?: /, "")
    : "Something went wrong. Please try again.";
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? "default" : "secondary"} className="font-medium">
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

function EmptyState({ label, onCreate }: { label: string; onCreate: () => void }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 p-8 text-center">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-accent">
        <FolderTree className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-semibold">No {label.toLowerCase()} found</div>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Create your first {label.toLowerCase().replace(/s$/, "")} to start configuring Asset
        Management.
      </p>
      <Button size="sm" className="mt-4" onClick={onCreate}>
        <Plus className="mr-1.5 h-4 w-4" />
        Create {label.replace(/s$/, "")}
      </Button>
    </div>
  );
}

function ErrorState({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
      <div className="text-sm font-semibold">Unable to load configuration data.</div>
      <p className="mt-1 text-xs text-muted-foreground">{error}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={retry}>
        <RefreshCw className="mr-1.5 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}
function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
      {children}
    </thead>
  );
}
function Th({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 font-medium", className)}>{children}</th>;
}
function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}
function RowActions({
  onEdit,
  onToggle,
  active,
  onDelete,
  deleteLabel = "Delete",
}: {
  onEdit: () => void;
  onToggle: () => void;
  active: boolean;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={onEdit}>
        <Edit3 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onToggle}>
        {active ? "Deactivate" : "Activate"}
      </Button>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          title={deleteLabel}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function useDialog<T>() {
  const [item, setItem] = useState<T | null>(null);
  return { item, open: setItem, close: () => setItem(null) };
}

export function AssetConfiguration({
  section,
  onSectionChange,
}: {
  section: ConfigSection;
  onSectionChange: (section: ConfigSection) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const current = nav.find((x) => x.key === section)!;

  return (
    <div className="flex min-h-[calc(100vh-132px)] flex-col lg:flex-row">
      <aside
        className={cn(
          "shrink-0 border-b border-border bg-surface transition-[width] duration-200 lg:border-b-0 lg:border-r",
          collapsed ? "w-full lg:w-16" : "w-full lg:w-64",
        )}
      >
        <div className="flex items-center justify-between gap-2 p-4">
          <div className={cn("min-w-0", collapsed && "lg:hidden")}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Configuration
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Master data used by Asset Management
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>
        <nav className="px-2 pb-3 lg:pb-4">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSectionChange(item.key)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                  collapsed && "lg:justify-center lg:px-2",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="hidden text-[11px] text-muted-foreground lg:block">
                    {item.description}
                  </span>
                </span>
                {active && !collapsed && <ChevronRight className="h-4 w-4" />}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 lg:block">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Asset Management</span>
            <ChevronRight className="h-3 w-3" />
            <span>Configuration</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{current.label}</span>
          </div>
          <div className="mt-2">
            <h2 className="text-xl font-semibold tracking-tight">{current.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{current.description}</p>
          </div>
        </div>
        {section === "classes" && <AssetClasses />}
        {section === "categories" && <Categories />}
        {section === "attributes" && <Attributes />}
        {section === "statuses" && <Statuses />}
        {section === "locations" && <Locations />}
        {section === "currencies" && <Currencies />}
        {section === "depreciation" && <DepreciationMethods />}
        {section === "lifecycle" && <LifecycleEvents />}
      </main>
    </div>
  );
}

function SectionToolbar({
  search,
  setSearch,
  buttonLabel,
  onCreate,
  children,
}: {
  search?: string;
  setSearch?: (v: string) => void;
  buttonLabel: string;
  onCreate: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {setSearch && <SearchBar value={search ?? ""} onChange={setSearch} />}
        {children}
      </div>
      <Button onClick={onCreate}>
        <Plus className="mr-1.5 h-4 w-4" />
        {buttonLabel}
      </Button>
    </div>
  );
}

function AssetClasses() {
  const [items, setItems] = useState<AssetClassDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const dialog = useDialog<AssetClassDto | "new">();
  const confirm = useDialog<AssetClassDto>();
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems((await api.getAssetClasses({ pageSize: 500 })).items);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const filtered = useMemo(
    () =>
      items.filter((x) =>
        `${x.code} ${x.name} ${x.description ?? ""}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );
  const save = async (data: Omit<AssetClassDto, "id">, editing?: AssetClassDto) => {
    try {
      if (editing) await api.updateAssetClass(editing.id, data);
      else await api.createAssetClass(data);
      toast.success(editing ? "Asset class updated" : "Asset class created");
      dialog.close();
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  const toggle = async (item: AssetClassDto) => {
    try {
      await api.updateAssetClass(item.id, {
        code: item.code,
        name: item.name,
        description: item.description,
        isActive: !item.isActive,
      });
      toast.success(item.isActive ? "Asset class deactivated" : "Asset class activated");
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  return (
    <>
      <SectionToolbar
        search={search}
        setSearch={setSearch}
        buttonLabel="Add Asset Class"
        onCreate={() => dialog.open("new")}
      />
      <ConfigTableState
        loading={loading}
        error={error}
        retry={load}
        empty={!filtered.length}
        emptyLabel="Asset Classes"
        onCreate={() => dialog.open("new")}
      >
        <TableShell>
          <TableHead>
            <tr>
              <Th>Code</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </TableHead>
          <tbody>
            {filtered.map((x) => (
              <tr key={x.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                <Td>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                    {x.code}
                  </code>
                </Td>
                <Td className="font-medium">{x.name}</Td>
                <Td className="max-w-md truncate text-muted-foreground">{x.description || "—"}</Td>
                <Td>
                  <StatusBadge active={x.isActive} />
                </Td>
                <Td>
                  <RowActions
                    onEdit={() => dialog.open(x)}
                    onToggle={() => void toggle(x)}
                    active={x.isActive}
                    onDelete={() => confirm.open(x)}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </ConfigTableState>
      <AssetClassDialog value={dialog.item} onClose={dialog.close} onSave={save} />
      <ConfirmDialog
        item={confirm.item}
        title="Delete asset class?"
        description="Only delete a class when it is not referenced by categories or assets. Otherwise deactivate it instead."
        onClose={confirm.close}
        onConfirm={async () => {
          if (!confirm.item) return;
          try {
            await api.deleteAssetClass(confirm.item.id);
            toast.success("Asset class deleted");
            confirm.close();
            await load();
          } catch (e) {
            toast.error(normalizeError(e));
          }
        }}
      />
    </>
  );
}

function AssetClassDialog({
  value,
  onClose,
  onSave,
}: {
  value: AssetClassDto | "new" | null;
  onClose: () => void;
  onSave: (data: Omit<AssetClassDto, "id">, editing?: AssetClassDto) => Promise<void>;
}) {
  const editing = value && value !== "new" ? value : undefined;
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setCode(editing?.code ?? "");
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setActive(editing?.isActive ?? true);
  }, [editing?.id, value]);
  const submit = async () => {
    if (!code.trim() || !name.trim()) {
      toast.error("Code and name are required");
      return;
    }
    setSaving(true);
    await onSave(
      {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || undefined,
        isActive: active,
      },
      editing,
    );
    setSaving(false);
  };
  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit asset class" : "Create asset class"}</DialogTitle>
          <DialogDescription>
            Manage a master classification used throughout Asset Management.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <Field label="Code *">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={50}
              placeholder="PHYSICAL"
              disabled={!!editing}
            />

            <p className="text-[11px] text-muted-foreground">
              {editing
                ? "Asset class code cannot be changed after creation."
                : "This code cannot be changed after the asset class is created."}
            </p>
          </Field>
          <Field label="Name *">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={200}
              placeholder="Physical Assets"
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </Field>
          <SwitchField label="Active" checked={active} onCheckedChange={setActive} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={() => void submit()}>
            {saving ? "Saving…" : editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type CategoryDialogValue = AssetCategoryDto | "new" | { kind: "child"; parent: AssetCategoryDto };

function isChildSeed(
  value: CategoryDialogValue,
): value is { kind: "child"; parent: AssetCategoryDto } {
  return typeof value === "object" && value !== null && "kind" in value;
}

function getCategoryParentLabel(
  category: AssetCategoryDto,
  categoriesById: Map<number, AssetCategoryDto>,
  classesById: Map<number, AssetClassDto>,
) {
  if (category.parentCategoryId != null) {
    return categoriesById.get(category.parentCategoryId)?.name ?? "—";
  }
  return classesById.get(category.assetClassId)?.name ?? "—";
}

function Categories() {
  const [items, setItems] = useState<AssetCategoryDto[]>([]);
  const [classes, setClasses] = useState<AssetClassDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const dialog = useDialog<CategoryDialogValue>();
  const confirm = useDialog<AssetCategoryDto>();
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [c, k] = await Promise.all([
        api.getAssetCategories({ pageSize: 1000 }),
        api.getAssetClasses({ pageSize: 500 }),
      ]);
      setItems(c.items);
      setClasses(k.items);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const filtered = useMemo(
    () =>
      items.filter(
        (x) =>
          (classFilter === "all" || String(x.assetClassId) === classFilter) &&
          `${x.code} ${x.name} ${x.description ?? ""}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, classFilter, search],
  );
  const categoriesById = useMemo(() => new Map(items.map((x) => [x.id, x])), [items]);
  const classesById = useMemo(() => new Map(classes.map((x) => [x.id, x])), [classes]);
  const children = useMemo(() => {
    const m = new Map<number | null, AssetCategoryDto[]>();
    for (const x of filtered) {
      const k = x.parentCategoryId ?? null;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(x);
    }
    for (const a of m.values())
      a.sort(
        (x, y) => (x.displayOrder ?? 0) - (y.displayOrder ?? 0) || x.name.localeCompare(y.name),
      );
    return m;
  }, [filtered]);
  const save = async (data: Omit<AssetCategoryDto, "id">, editing?: AssetCategoryDto) => {
    try {
      if (editing) await api.updateAssetCategory(editing.id, data);
      else await api.createAssetCategory(data);
      toast.success(editing ? "Category updated" : "Category created");
      dialog.close();
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  const toggle = async (x: AssetCategoryDto) => {
    try {
      await api.updateAssetCategory(x.id, {
        assetClassId: x.assetClassId,
        parentCategoryId: x.parentCategoryId,
        code: x.code,
        name: x.name,
        description: x.description,
        isActive: !x.isActive,
      });
      toast.success(x.isActive ? "Category deactivated" : "Category activated");
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  const render = (parent: number | null, depth = 0): ReactNode =>
    (children.get(parent) ?? []).map((x) => {
      const has = (children.get(x.id) ?? []).length > 0;
      const open = expanded.has(x.id);
      return (
        <div key={x.id}>
          <div
            className="group flex items-center gap-2 border-b border-border px-3 py-2.5 hover:bg-muted/20"
            style={{ paddingLeft: 12 + depth * 24 }}
          >
            <button
              className="grid h-7 w-7 shrink-0 place-items-center rounded hover:bg-accent"
              onClick={() =>
                setExpanded((s) => {
                  const n = new Set(s);
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  open ? n.delete(x.id) : n.add(x.id);
                  return n;
                })
              }
            >
              {has ? (
                open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{x.name}</span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{x.code}</code>
                {depth === 0 && <span className="text-[10px] text-muted-foreground">Root</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                {x.description || "No description"}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Parent:{" "}
                <span className="font-medium text-foreground">
                  {getCategoryParentLabel(x, categoriesById, classesById)}
                </span>
              </div>
            </div>
            <StatusBadge active={x.isActive} />
            <div className="flex items-center gap-1 opacity-80 sm:opacity-100">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => dialog.open({ kind: "child", parent: x })}
              >
                Add child
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => dialog.open(x)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => void toggle(x)}
              >
                {x.isActive ? (
                  <span className="text-xs">Off</span>
                ) : (
                  <span className="text-xs">On</span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => confirm.open(x)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {open && render(x.id, depth + 1)}
        </div>
      );
    });
  return (
    <>
      <SectionToolbar
        search={search}
        setSearch={setSearch}
        buttonLabel="Add Root Category"
        onCreate={() => dialog.open("new")}
      >
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[210px]">
            <SelectValue placeholder="Asset class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All asset classes</SelectItem>
            {classes.map((x) => (
              <SelectItem key={x.id} value={String(x.id)}>
                {x.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SectionToolbar>
      <ConfigTableState
        loading={loading}
        error={error}
        retry={load}
        empty={!filtered.length}
        emptyLabel="Categories"
        onCreate={() => dialog.open("new")}
      >
        {filtered.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="flex-1">Category tree</span>
              <span>Status</span>
              <span className="w-44 text-right">Actions</span>
            </div>
            {render(null)}
          </div>
        )}
      </ConfigTableState>
      <CategoryDialog
        value={dialog.item}
        classes={classes}
        categories={items}
        onClose={dialog.close}
        onSave={save}
      />
      <ConfirmDialog
        item={confirm.item}
        title="Delete category?"
        description="Categories with children, attributes or asset references should be deactivated instead of deleted."
        onClose={confirm.close}
        onConfirm={async () => {
          if (!confirm.item) return;
          try {
            await api.deleteAssetCategory(confirm.item.id);
            toast.success("Category deleted");
            confirm.close();
            await load();
          } catch (e) {
            toast.error(normalizeError(e));
          }
        }}
      />
    </>
  );
}

function CategoryDialog({
  value,
  classes,
  categories,
  onClose,
  onSave,
}: {
  value: CategoryDialogValue | null;
  classes: AssetClassDto[];
  categories: AssetCategoryDto[];
  onClose: () => void;
  onSave: (data: Omit<AssetCategoryDto, "id">, editing?: AssetCategoryDto) => Promise<void>;
}) {
  const editing = value && value !== "new" && !isChildSeed(value) ? value : undefined;
  const childSeed = value && value !== "new" && isChildSeed(value) ? value.parent : undefined;
  const [assetClassId, setAssetClassId] = useState("");
  const [parentId, setParentId] = useState("none");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [order, setOrder] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setAssetClassId(String(editing?.assetClassId ?? childSeed?.assetClassId ?? ""));
    setParentId(
      editing?.parentCategoryId
        ? String(editing.parentCategoryId)
        : childSeed
          ? String(childSeed.id)
          : "none",
    );
    setCode("");
    setName("");
    setDesc("");
    setOrder("");
    setActive(true);
    if (editing) {
      setCode(editing.code);
      setName(editing.name);
      setDesc(editing.description ?? "");
      setOrder(editing.displayOrder == null ? "" : String(editing.displayOrder));
      setActive(editing.isActive);
    }
  }, [editing?.id, value]);
  const parentOptions = categories.filter(
    (x) => x.id !== editing?.id && (!assetClassId || String(x.assetClassId) === assetClassId),
  );
  const submit = async () => {
    const cls = Number(assetClassId);
    if (!cls || !code.trim() || !name.trim()) {
      toast.error("Asset class, code and name are required");
      return;
    }
    setSaving(true);
    await onSave(
      {
        assetClassId: cls,
        parentCategoryId: parentId === "none" ? null : Number(parentId),
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: desc.trim() || undefined,
        displayOrder: order === "" ? undefined : Number(order),
        isActive: active,
      },
      editing,
    );
    setSaving(false);
  };
  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit category" : "Create category"}</DialogTitle>
          <DialogDescription>
            Categories form the hierarchical taxonomy used by the registration wizard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <Field label="Asset Class *">
            <Select
              value={assetClassId}
              onValueChange={(v) => {
                setAssetClassId(v);
                if (editing?.assetClassId !== Number(v)) setParentId("none");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((x) => (
                  <SelectItem key={x.id} value={String(x.id)}>
                    {x.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Parent Category">
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue placeholder="Root category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent — root</SelectItem>
                {parentOptions.map((x) => (
                  <SelectItem key={x.id} value={String(x.id)}>
                    {x.name} ({x.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code *">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={50}
              />
            </Field>
            <Field label="Display Order">
              <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
            </Field>
          </div>
          <Field label="Name *">
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
          </Field>
          <Field label="Description">
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          </Field>
          <SwitchField label="Active" checked={active} onCheckedChange={setActive} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={() => void submit()}>
            {saving ? "Saving…" : editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Attributes() {
  const [items, setItems] = useState<CategoryAttributeDto[]>([]);
  const [cats, setCats] = useState<AssetCategoryDto[]>([]);
  const [classes, setClasses] = useState<AssetClassDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const dialog = useDialog<{ item: CategoryAttributeDto | "new"; categoryId: number }>();
  const confirm = useDialog<CategoryAttributeDto>();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [a, c, k] = await Promise.all([
        api.getCategoryAttributes({ pageSize: 1000 }),
        api.getAssetCategories({ pageSize: 1000 }),
        api.getAssetClasses({ pageSize: 500 }),
      ]);
      setItems(a.items);
      setCats(c.items);
      setClasses(k.items);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  // Category tree indexed by parent
  const childrenByParent = useMemo(() => {
    const m = new Map<number | null, AssetCategoryDto[]>();
    for (const x of cats) {
      const k = x.parentCategoryId ?? null;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(x);
    }
    for (const a of m.values())
      a.sort(
        (x, y) => (x.displayOrder ?? 0) - (y.displayOrder ?? 0) || x.name.localeCompare(y.name),
      );
    return m;
  }, [cats]);

  const isLeaf = useCallback(
    (categoryId: number) => !(childrenByParent.get(categoryId) ?? []).length,
    [childrenByParent],
  );

  const attributesByCategory = useMemo(() => {
    const m = new Map<number, CategoryAttributeDto[]>();
    for (const x of items) {
      if (!m.has(x.categoryId)) m.set(x.categoryId, []);
      m.get(x.categoryId)!.push(x);
    }
    for (const a of m.values()) a.sort((x, y) => (x.displayOrder ?? 0) - (y.displayOrder ?? 0));
    return m;
  }, [items]);

  const leafCategories = useMemo(() => cats.filter((x) => isLeaf(x.id)), [cats, isLeaf]);
  const term = search.trim().toLowerCase();

  const save = async (
    data: CategoryAttributeDto | Omit<CategoryAttributeDto, "id">,
    editing?: CategoryAttributeDto,
  ) => {
    try {
      const dto = data as any;
      if (editing) await api.updateCategoryAttribute(editing.id, dto);
      else await api.createCategoryAttribute(dto);
      toast.success(editing ? "Attribute updated" : "Attribute created");
      dialog.close();
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  const toggle = async (x: CategoryAttributeDto) => {
    try {
      await api.updateCategoryAttribute(x.id, {
        categoryId: x.categoryId,
        code: x.code,
        name: x.name,
        dataType: Number(x.dataType),
        isRequired: x.isRequired,
        isSearchable: x.isSearchable,
        isFilterable: x.isFilterable,
        displayOrder: x.displayOrder,
        description: x.description,
        defaultValue: x.defaultValue,
        validationRules: x.validationRules,
        isActive: !x.isActive,
      });
      toast.success(x.isActive ? "Attribute deactivated" : "Attribute activated");
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  const removeAttribute = async () => {
    if (!confirm.item) return;
    try {
      await api.deleteCategoryAttribute(confirm.item.id);
      toast.success("Attribute deleted");
      confirm.close();
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };

  // A category matches search if its own name/code matches, one of its
  // attributes matches, or any descendant matches (so parents stay visible
  // while you drill down to the leaf that actually matched).
  const matchesSearch = useCallback(
    (cat: AssetCategoryDto): boolean => {
      if (!term) return true;
      if (`${cat.code} ${cat.name}`.toLowerCase().includes(term)) return true;
      const attrs = attributesByCategory.get(cat.id) ?? [];
      if (attrs.some((a) => `${a.code} ${a.name}`.toLowerCase().includes(term))) return true;
      return (childrenByParent.get(cat.id) ?? []).some((child) => matchesSearch(child));
    },
    [term, attributesByCategory, childrenByParent],
  );

  const render = (parent: number | null, depth = 0): ReactNode =>
    (childrenByParent.get(parent) ?? [])
      .filter((x) => classFilter === "all" || String(x.assetClassId) === classFilter)
      .filter(matchesSearch)
      .map((x) => {
        const leaf = isLeaf(x.id);
        const open = expanded.has(x.id);
        const attrs = attributesByCategory.get(x.id) ?? [];
        const shownAttrs = term
          ? attrs.filter((a) => `${a.code} ${a.name}`.toLowerCase().includes(term))
          : attrs;

        return (
          <div key={x.id}>
            <div
              className="group flex items-center gap-2 border-b border-border px-3 py-2.5 hover:bg-muted/20"
              style={{ paddingLeft: 12 + depth * 24 }}
            >
              <button
                className="grid h-7 w-7 shrink-0 place-items-center rounded hover:bg-accent"
                onClick={() =>
                  setExpanded((s) => {
                    const n = new Set(s);
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    open ? n.delete(x.id) : n.add(x.id);
                    return n;
                  })
                }
              >
                {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{x.name}</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{x.code}</code>
                  {leaf ? (
                    <Badge variant="outline" className="text-[10px]">
                      {attrs.length} attribute{attrs.length === 1 ? "" : "s"}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      Has subcategories
                    </Badge>
                  )}
                </div>
                {!leaf && (
                  <div className="text-[11px] text-muted-foreground">
                    Attributes can only be defined on categories with no subcategories.
                  </div>
                )}
              </div>
              {leaf && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={() => {
                    setExpanded((s) => new Set(s).add(x.id));
                    dialog.open({ item: "new", categoryId: x.id });
                  }}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add attribute
                </Button>
              )}
            </div>

            {open && !leaf && render(x.id, depth + 1)}

            {open && leaf && (
              <div
                style={{ paddingLeft: 12 + (depth + 1) * 24 }}
                className="border-b border-border bg-muted/10 py-2 pr-3"
              >
                {shownAttrs.length ? (
                  <div className="divide-y divide-border rounded-md border border-border bg-surface">
                    {shownAttrs.map((a) => (
                      <div key={a.id} className="flex flex-wrap items-center gap-3 px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">{a.name}</div>
                          <code className="text-[10px] text-muted-foreground">{a.code}</code>
                        </div>
                        <Badge variant="outline">{dataTypeName(a.dataType)}</Badge>
                        <div className="flex flex-wrap gap-1">
                          {a.isRequired && <Badge variant="secondary">Required</Badge>}
                          {a.isSearchable && <Badge variant="secondary">Search</Badge>}
                          {a.isFilterable && <Badge variant="secondary">Filter</Badge>}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {a.options?.length ?? 0} option{(a.options?.length ?? 0) === 1 ? "" : "s"}
                        </span>
                        <StatusBadge active={a.isActive} />
                        <RowActions
                          onEdit={() => dialog.open({ item: a, categoryId: x.id })}
                          onToggle={() => void toggle(a)}
                          active={a.isActive}
                          onDelete={() => confirm.open(a)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                    No attributes yet for this category.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      });

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search categories or attributes..."
          />
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[210px]">
              <SelectValue placeholder="Asset class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All asset classes</SelectItem>
              {classes.map((x) => (
                <SelectItem key={x.id} value={String(x.id)}>
                  {x.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        Attributes belong to a specific category. Only categories without subcategories (leaf
        categories) can have attributes — expand a leaf category below to view, add, or edit its
        fields.
      </div>

      {loading ? (
        <div className="space-y-3 rounded-lg border border-border p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <ErrorState error={error} retry={load} />
      ) : !cats.length ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 p-8 text-center">
          <div className="text-sm font-semibold">No categories found</div>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Create categories first, then add attributes to categories that have no subcategories.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="border-b border-border bg-muted/30 px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
            Category tree
          </div>
          {render(null)}
        </div>
      )}

      <AttributeDialog
        value={dialog.item?.item ?? null}
        categories={leafCategories}
        lockedCategoryId={dialog.item?.categoryId}
        onClose={dialog.close}
        onSave={save}
      />
      <ConfirmDialog
        item={confirm.item}
        title="Delete attribute?"
        description="Delete only when no existing asset values depend on this attribute. Otherwise deactivate it."
        onClose={confirm.close}
        onConfirm={removeAttribute}
      />
    </>
  );
}

function AttributeDialog({
  value,
  categories,
  lockedCategoryId,
  onClose,
  onSave,
}: {
  value: CategoryAttributeDto | "new" | null;
  categories: AssetCategoryDto[];
  lockedCategoryId?: number;
  onClose: () => void;
  onSave: (data: unknown, editing?: CategoryAttributeDto) => Promise<void>;
}) {
  const editing = value && value !== "new" ? value : undefined;
  const resolvedCategoryId = editing?.categoryId ?? lockedCategoryId;
  const categoryName = categories.find((c) => c.id === resolvedCategoryId)?.name ?? "—";

  const [categoryId, setCategoryId] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("0");
  const [required, setRequired] = useState(false);
  const [searchable, setSearchable] = useState(false);
  const [filterable, setFilterable] = useState(false);
  const [order, setOrder] = useState("");
  const [description, setDescription] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [validation, setValidation] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setCategoryId(resolvedCategoryId ? String(resolvedCategoryId) : "");
    setCode(editing?.code ?? "");
    setName(editing?.name ?? "");
    setType(String(editing?.dataType ?? 0));
    setRequired(editing?.isRequired ?? false);
    setSearchable(editing?.isSearchable ?? false);
    setFilterable(editing?.isFilterable ?? false);
    setOrder(editing?.displayOrder == null ? "" : String(editing.displayOrder));
    setDescription(editing?.description ?? "");
    setDefaultValue(editing?.defaultValue ?? "");
    setValidation(editing?.validationRules ?? "");
    setActive(editing?.isActive ?? true);
  }, [editing?.id, value, lockedCategoryId]);
  const submit = async () => {
    if (!categoryId || !code.trim() || !name.trim()) {
      toast.error("Category, code and name are required");
      return;
    }
    const rules = validation.trim() || undefined;
    if (rules) {
      try {
        JSON.parse(rules);
      } catch {
        toast.error("Validation rules must be valid JSON");
        return;
      }
    }
    setSaving(true);
    await onSave(
      {
        categoryId: Number(categoryId),
        code: code.trim().toLowerCase(),
        name: name.trim(),
        dataType: Number(type),
        isRequired: required,
        isSearchable: searchable,
        isFilterable: filterable,
        displayOrder: order === "" ? undefined : Number(order),
        description: description.trim() || undefined,
        defaultValue: defaultValue || undefined,
        validationRules: rules,
        isActive: active,
      },
      editing,
    );
    setSaving(false);
  };
  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit attribute" : "Create attribute"}</DialogTitle>
          <DialogDescription>
            Define a dynamic field consumed by the Asset Registration Wizard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <div className="flex h-9 items-center rounded-md border border-border bg-muted/30 px-3 text-sm">
                {categoryName}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Set by the leaf category you added this attribute from.
              </p>
            </Field>
            <Field label="Data Type *">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATA_TYPES.map(([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code *">
              <Input value={code} onChange={(e) => setCode(e.target.value)} maxLength={50} />
            </Field>
            <Field label="Name *">
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Display Order">
              <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
            </Field>
            <Field label="Default Value">
              <Input value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} />
            </Field>
            <Field label="Status">
              <SwitchField label="Active" checked={active} onCheckedChange={setActive} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </Field>
          <div className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-3">
            <SwitchField label="Required" checked={required} onCheckedChange={setRequired} />
            <SwitchField label="Searchable" checked={searchable} onCheckedChange={setSearchable} />
            <SwitchField label="Filterable" checked={filterable} onCheckedChange={setFilterable} />
          </div>
          <Field label="Validation Rules (JSON)">
            <Textarea
              value={validation}
              onChange={(e) => setValidation(e.target.value)}
              rows={4}
              placeholder={
                type === "0"
                  ? '{"minLength": 2, "maxLength": 100}'
                  : type === "1"
                    ? '{"min": 0, "max": 100}'
                    : "{}"
              }
            />
            <p className="text-[11px] text-muted-foreground">
              Store structured rules in the existing validationRules field. Leave blank when no
              rules are needed.
            </p>
          </Field>
          {(type === "6" || type === "7") && editing && <AttributeOptions attribute={editing} />}
          {(type === "6" || type === "7") && !editing && (
            <p className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
              Save the attribute first, then add SELECT/MULTISELECT options from the attribute row.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={() => void submit()}>
            {saving ? "Saving…" : editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AttributeOptions({ attribute }: { attribute: CategoryAttributeDto }) {
  const [options, setOptions] = useState<CategoryAttributeOptionDto[]>(attribute.options ?? []);
  const [loading, setLoading] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryAttributeOptionDto | undefined>();
  const load = async () => {
    setLoading(true);
    try {
      setOptions(
        await api
          .getCategoryAttributeOptions({ pageSize: 500, searchTerm: "" })
          .then((r) => r.items.filter((x) => x.attributeId === attribute.id)),
      );
    } catch (e) {
      toast.error(normalizeError(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [attribute.id]);
  const save = async (
    data: Omit<CategoryAttributeOptionDto, "id">,
    item?: CategoryAttributeOptionDto,
  ) => {
    try {
      if (item) await api.updateCategoryAttributeOption(item.id, data);
      else await api.createCategoryAttributeOption(data);
      toast.success(item ? "Option updated" : "Option added");
      setNewOpen(false);
      setEditing(undefined);
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-3 py-2">
        <div>
          <div className="text-sm font-medium">Options</div>
          <div className="text-[11px] text-muted-foreground">SELECT / MULTISELECT values</div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setNewOpen(true)}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add option
        </Button>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-3">
            <Skeleton className="h-8 w-full" />
          </div>
        ) : options.length ? (
          options
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map((o) => (
              <div key={o.id} className="flex items-center gap-3 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{o.label}</div>
                  <code className="text-[10px] text-muted-foreground">{o.value}</code>
                </div>
                <span className="text-xs text-muted-foreground">#{o.displayOrder ?? 0}</span>
                <StatusBadge active={o.isActive} />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[11px]"
                  onClick={async () => {
                    try {
                      await api.updateCategoryAttributeOption(o.id, {
                        attributeId: o.attributeId,
                        value: o.value,
                        label: o.label,
                        displayOrder: o.displayOrder,
                        isActive: !o.isActive,
                      });
                      toast.success(o.isActive ? "Option deactivated" : "Option activated");
                      await load();
                    } catch (e) {
                      toast.error(normalizeError(e));
                    }
                  }}
                >
                  {o.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setEditing(o)}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive"
                  onClick={async () => {
                    try {
                      await api.deleteCategoryAttributeOption(o.id);
                      toast.success("Option deleted");
                      await load();
                    } catch (e) {
                      toast.error(normalizeError(e));
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
        ) : (
          <div className="p-4 text-center text-xs text-muted-foreground">No options yet.</div>
        )}
      </div>
      <OptionDialog
        open={newOpen || !!editing}
        value={editing}
        attributeId={attribute.id}
        onClose={() => {
          setNewOpen(false);
          setEditing(undefined);
        }}
        onSave={save}
      />
    </div>
  );
}

function OptionDialog({
  open,
  value,
  attributeId,
  onClose,
  onSave,
}: {
  open: boolean;
  value?: CategoryAttributeOptionDto;
  attributeId: number;
  onClose: () => void;
  onSave: (
    data: Omit<CategoryAttributeOptionDto, "id">,
    item?: CategoryAttributeOptionDto,
  ) => Promise<void>;
}) {
  const [val, setVal] = useState("");
  const [label, setLabel] = useState("");
  const [order, setOrder] = useState("");
  const [active, setActive] = useState(true);
  useEffect(() => {
    setVal(value?.value ?? "");
    setLabel(value?.label ?? "");
    setOrder(value?.displayOrder == null ? "" : String(value.displayOrder));
    setActive(value?.isActive ?? true);
  }, [value, open]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{value ? "Edit option" : "Add option"}</DialogTitle>
          <DialogDescription>
            Option values are submitted to the Registration Wizard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Value *">
            <Input value={val} onChange={(e) => setVal(e.target.value)} maxLength={150} />
          </Field>
          <Field label="Label *">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={150} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Display Order">
              <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
            </Field>
            <SwitchField label="Active" checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!val.trim() || !label.trim()) {
                toast.error("Value and label are required");
                return;
              }
              void onSave(
                {
                  attributeId,
                  value: val.trim(),
                  label: label.trim(),
                  displayOrder: order === "" ? undefined : Number(order),
                  isActive: active,
                },
                value,
              );
            }}
          >
            {value ? "Save changes" : "Add option"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Statuses() {
  return (
    <SimpleMaster<AssetStatusDto>
      title="Asset Status"
      createLabel="Add Status"
      fetch={(p) => api.getAssetStatuses({ pageSize: 500, ...p })}
      create={(d) => api.createAssetStatus(d)}
      update={(id, d) => api.updateAssetStatus(id, d)}
      remove={(id) => api.deleteAssetStatus(id)}
      fields="status"
    />
  );
}
function DepreciationMethods() {
  return (
    <SimpleMaster<DepreciationMethodDto>
      title="Depreciation Method"
      createLabel="Add Method"
      fetch={(p) => api.getDepreciationMethods({ pageSize: 500, ...p })}
      create={(d) => api.createDepreciationMethod(d)}
      update={(id, d) => api.updateDepreciationMethod(id, d)}
      remove={(id) => api.deleteDepreciationMethod(id)}
      fields="master"
    />
  );
}
function LifecycleEvents() {
  return (
    <SimpleMaster<LifecycleEventTypeDto>
      title="Lifecycle Event Type"
      createLabel="Add Event Type"
      fetch={(p) => api.getLifecycleEventTypes({ pageSize: 500, ...p })}
      create={(d) => api.createLifecycleEventType(d)}
      update={(id, d) => api.updateLifecycleEventType(id, d)}
      remove={(id) => api.deleteLifecycleEventType(id)}
      fields="lifecycle"
    />
  );
}

type Master = AssetStatusDto | DepreciationMethodDto | LifecycleEventTypeDto;
function SimpleMaster<T extends Master>({
  title,
  createLabel,
  fetch,
  create,
  update,
  remove,
  fields,
}: {
  title: string;
  createLabel: string;
  fetch: (p: any) => Promise<{ items: T[] }>;
  create: (d: any) => Promise<T>;
  update: (id: number, d: any) => Promise<void>;
  remove: (id: number) => Promise<void>;
  fields: "status" | "master" | "lifecycle";
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const dialog = useDialog<T | "new">();
  const confirm = useDialog<T>();
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems((await fetch({ searchTerm: "" })).items);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }, [fetch]);
  useEffect(() => {
    void load();
  }, []);
  const filtered = items.filter((x) =>
    `${x.code} ${x.name} ${x.description ?? ""} ${"stage" in x ? (x.stage ?? "") : ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const save = async (d: any, item?: T) => {
    try {
      if (item) await update(item.id, d);
      else await create(d);
      toast.success(item ? `${title} updated` : `${title} created`);
      dialog.close();
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  const toggle = async (x: T) => {
    try {
      const d: any = {
        code: x.code,
        name: x.name,
        description: x.description,
        isActive: !x.isActive,
      };
      if ("stage" in x) d.stage = x.stage;
      await update(x.id, d);
      toast.success(x.isActive ? `${title} deactivated` : `${title} activated`);
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  return (
    <>
      <SectionToolbar
        search={search}
        setSearch={setSearch}
        buttonLabel={createLabel}
        onCreate={() => dialog.open("new")}
      />
      <ConfigTableState
        loading={loading}
        error={error}
        retry={load}
        empty={!filtered.length}
        emptyLabel={`${title}s`}
        onCreate={() => dialog.open("new")}
      >
        <TableShell>
          <TableHead>
            <tr>
              <Th>Code</Th>
              {fields === "lifecycle" && <Th>Stage</Th>}
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </TableHead>
          <tbody>
            {filtered.map((x) => (
              <tr key={x.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                <Td>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{x.code}</code>
                </Td>
                {fields === "lifecycle" && (
                  <Td>
                    <Badge variant="outline">{("stage" in x && x.stage) || "—"}</Badge>
                  </Td>
                )}
                <Td className="font-medium">{x.name}</Td>
                <Td className="max-w-md truncate text-muted-foreground">{x.description || "—"}</Td>
                <Td>
                  <StatusBadge active={x.isActive} />
                </Td>
                <Td>
                  <RowActions
                    onEdit={() => dialog.open(x)}
                    onToggle={() => void toggle(x)}
                    active={x.isActive}
                    onDelete={() => confirm.open(x)}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </ConfigTableState>
      <SimpleMasterDialog
        value={dialog.item}
        title={title}
        fields={fields}
        onClose={dialog.close}
        onSave={save}
      />
      <ConfirmDialog
        item={confirm.item}
        title={`Delete ${title.toLowerCase()}?`}
        description="Prefer deactivation when this master record is referenced by business data."
        onClose={confirm.close}
        onConfirm={async () => {
          if (!confirm.item) return;
          try {
            await remove(confirm.item.id);
            toast.success(`${title} deleted`);
            confirm.close();
            await load();
          } catch (e) {
            toast.error(normalizeError(e));
          }
        }}
      />
    </>
  );
}

function SimpleMasterDialog({
  value,
  title,
  fields,
  onClose,
  onSave,
}: {
  value: Master | "new" | null;
  title: string;
  fields: "status" | "master" | "lifecycle";
  onClose: () => void;
  onSave: (d: any, item?: Master) => Promise<void>;
}) {
  const editing = value && value !== "new" ? value : undefined;
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stage, setStage] = useState("");
  const [active, setActive] = useState(true);
  useEffect(() => {
    setCode(editing?.code ?? "");
    setName(editing?.name ?? "");
    setDesc(editing?.description ?? "");
    setStage("stage" in (editing ?? {}) ? (editing?.stage ?? "") : "");
    setActive(editing?.isActive ?? true);
  }, [editing?.id, value]);
  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ${title}` : `Create ${title}`}</DialogTitle>
          <DialogDescription>
            Manage a backend master record used by Asset Management.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {fields === "lifecycle" && (
            <Field label="Stage">
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {LIFECYCLE_STAGES.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
          <Field label="Code *">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={50}
            />
          </Field>
          <Field label="Name *">
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={200} />
          </Field>
          <Field label="Description">
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </Field>
          <SwitchField label="Active" checked={active} onCheckedChange={setActive} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!code.trim() || !name.trim()) {
                toast.error("Code and name are required");
                return;
              }
              void onSave(
                {
                  ...(fields === "lifecycle" ? { stage: stage || null } : {}),
                  code: code.trim(),
                  name: name.trim(),
                  description: desc.trim() || null,
                  isActive: active,
                },
                editing,
              );
            }}
          >
            {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Locations() {
  const [items, setItems] = useState<LocationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const dialog = useDialog<LocationDto | "new">();
  const confirm = useDialog<LocationDto>();
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems((await api.getLocations({ pageSize: 1000 })).items);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, []);
  const filtered = items.filter(
    (x) =>
      (type === "all" || x.locationType === type) &&
      `${x.code} ${x.name} ${x.address ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const children = useMemo(() => {
    const m = new Map<number | null, LocationDto[]>();
    for (const x of filtered) {
      const k = x.parentLocationId ?? null;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(x);
    }
    for (const a of m.values()) a.sort((x, y) => x.name.localeCompare(y.name));
    return m;
  }, [filtered]);
  const save = async (d: Omit<LocationDto, "id">, editing?: LocationDto) => {
    try {
      if (editing) await api.updateLocation(editing.id, d);
      else await api.createLocation(d);
      toast.success(editing ? "Location updated" : "Location created");
      dialog.close();
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  const toggle = async (x: LocationDto) => {
    try {
      await api.updateLocation(x.id, {
        parentLocationId: x.parentLocationId,
        code: x.code,
        name: x.name,
        locationType: x.locationType,
        address: x.address,
        isActive: !x.isActive,
      });
      toast.success(x.isActive ? "Location deactivated" : "Location activated");
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  const render = (parent: number | null, depth = 0): ReactNode =>
    (children.get(parent) ?? []).map((x) => {
      const has = (children.get(x.id) ?? []).length > 0;
      const open = expanded.has(x.id);
      return (
        <div key={x.id}>
          <div
            className="flex items-center gap-2 border-b border-border px-3 py-2.5 hover:bg-muted/20"
            style={{ paddingLeft: 12 + depth * 24 }}
          >
            <button
              className="grid h-7 w-7 shrink-0 place-items-center rounded hover:bg-accent"
              onClick={() =>
                setExpanded((s) => {
                  const n = new Set(s);
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  open ? n.delete(x.id) : n.add(x.id);
                  return n;
                })
              }
            >
              {has ? (
                open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{x.name}</span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{x.code}</code>
                {x.locationType && (
                  <Badge variant="outline" className="text-[10px]">
                    {x.locationType}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{x.address || "No address"}</div>
            </div>
            <StatusBadge active={x.isActive} />
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => dialog.open({ ...x, parentLocationId: x.id } as LocationDto)}
              >
                Add child
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => dialog.open(x)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={() => confirm.open(x)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {open && render(x.id, depth + 1)}
        </div>
      );
    });
  return (
    <>
      <SectionToolbar
        search={search}
        setSearch={setSearch}
        buttonLabel="Add Root Location"
        onCreate={() => dialog.open("new")}
      >
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {LOCATION_TYPES.map((x) => (
              <SelectItem key={x} value={x}>
                {x}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SectionToolbar>
      <ConfigTableState
        loading={loading}
        error={error}
        retry={load}
        empty={!filtered.length}
        emptyLabel="Locations"
        onCreate={() => dialog.open("new")}
      >
        {filtered.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex items-center border-b border-border bg-muted/30 px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="flex-1">Location tree</span>
              <span>Status</span>
              <span className="w-48 text-right">Actions</span>
            </div>
            {render(null)}
          </div>
        )}
      </ConfigTableState>
      <LocationDialog value={dialog.item} locations={items} onClose={dialog.close} onSave={save} />
      <ConfirmDialog
        item={confirm.item}
        title="Delete location?"
        description="Do not delete locations referenced by assets. Deactivate them instead."
        onClose={confirm.close}
        onConfirm={async () => {
          if (!confirm.item) return;
          try {
            await api.deleteLocation(confirm.item.id);
            toast.success("Location deleted");
            confirm.close();
            await load();
          } catch (e) {
            toast.error(normalizeError(e));
          }
        }}
      />
    </>
  );
}

function LocationDialog({
  value,
  locations,
  onClose,
  onSave,
}: {
  value: LocationDto | "new" | null;
  locations: LocationDto[];
  onClose: () => void;
  onSave: (d: Omit<LocationDto, "id">, editing?: LocationDto) => Promise<void>;
}) {
  const editing = value && value !== "new" ? value : undefined;
  const [parent, setParent] = useState("none");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [locationType, setLocationType] = useState("");
  const [address, setAddress] = useState("");
  const [active, setActive] = useState(true);
  useEffect(() => {
    setParent(editing?.parentLocationId ? String(editing.parentLocationId) : "none");
    setCode(editing?.code ?? "");
    setName(editing?.name ?? "");
    setLocationType(editing?.locationType ?? "");
    setAddress(editing?.address ?? "");
    setActive(editing?.isActive ?? true);
  }, [editing?.id, value]);
  const parents = locations.filter((x) => x.id !== editing?.id);
  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit location" : "Create location"}</DialogTitle>
          <DialogDescription>
            Build an unlimited-depth organizational or physical location hierarchy.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Parent Location">
            <Select value={parent} onValueChange={setParent}>
              <SelectTrigger>
                <SelectValue placeholder="Root location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent — root</SelectItem>
                {parents.map((x) => (
                  <SelectItem key={x.id} value={String(x.id)}>
                    {x.name} ({x.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code *">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={50}
              />
            </Field>
            <Field label="Name *">
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={200} />
            </Field>
          </div>
          <Field label="Location Type">
            <Select
              value={locationType || "none"}
              onValueChange={(v) => setLocationType(v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not specified</SelectItem>
                {LOCATION_TYPES.map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Address">
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </Field>
          <SwitchField label="Active" checked={active} onCheckedChange={setActive} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!code.trim() || !name.trim()) {
                toast.error("Code and name are required");
                return;
              }
              void onSave(
                {
                  parentLocationId: parent === "none" ? null : Number(parent),
                  code: code.trim(),
                  name: name.trim(),
                  locationType: locationType || undefined,
                  address: address.trim() || undefined,
                  isActive: active,
                },
                editing,
              );
            }}
          >
            {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Currencies() {
  const [items, setItems] = useState<CurrencyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const dialog = useDialog<CurrencyDto | "new">();
  const confirm = useDialog<CurrencyDto>();
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems((await api.getCurrencies({ pageSize: 500 })).items);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, []);
  const filtered = items.filter((x) =>
    `${x.code} ${x.name} ${x.symbol ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const save = async (d: CurrencyDto, item?: CurrencyDto) => {
    try {
      if (item) await api.updateCurrency(item.code, d);
      else await api.createCurrency(d);
      toast.success(item ? "Currency updated" : "Currency created");
      dialog.close();
      await load();
    } catch (e) {
      toast.error(normalizeError(e));
    }
  };
  return (
    <>
      <SectionToolbar
        search={search}
        setSearch={setSearch}
        buttonLabel="Add Currency"
        onCreate={() => dialog.open("new")}
      />
      <div className="mb-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        ISO 4217 lookup. Currency records do not have an active/inactive field in the backend.
      </div>
      <ConfigTableState
        loading={loading}
        error={error}
        retry={load}
        empty={!filtered.length}
        emptyLabel="Currencies"
        onCreate={() => dialog.open("new")}
      >
        <TableShell>
          <TableHead>
            <tr>
              <Th>Code</Th>
              <Th>Name</Th>
              <Th>Symbol</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </TableHead>
          <tbody>
            {filtered.map((x) => (
              <tr key={x.code} className="border-b border-border last:border-0 hover:bg-muted/20">
                <Td>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">
                    {x.code}
                  </code>
                </Td>
                <Td className="font-medium">{x.name}</Td>
                <Td>{x.symbol || "—"}</Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => dialog.open(x)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => confirm.open(x)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </ConfigTableState>
      <CurrencyDialog value={dialog.item} onClose={dialog.close} onSave={save} />
      <ConfirmDialog
        item={confirm.item}
        title="Delete currency?"
        description="Only delete a currency when it is not referenced by acquisitions or valuations."
        onClose={confirm.close}
        onConfirm={async () => {
          if (!confirm.item) return;
          try {
            await api.deleteCurrency(confirm.item.code);
            toast.success("Currency deleted");
            confirm.close();
            await load();
          } catch (e) {
            toast.error(normalizeError(e));
          }
        }}
      />
    </>
  );
}
function CurrencyDialog({
  value,
  onClose,
  onSave,
}: {
  value: CurrencyDto | "new" | null;
  onClose: () => void;
  onSave: (d: CurrencyDto, item?: CurrencyDto) => Promise<void>;
}) {
  const editing = value && value !== "new" ? value : undefined;
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  useEffect(() => {
    setCode(editing?.code ?? "");
    setName(editing?.name ?? "");
    setSymbol(editing?.symbol ?? "");
  }, [editing?.code, value]);
  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit currency" : "Create currency"}</DialogTitle>
          <DialogDescription>Use a valid ISO 4217 three-letter currency code.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Code *">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={3}
              disabled={!!editing}
            />
          </Field>
          <Field label="Name *">
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
          </Field>
          <Field label="Symbol">
            <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} maxLength={10} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (code.trim().length !== 3 || !name.trim()) {
                toast.error("Enter a 3-letter code and name");
                return;
              }
              void onSave(
                { code: code.trim(), name: name.trim(), symbol: symbol.trim() || undefined },
                editing,
              );
            }}
          >
            {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfigTableState({
  loading,
  error,
  retry,
  empty,
  emptyLabel,
  onCreate,
  children,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
  empty: boolean;
  emptyLabel: string;
  onCreate: () => void;
  children: ReactNode;
}) {
  if (loading)
    return (
      <div className="rounded-lg border border-border p-4 space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  if (error) return <ErrorState error={error} retry={retry} />;
  if (empty) return <EmptyState label={emptyLabel} onCreate={onCreate} />;
  return <>{children}</>;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
function SwitchField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
function ConfirmDialog<T extends object>({
  item,
  title,
  description,
  onClose,
  onConfirm,
}: {
  item: T | null;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="rounded-md bg-destructive/5 p-3 text-xs text-muted-foreground">
          This action cannot be undone if the backend permits physical deletion.
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onConfirm();
              setBusy(false);
            }}
          >
            {busy ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function dataTypeName(value: string | number) {
  const n = typeof value === "number" ? value : Number(value);
  return DATA_TYPES[n]?.[1] ?? String(value);
}
