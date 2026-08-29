import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "Finance · Meridian ERP" }] }),
  component: () => (
    <ComingSoon
      module="Finance"
      description="Multi-entity general ledger, accounts payable & receivable, treasury and consolidated financial reporting."
      features={[
        "Multi-entity, multi-currency general ledger",
        "AP / AR with intelligent invoice capture",
        "Bank reconciliation & cash management",
        "Budgets, forecasts and variance analysis",
        "Tax engine (VAT, GST, WHT)",
        "IFRS & GAAP-ready financial statements",
      ]}
    />
  ),
});
