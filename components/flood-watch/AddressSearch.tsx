"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { RiskSummaryCard, RiskResult } from "./RiskSummaryCard";

export function AddressSearch() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RiskResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (address.trim().length < 3) {
      setError("Enter an address, intersection, or neighborhood name.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/risk?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("We couldn't reach the flood data service. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="address-search" className="sr-only">
          Address or neighborhood
        </label>
        <input
          id="address-search"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Sandbridge, or 123 Main St"
          className="flex-1 rounded-full border border-ocean-200 bg-white px-5 py-3 text-ocean-800 placeholder:text-ocean-400 focus:border-ocean-400 focus:outline-none dark:bg-ocean-700 dark:text-sand-50 dark:border-ocean-600"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Checking…" : "Check my risk"}
        </Button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-risk-high">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6">
          <RiskSummaryCard result={result} />
        </div>
      )}
    </div>
  );
}
