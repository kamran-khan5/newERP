import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/hr")({
  head: () => ({ meta: [{ title: "Human Resources · Meridian ERP" }] }),
  component: () => (
    <ComingSoon
      module="Human Resources"
      description="Manage the entire employee lifecycle — from hire to retire — with org charts, positions, leave, performance and learning."
      features={[
        "Employee master with positions & org hierarchy",
        "Leave, attendance and time-off policies",
        "Performance reviews & goal cascading",
        "Learning management & certifications",
        "Recruitment pipeline & onboarding checklists",
        "Employee self-service portal",
      ]}
    />
  ),
});
