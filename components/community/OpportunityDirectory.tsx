"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Audience, Opportunity } from "@/data/opportunities";

const AUDIENCE_FILTERS: { value: Audience; label: string }[] = [
  { value: "everyone", label: "Everyone" },
  { value: "kids", label: "Kids & families" },
  { value: "students", label: "Students" },
  { value: "job-seekers", label: "Job seekers" },
  { value: "educators", label: "Educators" },
];

type CategoryFilter = "all" | Opportunity["category"];

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "visit", label: "Places to visit" },
  { value: "event", label: "Events" },
  { value: "job", label: "Jobs" },
  { value: "internship", label: "Internships" },
  { value: "education", label: "Scholarships & education" },
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
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities.filter((o) => {
      if (audience !== "everyone" && !o.audience.includes(audience)) return false;
      if (category !== "all" && o.category !== category) return false;
      if (q) {
        const haystack = `${o.title} ${o.orgName} ${o.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [opportunities, audience, category, query]);

  return (
    <div>
      <label htmlFor="community-search" className="sr-only">
        Search events, jobs, and places
      </label>
      <input
        id="community-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, organization, or keyword…"
        className="w-full rounded-full border border-ocean-200 bg-white px-5 py-3 text-ocean-800 placeholder:text-ocean-400 focus:border-ocean-400 focus:outline-none dark:border-ocean-600 dark:bg-ocean-700 dark:text-sand-50"
      />

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter by type">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={category === f.value}
            onClick={() => setCategory(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === f.value
                ? "bg-ocean-700 text-sand-50 dark:bg-sand-100 dark:text-ocean-800"
                : "border border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-600 dark:text-sand-100 dark:hover:bg-ocean-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2" role="tablist" aria-label="Filter by audience">
        {AUDIENCE_FILTERS.map((f) => (
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

      <p className="mt-4 text-sm text-ocean-600 dark:text-ocean-200" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {filtered.map((o) => (
          <Card key={o.id} className="flex flex-col">
            <Badge>{CATEGORY_LABEL[o.category]}</Badge>
            <h3 className="mt-3 text-lg font-bold text-ocean-800 dark:text-sand-50">
              {o.title}
            </h3>
            <p className="text-sm font-medium text-ocean-600 dark:text-ocean-200">{o.orgName}</p>
            <p className="mt-2 flex-1 text-sm text-ocean-700 dark:text-sand-100">
              {o.description}
            </p>
            <a
              href={o.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm font-semibold text-coral-700 dark:text-coral-400 hover:underline"
            >
              Learn more →
            </a>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-ocean-600 dark:text-sand-200">
            Nothing matches that search. Try a different keyword or filter.
          </p>
        )}
      </div>
    </div>
  );
}
