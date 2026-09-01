import { useEffect, useState, type ReactNode, type ChangeEvent } from "react";
import {
  Building2,
  Package,
  Landmark,
  FileDigit,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Folder,
  FolderOpen,
  MapPin,
  Layers,
  DoorClosed,
  FileText,
  Loader2,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  api,
  OWNERSHIP_TO_INT,
  ACQUISITION_TO_INT,
  type AssetClassDto,
  type AssetCategoryDto,
  type CategoryAttributeDto,
  type CategoryAttributeOptionDto,
  type AssetStatusDto,
  type CurrencyDto,
  type DepreciationMethodDto,
  type LocationDto,
} from "@/lib/api";

// ============================================================================
// TYPES
// ============================================================================

type Ownership = "OWNED" | "LEASED" | "RENTED" | "FINANCE";
type AcquisitionType = "PURCHASE" | "FOC" | "DONATION" | "TRANSFER";

interface TreeItem {
  id: number;
  parentId?: number | null;
  parentCategoryId?: number | null;
  code: string;
  name: string;
  description?: string;
}

interface Attachment {
  name: string;
  mimeType: string;
  size: number;
}

interface WizardData {
  // Classification
  assetClassId: number | null;
  categoryPath: AssetCategoryDto[];
  categoryId: number | null;
  extraAttributes: Record<string, string | string[]>;

  // Identity
  assetCode: string;
  name: string;
  description: string;
  ownership: Ownership;
  statusId: number | null;

  // Assignment
  departmentId: string;
  custodianId: string;
  currentLocationId: number | null;

  attachments: Attachment[];

  // Acquisition
  acquisitionDate: string;
  acquisitionCost: string;
  currencyCode: string;
  supplierId: string;
  purchaseReference: string;
  acquisitionType: AcquisitionType;
  warrantyExpiryDate: string;

  // Depreciation schedule
  depreciationMethodId: number | null;
  usefulLifeMonths: string;
  salvageValue: string;
  depreciationStartDate: string;
}

interface LocationDropdownOption {
  id: number;
  code: string;
  name: string;
  locationType: string;
  displayPath: string;
  icon: ReactNode;
}

// Fallback seed data in case backend is offline
const DEFAULT_CLASSES: AssetClassDto[] = [
  {
    id: 1,
    code: "PHY",
    name: "Physical Assets",
    description:
      "Tangible property including land, buildings, vehicles, machinery, and office equipment.",
    isActive: true,
  },
  {
    id: 2,
    code: "FIN",
    name: "Financial Assets",
    description:
      "Monetary resources including bank deposits, investments, securities, and receivables.",
    isActive: true,
  },
  {
    id: 3,
    code: "INT",
    name: "Intangible Assets",
    description:
      "Non-physical property including software licenses, patents, trademarks, and digital rights.",
    isActive: true,
  },
  {
    id: 4,
    code: "INV",
    name: "Inventory & Supplies",
    description:
      "Operational stock, spare parts, raw materials, and consumables held for use or distribution.",
    isActive: true,
  },
];

const DEFAULT_STATUSES: AssetStatusDto[] = [
  { id: 1, code: "DRAFT", name: "Draft", isActive: true },
  { id: 2, code: "ACTIVE", name: "In Use", isActive: true },
  { id: 3, code: "IN_MAINTENANCE", name: "Under Maintenance", isActive: true },
  { id: 4, code: "IDLE", name: "Idle", isActive: true },
  { id: 5, code: "RESERVED", name: "Reserved", isActive: true },
  { id: 6, code: "DISPOSED", name: "Disposed", isActive: true },
];

const DEFAULT_CURRENCIES: CurrencyDto[] = [
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "AED", name: "UAE Dirham", symbol: "AED" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR" },
];

const DEFAULT_DEPRECIATION_METHODS: DepreciationMethodDto[] = [
  { id: 1, code: "STRAIGHT_LINE", name: "Straight Line", isActive: true },
  { id: 2, code: "DECLINING_BALANCE", name: "Declining Balance", isActive: true },
  { id: 3, code: "SUM_OF_YEARS", name: "Sum of Years Digits", isActive: true },
  { id: 4, code: "UNITS_OF_PRODUCTION", name: "Units of Production", isActive: true },
];

const DEFAULT_LOCATIONS: LocationDto[] = [
  {
    id: 1,
    parentLocationId: null,
    code: "GDA_HQ",
    name: "GDA Head Office — Abbottabad",
    locationType: "SITE",
    isActive: true,
  },
  {
    id: 5,
    parentLocationId: 1,
    code: "ADMIN_BLDG",
    name: "Administration Block",
    locationType: "BUILDING",
    isActive: true,
  },
  {
    id: 9,
    parentLocationId: 5,
    code: "ROOM_101",
    name: "Room 101 — Executive Suite",
    locationType: "ROOM",
    isActive: true,
  },
  {
    id: 10,
    parentLocationId: 5,
    code: "ROOM_102",
    name: "Room 102 — Operations Hub",
    locationType: "ROOM",
    isActive: true,
  },
  {
    id: 8,
    parentLocationId: 5,
    code: "IT_DC",
    name: "IT Data Center",
    locationType: "FLOOR",
    isActive: true,
  },
  {
    id: 2,
    parentLocationId: null,
    code: "ISB_OFFICE",
    name: "Liaison Office — Islamabad",
    locationType: "SITE",
    isActive: true,
  },
  {
    id: 3,
    parentLocationId: null,
    code: "NG_SITE",
    name: "Site Office — Nathiagali",
    locationType: "SITE",
    isActive: true,
  },
];

const DEFAULT_CATEGORIES: AssetCategoryDto[] = [
  {
    id: 1,
    assetClassId: 1,
    parentCategoryId: null,
    code: "IT",
    name: "IT Equipment",
    description: "Computing, networking, and electronics hardware",
    isActive: true,
  },
  {
    id: 8,
    assetClassId: 1,
    parentCategoryId: 1,
    code: "COMPUTER",
    name: "Computers & Workstations",
    description: "Desktop systems and enterprise workstations",
    isActive: true,
  },
  {
    id: 13,
    assetClassId: 1,
    parentCategoryId: 8,
    code: "LAPTOP",
    name: "Laptops & Portables",
    description: "Staff laptops, ultrabooks, and portable workstations",
    isActive: true,
  },
  {
    id: 2,
    assetClassId: 1,
    parentCategoryId: null,
    code: "VEHICLES",
    name: "Vehicles & Transport",
    description: "Automobiles, transport trucks, and heavy road machinery",
    isActive: true,
  },
  {
    id: 10,
    assetClassId: 1,
    parentCategoryId: 2,
    code: "CAR",
    name: "Passenger Cars",
    description: "Sedans, SUVs, and passenger vans",
    isActive: true,
  },
  {
    id: 3,
    assetClassId: 1,
    parentCategoryId: null,
    code: "BUILDINGS",
    name: "Real Estate & Buildings",
    description: "Offices, rest houses, land parcels, and infrastructural structures",
    isActive: true,
  },
  {
    id: 4,
    assetClassId: 1,
    parentCategoryId: null,
    code: "FURNITURE",
    name: "Furniture & Fixtures",
    description: "Desks, conference tables, chairs, and filing units",
    isActive: true,
  },
  {
    id: 5,
    assetClassId: 2,
    parentCategoryId: null,
    code: "INVESTMENTS",
    name: "Investments & Treasury",
    description: "Term deposits, government bonds, and cash equivalents",
    isActive: true,
  },
  {
    id: 6,
    assetClassId: 3,
    parentCategoryId: null,
    code: "SOFTWARE",
    name: "Software & Licenses",
    description: "Enterprise applications, OS licenses, and cloud subscriptions",
    isActive: true,
  },
  {
    id: 7,
    assetClassId: 4,
    parentCategoryId: null,
    code: "RAW_MATERIAL",
    name: "Raw Materials & Supplies",
    description: "Construction supplies, asphalt, bitumen, and gravel",
    isActive: true,
  },
];

const DEPARTMENTS = [
  { id: "d0000000-0000-0000-0000-000000000001", name: "IT & Telecommunications" },
  { id: "d0000000-0000-0000-0000-000000000002", name: "Operations & Maintenance" },
  { id: "d0000000-0000-0000-0000-000000000003", name: "Finance & Accounts" },
  { id: "d0000000-0000-0000-0000-000000000004", name: "General Administration" },
  { id: "d0000000-0000-0000-0000-000000000005", name: "Logistics & Transport" },
];

const CUSTODIANS = [
  { id: "e0000000-0000-0000-0000-000000000001", name: "Ali Hassan (Director IT)" },
  { id: "e0000000-0000-0000-0000-000000000002", name: "Sara Khalid (Finance Officer)" },
  { id: "e0000000-0000-0000-0000-000000000003", name: "Omar Farooq (Logistics Lead)" },
  { id: "e0000000-0000-0000-0000-000000000004", name: "Yasmin Akhtar (Operations Manager)" },
];

const SUPPLIERS = [
  { id: "s0000000-0000-0000-0000-000000000001", name: "Dell Pakistan Pvt Ltd" },
  { id: "s0000000-0000-0000-0000-000000000002", name: "Toyota Indus Motors" },
  { id: "s0000000-0000-0000-0000-000000000003", name: "Caterpillar Heavy Machinery" },
  { id: "s0000000-0000-0000-0000-000000000004", name: "Microsoft Corporation" },
  { id: "s0000000-0000-0000-0000-000000000005", name: "National Development Supplies" },
];

const OWNERSHIP_OPTIONS: { label: string; value: Ownership }[] = [
  { label: "Owned", value: "OWNED" },
  { label: "Leased", value: "LEASED" },
  { label: "Rented", value: "RENTED" },
  { label: "Finance", value: "FINANCE" },
];

const ACQUISITION_TYPE_OPTIONS: { label: string; value: AcquisitionType }[] = [
  { label: "Purchase", value: "PURCHASE" },
  { label: "Free of Charge (FOC)", value: "FOC" },
  { label: "Donation / Grant", value: "DONATION" },
  { label: "Transfer", value: "TRANSFER" },
];

const ACCENT_PALETTE = [
  "from-blue-500/15 to-indigo-500/5",
  "from-emerald-500/15 to-teal-500/5",
  "from-amber-500/15 to-orange-500/5",
  "from-violet-500/15 to-fuchsia-500/5",
  "from-rose-500/15 to-pink-500/5",
  "from-cyan-500/15 to-sky-500/5",
];

// One fixed accent per hierarchy depth so the picker reads as a tree
// (root/subcategory/type) instead of a random grid of colors.
const CATEGORY_LEVEL_ACCENTS = [
  "from-blue-500/15 to-indigo-500/5",
  "from-violet-500/15 to-fuchsia-500/5",
  "from-emerald-500/15 to-teal-500/5",
];

const CATEGORY_LEVEL_LABELS = ["Root Category", "Subcategory", "Type"];

const CATEGORY_LEVEL_DESCRIPTIONS = [
  "Select the primary asset classification",
  "Choose a more specific category",
  "Pick the asset type",
];

const emptyData: WizardData = {
  assetClassId: null,
  categoryPath: [],
  categoryId: null,
  extraAttributes: {},
  assetCode: "",
  name: "",
  description: "",
  ownership: "OWNED",
  statusId: 2, // Default to Active / In Use
  departmentId: "",
  custodianId: "",
  currentLocationId: null,
  attachments: [],
  acquisitionDate: new Date().toISOString().split("T")[0],
  acquisitionCost: "",
  currencyCode: "PKR",
  supplierId: "",
  purchaseReference: "",
  acquisitionType: "PURCHASE",
  warrantyExpiryDate: "",
  depreciationMethodId: 1, // Straight Line
  usefulLifeMonths: "36",
  salvageValue: "0",
  depreciationStartDate: new Date().toISOString().split("T")[0],
};

const STEPS = ["Asset Class", "Details & Assignment", "Acquisition & Depreciation", "Review"];
const DRAFT_KEY = "gda-asset-registration-draft";

function toGuidOrNull(id?: string): string | null {
  if (!id) return null;
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (guidRegex.test(id)) return id;
  const hash = Array.from(id).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0);
  const hex = hash.toString(16).padStart(8, "0");
  return `00000000-0000-0000-0000-${hex.padStart(12, "0")}`;
}

const classIcon = (code: string) => {
  const c = code?.toUpperCase();
  if (c === "PHY" || c === "PHYSICAL") return Building2;
  if (c === "INV" || c === "INVENTORY") return Package;
  if (c === "FIN" || c === "FINANCIAL") return Landmark;
  if (c === "INT" || c === "INTANGIBLE") return FileDigit;
  return Box;
};

const locationIcon = (type?: string) => {
  const t = type?.toUpperCase();
  if (t === "SITE") return MapPin;
  if (t === "BUILDING") return Building2;
  if (t === "FLOOR") return Layers;
  if (t === "ROOM") return DoorClosed;
  return MapPin;
};

// Formats location into a hierarchical trail: e.g. "GDA HQ › Admin Block › Room 101"
function buildLocationPath(loc: LocationDto, allLocs: LocationDto[]): string {
  const parts: string[] = [loc.name];
  let parentId = loc.parentLocationId;
  while (parentId) {
    const parent = allLocs.find((l) => l.id === parentId);
    if (!parent) break;
    parts.unshift(parent.name);
    parentId = parent.parentLocationId;
  }
  return parts.join(" › ");
}

// Small "(i)" affordance that reveals a description on hover/focus without
// permanently occupying layout space — used anywhere a term may need
// clarification (asset classes, category tiers).
function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="More info"
          className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-border text-muted-foreground outline-none transition-colors hover:border-primary/50 hover:text-primary focus-visible:border-primary focus-visible:text-primary"
        >
          <Info className="h-2.5 w-2.5" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 text-left font-normal leading-snug">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// MAIN WIZARD COMPONENT
// ============================================================================

export function AssetRegistrationWizard({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(emptyData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live API lookups
  const [classes, setClasses] = useState<AssetClassDto[]>(DEFAULT_CLASSES);
  const [categories, setCategories] = useState<AssetCategoryDto[]>(DEFAULT_CATEGORIES);
  const [attributes, setAttributes] = useState<CategoryAttributeDto[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<CategoryAttributeOptionDto[]>([]);
  const [statuses, setStatuses] = useState<AssetStatusDto[]>(DEFAULT_STATUSES);
  const [currencies, setCurrencies] = useState<CurrencyDto[]>(DEFAULT_CURRENCIES);
  const [depreciationMethods, setDepreciationMethods] = useState<DepreciationMethodDto[]>(
    DEFAULT_DEPRECIATION_METHODS,
  );
  const [locations, setLocations] = useState<LocationDto[]>(DEFAULT_LOCATIONS);

  // Load live master data on open
  useEffect(() => {
    if (!open) return;

    async function loadMasterData() {
      try {
        const [
          resClasses,
          resCategories,
          resAttributes,
          resOptions,
          resStatuses,
          resCurrencies,
          resDeprec,
          resLocations,
        ] = await Promise.allSettled([
          api.getAssetClasses(),
          api.getAssetCategories(),
          api.getCategoryAttributes(),
          api.getCategoryAttributeOptions(),
          api.getAssetStatuses(),
          api.getCurrencies(),
          api.getDepreciationMethods(),
          api.getLocations(),
        ]);

        if (resClasses.status === "fulfilled" && resClasses.value.items.length > 0) {
          setClasses(resClasses.value.items);
        }
        if (resCategories.status === "fulfilled" && resCategories.value.items.length > 0) {
          setCategories(resCategories.value.items);
        }
        if (resAttributes.status === "fulfilled" && resAttributes.value.items.length > 0) {
          setAttributes(resAttributes.value.items);
        }
        if (resOptions.status === "fulfilled" && resOptions.value.items.length > 0) {
          setAttributeOptions(resOptions.value.items);
        }
        if (resStatuses.status === "fulfilled" && resStatuses.value.items.length > 0) {
          setStatuses(resStatuses.value.items);
        }
        if (resCurrencies.status === "fulfilled" && resCurrencies.value.items.length > 0) {
          setCurrencies(resCurrencies.value.items);
        }
        if (resDeprec.status === "fulfilled" && resDeprec.value.items.length > 0) {
          setDepreciationMethods(resDeprec.value.items);
        }
        if (resLocations.status === "fulfilled" && resLocations.value.items.length > 0) {
          setLocations(resLocations.value.items);
        }
      } catch (err) {
        console.warn("Could not fetch master data, using default lookups:", err);
      }
    }

    loadMasterData();
  }, [open]);

  // Restore draft from localStorage
  useEffect(() => {
    if (!open || draftLoaded) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(parsed.data);
        setStep(parsed.step);
        toast.info("Draft restored");
      }
    } catch {
      // ignore corrupt draft
    }
    setDraftLoaded(true);
  }, [open, draftLoaded]);

  // Autosave draft
  useEffect(() => {
    if (!open || success) return;
    const t = setTimeout(
      () => localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step })),
      400,
    );
    return () => clearTimeout(t);
  }, [data, step, open, success]);

  // Auto-generate asset code when class changes
  useEffect(() => {
    if (data.assetClassId && !data.assetCode) {
      const cls = classes.find((c) => c.id === data.assetClassId);
      const prefix = cls?.code ? cls.code.slice(0, 3).toUpperCase() : "AST";
      const suffix = String(1000 + Math.floor(Math.random() * 9000));
      setData((d) => ({ ...d, assetCode: `AST-${prefix}-${suffix}` }));
    }
  }, [data.assetClassId, classes]);

  if (!open) return null;

  const set = (patch: Partial<WizardData>) => setData((d) => ({ ...d, ...patch }));

  const setAttr = (code: string, value: string | string[]) =>
    setData((d) => ({ ...d, extraAttributes: { ...d.extraAttributes, [code]: value } }));

  const onCategoryPathChange = (path: AssetCategoryDto[]) =>
    set({ categoryPath: path, categoryId: path.at(-1)?.id ?? null, extraAttributes: {} });

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !data.assetClassId) e.assetClassId = "Select an asset class to continue.";
    if (step === 1) {
      if (!data.categoryId) e.categoryId = "Select a category to continue.";
      const requiredAttrs = attributes.filter(
        (a) => a.categoryId === data.categoryId && a.isRequired,
      );
      requiredAttrs.forEach((attr) => {
        const value = data.extraAttributes[attr.code];
        const missing =
          attr.dataType === "MULTISELECT" ? !Array.isArray(value) || value.length === 0 : !value;
        if (missing) e[`attr_${attr.code}`] = "Required";
      });
      if (!data.assetCode) e.assetCode = "Asset code is required.";
      if (!data.name) e.name = "Asset name is required.";
      if (!data.statusId) e.statusId = "Status is required.";
      if (!data.currentLocationId) e.currentLocationId = "Location is required.";
    }
    if (step === 2) {
      if (!data.acquisitionDate) e.acquisitionDate = "Acquisition date is required.";
      if (!data.acquisitionCost) e.acquisitionCost = "Acquisition cost is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => validateStep() && setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const handlePrev = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      // 1. Create real Asset
      const createdAsset = await api.createAsset({
        assetCode: data.assetCode,
        name: data.name,
        description: data.description || undefined,
        ownership: OWNERSHIP_TO_INT[data.ownership] ?? 0,
        assetClassId: data.assetClassId!,
        categoryId: data.categoryId!,
        statusId: data.statusId || 2,
        departmentId: toGuidOrNull(data.departmentId),
        custodianId: toGuidOrNull(data.custodianId),
        currentLocationId: data.currentLocationId,
        extraAttributes:
          Object.keys(data.extraAttributes).length > 0
            ? JSON.stringify(data.extraAttributes)
            : null,
        isActive: true,
      });

      // 2. Create Asset Acquisition if provided
      if (createdAsset.id && data.acquisitionDate && data.acquisitionCost) {
        try {
          await api.createAssetAcquisition({
            assetId: createdAsset.id,
            acquisitionDate: new Date(data.acquisitionDate).toISOString(),
            acquisitionCost: parseFloat(data.acquisitionCost) || 0,
            currencyCode: (data.currencyCode || "PKR").slice(0, 3),
            supplierId: toGuidOrNull(data.supplierId),
            purchaseReference: data.purchaseReference || undefined,
            acquisitionType: ACQUISITION_TO_INT[data.acquisitionType] ?? 0,
            warrantyExpiryDate: data.warrantyExpiryDate
              ? new Date(data.warrantyExpiryDate).toISOString()
              : null,
          });
        } catch (acqErr) {
          console.warn("Could not save acquisition record:", acqErr);
        }
      }

      // 3. Create Depreciation Schedule if provided
      if (createdAsset.id && data.depreciationMethodId && data.usefulLifeMonths) {
        try {
          await api.createAssetDepreciationSchedule({
            assetId: createdAsset.id,
            methodId: data.depreciationMethodId,
            usefulLifeMonths: parseInt(data.usefulLifeMonths, 10) || 36,
            salvageValue: parseFloat(data.salvageValue) || 0,
            startDate: data.depreciationStartDate
              ? new Date(data.depreciationStartDate).toISOString()
              : new Date().toISOString(),
            isActive: true,
          });
        } catch (depErr) {
          console.warn("Could not save depreciation schedule:", depErr);
        }
      }

      localStorage.removeItem(DRAFT_KEY);
      setSuccess(true);
      toast.success("Asset registered successfully in central database", {
        description: `${data.assetCode} · ${data.name}`,
      });

      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error creating asset:", err);
      toast.error("Failed to register asset", {
        description:
          err?.message || "An unexpected error occurred while communicating with the backend API.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Register New Asset</div>
              <div className="text-xs text-muted-foreground">
                Connected to real backend API · autosaved
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {!success && (
          <div className="mx-auto max-w-[1400px] px-6 pb-4">
            <Stepper
              current={step}
              steps={STEPS}
              onJump={(i) => i < step && setStep(i)}
              subLabels={[classes.find((c) => c.id === data.assetClassId)?.name]}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1000px] px-6 py-8">
          {success ? (
            <SuccessScreen data={data} onDone={onClose} />
          ) : (
            <>
              {step === 0 && <Step1Class data={data} set={set} classes={classes} errors={errors} />}
              {step === 1 && (
                <Step2Details
                  data={data}
                  set={set}
                  setAttr={setAttr}
                  classes={classes}
                  categories={categories}
                  attributes={attributes}
                  attributeOptions={attributeOptions}
                  statuses={statuses}
                  locations={locations}
                  errors={errors}
                  onCategoryPathChange={onCategoryPathChange}
                  onChangeClass={() => setStep(0)}
                />
              )}
              {step === 2 && (
                <Step3Acquisition
                  data={data}
                  set={set}
                  currencies={currencies}
                  depreciationMethods={depreciationMethods}
                  errors={errors}
                />
              )}
              {step === 3 && (
                <Step4Review
                  data={data}
                  classes={classes}
                  statuses={statuses}
                  currencies={currencies}
                  depreciationMethods={depreciationMethods}
                  locations={locations}
                  attributes={attributes}
                  onEdit={setStep}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      {!success && (
        <div className="border-t border-border bg-surface">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-6 py-3">
            <Button variant="outline" onClick={handlePrev} disabled={step === 0 || isSubmitting}>
              <ChevronLeft className="mr-1.5 h-4 w-4" /> Previous
            </Button>
            <div className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </div>
            {step < STEPS.length - 1 ? (
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving to Database…
                  </>
                ) : (
                  <>
                    <Check className="mr-1.5 h-4 w-4" /> Save Asset
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CASCADING PICKER — For Asset Categories (Root Category → Subcategory → Type)
// ============================================================================

interface BreadcrumbLeading {
  label: string;
  name: string;
  onClick?: () => void;
}

function CategoryBreadcrumb<T extends TreeItem>({
  path,
  levelLabels,
  levelDescriptions,
  onJump,
  leading,
}: {
  path: T[];
  levelLabels: string[];
  levelDescriptions?: string[];
  onJump: (levelIndex: number) => void;
  leading?: BreadcrumbLeading;
}) {
  if (path.length === 0 && !leading) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface-muted/40 px-3 py-2.5">
      {leading && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={leading.onClick}
            disabled={!leading.onClick}
            className="flex flex-col items-start rounded-md bg-muted px-2.5 py-1 text-left enabled:hover:bg-muted/70"
          >
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {leading.label}
            </span>
            <span className="text-xs font-semibold text-foreground">{leading.name}</span>
          </button>
          {path.length > 0 && (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
        </div>
      )}
      {path.map((node, i) => {
        const description = node.description || levelDescriptions?.[i];
        return (
          <div key={node.id} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onJump(i)}
                className="flex flex-col items-start rounded-md bg-primary/10 px-2.5 py-1 text-left hover:bg-primary/15"
              >
                <span className="text-[9px] font-semibold uppercase tracking-wider text-primary/60">
                  {levelLabels[i] ?? `Level ${i + 1}`}
                </span>
                <span className="text-xs font-semibold text-primary">{node.name}</span>
              </button>
              {description && <InfoTooltip text={description} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CascadingPicker<T extends TreeItem>({
  items,
  path,
  onPathChange,
  levelLabels = [],
  levelDescriptions = [],
  renderIcon,
  getDescription,
  leading,
  emptyLabel = "Nothing here yet.",
}: {
  items: T[];
  path: T[];
  onPathChange: (path: T[]) => void;
  levelLabels?: string[];
  levelDescriptions?: string[];
  renderIcon?: (node: T) => ReactNode;
  getDescription?: (node: T) => string | undefined;
  leading?: BreadcrumbLeading;
  emptyLabel?: string;
}) {
  const rootChildren = items.filter((i) => !i.parentId && !i.parentCategoryId);

  const levels: { parentId: number | null; parentName?: string; children: T[] }[] = [
    { parentId: null, children: rootChildren },
  ];
  for (const node of path) {
    const children = items.filter((i) => (i.parentId ?? i.parentCategoryId) === node.id);
    if (children.length === 0) break;
    levels.push({ parentId: node.id, parentName: node.name, children });
  }

  const selectAt = (levelIndex: number, node: T) =>
    onPathChange([...path.slice(0, levelIndex), node]);

  const jumpTo = (levelIndex: number) => onPathChange(path.slice(0, levelIndex + 1));

  const nodeDescription = (node: T) => getDescription?.(node) || node.description;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid gap-4">
        <CategoryBreadcrumb
          path={path}
          levelLabels={levelLabels}
          onJump={jumpTo}
          leading={leading}
        />
        {levels.map((level, li) => {
          const accent = CATEGORY_LEVEL_ACCENTS[li % CATEGORY_LEVEL_ACCENTS.length];
          const selected = path[li];
          const headingHint = selected
            ? nodeDescription(selected) || CATEGORY_LEVEL_DESCRIPTIONS[li]
            : CATEGORY_LEVEL_DESCRIPTIONS[li];
          return (
            <div
              key={level.parentId ?? "root"}
              className="grid gap-2.5 border-l-2 border-border pl-4"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold">
                  {levelLabels[li] ?? `Level ${li + 1}`}
                </span>
                {headingHint && <InfoTooltip text={headingHint} />}
                {level.parentName && (
                  <span className="text-[11px] text-muted-foreground">
                    within {level.parentName}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {level.children.map((node) => {
                  const active = path.some((p) => p.id === node.id);
                  const branches = items.some(
                    (i) => (i.parentId ?? i.parentCategoryId) === node.id,
                  );
                  const description = nodeDescription(node);
                  return (
                    <div key={node.id} className="relative">
                      <button
                        type="button"
                        onClick={() => selectAt(li, node)}
                        className={cn(
                          "erp-card group relative w-full overflow-hidden p-3.5 text-left transition-all hover:border-primary/40",
                          active && "border-primary ring-2 ring-primary/20",
                        )}
                      >
                        <div
                          className={cn("absolute inset-0 bg-gradient-to-br opacity-80", accent)}
                        />
                        <div className="relative flex items-center gap-2.5 pr-5">
                          <div
                            className={cn(
                              "grid h-8 w-8 shrink-0 place-items-center rounded-md",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "border border-border bg-surface",
                            )}
                          >
                            {renderIcon?.(node) ??
                              (branches ? (
                                <FolderOpen className="h-4 w-4" />
                              ) : (
                                <Folder className="h-4 w-4" />
                              ))}
                          </div>
                          <span className="min-w-0 flex-1 truncate text-xs font-medium">
                            {node.name}
                          </span>
                          {active && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                        </div>
                      </button>
                      {description && (
                        <span className="absolute right-2 top-2 z-10">
                          <InfoTooltip text={description} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {level.children.length === 0 && (
                <p className="text-xs text-muted-foreground">{emptyLabel}</p>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

// ============================================================================
// STEP 1 — ASSET CLASS
// ============================================================================

interface Step1ClassProps {
  data: WizardData;
  set: (patch: Partial<WizardData>) => void;
  classes: AssetClassDto[];
  errors: Record<string, string>;
}

function Step1Class({ data, set, classes, errors }: Step1ClassProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Select Asset Class</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The top-level classification loaded from your system database.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {classes.map((c: AssetClassDto, i: number) => {
          const active = data.assetClassId === c.id;
          const Icon = classIcon(c.code);
          const accent = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
          return (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                set({ assetClassId: c.id, categoryPath: [], categoryId: null, extraAttributes: {} })
              }
              className={cn(
                "erp-card group relative overflow-hidden p-6 text-left transition-all hover:border-primary/50 hover:shadow-sm",
                active && "border-primary ring-2 ring-primary/20",
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", accent)} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-lg border",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {active && (
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-base font-semibold">{c.name}</div>
                {c.description && (
                  <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {errors.assetClassId && (
        <p className="mt-4 text-center text-sm text-destructive">{errors.assetClassId}</p>
      )}
    </div>
  );
}

// ============================================================================
// STEP 2 — DETAILS & ASSIGNMENT (WITH DIRECT LOCATION DROPDOWN)
// ============================================================================

interface Step2DetailsProps {
  data: WizardData;
  set: (patch: Partial<WizardData>) => void;
  setAttr: (code: string, value: string | string[]) => void;
  classes: AssetClassDto[];
  categories: AssetCategoryDto[];
  attributes: CategoryAttributeDto[];
  attributeOptions: CategoryAttributeOptionDto[];
  statuses: AssetStatusDto[];
  locations: LocationDto[];
  errors: Record<string, string>;
  onCategoryPathChange: (path: AssetCategoryDto[]) => void;
  onChangeClass: () => void;
}

function Step2Details({
  data,
  set,
  setAttr,
  classes,
  categories,
  attributes,
  attributeOptions,
  statuses,
  locations,
  errors,
  onCategoryPathChange,
  onChangeClass,
}: Step2DetailsProps) {
  const selectedClass = classes.find((c: AssetClassDto) => c.id === data.assetClassId);
  const classCategories = data.assetClassId
    ? categories.filter((c: AssetCategoryDto) => c.assetClassId === data.assetClassId)
    : [];
  const leafAttributes = data.categoryId
    ? attributes.filter((a: CategoryAttributeDto) => a.categoryId === data.categoryId)
    : [];

  // Pre-calculate hierarchical display paths for all locations for the single dropdown
  const locationDropdownOptions: LocationDropdownOption[] = locations.map(
    (loc: LocationDto): LocationDropdownOption => {
      const displayPath = buildLocationPath(loc, locations);
      const Icon = locationIcon(loc.locationType);
      return {
        id: loc.id,
        code: loc.code,
        name: loc.name,
        locationType: loc.locationType || "SITE",
        displayPath,
        icon: <Icon className="h-3.5 w-3.5" />,
      };
    },
  );

  const addAttachments = (files: FileList | null) => {
    if (!files) return;
    const added: Attachment[] = Array.from(files).map((f) => ({
      name: f.name,
      mimeType: f.type || "application/octet-stream",
      size: f.size,
    }));
    set({ attachments: [...data.attachments, ...added] });
  };
  const removeAttachment = (index: number) =>
    set({ attachments: data.attachments.filter((_: Attachment, i: number) => i !== index) });

  return (
    <div className="grid gap-6">
      {/* Category selection */}
      <Card title="Category" description="Root category, subcategory, and specific type">
        <CascadingPicker
          items={classCategories}
          path={data.categoryPath}
          onPathChange={onCategoryPathChange}
          levelLabels={CATEGORY_LEVEL_LABELS}
          levelDescriptions={CATEGORY_LEVEL_DESCRIPTIONS}
          emptyLabel="No categories configured at this level."
          leading={
            selectedClass
              ? { label: "Asset Class", name: selectedClass.name, onClick: onChangeClass }
              : undefined
          }
        />
        {errors.categoryId && (
          <p className="mt-3 text-[11px] text-destructive">{errors.categoryId}</p>
        )}
      </Card>

      {/* Core Identification */}
      <Card title="Identity" description="Core identifiers for this asset">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Asset Code" required error={errors.assetCode}>
            <Input
              className="font-mono"
              value={data.assetCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => set({ assetCode: e.target.value })}
            />
          </Field>
          <Field label="Asset Name" required error={errors.name}>
            <Input
              value={data.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => set({ name: e.target.value })}
              placeholder="e.g. ThinkPad T14 Gen 4"
            />
          </Field>
          <Field label="Ownership Type">
            <SearchSelect
              value={data.ownership}
              onChange={(v: string) => set({ ownership: v as Ownership })}
              options={OWNERSHIP_OPTIONS}
            />
          </Field>
          <Field label="Status" required error={errors.statusId}>
            <SearchSelect
              value={String(data.statusId ?? "")}
              onChange={(v: string) => set({ statusId: Number(v) })}
              options={statuses.map((s: AssetStatusDto) => ({
                label: s.name,
                value: String(s.id),
              }))}
            />
          </Field>
          <Field label="Description" helper="Notes and remarks visible across the asset register">
            <Textarea
              rows={3}
              value={data.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                set({ description: e.target.value })
              }
            />
          </Field>
        </div>
      </Card>

      {/* Dynamic Category Attributes */}
      {leafAttributes.length > 0 && (
        <Card
          title="Category Attributes"
          description="Dynamic specification fields defined for this exact category"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {leafAttributes.map((attr: CategoryAttributeDto) => (
              <Field
                key={attr.id}
                label={attr.name}
                required={attr.isRequired}
                error={errors[`attr_${attr.code}`]}
              >
                {renderAttributeField(
                  attr,
                  attributeOptions,
                  data.extraAttributes[attr.code],
                  (v) => setAttr(attr.code, v),
                )}
              </Field>
            ))}
          </div>
        </Card>
      )}

      {/* Assignment & DIRECT LOCATION DROPDOWN */}
      <Card
        title="Assignment & Location"
        description="Directly assign custodian, department, and location without cascading drilldown"
      >
        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          <Field label="Department">
            <SearchSelect
              value={data.departmentId}
              onChange={(v: string) => set({ departmentId: v })}
              options={DEPARTMENTS.map((d) => ({ label: d.name, value: d.id }))}
              placeholder="Select department"
            />
          </Field>
          <Field label="Custodian Employee">
            <SearchSelect
              value={data.custodianId}
              onChange={(v: string) => set({ custodianId: v })}
              options={CUSTODIANS.map((c) => ({ label: c.name, value: c.id }))}
              placeholder="Assign custodian"
            />
          </Field>
        </div>

        {/* SINGLE LOCATION DROPDOWN */}
        <Field
          label="Current Location"
          required
          error={errors.currentLocationId}
          helper="Choose the direct operational site, building, floor, or room"
        >
          <Select
            value={data.currentLocationId ? String(data.currentLocationId) : undefined}
            onValueChange={(val) => set({ currentLocationId: Number(val) })}
          >
            <SelectTrigger className="w-full h-10 bg-surface">
              <SelectValue placeholder="Select location from dropdown…" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {locationDropdownOptions.map((loc: LocationDropdownOption) => (
                <SelectItem key={String(loc.id)} value={String(loc.id)}>
                  <div className="flex items-center gap-2 py-0.5">
                    <span className="text-muted-foreground">{loc.icon}</span>
                    <span className="font-medium text-xs">{loc.displayPath}</span>
                    <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {loc.locationType}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Card>

      {/* Attachments */}
      <Card title="Attachments" description="Documentation, manuals, and warranty certificates">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface-muted/40 px-4 py-6 text-center hover:border-primary/40 hover:bg-accent/40">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Drop files or click to browse</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => addAttachments(e.target.files)}
          />
        </label>
        {data.attachments.length > 0 && (
          <ul className="mt-4 grid gap-2">
            {data.attachments.map((file: Attachment, i: number) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-xs"
              >
                <span className="flex items-center gap-2 truncate">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function renderAttributeField(
  attr: CategoryAttributeDto,
  allOptions: CategoryAttributeOptionDto[],
  value: string | string[] | undefined,
  onChange: (v: string | string[]) => void,
) {
  const options =
    attr.options && attr.options.length > 0
      ? attr.options
      : allOptions.filter((o) => o.attributeId === attr.id);

  const typeStr =
    typeof attr.dataType === "number"
      ? ([
          "TEXT",
          "INTEGER",
          "DECIMAL",
          "BOOLEAN",
          "DATE",
          "DATETIME",
          "SELECT",
          "MULTISELECT",
          "JSON",
        ][attr.dataType] ?? "TEXT")
      : String(attr.dataType).toUpperCase();

  switch (typeStr) {
    case "SELECT":
      return (
        <SearchSelect
          value={(value as string) ?? ""}
          onChange={onChange}
          options={options.map((o) => ({ label: o.label, value: o.value }))}
        />
      );
    case "MULTISELECT": {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const active = selected.includes(o.value);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() =>
                  onChange(active ? selected.filter((v) => v !== o.value) : [...selected, o.value])
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground hover:border-primary/40",
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      );
    }
    case "BOOLEAN":
      return (
        <Switch
          checked={value === "true" || value === "True"}
          onCheckedChange={(v) => onChange(String(v))}
        />
      );
    case "DATE":
      return (
        <Input
          type="date"
          value={(value as string) ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
      );
    case "DATETIME":
      return (
        <Input
          type="datetime-local"
          value={(value as string) ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
      );
    case "INTEGER":
      return (
        <Input
          type="number"
          step={1}
          value={(value as string) ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
      );
    case "DECIMAL":
      return (
        <Input
          type="number"
          step={0.01}
          value={(value as string) ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
      );
    case "JSON":
      return (
        <Textarea
          rows={3}
          className="font-mono text-xs"
          placeholder="{}"
          value={(value as string) ?? ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        />
      );
    default:
      return (
        <Input
          value={(value as string) ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
      );
  }
}

// ============================================================================
// STEP 3 — ACQUISITION & DEPRECIATION
// ============================================================================

interface Step3AcquisitionProps {
  data: WizardData;
  set: (patch: Partial<WizardData>) => void;
  currencies: CurrencyDto[];
  depreciationMethods: DepreciationMethodDto[];
  errors: Record<string, string>;
}

function Step3Acquisition({
  data,
  set,
  currencies,
  depreciationMethods,
  errors,
}: Step3AcquisitionProps) {
  return (
    <div className="grid gap-6">
      <Card
        title="Acquisition Details"
        description="Initial purchase value and supplier referencing"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Acquisition Date" required error={errors.acquisitionDate}>
            <Input
              type="date"
              value={data.acquisitionDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                set({ acquisitionDate: e.target.value })
              }
            />
          </Field>
          <Field label="Acquisition Cost" required error={errors.acquisitionCost}>
            <div className="flex gap-2">
              <Select value={data.currencyCode} onValueChange={(v) => set({ currencyCode: v })}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c: CurrencyDto) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} ({c.symbol ?? c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                step={0.01}
                className="flex-1 tabular-nums"
                value={data.acquisitionCost}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  set({ acquisitionCost: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          </Field>
          <Field label="Acquisition Type">
            <SearchSelect
              value={data.acquisitionType}
              onChange={(v: string) => set({ acquisitionType: v as AcquisitionType })}
              options={ACQUISITION_TYPE_OPTIONS}
            />
          </Field>
          <Field label="Supplier">
            <SearchSelect
              value={data.supplierId}
              onChange={(v: string) => set({ supplierId: v })}
              options={SUPPLIERS.map((s) => ({ label: s.name, value: s.id }))}
              placeholder="Search supplier"
            />
          </Field>
          <Field label="Purchase Reference" helper="PO number, invoice number, or contract ID">
            <Input
              value={data.purchaseReference}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                set({ purchaseReference: e.target.value })
              }
              placeholder="e.g. PO-2026-00421"
            />
          </Field>
          <Field label="Warranty Expiry Date">
            <Input
              type="date"
              value={data.warrantyExpiryDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                set({ warrantyExpiryDate: e.target.value })
              }
            />
          </Field>
        </div>
      </Card>

      <Card title="Depreciation Schedule" description="Automated amortization parameters">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Depreciation Method">
            <SearchSelect
              value={String(data.depreciationMethodId ?? "")}
              onChange={(v: string) => set({ depreciationMethodId: v ? Number(v) : null })}
              options={depreciationMethods.map((m: DepreciationMethodDto) => ({
                label: m.name,
                value: String(m.id),
              }))}
            />
          </Field>
          <Field label="Useful Life (months)">
            <Input
              type="number"
              min="0"
              value={data.usefulLifeMonths}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                set({ usefulLifeMonths: e.target.value })
              }
              placeholder="36"
            />
          </Field>
          <Field label="Salvage Value" helper={`In ${data.currencyCode}`}>
            <Input
              type="number"
              step={0.01}
              value={data.salvageValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => set({ salvageValue: e.target.value })}
              placeholder="0.00"
            />
          </Field>
          <Field label="Schedule Start Date">
            <Input
              type="date"
              value={data.depreciationStartDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                set({ depreciationStartDate: e.target.value })
              }
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// STEP 4 — REVIEW
// ============================================================================

interface Step4ReviewProps {
  data: WizardData;
  classes: AssetClassDto[];
  statuses: AssetStatusDto[];
  currencies: CurrencyDto[];
  depreciationMethods: DepreciationMethodDto[];
  locations: LocationDto[];
  attributes: CategoryAttributeDto[];
  onEdit: (stepIndex: number) => void;
}

function Step4Review({
  data,
  classes,
  statuses,
  currencies,
  depreciationMethods,
  locations,
  attributes,
  onEdit,
}: Step4ReviewProps) {
  const cls = classes.find((c: AssetClassDto) => c.id === data.assetClassId);
  const ClassIcon = cls ? classIcon(cls.code) : Box;
  const categoryTrail = data.categoryPath.map((c: AssetCategoryDto) => c.name).join(" › ");

  const selectedLoc = locations.find((l: LocationDto) => l.id === data.currentLocationId);
  const locationTrail = selectedLoc ? buildLocationPath(selectedLoc, locations) : "—";

  const status = statuses.find((s: AssetStatusDto) => s.id === data.statusId);
  const currency = currencies.find((c: CurrencyDto) => c.code === data.currencyCode);
  const depreciationMethod = depreciationMethods.find(
    (m: DepreciationMethodDto) => m.id === data.depreciationMethodId,
  );
  const leafAttributes = data.categoryId
    ? attributes.filter((a: CategoryAttributeDto) => a.categoryId === data.categoryId)
    : [];

  return (
    <div className="grid gap-6">
      <div className="erp-card flex items-center gap-4 p-6 bg-surface-muted/30">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <ClassIcon className="h-7 w-7" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {cls?.name} / {categoryTrail}
          </div>
          <div className="mt-1 text-xl font-bold">{data.name}</div>
          <div className="mt-1 font-mono text-sm text-muted-foreground">{data.assetCode}</div>
        </div>
      </div>

      <ReviewSection title="Classification" onEdit={() => onEdit(0)}>
        <ReviewRow label="Asset Class" value={cls?.name} />
        <ReviewRow label="Category" value={categoryTrail} />
        {leafAttributes.map((attr: CategoryAttributeDto) => {
          const value = data.extraAttributes[attr.code];
          return (
            <ReviewRow
              key={attr.id}
              label={attr.name}
              value={Array.isArray(value) ? value.join(", ") : value}
            />
          );
        })}
      </ReviewSection>

      <ReviewSection title="Identity & Assignment" onEdit={() => onEdit(1)}>
        <ReviewRow label="Ownership" value={data.ownership} />
        <ReviewRow label="Status" value={status?.name} />
        <ReviewRow
          label="Department"
          value={DEPARTMENTS.find((d) => d.id === data.departmentId)?.name}
        />
        <ReviewRow
          label="Custodian"
          value={CUSTODIANS.find((c) => c.id === data.custodianId)?.name}
        />
        <ReviewRow label="Location" value={locationTrail} />
        <ReviewRow
          label="Attachments"
          value={data.attachments.length ? `${data.attachments.length} file(s)` : ""}
        />
        <ReviewRow label="Description" value={data.description} span />
      </ReviewSection>

      <ReviewSection title="Acquisition" onEdit={() => onEdit(2)}>
        <ReviewRow label="Date" value={data.acquisitionDate} />
        <ReviewRow
          label="Cost"
          value={
            data.acquisitionCost
              ? `${currency?.symbol ?? data.currencyCode} ${data.acquisitionCost}`
              : ""
          }
        />
        <ReviewRow
          label="Type"
          value={ACQUISITION_TYPE_OPTIONS.find((o) => o.value === data.acquisitionType)?.label}
        />
        <ReviewRow label="Supplier" value={SUPPLIERS.find((s) => s.id === data.supplierId)?.name} />
        <ReviewRow label="Purchase Reference" value={data.purchaseReference} />
        <ReviewRow label="Warranty Expiry" value={data.warrantyExpiryDate} />
      </ReviewSection>

      <ReviewSection title="Depreciation Schedule" onEdit={() => onEdit(2)}>
        <ReviewRow label="Method" value={depreciationMethod?.name} />
        <ReviewRow
          label="Useful Life"
          value={data.usefulLifeMonths ? `${data.usefulLifeMonths} months` : ""}
        />
        <ReviewRow
          label="Salvage Value"
          value={
            data.salvageValue ? `${currency?.symbol ?? data.currencyCode} ${data.salvageValue}` : ""
          }
        />
        <ReviewRow label="Start Date" value={data.depreciationStartDate} />
      </ReviewSection>
    </div>
  );
}

interface ReviewSectionProps {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}

function ReviewSection({ title, onEdit, children }: ReviewSectionProps) {
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
      <dd className={cn("text-sm", !value && "text-muted-foreground italic")}>{value || "—"}</dd>
    </div>
  );
}

// ============================================================================
// SHARED UI COMPONENTS
// ============================================================================

interface CardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, action, children }: CardProps) {
  return (
    <section className="erp-card p-6">
      <header className="mb-5 flex items-start justify-between">
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

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: ReactNode;
}

function Field({ label, required, error, helper, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium">
        {label} {required && <span className="text-destructive">*</span>}
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

function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder ?? "Select…"} />
      </SelectTrigger>
      <SelectContent>
        {options
          .filter((o) => Boolean(o.value))
          .map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

function Stepper({
  current,
  steps,
  onJump,
  subLabels = [],
}: {
  current: number;
  steps: string[];
  onJump: (i: number) => void;
  subLabels?: (string | undefined)[];
}) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const subLabel = subLabels[i];
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
              <span className="hidden flex-col sm:flex">
                <span
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
                {subLabel && (
                  <span className="max-w-[140px] truncate text-[10px] text-primary/80">
                    {subLabel}
                  </span>
                )}
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

function SuccessScreen({ data, onDone }: { data: WizardData; onDone: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">Asset Successfully Registered</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-mono font-medium">{data.assetCode}</span> has been written to the
        central database.
      </p>
      <Button onClick={onDone} className="mt-8">
        Go to Asset Register <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    </div>
  );
}
