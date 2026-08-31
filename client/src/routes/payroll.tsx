import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
export const Route = createFileRoute("/payroll")({
  head: () => ({ meta: [{ title: "Payroll · GDA ERP" }] }),
  component: () => (
    <ComingSoon
      module="Payroll"
      description="Country-specific payroll engines with statutory compliance, payslips and GL integration."
      features={[
        "Configurable pay elements & formulas",
        "Country-specific statutory compliance",
        "Bulk payroll runs with approvals",
        "Employee payslips & tax certificates",
        "Bank file & WPS generation",
        "Automatic GL & cost-center posting",
      ]}
    />
  ),
});
