"use client";

import { LucideIcon } from "lucide-react";

interface RoomFeaturesProps {
  features: { key: string; label: string; icon: LucideIcon }[];
  variant?: "booking" | "pills" | "list";
}

export function RoomFeatures({ features, variant = "booking" }: RoomFeaturesProps) {
  if (!features || features.length === 0) return null;

  // VARIANT 1: Booking Page (Airbnb style - no borders so they don't look clickable)
  if (variant === "booking") {
    return (
      <div>
        <h3 className="mb-4 text-xl font-bold text-slate-900">
          What this space offers
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {features.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon className="h-6 w-6 shrink-0 stroke-[1.5] text-slate-700" />
              <span className="text-base text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // VARIANT 2: Admin or Cards (Small inline pills)
  if (variant === "pills") {
    return (
      <div className="flex flex-wrap gap-2">
        {features.map(({ key, label, icon: Icon }) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </span>
        ))}
      </div>
    );
  }

  // VARIANT 3: Simple List (For sidebars or tight admin table columns)
  return (
    <div className="flex flex-col gap-2">
      {features.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-slate-500" />
          <span className="text-sm text-slate-600">{label}</span>
        </div>
      ))}
    </div>
  );
}
