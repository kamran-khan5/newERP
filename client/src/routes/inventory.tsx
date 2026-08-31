import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory · GDA ERP" }] }),
  component: () => (
    <ComingSoon
      module="Inventory"
      description="Multi-warehouse stock control with real-time visibility, cycle counts and lot / serial tracking."
      features={[
        "Multi-warehouse & multi-bin storage",
        "Lot, batch and serial number traceability",
        "Cycle counting and physical inventory",
        "Reorder points, min/max & MRP signals",
        "Landed cost & valuation methods",
        "Barcode / RFID mobile picking",
      ]}
    />
  ),
});
