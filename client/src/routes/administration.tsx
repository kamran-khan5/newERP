import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/administration")({
  head: () => ({ meta: [{ title: "Administration · Meridian ERP" }] }),
  component: () => (
    <ComingSoon
      module="Administration"
      description="System-wide governance: users, roles, approval workflows, audit logs and integration endpoints."
      features={[
        "Users, roles and permission matrix",
        "Approval workflow designer",
        "Audit log & change history",
        "Integration & API gateway",
        "Data import / export tools",
        "System health monitoring",
      ]}
    />
  ),
});
