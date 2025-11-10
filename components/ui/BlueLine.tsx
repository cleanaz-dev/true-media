"use client";

import React from "react";
import clsx from "clsx";

interface BlueLineProps {
  width?: string; // e.g. "w-12", "w-24", "w-32"
  align?: "center" | "left";
  className?: string;
}

export default function BlueLine({
  width = "w-20",
  align = "center",
  className = "",
}: BlueLineProps) {
  return (
    <div
      className={clsx(
        "h-1 bg-blue-600 rounded-full",
        width,
        align === "center" ? "mx-auto" : "",
        className
      )}
    />
  );
}
