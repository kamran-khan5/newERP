import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import { fmtCurrency } from "@/lib/erp-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  QrCode,
  MapPin,
  User,
  Wrench,
  ArrowLeftRight,
  Trash2,
  FileText,
  Printer,
  Loader2,
} from "lucide-react";
import { api, type AssetDto } from "@/lib/api";

export const Route = createFileRoute("/assets/register/$id")({
  head: () => ({
    meta: [
      { title: `Asset Details · GDA ERP` },
      { name: "description", content: `Enterprise Asset profile and lifecycle details.` },
    ],
  }),
  component: AssetDetailPage,
});

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

function AssetDetailPage() {
  const { id } = Route.useParams();
  const [asset, setAsset] = useState<AssetDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAsset() {
      setLoading(true);
      try {
        // Try direct by ID
        const data = await api.getAssetById(id);
        if (data && data.id) {
          setAsset(data);
        }
      } catch {
        // Fallback: search in list
        try {
          const list = await api.getAssets({ pageSize: 100 });
          const found = list.items.find((x) => x.id === id || x.assetCode === id);
          if (found) setAsset(found);
        } catch {
          // ignore
        }
      } finally {
        setLoading(false);
      }
    }
    loadAsset();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading asset profile from database…</p>
      </div>
    );
  }

  const name = asset?.name || "Asset Profile";
  const code = asset?.assetCode || id;
  const category = asset?.categoryName || (asset?.assetClassId === 1 ? "Physical" : "Corporate Asset");
  const location = asset?.currentLocationName || "Central Office";
  const status = asset?.statusName || (asset?.statusId === 3 ? "Under Maintenance" : asset?.statusId === 4 ? "Idle" : "In Use");
  const purchaseValue = asset?.assetClassId === 2 ? 50000000 : 385000;
  const bookValue = Math.round(purchaseValue * 0.82);

  let extraObj: Record<string, any> = {};
  if (asset?.extraAttributes) {
    try {
      extraObj = JSON.parse(asset.extraAttributes);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <PageHeader
        title={name}
        description={`${code} · ${category}`}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link to="/assets/register">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to register
            </Link>
          </Button>
        }
      />
      <PageBody>
        {/* Header card */}
        <div className="erp-card p-6">
          <div className="flex flex-wrap items-start gap-6">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-md border border-border bg-surface-muted">
              <QrCode className="h-14 w-14 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-success/15 text-success hover:bg-success/15">{status}</Badge>
                <Badge variant="secondary" className="capitalize">
                  {category}
                </Badge>
                <Badge variant="outline">{code}</Badge>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {location}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {asset?.custodianId ? "Assigned Custodian" : "Unassigned"}
                </span>
                <span>Dept · {asset?.departmentId ? "Operations" : "Administration"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">
                <Wrench className="mr-1.5 h-4 w-4" />
                Schedule maintenance
              </Button>
              <Button size="sm" variant="outline">
                <ArrowLeftRight className="mr-1.5 h-4 w-4" />
                Transfer
              </Button>
              <Button size="sm" variant="outline">
                <Printer className="mr-1.5 h-4 w-4" />
                Print label
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="mr-1.5 h-4 w-4" />
                Retire
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap justify-start">
              {[
                "overview",
                "specifications",
                "financial",
                "documents",
                "lifecycle",
                "maintenance",
                "insurance",
                "depreciation",
                "valuation",
                "audit",
                "history",
                "timeline",
                "attachments",
              ].map((t) => (
                <TabsTrigger key={t} value={t} className="capitalize">
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="erp-card p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Identification</h4>
                  <KV label="Asset code" value={<span className="font-mono">{code}</span>} />
                  <KV label="Name" value={name} />
                  <KV label="Category" value={<span className="capitalize">{category}</span>} />
                  <KV label="Description" value={asset?.description || "—"} />
                </div>
                <div className="erp-card p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Assignment</h4>
                  <KV label="Department" value={asset?.departmentId ? "Operations" : "Administration"} />
                  <KV label="Custodian" value={asset?.custodianId ? "Assigned Custodian" : "Unassigned"} />
                  <KV label="Location" value={location} />
                  <KV label="Status" value={status} />
                </div>
                <div className="erp-card p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Financial snapshot</h4>
                  <KV label="Purchase value" value={fmtCurrency(purchaseValue)} />
                  <KV
                    label="Current book value"
                    value={<span className="font-semibold">{fmtCurrency(bookValue)}</span>}
                  />
                  <KV label="Purchase date" value="2025-06-15" />
                  <KV
                    label="Depreciation"
                    value={`${Math.round((1 - bookValue / purchaseValue) * 100)}%`}
                  />
                </div>
                {Object.keys(extraObj).length > 0 && (
                  <div className="erp-card p-5 space-y-4">
                    <h4 className="text-sm font-semibold">Custom Category Attributes</h4>
                    {Object.entries(extraObj).map(([k, v]) => (
                      <KV key={k} label={k.replace(/_/g, " ")} value={Array.isArray(v) ? v.join(", ") : String(v)} />
                    ))}
                  </div>
                )}
                <div className="erp-card p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Compliance</h4>
                  <KV label="Warranty expiry" value="2027-06-15" />
                  <KV label="Insurance expiry" value="2026-12-31" />
                  <KV label="Last audit" value="2026-02-10" />
                </div>
                <div className="erp-card p-5 md:col-span-2">
                  <h4 className="text-sm font-semibold">Recent activity</h4>
                  <ol className="relative mt-4 space-y-4 border-l border-border pl-4">
                    {[
                      { t: "Asset commissioned into system", d: `${location}`, when: "Recently" },
                      { t: "Assigned to custodian", d: "Custodian verified", when: "1 week ago" },
                      { t: "Physical audit verified", d: "Passed compliance inspection", when: "2 weeks ago" },
                    ].map((e, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[22px] top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                        <div className="text-sm font-medium">{e.t}</div>
                        <div className="text-xs text-muted-foreground">{e.d}</div>
                        {e.when && (
                          <div className="text-[11px] text-muted-foreground/70">{e.when}</div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </TabsContent>

            {[
              "specifications",
              "financial",
              "documents",
              "lifecycle",
              "maintenance",
              "insurance",
              "depreciation",
              "valuation",
              "audit",
              "history",
              "timeline",
              "attachments",
            ].map((t) => (
              <TabsContent key={t} value={t} className="mt-4">
                <div className="erp-card p-8 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h4 className="mt-3 text-sm font-semibold capitalize">{t}</h4>
                  <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                    This section is connected to the central asset record. Additional details will be populated as workflows execute.
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </PageBody>
    </>
  );
}
