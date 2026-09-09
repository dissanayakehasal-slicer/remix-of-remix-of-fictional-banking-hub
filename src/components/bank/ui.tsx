import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const TONES = {
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/25",
  danger: "bg-danger-soft text-danger border-danger/25",
  info: "bg-info-soft text-info border-info/25",
  neutral: "bg-neutral-soft text-neutral border-border",
} as const;

export type Tone = keyof typeof TONES;

const STATUS_TONE: Record<string, Tone> = {
  ACTIVE: "success",
  COMPLETED: "success",
  VERIFIED: "success",
  PAID: "success",
  CLEARED: "success",
  RESOLVED: "success",
  MATURED: "success",
  SUCCESS: "success",
  LOW: "success",
  PENDING: "warning",
  DORMANT: "warning",
  UNDER_REVIEW: "warning",
  REVIEW_REQUIRED: "warning",
  REPLACEMENT_PENDING: "warning",
  WAITING_CUSTOMER: "warning",
  REVIEWING: "warning",
  OVERDUE: "warning",
  MEDIUM: "warning",
  ASSIGNED: "info",
  IN_PROGRESS: "info",
  OPEN: "info",
  NEW: "info",
  RENEWED: "info",
  PENDING_REVIEW: "info",
  FROZEN: "danger",
  BLOCKED: "danger",
  SUSPENDED: "danger",
  DECLINED: "danger",
  FAILED: "danger",
  DEFAULT: "danger",
  ESCALATED: "danger",
  CONFIRMED: "danger",
  CRITICAL: "danger",
  HIGH: "danger",
  CLOSED: "neutral",
  CANCELLED: "neutral",
  EXPIRED: "neutral",
  REVERSED: "neutral",
  BROKEN: "neutral",
  NOT_VERIFIED: "neutral",
};

export function StatusPill({
  value,
  tone,
  className,
}: {
  value: string;
  tone?: Tone;
  className?: string;
}) {
  const resolved = tone ?? STATUS_TONE[value] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
        TONES[resolved],
        className,
      )}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

export function Panel({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("panel p-5", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="label-mono">{label}</div>
      <div
        className={cn(
          "mt-1 text-sm text-foreground",
          mono && "font-mono text-[13px] tracking-tight",
        )}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="panel px-4 py-3.5">
      <div className="label-mono">{label}</div>
      <div className="mt-1.5 font-display text-xl font-semibold text-foreground">{value}</div>
      {hint && (
        <div
          className={cn(
            "mt-1 text-[11px]",
            tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-muted-foreground",
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="panel-inset px-4 py-10 text-center text-sm text-muted-foreground">{message}</div>
  );
}

export function SimBanner() {
  return (
    <div className="border-b border-warning/25 bg-warning-soft px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-warning">
      Fictional roleplay simulation — every record on this platform is invented
    </div>
  );
}
