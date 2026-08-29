import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects · Meridian ERP" }] }),
  component: () => (
    <ComingSoon
      module="Projects"
      description="Deliver projects on time and on budget with WBS, resource planning, timesheets and revenue milestones."
      features={[
        "Work breakdown structure & Gantt",
        "Resource planning & utilization",
        "Timesheets & expense capture",
        "Milestone-based billing",
        "Project P&L and earned value",
        "Client portal & document collaboration",
      ]}
    />
  ),
});
