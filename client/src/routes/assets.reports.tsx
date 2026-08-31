import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";

export const Route = createFileRoute("/assets/reports")({
  head: () => ({ meta: [{ title: "Asset Reports · GDA ERP" }] }),
  component: ReportsPage,
});

const REPORTS = [
  { name: "Asset Register", desc: "Complete list of all assets with current status." },
  { name: "Asset Valuation", desc: "Book value, market value & impairment overview." },
  { name: "Depreciation", desc: "Period-wise depreciation posting and forecast." },
  { name: "Maintenance Cost", desc: "Preventive & corrective spend by asset & site." },
  { name: "Insurance Expiry", desc: "Policies expiring in the next 30/60/90 days." },
  { name: "Warranty Expiry", desc: "Assets going out of warranty by period." },
  { name: "Asset Audit", desc: "Physical verification exceptions & reconciliation." },
  { name: "Disposal Report", desc: "Retired assets with gain/loss on disposal." },
  { name: "Movement Report", desc: "Inter-location & inter-department transfers." },
];

function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Enterprise-grade reporting across the asset base"
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileText className="mr-1.5 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-1.5 h-4 w-4" />
              Export Excel
            </Button>
          </>
        }
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPORTS.map((r) => (
            <div
              key={r.name}
              className="erp-card group flex flex-col p-5 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">Generated on demand</div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
                  Excel
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto h-8">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
