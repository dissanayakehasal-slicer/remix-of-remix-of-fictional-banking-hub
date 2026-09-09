import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { useBank } from "@/lib/bank/store";
import { ROLE_LABELS } from "@/lib/bank/permissions";
import { SimBanner } from "@/components/bank/ui";
import { cn } from "@/lib/utils";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Loading simulation records…
      </p>
    </div>
  );
}

type NavItem = { to: string; label: string };

const STAFF_NAV: NavItem[] = [
  { to: "/staff", label: "Dashboard" },
  { to: "/staff/customers", label: "Customers" },
  { to: "/staff/cards", label: "Cards" },
  { to: "/staff/cases", label: "Cases" },
  { to: "/staff/fraud", label: "Fraud" },
  { to: "/staff/audit", label: "Audit" },
  { to: "/staff/admin", label: "Administration" },
];

const PORTAL_NAV: NavItem[] = [
  { to: "/portal", label: "Overview" },
  { to: "/portal/accounts", label: "Accounts" },
  { to: "/portal/cards", label: "Cards" },
  { to: "/portal/deposits", label: "Deposits" },
  { to: "/portal/loans", label: "Loans" },
  { to: "/portal/security", label: "Security" },
  { to: "/portal/support", label: "Support" },
];

function Chrome({
  nav,
  title,
  subtitle,
  identity,
  children,
}: {
  nav: NavItem[];
  title: string;
  subtitle: string;
  identity: string;
  children: ReactNode;
}) {
  const { signOut } = useBank();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SimBanner />
      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4 px-5 py-3">
          <div className="mr-auto">
            <div className="font-display text-sm font-semibold tracking-tight text-foreground">
              {title}
            </div>
            <div className="label-mono mt-0.5">{subtitle}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-foreground">{identity}</div>
            <button
              onClick={() => {
                signOut();
                navigate({ to: "/", replace: true });
              }}
              className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-danger"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-4 pb-2">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/staff" || item.to === "/portal" }}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-neutral-soft hover:text-foreground",
              )}
              activeProps={{ className: "bg-primary/10 !text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1500px] px-5 py-6">{children}</main>
    </div>
  );
}

export function StaffShell({ children }: { children: ReactNode }) {
  const { hydrated, session, employee } = useBank();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && (!session || session.kind !== "employee")) {
      navigate({ to: "/", replace: true });
    }
  }, [hydrated, session, navigate]);

  if (!hydrated || !employee) return <LoadingScreen />;

  return (
    <Chrome
      nav={STAFF_NAV}
      title="Meridian Trust — Operations Console"
      subtitle="Internal staff system"
      identity={`${employee.name} · ${ROLE_LABELS[employee.role]}`}
    >
      {children}
    </Chrome>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  const { hydrated, session, state } = useBank();
  const navigate = useNavigate();
  const customer = state.customers.find((c) => c.customer_id === session?.customerId);

  useEffect(() => {
    if (hydrated && (!session || session.kind !== "customer")) {
      navigate({ to: "/", replace: true });
    }
  }, [hydrated, session, navigate]);

  if (!hydrated || !customer) return <LoadingScreen />;

  return (
    <Chrome
      nav={PORTAL_NAV}
      title="Meridian Trust — Customer Portal"
      subtitle="Personal banking"
      identity={`${customer.preferred_name} · ${customer.customer_id}`}
    >
      {children}
    </Chrome>
  );
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
