import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [{ title: "Sales · Meridian ERP" }] }),
  component: () => (
    <ComingSoon
      module="Sales"
      description="Quote-to-cash covering quotations, sales orders, shipments, invoicing and revenue recognition."
      features={[
        "Quotations & configurable pricing",
        "Sales orders with credit checks",
        "Shipments & delivery scheduling",
        "Invoicing & revenue recognition",
        "Returns, RMA & credit notes",
        "Sales analytics & commissions",
      ]}
    />
  ),
});
