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
  Upload,
  QrCode,
  Info,
  CheckCircle2,
  Search,
  Car,
  Wrench,
  Home,
  Sofa,
  Factory,
  Route,
  Coins,
  TrendingUp,
  Receipt,
  Key,
  BadgeCheck,
  Cpu,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { AssetCategory } from "@/lib/erp-data";

type SubKey = string;

type WizardData = {
  category: AssetCategory | null;
  subtype: SubKey | null;
  type: SubKey | null;
  // basic
  code: string;
  name: string;
  organization: string;
  department: string;
  custodian: string;
  location: string;
  status: string;
  ownership: string;
  description: string;
  // financial
  acquisitionDate: string;
  acquisitionCost: string;
  currency: string;
  bookValue: string;
  usefulLife: string;
  salvageValue: string;
  depreciationMethod: string;
  glAccount: string;
  supplier: string;
  purchaseRef: string;
  warrantyExpiry: string;
  // specific bag
  specific: Record<string, string>;
};

const emptyData: WizardData = {
  category: null,
  subtype: null,
  type: null,
  code: "",
  name: "",
  organization: "",
  department: "",
  custodian: "",
  location: "",
  status: "In Use",
  ownership: "Owned",
  description: "",
  acquisitionDate: "",
  acquisitionCost: "",
  currency: "USD",
  bookValue: "",
  usefulLife: "",
  salvageValue: "",
  depreciationMethod: "Straight Line",
  glAccount: "",
  supplier: "",
  purchaseRef: "",
  warrantyExpiry: "",
  specific: {},
};

const CATEGORY_CARDS: {
  key: AssetCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  examples: string[];
  accent: string;
}[] = [
  {
    key: "physical",
    label: "Physical Assets",
    icon: Building2,
    description: "Tangible items owned by the organization",
    examples: ["Equipment", "Vehicle", "Furniture", "Building", "Plant"],
    accent: "from-blue-500/10 to-indigo-500/5",
  },
  {
    key: "inventory",
    label: "Inventory Assets",
    icon: Package,
    description: "Stock, materials and goods held for operations",
    examples: ["Raw Material", "Finished Goods", "Work In Progress"],
    accent: "from-emerald-500/10 to-teal-500/5",
  },
  {
    key: "financial",
    label: "Financial Assets",
    icon: Landmark,
    description: "Monetary holdings, investments and receivables",
    examples: ["Cash", "Investment", "Receivable"],
    accent: "from-amber-500/10 to-orange-500/5",
  },
  {
    key: "intangible",
    label: "Intangible Assets",
    icon: FileDigit,
    description: "Non-physical assets with economic value",
    examples: ["Software License", "Trademark", "Patent", "Goodwill"],
    accent: "from-violet-500/10 to-fuchsia-500/5",
  },
];

const SUBTYPES: Record<
  AssetCategory,
  { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[]
> = {
  physical: [
    { key: "property", label: "Property", icon: Home },
    { key: "plant", label: "Plant", icon: Factory },
    { key: "equipment", label: "Equipment", icon: Wrench },
    { key: "vehicle", label: "Vehicle", icon: Car },
    { key: "furniture", label: "Furniture", icon: Sofa },
    { key: "infrastructure", label: "Infrastructure", icon: Route },
  ],
  inventory: [
    { key: "raw", label: "Raw Material", icon: Package },
    { key: "finished", label: "Finished Goods", icon: Package },
    { key: "wip", label: "Work In Progress", icon: Package },
    { key: "foc", label: "FOC Item", icon: Package },
    { key: "scrap", label: "Scrap", icon: Package },
  ],
  financial: [
    { key: "cash", label: "Cash", icon: Coins },
    { key: "investment", label: "Investment", icon: TrendingUp },
    { key: "receivable", label: "Receivable", icon: Receipt },
  ],
  intangible: [
    { key: "software", label: "Software License", icon: Key },
    { key: "digital", label: "Digital Asset", icon: Cpu },
    { key: "trademark", label: "Trademark", icon: BadgeCheck },
    { key: "patent", label: "Patent", icon: BadgeCheck },
    { key: "copyright", label: "Copyright", icon: BadgeCheck },
    { key: "goodwill", label: "Goodwill", icon: Sparkles },
  ],
};

// Second-tier classification for subtypes that need it (e.g. Raw Material -> Steel, Wood)
const TYPES: Record<SubKey, { key: string; label: string }[]> = {
  raw: [
    { key: "steel", label: "Steel" },
    { key: "wood", label: "Wood" },
    { key: "plastic", label: "Plastic" },
    { key: "chemical", label: "Chemical" },
    { key: "textile", label: "Textile" },
    { key: "other", label: "Other" },
  ],
  finished: [
    { key: "consumer", label: "Consumer Goods" },
    { key: "industrial", label: "Industrial Goods" },
    { key: "custom", label: "Custom Order" },
  ],
  wip: [
    { key: "assembly", label: "Assembly" },
    { key: "fabrication", label: "Fabrication" },
    { key: "processing", label: "Processing" },
  ],
  scrap: [
    { key: "metal", label: "Metal Scrap" },
    { key: "damaged", label: "Damaged Goods" },
    { key: "obsolete", label: "Obsolete Stock" },
  ],
};

// Specific fields per subtype
type SpecField = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select";
  options?: string[];
  helper?: string;
};

const SPEC_FIELDS: Record<string, SpecField[]> = {
  vehicle: [
    { key: "vin", label: "VIN" },
    {
      key: "fuelType",
      label: "Fuel Type",
      type: "select",
      options: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    { key: "fuelCapacity", label: "Fuel Capacity (L)", type: "number" },
    { key: "odometer", label: "Odometer (km)", type: "number" },
    { key: "seating", label: "Seating Capacity", type: "number" },
    { key: "driver", label: "Assigned Driver" },
  ],
  equipment: [
    { key: "assetTag", label: "Asset Tag" },
    { key: "equipmentCategory", label: "Equipment Category" },
    {
      key: "condition",
      label: "Condition",
      type: "select",
      options: ["New", "Good", "Fair", "Poor"],
    },
  ],
  property: [
    {
      key: "ownership",
      label: "Ownership Type",
      type: "select",
      options: ["Owned", "Leased", "Rented"],
    },
    {
      key: "propertyType",
      label: "Property Type",
      type: "select",
      options: ["Land", "Building", "Mixed"],
    },
    { key: "landArea", label: "Land Area (m²)", type: "number" },
    { key: "coveredArea", label: "Covered Area (m²)", type: "number" },
    { key: "lease", label: "Lease Information" },
  ],
  furniture: [
    { key: "material", label: "Material" },
    { key: "weight", label: "Weight (kg)", type: "number" },
    { key: "dimensions", label: "Dimensions (LxWxH)" },
    {
      key: "condition",
      label: "Condition",
      type: "select",
      options: ["New", "Good", "Fair", "Poor"],
    },
  ],
  plant: [
    { key: "plantType", label: "Plant Type" },
    { key: "capacity", label: "Capacity" },
    { key: "commissioning", label: "Commissioning Date", type: "date" },
  ],
  infrastructure: [
    { key: "kind", label: "Infrastructure Kind" },
    { key: "length", label: "Length / Span" },
    {
      key: "condition",
      label: "Condition",
      type: "select",
      options: ["New", "Good", "Fair", "Poor"],
    },
  ],
  raw: [
    { key: "warehouse", label: "Warehouse" },
    { key: "uom", label: "Unit of Measure" },
    { key: "materialCode", label: "Material Code" },
    { key: "supplier", label: "Supplier" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Quantity", type: "number" },
  ],
  finished: [
    { key: "warehouse", label: "Warehouse" },
    { key: "uom", label: "Unit of Measure" },
    { key: "materialCode", label: "SKU" },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "category", label: "Product Category" },
  ],
  wip: [
    { key: "warehouse", label: "Warehouse" },
    { key: "uom", label: "Unit of Measure" },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "workOrder", label: "Work Order Ref" },
  ],
  foc: [
    { key: "warehouse", label: "Warehouse" },
    { key: "supplier", label: "Supplier" },
    { key: "quantity", label: "Quantity", type: "number" },
  ],
  scrap: [
    { key: "warehouse", label: "Warehouse" },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "reason", label: "Reason" },
  ],
  cash: [
    { key: "bank", label: "Bank" },
    { key: "accountNumber", label: "Account Number" },
    { key: "balance", label: "Balance", type: "number" },
  ],
  investment: [
    {
      key: "investmentType",
      label: "Investment Type",
      type: "select",
      options: ["Stocks", "Bonds", "Mutual Fund", "Real Estate"],
    },
    { key: "broker", label: "Broker" },
    { key: "interestRate", label: "Interest Rate (%)", type: "number" },
    { key: "riskLevel", label: "Risk Level", type: "select", options: ["Low", "Medium", "High"] },
    {
      key: "incomeFrequency",
      label: "Income Frequency",
      type: "select",
      options: ["Monthly", "Quarterly", "Annually"],
    },
  ],
  receivable: [
    { key: "customer", label: "Customer" },
    { key: "invoice", label: "Invoice" },
    { key: "outstanding", label: "Outstanding Amount", type: "number" },
    { key: "dueDate", label: "Due Date", type: "date" },
  ],
  software: [
    { key: "licenseKey", label: "License Key" },
    { key: "vendor", label: "Vendor" },
    { key: "seats", label: "Seats", type: "number" },
    { key: "platform", label: "Platform" },
    { key: "renewalDate", label: "Renewal Date", type: "date" },
    { key: "expiryDate", label: "Expiry Date", type: "date" },
  ],
  digital: [
    { key: "platform", label: "Platform" },
    { key: "vendor", label: "Vendor" },
    { key: "registrationNumber", label: "Registration Number" },
  ],
  trademark: [
    { key: "registrationNumber", label: "Registration Number" },
    { key: "authority", label: "Authority" },
    { key: "renewalDate", label: "Renewal Date", type: "date" },
    { key: "expiryDate", label: "Expiry Date", type: "date" },
  ],
  patent: [
    { key: "registrationNumber", label: "Patent Number" },
    { key: "authority", label: "Authority" },
    { key: "expiryDate", label: "Expiry Date", type: "date" },
  ],
  copyright: [
    { key: "registrationNumber", label: "Registration Number" },
    { key: "authority", label: "Authority" },
    { key: "expiryDate", label: "Expiry Date", type: "date" },
  ],
  goodwill: [
    { key: "origin", label: "Origin / Acquisition" },
    { key: "valuationMethod", label: "Valuation Method" },
  ],
};

// Extra fields layered on top of SPEC_FIELDS once a type is chosen, keyed by "subtype:type"
const TYPE_SPEC_FIELDS: Record<string, SpecField[]> = {
  "raw:steel": [
    { key: "grade", label: "Steel Grade" },
    { key: "thickness", label: "Thickness (mm)", type: "number" },
  ],
  "raw:wood": [
    { key: "species", label: "Wood Species" },
    { key: "moisture", label: "Moisture Content (%)", type: "number" },
  ],
  "raw:plastic": [
    { key: "resinType", label: "Resin Type" },
    { key: "grade", label: "Grade" },
  ],
  "raw:chemical": [
    { key: "casNumber", label: "CAS Number" },
    { key: "hazardClass", label: "Hazard Class" },
  ],
  "raw:textile": [
    { key: "fiberType", label: "Fiber Type" },
    { key: "gsm", label: "GSM", type: "number" },
  ],
};

function getSpecFields(subtype: SubKey | null, type: SubKey | null): SpecField[] {
  if (!subtype) return [];
  const base = SPEC_FIELDS[subtype] ?? [];
  const extra = type ? (TYPE_SPEC_FIELDS[`${subtype}:${type}`] ?? []) : [];
  return [...base, ...extra];
}

const STEPS = ["Asset Type", "Asset Details", "Financial", "Review"];

const DRAFT_KEY = "gda-new-asset-draft";

export function NewAssetWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(emptyData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Load draft on open
  useEffect(() => {
    if (!open || draftLoaded) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { data: WizardData; step: number };
        setData(parsed.data);
        setStep(parsed.step);
        toast.info("Draft restored", { description: "Your previous progress was loaded." });
      }
    } catch {
      // ignore
    }
    setDraftLoaded(true);
  }, [open, draftLoaded]);

  // Autosave
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

  // Auto code on category select
  useEffect(() => {
    if (data.category && !data.code) {
      const prefix = { physical: "PHY", inventory: "INV", financial: "FIN", intangible: "INT" }[
        data.category
      ];
      const suffix = String(1000 + Math.floor((Date.now() / 1000) % 9000));
      setData((d) => ({ ...d, code: `${prefix}-${suffix}` }));
    }
  }, [data.category]);

  // Lock body scroll
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

  const setSpec = (k: string, v: string) =>
    setData((d) => ({ ...d, specific: { ...d.specific, [k]: v } }));

  const selectSubtype = (key: SubKey) =>
    setData((d) => ({ ...d, subtype: key, type: null, specific: {} }));

  const selectType = (key: SubKey) => setData((d) => ({ ...d, type: key, specific: {} }));

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !data.category) e.category = "Select an asset type to continue.";
    if (step === 1) {
      if (!data.name) e.name = "Asset name is required.";
      if (!data.code) e.code = "Asset code is required.";
      if (!data.subtype) e.subtype = "Select a subtype.";
      else if (TYPES[data.subtype] && !data.type) e.type = "Select a type.";
      if (!data.department) e.department = "Department is required.";
      if (!data.location) e.location = "Location is required.";
    }
    if (step === 2) {
      if (!data.acquisitionDate) e.acquisitionDate = "Required.";
      if (!data.acquisitionCost) e.acquisitionCost = "Required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
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
    // reset after animation
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
    toast.success("Asset registered successfully", {
      description: `${data.code} · ${data.name}`,
    });
  };

  const registerAnother = () => {
    setData(emptyData);
    setStep(0);
    setSuccess(false);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Register New Asset</div>
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

        {/* Stepper */}
        {!success && (
          <div className="mx-auto max-w-[1400px] px-6 pb-4">
            <Stepper current={step} steps={STEPS} onJump={(i) => i < step && setStep(i)} />
            {step > 0 && (
              <SelectionTrail category={data.category} subtype={data.subtype} type={data.type} />
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          {success ? (
            <SuccessScreen data={data} onAnother={registerAnother} onDone={handleClose} />
          ) : (
            <>
              {step === 0 && <Step1Type data={data} set={set} error={errors.category} />}
              {step === 1 && (
                <Step2Details
                  data={data}
                  set={set}
                  setSpec={setSpec}
                  onSelectSubtype={selectSubtype}
                  onSelectType={selectType}
                  errors={errors}
                />
              )}
              {step === 2 && <Step3Financial data={data} set={set} errors={errors} />}
              {step === 3 && <Step5Review data={data} onEdit={setStep} />}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      {!success && (
        <div className="border-t border-border bg-surface">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-6 py-3">
            <Button variant="outline" onClick={prev} disabled={step === 0}>
              <ChevronLeft className="mr-1.5 h-4 w-4" />
              Previous
            </Button>
            <div className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </div>
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>
                Next
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit}>
                <Check className="mr-1.5 h-4 w-4" />
                Save Asset
              </Button>
            )}
          </div>
        </div>
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

// ================== Selection trail ==================
// Keeps the category/subtype/type chosen earlier visible on every later step.
function SelectionTrail({
  category,
  subtype,
  type,
}: {
  category: AssetCategory | null;
  subtype: SubKey | null;
  type: SubKey | null;
}) {
  if (!category) return null;

  const categoryLabel = CATEGORY_CARDS.find((c) => c.key === category)?.label;
  const subtypeLabel = subtype ? SUBTYPES[category].find((s) => s.key === subtype)?.label : null;
  const typeLabel = subtype && type ? TYPES[subtype]?.find((t) => t.key === type)?.label : null;

  const crumbs = [categoryLabel, subtypeLabel, typeLabel].filter(Boolean) as string[];

  return (
    <div className="mt-3 flex items-center gap-1.5 text-xs">
      {crumbs.map((label, i) => (
        <span key={label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          <span
            className={cn(
              "rounded-full border border-border bg-surface px-2 py-0.5",
              i === crumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}

// ================== Section Card ==================
function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="erp-card p-6">
      <header className="mb-5">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
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

// ================== Step 1 ==================
function Step1Type({
  data,
  set,
  error,
}: {
  data: WizardData;
  set: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  error?: string;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          What type of asset would you like to register?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a category — the wizard will adapt the remaining steps to only ask what's relevant.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORY_CARDS.map((c) => {
          const active = data.category === c.key;
          return (
            <button
              key={c.key}
              onClick={() => set("category", c.key)}
              className={cn(
                "erp-card group relative overflow-hidden p-6 text-left transition-all",
                "hover:border-primary/50 hover:shadow-sm",
                active && "border-primary ring-2 ring-primary/20",
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", c.accent)} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-lg",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface text-foreground border border-border",
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
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.examples.map((ex) => (
                    <span
                      key={ex}
                      className="rounded-full border border-border bg-surface/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}

// ================== Step 2 ==================
function Step2Details({
  data,
  set,
  setSpec,
  onSelectSubtype,
  onSelectType,
  errors,
}: {
  data: WizardData;
  set: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  setSpec: (k: string, v: string) => void;
  onSelectSubtype: (key: SubKey) => void;
  onSelectType: (key: SubKey) => void;
  errors: Record<string, string>;
}) {
  const cat = data.category!;
  const subs = SUBTYPES[cat];
  const typesForSubtype = data.subtype ? TYPES[data.subtype] : undefined;
  const readyForFields = !typesForSubtype || !!data.type;
  const fields = readyForFields ? getSpecFields(data.subtype, data.type) : [];
  const subtypeLabel = subs.find((s) => s.key === data.subtype)?.label;
  const typeLabel = typesForSubtype?.find((t) => t.key === data.type)?.label;

  const departments = [
    "Operations",
    "IT",
    "Finance",
    "HR",
    "Manufacturing",
    "R&D",
    "Logistics",
    "Sales",
  ];
  const locations = [
    "HQ — Riyadh",
    "Plant A — Jeddah",
    "Warehouse 3 — Dammam",
    "Data Center — Riyadh",
    "Branch — Dubai",
    "Site Office — NEOM",
  ];
  const custodians = [
    "Amir Nasser",
    "Layla Haddad",
    "Omar Farouk",
    "Yasmin Saleh",
    "Karim Adel",
    "Noura Al-Rashid",
  ];
  const organizations = ["GDA"];
  return (
    <div className="grid gap-6">
      <Card title="Identity" description="Core identifiers for this asset">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Asset Code"
            required
            helper="Auto-generated, editable if you have your own numbering"
            error={errors.code}
          >
            <Input
              value={data.code}
              onChange={(e) => set("code", e.target.value)}
              className="font-mono"
            />
          </Field>
          <Field label="Asset Name" required error={errors.name}>
            <Input
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Excavator CAT 320"
            />
          </Field>
          <Field label="Ownership Type">
            <SearchSelect
              value={data.ownership}
              onChange={(v) => set("ownership", v)}
              options={["Owned", "Leased", "Rented", "Financed"]}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Choose subtype"
        description={`Select the specific kind of ${cat === "physical" ? "physical asset" : cat + " asset"} — we'll only show relevant fields.`}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {subs.map((s) => {
            const active = data.subtype === s.key;
            return (
              <button
                key={s.key}
                onClick={() => onSelectSubtype(s.key)}
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
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="text-xs font-medium">{s.label}</div>
              </button>
            );
          })}
        </div>
        {errors.subtype && <p className="mt-3 text-[11px] text-destructive">{errors.subtype}</p>}
      </Card>

      {typesForSubtype && (
        <Card
          title="Choose type"
          description={`Narrow down the ${subtypeLabel?.toLowerCase()} by type`}
        >
          <div className="flex flex-wrap gap-2">
            {typesForSubtype.map((t) => {
              const active = data.type === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onSelectType(t.key)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-accent/40",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          {errors.type && <p className="mt-3 text-[11px] text-destructive">{errors.type}</p>}
        </Card>
      )}

      {fields.length > 0 && (
        <Card
          title={`${typeLabel ? `${typeLabel} · ` : ""}${subtypeLabel} details`}
          description="Only fields relevant to this selection are shown"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <Field key={f.key} label={f.label} helper={f.helper}>
                {f.type === "select" && f.options ? (
                  <SearchSelect
                    value={data.specific[f.key] ?? ""}
                    onChange={(v) => setSpec(f.key, v)}
                    options={f.options}
                  />
                ) : (
                  <Input
                    type={f.type ?? "text"}
                    value={data.specific[f.key] ?? ""}
                    onChange={(e) => setSpec(f.key, e.target.value)}
                  />
                )}
              </Field>
            ))}
          </div>
        </Card>
      )}

      <Card title="Description & Media" description="Optional context and attachments">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Description" helper="Notes visible to anyone with access to this asset">
            <Textarea
              rows={4}
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <div className="grid gap-5">
            <Field label="Upload Image">
              <UploadDrop label="Drop image or click to browse" accept="image/*" />
            </Field>
            <Field label="Attachments" helper="Manuals, invoices, warranty documents">
              <UploadDrop label="Drop files here" />
            </Field>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between rounded-md border border-dashed border-border bg-surface-muted/40 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-surface border border-border">
              <QrCode className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">QR Code Preview</div>
              <div className="text-xs text-muted-foreground">
                Generated from asset code · <span className="font-mono">{data.code || "—"}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" disabled>
            Regenerate
          </Button>
        </div>
      </Card>

      <Card title="Assignment" description="Where the asset lives and who is responsible">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Organization">
            <SearchSelect
              value={data.organization}
              onChange={(v) => set("organization", v)}
              options={organizations}
              placeholder="Select organization"
            />
          </Field>
          <Field label="Department" required error={errors.department}>
            <SearchSelect
              value={data.department}
              onChange={(v) => set("department", v)}
              options={departments}
              placeholder="Select department"
            />
          </Field>
          <Field label="Custodian Employee">
            <SearchSelect
              value={data.custodian}
              onChange={(v) => set("custodian", v)}
              options={custodians}
              placeholder="Search employee"
            />
          </Field>
          <Field label="Current Location" required error={errors.location}>
            <SearchSelect
              value={data.location}
              onChange={(v) => set("location", v)}
              options={locations}
              placeholder="Select location"
            />
          </Field>
          <Field label="Status">
            <SearchSelect
              value={data.status}
              onChange={(v) => set("status", v)}
              options={["In Use", "Idle", "Under Maintenance", "Reserved"]}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}

// ================== Step 3 ==================
function Step3Financial({
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
      <Card title="Acquisition" description="How and when the asset was obtained">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Acquisition Date" required error={errors.acquisitionDate}>
            <Input
              type="date"
              value={data.acquisitionDate}
              onChange={(e) => set("acquisitionDate", e.target.value)}
            />
          </Field>
          <Field
            label="Acquisition Cost"
            required
            error={errors.acquisitionCost}
            helper="Original purchase amount excluding taxes"
          >
            <CurrencyInput
              currency={data.currency}
              onCurrencyChange={(v) => set("currency", v)}
              value={data.acquisitionCost}
              onValueChange={(v) => set("acquisitionCost", v)}
            />
          </Field>
          <Field label="Supplier">
            <SearchSelect
              value={data.supplier}
              onChange={(v) => set("supplier", v)}
              options={[
                "Siemens",
                "ABB",
                "Caterpillar",
                "Toyota Industries",
                "Oracle",
                "SAP",
                "Microsoft",
              ]}
              placeholder="Search supplier"
            />
          </Field>
          <Field label="Purchase Reference" helper="PO number, invoice number, or contract ID">
            <Input
              value={data.purchaseRef}
              onChange={(e) => set("purchaseRef", e.target.value)}
              placeholder="e.g. PO-2026-00421"
            />
          </Field>
          <Field label="Warranty Expiry">
            <Input
              type="date"
              value={data.warrantyExpiry}
              onChange={(e) => set("warrantyExpiry", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Depreciation & Valuation"
        description="Applied to physical and intangible assets"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Current Book Value">
            <CurrencyInput
              currency={data.currency}
              onCurrencyChange={(v) => set("currency", v)}
              value={data.bookValue}
              onValueChange={(v) => set("bookValue", v)}
            />
          </Field>
          <Field label="Useful Life (years)">
            <Input
              type="number"
              min="0"
              value={data.usefulLife}
              onChange={(e) => set("usefulLife", e.target.value)}
            />
          </Field>
          <Field label="Salvage Value">
            <CurrencyInput
              currency={data.currency}
              onCurrencyChange={(v) => set("currency", v)}
              value={data.salvageValue}
              onValueChange={(v) => set("salvageValue", v)}
            />
          </Field>
          <Field label="Depreciation Method">
            <SearchSelect
              value={data.depreciationMethod}
              onChange={(v) => set("depreciationMethod", v)}
              options={[
                "Straight Line",
                "Declining Balance",
                "Sum of Years' Digits",
                "Units of Production",
              ]}
            />
          </Field>
          <Field label="GL Account" helper="Chart of accounts mapping for finance postings">
            <SearchSelect
              value={data.glAccount}
              onChange={(v) => set("glAccount", v)}
              options={[
                "1500 · Fixed Assets",
                "1520 · Machinery",
                "1530 · Vehicles",
                "1610 · Intangibles",
              ]}
              placeholder="Search account"
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}

// ================== Step 5 Review ==================
function Step5Review({ data, onEdit }: { data: WizardData; onEdit: (step: number) => void }) {
  const cat = CATEGORY_CARDS.find((c) => c.key === data.category);
  const subLabel =
    data.subtype && data.category
      ? SUBTYPES[data.category].find((s) => s.key === data.subtype)?.label
      : null;
  const typeLabel =
    data.subtype && data.type ? TYPES[data.subtype]?.find((t) => t.key === data.type)?.label : null;
  const specFields = getSpecFields(data.subtype, data.type);

  return (
    <div className="grid gap-6">
      <div className="erp-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-primary/10 text-primary">
              {cat && <cat.icon className="h-7 w-7" />}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {cat?.label} · {subLabel ?? "—"}
                {typeLabel ? ` · ${typeLabel}` : ""}
              </div>
              <div className="mt-0.5 text-lg font-semibold">{data.name || "Untitled asset"}</div>
              <div className="mt-0.5 font-mono text-xs text-muted-foreground">{data.code}</div>
            </div>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-md border border-border bg-surface-muted">
            <QrCode className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      <ReviewSection title="General Information" onEdit={() => onEdit(1)}>
        <ReviewRow label="Organization" value={data.organization} />
        <ReviewRow label="Department" value={data.department} />
        <ReviewRow label="Custodian" value={data.custodian} />
        <ReviewRow label="Location" value={data.location} />
        <ReviewRow label="Status" value={data.status} />
        <ReviewRow label="Ownership" value={data.ownership} />
        <ReviewRow label="Description" value={data.description} span />
      </ReviewSection>

      <ReviewSection title="Financial Information" onEdit={() => onEdit(2)}>
        <ReviewRow label="Acquisition Date" value={data.acquisitionDate} />
        <ReviewRow
          label="Acquisition Cost"
          value={data.acquisitionCost ? `${data.currency} ${data.acquisitionCost}` : ""}
        />
        <ReviewRow
          label="Book Value"
          value={data.bookValue ? `${data.currency} ${data.bookValue}` : ""}
        />
        <ReviewRow label="Useful Life" value={data.usefulLife ? `${data.usefulLife} years` : ""} />
        <ReviewRow
          label="Salvage Value"
          value={data.salvageValue ? `${data.currency} ${data.salvageValue}` : ""}
        />
        <ReviewRow label="Depreciation Method" value={data.depreciationMethod} />
        <ReviewRow label="GL Account" value={data.glAccount} />
        <ReviewRow label="Supplier" value={data.supplier} />
        <ReviewRow label="Purchase Reference" value={data.purchaseRef} />
        <ReviewRow label="Warranty Expiry" value={data.warrantyExpiry} />
      </ReviewSection>

      {specFields.length > 0 && (
        <ReviewSection
          title={`${typeLabel ? `${typeLabel} · ` : ""}${subLabel} Details`}
          onEdit={() => onEdit(1)}
        >
          {specFields.map((f) => (
            <ReviewRow key={f.key} label={f.label} value={data.specific[f.key] ?? ""} />
          ))}
        </ReviewSection>
      )}

      <ReviewSection title="Attachments" onEdit={() => onEdit(1)}>
        <ReviewRow label="Image" value="No file uploaded" />
        <ReviewRow label="Attachments" value="No files uploaded" />
      </ReviewSection>
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
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">Asset successfully registered</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-mono">{data.code}</span> · {data.name || "New asset"} has been added
        to the register.
      </p>
      <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Button onClick={onAnother} variant="outline">
          Register Another Asset
        </Button>
        <Button onClick={onDone}>
          Go to Asset Register
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

  // Small option list -> use Select. Large -> command palette style.
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

function CurrencyInput({
  value,
  onValueChange,
  currency,
  onCurrencyChange,
}: {
  value: string;
  onValueChange: (v: string) => void;
  currency: string;
  onCurrencyChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["USD", "EUR", "GBP", "SAR", "AED", "JPY"].map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="0.00"
        className="flex-1 tabular-nums"
      />
    </div>
  );
}

function UploadDrop({ label, accept }: { label: string; accept?: string }) {
  const [name, setName] = useState<string | null>(null);
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface-muted/40 px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-accent/40">
      <Upload className="h-5 w-5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{name ?? label}</span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => setName(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  );
}
