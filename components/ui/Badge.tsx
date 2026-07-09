import { ReactNode } from "react";
import { RiskLevel } from "@/lib/risk";

const RISK_CLASSES: Record<RiskLevel, string> = {
  low: "bg-risk-low-bg text-risk-low",
  elevated: "bg-risk-elevated-bg text-risk-elevated",
  high: "bg-risk-high-bg text-risk-high",
  severe: "bg-risk-severe-bg text-risk-severe",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const label: Record<RiskLevel, string> = {
    low: "Low risk",
    elevated: "Elevated risk",
    high: "High risk",
    severe: "Severe risk",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${RISK_CLASSES[level]}`}
    >
      {label[level]}
    </span>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-sand-100 px-3 py-1 text-xs font-medium text-ocean-700 ${className}`}
    >
      {children}
    </span>
  );
}
