import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM · GDA ERP" }] }),
  component: () => (
    <ComingSoon
      module="CRM"
      description="Manage accounts, contacts, leads and opportunities with a 360° customer view that feeds Sales and Finance."
      features={[
        "Account & contact master with hierarchy",
        "Lead scoring & routing rules",
        "Opportunity pipeline & forecasting",
        "Activity timeline & email sync",
        "Cases & service SLAs",
        "Marketing campaign tracking",
      ]}
    />
  ),
});
