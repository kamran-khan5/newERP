import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/erp/ErpLayout";
import { Building2, Bell, Palette, KeyRound, Globe2, Users } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Meridian ERP" }] }),
  component: SettingsPage,
});

const GROUPS = [
  { icon: Building2, name: "Company profile", desc: "Legal entities, addresses, tax IDs." },
  { icon: Users, name: "Users & roles", desc: "Manage access and responsibilities." },
  { icon: Bell, name: "Notifications", desc: "Choose which events reach your inbox." },
  { icon: Palette, name: "Appearance", desc: "Density, theme and default landing page." },
  { icon: Globe2, name: "Regional", desc: "Language, timezone, number & date formats." },
  { icon: KeyRound, name: "Security", desc: "Password policy, SSO, MFA & session limits." },
];

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Personal and organization-wide preferences" />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <button
              key={g.name}
              className="erp-card group flex items-start gap-4 p-5 text-left transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                <g.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{g.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{g.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </PageBody>
    </>
  );
}
