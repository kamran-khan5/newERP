import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  Package,
  Landmark,
  FileDigit,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Info,
  CheckCircle2,
  Search,
  QrCode,
  ArrowRight,
  Sparkles,
  ShoppingCart,
  Gift,
  Upload,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type AssetCategoryKey = "physical" | "inventory" | "financial" | "intangible";
type OwnershipType = "Purchase" | "FOC";

type InventoryCategory = {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
};
type InventoryType = {
  id: string;
  code: string;
  name: string;
  description: string;
  inventoryCategoryId: string;
};

// Seed data — replace with GET /inventory-categories and GET /inventory-types responses
const INITIAL_CATEGORIES: InventoryCategory[] = [
  {
    id: "cat-raw",
    code: "RAW",
    name: "Raw Material",
    description: "Inputs consumed during production",
    isActive: true,
  },
  {
    id: "cat-fg",
    code: "FG",
    name: "Finished Goods",
    description: "Completed items ready for use or sale",
    isActive: true,
  },
  {
    id: "cat-cons",
    code: "CONS",
    name: "Consumables",
    description: "Items used up during operations",
    isActive: true,
  },
  {
    id: "cat-spare",
    code: "SPARE",
    name: "Spare Parts",
    description: "Replacement parts for equipment upkeep",
    isActive: true,
  },
];

const INITIAL_TYPES: InventoryType[] = [
  { id: "typ-steel", code: "STL", name: "Steel", description: "", inventoryCategoryId: "cat-raw" },
  { id: "typ-wood", code: "WD", name: "Wood", description: "", inventoryCategoryId: "cat-raw" },
  {
    id: "typ-chem",
    code: "CHM",
    name: "Chemical",
    description: "",
    inventoryCategoryId: "cat-raw",
  },
  {
    id: "typ-consumer",
    code: "CNS",
    name: "Consumer Goods",
    description: "",
    inventoryCategoryId: "cat-fg",
  },
  {
    id: "typ-industrial",
    code: "IND",
    name: "Industrial Goods",
    description: "",
    inventoryCategoryId: "cat-fg",
  },
  {
    id: "typ-office",
    code: "OFC",
    name: "Office Supplies",
    description: "",
    inventoryCategoryId: "cat-cons",
  },
  {
    id: "typ-cleaning",
    code: "CLN",
    name: "Cleaning Supplies",
    description: "",
    inventoryCategoryId: "cat-cons",
  },
  {
    id: "typ-mech",
    code: "MCH",
    name: "Mechanical",
    description: "",
    inventoryCategoryId: "cat-spare",
  },
  {
    id: "typ-elec",
    code: "ELC",
    name: "Electrical",
    description: "",
    inventoryCategoryId: "cat-spare",
  },
];

const SUPPLIERS = [
  "Siemens",
  "ABB",
  "Caterpillar",
  "Toyota Industries",
  "Oracle",
  "SAP",
  "Microsoft",
];
const CURRENCIES = ["USD", "EUR", "GBP", "SAR", "AED", "JPY"];
const UNIT_OPTIONS = ["pcs", "kg", "g", "ltr", "ml", "box", "meter", "roll", "ton", "dozen"];

// Matches InventoryOwnerShipType — Purchase = 1, FOC = 2
const OWNERSHIP_OPTIONS = [
  { key: "Purchase" as const, label: "Purchase", icon: ShoppingCart },
  { key: "FOC" as const, label: "Free of Charge", icon: Gift },
];

// Matches InventoryItemStatus
const ITEM_STATUS_OPTIONS = [
  "Available",
  "Reserved",
  "Allocated",
  "InTransit",
  "QualityInspection",
  "Blocked",
  "Damaged",
  "Expired",
  "Obsolete",
  "Scrapped",
  "Disposed",
  "Received",
  "Ordered",
];

// Matches PurchaseStatus
const PURCHASE_STATUS_OPTIONS = [
  "Draft",
  "PendingApproval",
  "Approved",
  "PartiallyReceived",
  "FullyReceived",
  "Cancelled",
  "Closed",
];

type PurchaseLineDraft = {
  id: string;
  itemRef: string;
  orderedQuantity: string;
  receivedQuantity: string;
  unit: string;
  unitValue: string;
  unitPriceAmount: string;
  discountAmount: string;
  taxAmount: string;
  remarks: string;
};

type PurchaseDraft = {
  supplierId: string;
  purchaseDate: string;
  status: string;
  currency: string;
  expectedDeliveryDate: string;
  remarks: string;
  street: string;
  building: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  paymentTermCode: string;
  paymentTermDueDays: string;
  paymentTermAdvancePercentage: string;
  lines: PurchaseLineDraft[];
};

type WizardData = {
  assetCategory: AssetCategoryKey | null;
  categoryId: string | null;
  inventoryTypeId: string | null;
  ownershipType: OwnershipType;
  code: string;
  name: string;
  description: string;
  fileName: string | null;
  unit: string;
  unitValue: string;
  status: string;
  purchase: PurchaseDraft;
};

const uid = () => Math.random().toString(36).slice(2, 10);

const newLine = (seed?: Partial<PurchaseLineDraft>): PurchaseLineDraft => ({
  id: uid(),
  itemRef: "",
  orderedQuantity: "",
  receivedQuantity: "0",
  unit: "",
  unitValue: "1",
  unitPriceAmount: "",
  discountAmount: "0",
  taxAmount: "0",
  remarks: "",
  ...seed,
});

const emptyPurchase: PurchaseDraft = {
  supplierId: "",
  purchaseDate: "",
  status: "Draft",
  currency: "USD",
  expectedDeliveryDate: "",
  remarks: "",
  street: "",
  building: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  latitude: "",
  longitude: "",
  paymentTermCode: "",
  paymentTermDueDays: "30",
  paymentTermAdvancePercentage: "0",
  lines: [],
};

const emptyData: WizardData = {
  assetCategory: null,
  categoryId: null,
  inventoryTypeId: null,
  ownershipType: "Purchase",
  code: "",
  name: "",
  description: "",
  fileName: null,
  unit: "",
  unitValue: "1",
  status: "Available",
  purchase: emptyPurchase,
};

const ASSET_CATEGORY_CARDS: {
  key: AssetCategoryKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  enabled: boolean;
}[] = [
  {
    key: "physical",
    label: "Physical Assets",
    icon: Building2,
    description: "Tangible items owned by the organization",
    enabled: false,
  },
  {
    key: "inventory",
    label: "Inventory Assets",
    icon: Package,
    description: "Stock, materials and goods held for operations",
    enabled: true,
  },
  {
    key: "financial",
    label: "Financial Assets",
    icon: Landmark,
    description: "Monetary holdings, investments and receivables",
    enabled: false,
  },
  {
    key: "intangible",
    label: "Intangible Assets",
    icon: FileDigit,
    description: "Non-physical assets with economic value",
    enabled: false,
  },
];

const ALL_STEPS = ["Asset Category", "Classification", "Item Details", "Purchase", "Review"];
const DRAFT_KEY = "gda-new-inventory-item-draft-v2";

export function InventoryItemWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(emptyData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [categories, setCategories] = useState<InventoryCategory[]>(INITIAL_CATEGORIES);
  const [types, setTypes] = useState<InventoryType[]>(INITIAL_TYPES);
  const [modal, setModal] = useState<"category" | "type" | null>(null);

  const steps = useMemo(
    () =>
      data.ownershipType === "Purchase" ? ALL_STEPS : ALL_STEPS.filter((s) => s !== "Purchase"),
    [data.ownershipType],
  );
  const currentStepLabel = steps[step];

  useEffect(() => {
    if (step >= steps.length) setStep(steps.length - 1);
  }, [steps, step]);

  useEffect(() => {
    if (!open || draftLoaded) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { data: Partial<WizardData>; step: number };
        setData({
          ...emptyData,
          ...parsed.data,
          purchase: { ...emptyPurchase, ...parsed.data.purchase },
        });
        setStep(parsed.step);
        toast.info("Draft restored", { description: "Your previous progress was loaded." });
      }
    } catch {
      // ignore corrupt draft
    }
    setDraftLoaded(true);
  }, [open, draftLoaded]);

  useEffect(() => {
    if (!open || success) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step }));
      } catch {
        // ignore autosave errors
      }
    }, 400);
    return () => clearTimeout(t);
  }, [data, step, open, success]);

  useEffect(() => {
    if (data.inventoryTypeId && !data.code) {
      const type = types.find((t) => t.id === data.inventoryTypeId)!;
      const suffix = String(1000 + Math.floor((Date.now() / 1000) % 9000));
      setData((d) => ({ ...d, code: `${type.code}-${suffix}` }));
    }
  }, [data.inventoryTypeId, types]);

  useEffect(() => {
    if (currentStepLabel === "Purchase" && (data.purchase?.lines.length ?? 0) === 0) {
      setData((d) => ({
        ...d,
        purchase: {
          ...d.purchase,
          lines: [
            newLine({ itemRef: "This item (being created)", unit: d.unit, unitValue: d.unitValue }),
          ],
        },
      }));
    }
  }, [currentStepLabel, data.purchase?.lines.length, data.unit, data.unitValue]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const set = <K extends keyof WizardData>(k: K, v: WizardData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const setPurchase = <K extends keyof PurchaseDraft>(k: K, v: PurchaseDraft[K]) =>
    setData((d) => ({ ...d, purchase: { ...d.purchase, [k]: v } }));

  const setLine = (id: string, k: keyof PurchaseLineDraft, v: string) =>
    setData((d) => ({
      ...d,
      purchase: {
        ...d.purchase,
        lines: d.purchase.lines.map((l) => (l.id === id ? { ...l, [k]: v } : l)),
      },
    }));

  const addLine = () => setPurchase("lines", [...data.purchase.lines, newLine()]);
  const removeLine = (id: string) =>
    setPurchase(
      "lines",
      data.purchase.lines.filter((l) => l.id !== id),
    );

  const selectCategory = (categoryId: string) =>
    setData((d) => ({ ...d, categoryId, inventoryTypeId: null, code: "" }));

  const createCategory = (draft: Omit<InventoryCategory, "id">) => {
    const category: InventoryCategory = { id: uid(), ...draft };
    setCategories((c) => [...c, category]);
    selectCategory(category.id);
    setModal(null);
    toast.success("Category created", { description: category.name });
  };

  const createType = (draft: Omit<InventoryType, "id" | "inventoryCategoryId">) => {
    if (!data.categoryId) return;
    const type: InventoryType = { id: uid(), inventoryCategoryId: data.categoryId, ...draft };
    setTypes((t) => [...t, type]);
    setData((d) => ({ ...d, inventoryTypeId: type.id, code: "" }));
    setModal(null);
    toast.success("Type created", { description: type.name });
  };

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (currentStepLabel === "Asset Category" && data.assetCategory !== "inventory")
      e.assetCategory = "Select Inventory Assets to continue.";
    if (currentStepLabel === "Classification") {
      if (!data.categoryId) e.categoryId = "Select a category to continue.";
      else if (!data.inventoryTypeId) e.inventoryTypeId = "Select a type to continue.";
    }
    if (currentStepLabel === "Item Details") {
      if (!data.code) e.code = "Item code is required.";
      if (!data.name) e.name = "Item name is required.";
      if (!data.unit) e.unit = "Unit of measure is required.";
      if (!data.unitValue || Number(data.unitValue) <= 0)
        e.unitValue = "Conversion value must be greater than zero.";
    }
    if (currentStepLabel === "Purchase") {
      if (!data.purchase.supplierId) e.supplierId = "Supplier is required.";
      if (!data.purchase.purchaseDate) e.purchaseDate = "Purchase date is required.";
      if (!data.purchase.lines.some((l) => Number(l.orderedQuantity) > 0))
        e.lines = "Add at least one line with an ordered quantity.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step }));
      toast.success("Draft saved");
    } catch {
      toast.error("Could not save draft");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setSuccess(false);
      setErrors({});
      setDraftLoaded(false);
    }, 200);
  };

  const submit = () => {
    if (!validateStep()) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore autosave errors
    }
    setSuccess(true);
    toast.success("Inventory item created", { description: `${data.code} · ${data.name}` });
  };

  const registerAnother = () => {
    setData(emptyData);
    setStep(0);
    setSuccess(false);
    setErrors({});
  };

  const selectedCategory = categories.find((c) => c.id === data.categoryId) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">New Inventory Item</div>
              <div className="text-xs text-muted-foreground">
                Guided wizard · progress is autosaved
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!success && (
              <Button variant="ghost" size="sm" onClick={saveDraft}>
                <Save className="mr-1.5 h-4 w-4" />
                Save draft
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!success && (
          <div className="mx-auto max-w-[1200px] px-6 pb-4">
            <Stepper current={step} steps={steps} onJump={(i) => i < step && setStep(i)} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[900px] px-6 py-8">
          {success ? (
            <SuccessScreen data={data} onAnother={registerAnother} onDone={handleClose} />
          ) : (
            <>
              {currentStepLabel === "Asset Category" && (
                <StepAssetCategory data={data} set={set} error={errors.assetCategory} />
              )}
              {currentStepLabel === "Classification" && (
                <StepClassification
                  data={data}
                  set={set}
                  categories={categories}
                  types={types}
                  onSelectCategory={selectCategory}
                  onNewCategory={() => setModal("category")}
                  onNewType={() => setModal("type")}
                  errors={errors}
                />
              )}
              {currentStepLabel === "Item Details" && (
                <StepItemDetails data={data} set={set} errors={errors} />
              )}
              {currentStepLabel === "Purchase" && (
                <StepPurchase
                  data={data}
                  setPurchase={setPurchase}
                  setLine={setLine}
                  addLine={addLine}
                  removeLine={removeLine}
                  errors={errors}
                />
              )}
              {currentStepLabel === "Review" && (
                <StepReview
                  data={data}
                  categories={categories}
                  types={types}
                  steps={steps}
                  onEdit={setStep}
                />
              )}
            </>
          )}
        </div>
      </div>

      {!success && (
        <div className="border-t border-border bg-surface">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-6 py-3">
            <Button variant="outline" onClick={prev} disabled={step === 0}>
              <ChevronLeft className="mr-1.5 h-4 w-4" />
              Previous
            </Button>
            <div className="text-xs text-muted-foreground">
              Step {step + 1} of {steps.length} · {currentStepLabel}
            </div>
            {step < steps.length - 1 ? (
              <Button onClick={next}>
                Next
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit}>
                <Check className="mr-1.5 h-4 w-4" />
                Save Item
              </Button>
            )}
          </div>
        </div>
      )}

      {modal === "category" && (
        <NewCategoryModal onClose={() => setModal(null)} onCreate={createCategory} />
      )}
      {modal === "type" && selectedCategory && (
        <NewTypeModal
          category={selectedCategory}
          onClose={() => setModal(null)}
          onCreate={createType}
        />
      )}
    </div>
  );
}

// ================== Stepper ==================
function Stepper({
  current,
  steps,
  onJump,
}: {
  current: number;
  steps: string[];
  onJump: (i: number) => void;
}) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={i >= current}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors",
                i < current && "hover:bg-accent cursor-pointer",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary bg-primary/10 text-primary",
                  !done && !active && "border-border bg-surface text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={cn("h-px flex-1", i < current ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ================== Shared primitives ==================
function Card({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="erp-card p-6">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  helper,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {helper && !error && (
        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Info className="h-3 w-3" />
          {helper}
        </p>
      )}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-md erp-card p-6" onClick={(e) => e.stopPropagation()}>
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </header>
        {children}
      </div>
    </div>
  );
}

// ================== Step 1: Asset Category ==================
function StepAssetCategory({
  data,
  set,
  error,
}: {
  data: WizardData;
  set: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  error?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          What type of asset would you like to register?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">This wizard handles Inventory Assets.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {ASSET_CATEGORY_CARDS.map((c) => {
          const active = data.assetCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => c.enabled && set("assetCategory", c.key)}
              disabled={!c.enabled}
              className={cn(
                "erp-card relative p-6 text-left transition-all",
                c.enabled
                  ? "hover:border-primary/50 hover:shadow-sm"
                  : "cursor-not-allowed opacity-50",
                active && "border-primary ring-2 ring-primary/20",
              )}
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-lg",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-surface text-foreground",
                  )}
                >
                  <c.icon className="h-6 w-6" />
                </div>
                {active && (
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
              <div className="mt-4 text-base font-semibold">{c.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.description}</div>
              {!c.enabled && (
                <span className="mt-3 inline-block rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Not available in this wizard
                </span>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}

// ================== Step 2: Classification ==================
function StepClassification({
  data,
  set,
  categories,
  types,
  onSelectCategory,
  onNewCategory,
  onNewType,
  errors,
}: {
  data: WizardData;
  set: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  categories: InventoryCategory[];
  types: InventoryType[];
  onSelectCategory: (categoryId: string) => void;
  onNewCategory: () => void;
  onNewType: () => void;
  errors: Record<string, string>;
}) {
  const typesForCategory = data.categoryId
    ? types.filter((t) => t.inventoryCategoryId === data.categoryId)
    : [];

  return (
    <div className="grid gap-6">
      <Card
        title="Category"
        description="The top-level grouping this item belongs to"
        action={
          <Button variant="outline" size="sm" onClick={onNewCategory}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Category
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories
            .filter((c) => c.isActive)
            .map((c) => {
              const active = data.categoryId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-md border p-4 text-center transition-colors",
                    active
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-surface hover:border-primary/40 hover:bg-accent/40",
                  )}
                >
                  <div
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-md",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground",
                    )}
                  >
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-medium">{c.name}</div>
                </button>
              );
            })}
        </div>
        {errors.categoryId && (
          <p className="mt-3 text-[11px] text-destructive">{errors.categoryId}</p>
        )}
      </Card>

      {data.categoryId && (
        <Card
          title="Type"
          description="Narrow the category down to a specific type"
          action={
            <Button variant="outline" size="sm" onClick={onNewType}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Type
            </Button>
          }
        >
          {typesForCategory.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {typesForCategory.map((t) => {
                const active = data.inventoryTypeId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => set("inventoryTypeId", t.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-accent/40",
                    )}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No types yet for this category — add one to continue.
            </p>
          )}
          {errors.inventoryTypeId && (
            <p className="mt-3 text-[11px] text-destructive">{errors.inventoryTypeId}</p>
          )}
        </Card>
      )}

      <Card title="Ownership Type" description="How this item enters inventory">
        <div className="flex gap-3">
          {OWNERSHIP_OPTIONS.map((o) => {
            const active = data.ownershipType === o.key;
            return (
              <button
                key={o.key}
                onClick={() => set("ownershipType", o.key)}
                className={cn(
                  "flex flex-1 items-center gap-3 rounded-md border p-4 transition-colors",
                  active
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-surface hover:border-primary/40 hover:bg-accent/40",
                )}
              >
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-md",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground",
                  )}
                >
                  <o.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{o.label}</span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function NewCategoryModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (draft: Omit<InventoryCategory, "id">) => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  const create = () => {
    if (!code || !name) {
      setError("Code and name are required.");
      return;
    }
    onCreate({ code, name, description, isActive });
  };

  return (
    <Modal
      title="New Inventory Category"
      description="Creates a top-level grouping for inventory types"
      onClose={onClose}
    >
      <div className="grid gap-4">
        <Field label="Code" required>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono"
            placeholder="e.g. PKG"
          />
        </Field>
        <Field label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Packaging Materials"
          />
        </Field>
        <Field label="Description">
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <div>
            <div className="text-sm font-medium">Active</div>
            <div className="text-xs text-muted-foreground">
              Inactive categories are hidden from selection
            </div>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
        {error && <p className="text-[11px] text-destructive">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={create}>Create Category</Button>
        </div>
      </div>
    </Modal>
  );
}

function NewTypeModal({
  category,
  onClose,
  onCreate,
}: {
  category: InventoryCategory;
  onClose: () => void;
  onCreate: (draft: Omit<InventoryType, "id" | "inventoryCategoryId">) => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const create = () => {
    if (!code || !name) {
      setError("Code and name are required.");
      return;
    }
    onCreate({ code, name, description });
  };

  return (
    <Modal
      title="New Inventory Type"
      description={`Adds a type under ${category.name}`}
      onClose={onClose}
    >
      <div className="grid gap-4">
        <Field label="Category">
          <Input value={category.name} disabled className="text-muted-foreground" />
        </Field>
        <Field label="Code" required>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono"
            placeholder="e.g. FBR"
          />
        </Field>
        <Field label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Fiberboard"
          />
        </Field>
        <Field label="Description">
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        {error && <p className="text-[11px] text-destructive">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={create}>Create Type</Button>
        </div>
      </div>
    </Modal>
  );
}

// ================== Step 3: Item Details ==================
function StepItemDetails({
  data,
  set,
  errors,
}: {
  data: WizardData;
  set: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="grid gap-6">
      <Card title="Identity" description="Core identifiers for this item">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Item Code"
            required
            helper="Auto-generated from the selected type, editable if you have your own numbering"
            error={errors.code}
          >
            <Input
              value={data.code}
              onChange={(e) => set("code", e.target.value)}
              className="font-mono"
            />
          </Field>
          <Field label="Item Name" required error={errors.name}>
            <Input
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Portland Cement"
            />
          </Field>
          <Field label="Status">
            <SearchSelect
              value={data.status}
              onChange={(v) => set("status", v)}
              options={ITEM_STATUS_OPTIONS}
            />
          </Field>
        </div>
      </Card>

      <Card title="Unit of Measure" description="How this item is counted and stocked">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Unit" required error={errors.unit}>
            <SearchSelect
              value={data.unit}
              onChange={(v) => set("unit", v)}
              options={UNIT_OPTIONS}
              placeholder="Select unit"
            />
          </Field>
          <Field
            label="Conversion Value"
            required
            error={errors.unitValue}
            helper="Base quantity represented by one unit, e.g. 12 for a box of 12"
          >
            <Input
              type="number"
              min="0"
              step="0.01"
              value={data.unitValue}
              onChange={(e) => set("unitValue", e.target.value)}
              className="tabular-nums"
            />
          </Field>
        </div>
      </Card>

      <Card title="Description & Attachment" description="Optional context and a supporting file">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Description">
            <Textarea
              rows={4}
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <Field label="Attachment" helper="Spec sheet, MSDS, or reference document">
            <UploadDrop fileName={data.fileName} onSelect={(name) => set("fileName", name)} />
          </Field>
        </div>
      </Card>
    </div>
  );
}

// ================== Step 4: Purchase ==================
function StepPurchase({
  data,
  setPurchase,
  setLine,
  addLine,
  removeLine,
  errors,
}: {
  data: WizardData;
  setPurchase: <K extends keyof PurchaseDraft>(k: K, v: PurchaseDraft[K]) => void;
  setLine: (id: string, k: keyof PurchaseLineDraft, v: string) => void;
  addLine: () => void;
  removeLine: (id: string) => void;
  errors: Record<string, string>;
}) {
  const p = data.purchase;

  return (
    <div className="grid gap-6">
      <Card title="Purchase Order" description="How and from whom this item is being procured">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Supplier" required error={errors.supplierId}>
            <SearchSelect
              value={p.supplierId}
              onChange={(v) => setPurchase("supplierId", v)}
              options={SUPPLIERS}
              placeholder="Search supplier"
            />
          </Field>
          <Field label="Purchase Date" required error={errors.purchaseDate}>
            <Input
              type="date"
              value={p.purchaseDate}
              onChange={(e) => setPurchase("purchaseDate", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <SearchSelect
              value={p.status}
              onChange={(v) => setPurchase("status", v)}
              options={PURCHASE_STATUS_OPTIONS}
            />
          </Field>
          <Field label="Currency">
            <SearchSelect
              value={p.currency}
              onChange={(v) => setPurchase("currency", v)}
              options={CURRENCIES}
            />
          </Field>
          <Field label="Expected Delivery Date">
            <Input
              type="date"
              value={p.expectedDeliveryDate}
              onChange={(e) => setPurchase("expectedDeliveryDate", e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Remarks">
            <Textarea
              rows={2}
              value={p.remarks}
              onChange={(e) => setPurchase("remarks", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Delivery Address" description="Where the purchased goods should be delivered">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Street">
            <Input value={p.street} onChange={(e) => setPurchase("street", e.target.value)} />
          </Field>
          <Field label="Building">
            <Input value={p.building} onChange={(e) => setPurchase("building", e.target.value)} />
          </Field>
          <Field label="City">
            <Input value={p.city} onChange={(e) => setPurchase("city", e.target.value)} />
          </Field>
          <Field label="State">
            <Input value={p.state} onChange={(e) => setPurchase("state", e.target.value)} />
          </Field>
          <Field label="Postal Code">
            <Input
              value={p.postalCode}
              onChange={(e) => setPurchase("postalCode", e.target.value)}
            />
          </Field>
          <Field label="Country">
            <Input value={p.country} onChange={(e) => setPurchase("country", e.target.value)} />
          </Field>
          <Field label="Latitude" helper="Optional">
            <Input
              type="number"
              value={p.latitude}
              onChange={(e) => setPurchase("latitude", e.target.value)}
            />
          </Field>
          <Field label="Longitude" helper="Optional">
            <Input
              type="number"
              value={p.longitude}
              onChange={(e) => setPurchase("longitude", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Payment Term" description="Applied to this purchase">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Code">
            <Input
              value={p.paymentTermCode}
              onChange={(e) => setPurchase("paymentTermCode", e.target.value)}
              placeholder="e.g. NET30"
            />
          </Field>
          <Field label="Due Days">
            <Input
              type="number"
              min="0"
              value={p.paymentTermDueDays}
              onChange={(e) => setPurchase("paymentTermDueDays", e.target.value)}
            />
          </Field>
          <Field label="Advance %">
            <Input
              type="number"
              min="0"
              max="100"
              value={p.paymentTermAdvancePercentage}
              onChange={(e) => setPurchase("paymentTermAdvancePercentage", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Purchase Lines"
        description="Items and quantities being ordered"
        action={
          <Button variant="outline" size="sm" onClick={addLine}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Line
          </Button>
        }
      >
        <div className="grid gap-4">
          {p.lines.map((line, i) => (
            <PurchaseLineRow
              key={line.id}
              index={i}
              line={line}
              onChange={setLine}
              onRemove={() => removeLine(line.id)}
              removable={p.lines.length > 1}
            />
          ))}
        </div>
        {errors.lines && <p className="mt-3 text-[11px] text-destructive">{errors.lines}</p>}
      </Card>
    </div>
  );
}

function PurchaseLineRow({
  index,
  line,
  onChange,
  onRemove,
  removable,
}: {
  index: number;
  line: PurchaseLineDraft;
  onChange: (id: string, k: keyof PurchaseLineDraft, v: string) => void;
  onRemove: () => void;
  removable: boolean;
}) {
  const lineTotal =
    Number(line.orderedQuantity || 0) * Number(line.unitPriceAmount || 0) -
    Number(line.discountAmount || 0) +
    Number(line.taxAmount || 0);

  return (
    <div className="rounded-md border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground">Line {index + 1}</div>
        {removable && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Item Reference">
          <Input
            value={line.itemRef}
            onChange={(e) => onChange(line.id, "itemRef", e.target.value)}
            placeholder="Item code or name"
          />
        </Field>
        <Field label="Ordered Quantity">
          <Input
            type="number"
            min="0"
            value={line.orderedQuantity}
            onChange={(e) => onChange(line.id, "orderedQuantity", e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <Field label="Received Quantity">
          <Input
            type="number"
            min="0"
            value={line.receivedQuantity}
            onChange={(e) => onChange(line.id, "receivedQuantity", e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <Field label="Unit">
          <SearchSelect
            value={line.unit}
            onChange={(v) => onChange(line.id, "unit", v)}
            options={UNIT_OPTIONS}
            placeholder="Select unit"
          />
        </Field>
        <Field label="Unit Price">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.unitPriceAmount}
            onChange={(e) => onChange(line.id, "unitPriceAmount", e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <Field label="Discount Amount">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.discountAmount}
            onChange={(e) => onChange(line.id, "discountAmount", e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <Field label="Tax Amount">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.taxAmount}
            onChange={(e) => onChange(line.id, "taxAmount", e.target.value)}
            className="tabular-nums"
          />
        </Field>
        <Field label="Remarks">
          <Input
            value={line.remarks}
            onChange={(e) => onChange(line.id, "remarks", e.target.value)}
          />
        </Field>
        <div className="flex flex-col justify-end">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Line Total
          </div>
          <div className="text-sm font-semibold tabular-nums">{lineTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

// ================== Step 5: Review ==================
function StepReview({
  data,
  categories,
  types,
  steps,
  onEdit,
}: {
  data: WizardData;
  categories: InventoryCategory[];
  types: InventoryType[];
  steps: string[];
  onEdit: (step: number) => void;
}) {
  const category = categories.find((c) => c.id === data.categoryId);
  const type = types.find((t) => t.id === data.inventoryTypeId);
  const editIndex = (label: string) => steps.indexOf(label);

  return (
    <div className="grid gap-6">
      <div className="erp-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {category?.name} · {type?.name} · {data.ownershipType}
              </div>
              <div className="mt-0.5 text-lg font-semibold">{data.name || "Untitled item"}</div>
              <div className="mt-0.5 font-mono text-xs text-muted-foreground">{data.code}</div>
            </div>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-md border border-border bg-surface-muted">
            <QrCode className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      <ReviewSection title="Item Details" onEdit={() => onEdit(editIndex("Item Details"))}>
        <ReviewRow label="Item Code" value={data.code} />
        <ReviewRow label="Item Name" value={data.name} />
        <ReviewRow label="Status" value={data.status} />
        <ReviewRow label="Unit of Measure" value={data.unit} />
        <ReviewRow label="Conversion Value" value={data.unitValue} />
        <ReviewRow label="Attachment" value={data.fileName ?? ""} />
        <ReviewRow label="Description" value={data.description} span />
      </ReviewSection>

      <ReviewSection title="Classification" onEdit={() => onEdit(editIndex("Classification"))}>
        <ReviewRow label="Category" value={category?.name ?? ""} />
        <ReviewRow label="Type" value={type?.name ?? ""} />
        <ReviewRow label="Ownership Type" value={data.ownershipType} />
      </ReviewSection>

      {data.ownershipType === "Purchase" && (
        <>
          <ReviewSection title="Purchase Order" onEdit={() => onEdit(editIndex("Purchase"))}>
            <ReviewRow label="Supplier" value={data.purchase.supplierId} />
            <ReviewRow label="Purchase Date" value={data.purchase.purchaseDate} />
            <ReviewRow label="Status" value={data.purchase.status} />
            <ReviewRow label="Currency" value={data.purchase.currency} />
            <ReviewRow label="Expected Delivery" value={data.purchase.expectedDeliveryDate} />
            <ReviewRow
              label="Delivery Address"
              value={[data.purchase.street, data.purchase.city, data.purchase.country]
                .filter(Boolean)
                .join(", ")}
              span
            />
            <ReviewRow
              label="Payment Term"
              value={
                data.purchase.paymentTermCode
                  ? `${data.purchase.paymentTermCode} · Net ${data.purchase.paymentTermDueDays} days`
                  : ""
              }
            />
            <ReviewRow label="Remarks" value={data.purchase.remarks} span />
          </ReviewSection>

          <section className="erp-card overflow-hidden">
            <header className="flex items-center justify-between border-b border-border bg-surface-muted/40 px-5 py-3">
              <h3 className="text-sm font-semibold">Purchase Lines</h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(editIndex("Purchase"))}>
                Edit
              </Button>
            </header>
            <div className="divide-y divide-border">
              {data.purchase.lines.map((l, i) => (
                <div key={l.id} className="grid gap-x-8 gap-y-2 p-5 sm:grid-cols-3">
                  <ReviewRow label={`Line ${i + 1} · Item`} value={l.itemRef} />
                  <ReviewRow label="Ordered Qty" value={`${l.orderedQuantity} ${l.unit}`} />
                  <ReviewRow label="Unit Price" value={l.unitPriceAmount} />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="erp-card overflow-hidden">
      <header className="flex items-center justify-between border-b border-border bg-surface-muted/40 px-5 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </header>
      <dl className="grid gap-x-8 gap-y-3 p-5 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value, span }: { label: string; value?: string; span?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-0.5", span && "sm:col-span-2")}>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={cn("text-sm", !value && "text-muted-foreground italic")}>
        {value || "Not provided"}
      </dd>
    </div>
  );
}

// ================== Success ==================
function SuccessScreen({
  data,
  onAnother,
  onDone,
}: {
  data: WizardData;
  onAnother: () => void;
  onDone: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">Inventory item created</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-mono">{data.code}</span> · {data.name || "New item"} has been added to
        the inventory register.
      </p>
      <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Button onClick={onAnother} variant="outline">
          Add Another Item
        </Button>
        <Button onClick={onDone}>
          Go to Inventory Register
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ================== Small components ==================
function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(q.toLowerCase())),
    [q, options],
  );

  if (options.length <= 6) {
    return (
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? "Select…"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={open ? q : value}
          onFocus={() => {
            setOpen(true);
            setQ("");
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder ?? "Search…"}
          className="pl-8"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md">
          {filtered.map((o) => (
            <button
              key={o}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(o);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
                value === o && "bg-accent",
              )}
            >
              <span>{o}</span>
              {value === o && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadDrop({
  fileName,
  onSelect,
}: {
  fileName: string | null;
  onSelect: (name: string | null) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface-muted/40 px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-accent/40">
      <Upload className="h-5 w-5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        {fileName ?? "Drop file or click to browse"}
      </span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  );
}
