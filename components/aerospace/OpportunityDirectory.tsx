"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Audience, Opportunity } from "@/data/opportunities";

const FILTERS: { value: Audience; label: string }[] = [
  { value: "everyone", label: "Everyone" },
  { value: "kids", label: "Kids & families" },
  { value: "students", label: "Students" },
  { value: "job-seekers", label: "Job seekers" },
  { value: "educators", label: "Educators" },
];

const CATEGORY_LABEL: Record<Opportunity["category"], string> = {
  visit: "Visit",
  event: "Event",
  job: "Job",
  internship: "Internship",
  education: "Scholarship / education",
};

export function OpportunityDirectory({ opportunities }: { opportunities: Opportunity[] }) {
  const [audience, setAudience] = useState<Audience>("everyone");

  const filtered =
    audience === "everyone"
      ? opportunities
      : opportunities.filter((o) => o.audience.includes(audience));

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by audience">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={audience === f.value}
            onClick={() => setAudience(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              audience === f.value
                ? "bg-ocean-500 text-sand-50"
                : "bg-sand-100 text-ocean-700 hover:bg-sand-200 dark:bg-ocean-700 dark:text-sand-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((o) => (
          <Card key={o.id} className="flex flex-col">
            <Badge>{CATEGORY_LABEL[o.category]}</Badge>
            <h3 className="mt-3 text-lg font-bold text-ocean-800 dark:text-sand-50">
              {o.title}
            </h3>
            <p className="text-sm font-medium text-ocean-500">{o.orgName}</p>
            <p className="mt-2 flex-1 text-sm text-ocean-700 dark:text-sand-100">
              {o.description}
            </p>
            <a
              href={o.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm font-semibold text-coral-500 hover:underline"
            >
              Learn more →
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
