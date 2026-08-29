import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/procurement")({
  head: () => ({ meta: [{ title: "Procurement · Meridian ERP" }] }),
  component: () => (
    <ComingSoon
      module="Procurement"
      description="Source-to-pay workflows with requisitions, RFQs, purchase orders, vendor scorecards and 3-way matching."
      features={[
        "Requisitions & approval workflows",
        "RFQ / tender & vendor bidding",
        "Purchase orders with 3-way match",
        "Supplier master & performance scoring",
        "Contracts & catalog management",
        "Spend analytics dashboards",
      ]}
    />
  ),
});
