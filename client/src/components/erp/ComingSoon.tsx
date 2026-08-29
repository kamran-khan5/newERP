import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageBody, PageHeader } from "./ErpLayout";

export function ComingSoon({
  module,
  description,
  features,
  eta = "Q3 2026",
}: {
  module: string;
  description: string;
  features: string[];
  eta?: string;
}) {
  return (
    <>
      <PageHeader
        title={module}
        description={description}
        actions={
          <Badge variant="secondary" className="gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            In development · {eta}
          </Badge>
        }
      />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="erp-card p-8">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Coming to Meridian ERP
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              A first-class {module} module —{" "}
              <span className="text-muted-foreground">built to scale.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {description} It's being designed alongside the Assets module using the same
              enterprise data model, so master data, permissions, and reports stay consistent across
              the suite.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/assets">
                  Explore Assets module
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline">Request early access</Button>
            </div>
          </div>

          <div className="erp-card p-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Planned capabilities
            </div>
            <ul className="mt-4 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageBody>
    </>
  );
}
