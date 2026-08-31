import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import { assets, fmtCurrency } from "@/lib/erp-data";
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
} from "lucide-react";

export const Route = createFileRoute("/assets/register/$id")({
  loader: ({ params }) => {
    const a = assets.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return { asset: a };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.asset.name ?? "Asset"} · GDA ERP` },
      { name: "description", content: `Details for asset ${loaderData?.asset.code ?? ""}.` },
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
  const { asset: a } = Route.useLoaderData();
  return (
    <>
      <PageHeader
        title={a.name}
        description={`${a.code} · ${a.subCategory}`}
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
                <Badge className="bg-success/15 text-success hover:bg-success/15">{a.status}</Badge>
                <Badge variant="secondary" className="capitalize">
                  {a.category}
                </Badge>
                <Badge variant="outline">{a.type}</Badge>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{a.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {a.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {a.custodian}
                </span>
                <span>Dept · {a.department}</span>
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
                  <KV label="Asset code" value={<span className="font-mono">{a.code}</span>} />
                  <KV label="Name" value={a.name} />
                  <KV label="Category" value={<span className="capitalize">{a.category}</span>} />
                  <KV label="Sub-category" value={a.subCategory} />
                </div>
                <div className="erp-card p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Assignment</h4>
                  <KV label="Department" value={a.department} />
                  <KV label="Custodian" value={a.custodian} />
                  <KV label="Location" value={a.location} />
                  <KV label="Status" value={a.status} />
                </div>
                <div className="erp-card p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Financial snapshot</h4>
                  <KV label="Purchase value" value={fmtCurrency(a.purchaseValue)} />
                  <KV
                    label="Current book value"
                    value={<span className="font-semibold">{fmtCurrency(a.bookValue)}</span>}
                  />
                  <KV label="Purchase date" value={a.purchaseDate} />
                  <KV
                    label="Depreciation"
                    value={`${Math.round((1 - a.bookValue / a.purchaseValue) * 100)}%`}
                  />
                </div>
                <div className="erp-card p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Compliance</h4>
                  <KV label="Warranty expiry" value={a.warrantyExpiry ?? "—"} />
                  <KV label="Insurance expiry" value={a.insuranceExpiry ?? "—"} />
                  <KV label="Last audit" value={a.lastAudit ?? "—"} />
                </div>
                <div className="erp-card p-5 md:col-span-2">
                  <h4 className="text-sm font-semibold">Recent activity</h4>
                  <ol className="relative mt-4 space-y-4 border-l border-border pl-4">
                    {[
                      { t: "Custodian assigned", d: `${a.custodian}`, when: "3 days ago" },
                      { t: "Transferred to location", d: `${a.location}`, when: "2 weeks ago" },
                      {
                        t: "Maintenance completed",
                        d: "Scheduled service · $420",
                        when: "1 month ago",
                      },
                      {
                        t: "Acquired",
                        d: `${fmtCurrency(a.purchaseValue)} on ${a.purchaseDate}`,
                        when: "",
                      },
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
                    This section is part of the asset profile. It will surface the {t} records tied
                    to this asset once data flows are connected.
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
