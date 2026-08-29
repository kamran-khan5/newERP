// Mock ERP data for the Assets module.
export type AssetCategory = "physical" | "inventory" | "financial" | "intangible";

export type Asset = {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  subCategory: string;
  type: string;
  department: string;
  custodian: string;
  location: string;
  status: "In Use" | "Under Maintenance" | "Idle" | "Disposed" | "Reserved";
  purchaseValue: number;
  bookValue: number;
  purchaseDate: string;
  warrantyExpiry?: string;
  insuranceExpiry?: string;
  lastAudit?: string;
};

const first = (arr: string[], i: number) => arr[i % arr.length];

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

const physicalSub = [
  "Property",
  "Plant",
  "Equipment",
  "Vehicles",
  "Furniture & Fixtures",
  "Infrastructure",
];
const inventorySub = [
  "Raw Materials",
  "Work In Progress",
  "Finished Goods",
  "Scrap & Obsolete",
  "Free Of Cost",
];
const financialSub = ["Cash", "Investments", "Receivables"];
const intangibleSub = ["Software Licenses", "Digital Assets", "Intellectual Property", "Goodwill"];

// Deterministic pseudo-random so SSR and client render identical values.
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function makeAssets(): Asset[] {
  const out: Asset[] = [];
  const push = (
    cat: AssetCategory,
    subs: string[],
    prefix: string,
    baseValue: number,
    count: number,
  ) => {
    for (let i = 0; i < count; i++) {
      const sub = subs[i % subs.length];
      const seedBase = out.length;
      const val = Math.round(baseValue * (0.4 + seeded(seedBase + 1) * 3.5));
      out.push({
        id: `${prefix}-${1000 + out.length}`,
        code: `${prefix}-${(1000 + i).toString()}`,
        name: `${sub} ${["Alpha", "Beta", "Delta", "Omega", "Sigma", "Prime"][i % 6]} ${i + 1}`,
        category: cat,
        subCategory: sub,
        type: sub,
        department: first(departments, i + 1),
        custodian: first(custodians, i + 2),
        location: first(locations, i),
        status: (
          [
            "In Use",
            "In Use",
            "In Use",
            "Under Maintenance",
            "Idle",
            "Reserved",
          ] as Asset["status"][]
        )[i % 6],
        purchaseValue: val,
        bookValue: Math.round(val * (0.35 + seeded(seedBase + 2) * 0.6)),
        purchaseDate: `20${20 + (i % 5)}-0${1 + (i % 9)}-1${i % 9}`,
        warrantyExpiry: cat === "physical" ? `2026-0${1 + (i % 9)}-15` : undefined,
        insuranceExpiry: cat === "physical" ? `2026-1${i % 3}-01` : undefined,
        lastAudit: `2025-1${i % 3}-2${i % 9}`,
      });
    }
  };
  push("physical", physicalSub, "PHY", 42000, 34);
  push("inventory", inventorySub, "INV", 8500, 22);
  push("financial", financialSub, "FIN", 120000, 12);
  push("intangible", intangibleSub, "INT", 26000, 14);
  return out;
}

export const assets: Asset[] = makeAssets();

export const categoryLabels: Record<AssetCategory, string> = {
  physical: "Physical Assets",
  inventory: "Inventory Assets",
  financial: "Financial Assets",
  intangible: "Intangible Assets",
};

export const subCategoriesByCategory: Record<AssetCategory, string[]> = {
  physical: physicalSub,
  inventory: inventorySub,
  financial: financialSub,
  intangible: intangibleSub,
};

export function fmtCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
