import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import {
  AssetConfiguration,
  type ConfigSection,
} from "@/components/erp/configuration/AssetConfiguration";

const sections: ConfigSection[] = [
  "classes",
  "categories",
  "attributes",
  "statuses",
  "locations",
  "currencies",
  "depreciation",
  "lifecycle",
];

export const Route = createFileRoute("/assets/configuration")({
  head: () => ({ meta: [{ title: "Asset Configuration · GDA ERP" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    section:
      typeof search.section === "string" && sections.includes(search.section as ConfigSection)
        ? (search.section as ConfigSection)
        : "classes",
  }),
  component: ConfigurationPage,
});

function ConfigurationPage() {
  const search = useSearch({ from: "/assets/configuration" });
  const section = useMemo(() => search.section as ConfigSection, [search.section]);
  const navigate = useNavigate({ from: "/assets/configuration" });
  return (
    <>
      <PageHeader
        title="Configuration"
        description="Manage the master data that powers Asset Management and the Registration Wizard."
      />
      <PageBody>
        <AssetConfiguration
          section={section}
          onSectionChange={(next) => void navigate({ search: { section: next } })}
        />
      </PageBody>
    </>
  );
}
