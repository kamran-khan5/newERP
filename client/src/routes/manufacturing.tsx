import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/manufacturing")({
  head: () => ({ meta: [{ title: "Manufacturing · Meridian ERP" }] }),
  component: () => (
    <ComingSoon
      module="Manufacturing"
      description="Plan and execute production with BOMs, routings, MRP, shop-floor control and quality management."
      features={[
        "Bill of materials & routings",
        "MRP, MPS and capacity planning",
        "Work orders & shop-floor terminal",
        "Quality inspections & non-conformance",
        "Machine OEE & downtime tracking",
        "Product costing & variance analysis",
      ]}
    />
  ),
});
