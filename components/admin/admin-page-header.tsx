"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  usePageHeader,
  type UsePageHeaderOptions,
} from "@/hooks/use-page-header";

export function AdminPageHeader(options: UsePageHeaderOptions) {
  const { title, description, icon: Icon, action } = usePageHeader(options);

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action.href ? (
            <Button size="lg">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button size="lg" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
