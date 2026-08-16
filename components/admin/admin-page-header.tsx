"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

export interface PageHeaderAction {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface PageHeaderBadge {
  label: ReactNode;
  icon?: LucideIcon;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

interface AdminPageHeaderProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  /** Single action button — convenience prop, folded into `actions` internally */
  action?: PageHeaderAction;
  actions?: PageHeaderAction[];
  badges?: PageHeaderBadge[];
  children?: ReactNode;
}

function HeaderActionButton({ action }: { action: PageHeaderAction }) {
  const Icon = action.icon;
  const size = action.size ?? "default";
  const variant = action.variant ?? "default";

  const content = (
    <>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {action.label}
    </>
  );

  if (action.href) {
    return (
      <Link
        href={action.href}
        className={cn(
          buttonVariants({ variant, size }),
          action.disabled && "pointer-events-none opacity-50"
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={action.onClick}
      disabled={action.disabled}
    >
      {content}
    </Button>
  );
}

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  action,
  actions = [],
  badges = [],
  children,
}: AdminPageHeaderProps) {
  const allActions = action ? [action, ...actions] : actions;
  const hasRightContent =
    Boolean(children) || badges.length > 0 || allActions.length > 0;

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {hasRightContent && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {children}

          {badges.map((badge, idx) => {
            const BadgeIcon = badge.icon;
            return (
              <Badge
                key={idx}
                variant={badge.variant ?? "secondary"}
                className="h-9 px-3 text-sm font-medium flex items-center gap-1.5"
              >
                {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
                {badge.label}
              </Badge>
            );
          })}

          {allActions.map((act, idx) => (
            <HeaderActionButton key={idx} action={act} />
          ))}
        </div>
      )}
    </div>
  );
}