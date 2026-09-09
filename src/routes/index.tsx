import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useBank } from "@/lib/bank/store";
import { ROLE_LABELS } from "@/lib/bank/permissions";
import { SimBanner, StatusPill } from "@/components/bank/ui";
import { LoadingScreen } from "@/components/bank/shell";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Meridian Trust Simulation" },
      {
        name: "description",
        content:
          "Choose a fictional staff role or customer profile to enter the Meridian Trust roleplay banking simulation.",
      },
      { property: "og:title", content: "Sign in — Meridian Trust Simulation" },
      {
        property: "og:description",
        content: "Enter the roleplay bank as staff or as a customer.",
      },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const { hydrated, state, signInEmployee, signInCustomer } = useBank();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"staff" | "customer">("staff");
  const [query, setQuery] = useState("");

  const customers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = state.customers;
    if (!q) return list.slice(0, 12);
    return list
      .filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          c.customer_id.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [state.customers, query]);

  if (!hydrated) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-background">
      <SimBanner />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="label-mono">Meridian Trust Bank</div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
            Fictional banking roleplay platform
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            One invented record set powers two connected experiences: an internal operations
            console for bank staff and a self-service portal for customers. Every name, number,
            account and transaction here is fabricated for simulation.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Customers", state.customers.length],
              ["Accounts", state.accounts.length],
              ["Transactions", state.transactions.length],
              ["Staff members", state.employees.length],
            ].map(([label, value]) => (
              <div key={label as string} className="panel px-4 py-3">
                <div className="label-mono">{label}</div>
                <div className="mt-1 font-display text-xl font-semibold">{value}</div>
              </div>
            ))}
          </dl>
        </div>

        <div className="panel p-6">
          <div className="mb-5 flex gap-1 rounded-xl bg-neutral-soft p-1">
            {(["staff", "customer"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${
                  mode === m ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m === "staff" ? "Staff sign in" : "Customer sign in"}
              </button>
            ))}
          </div>

          {mode === "staff" ? (
            <div className="max-h-[26rem] space-y-2 overflow-y-auto pr-1">
              {state.employees.slice(0, 24).map((emp) => (
                <button
                  key={emp.employee_id}
                  disabled={emp.status !== "ACTIVE"}
                  onClick={() => {
                    signInEmployee(emp.employee_id);
                    navigate({ to: "/staff" });
                  }}
                  className="panel-inset flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:border-primary/40 disabled:opacity-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{emp.name}</div>
                    <div className="label-mono mt-0.5 truncate">
                      {ROLE_LABELS[emp.role]} · {emp.employee_code}
                    </div>
                  </div>
                  <StatusPill value={emp.status} />
                </button>
              ))}
            </div>
          ) : (
            <div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, customer ID or email"
                className="mb-3 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
              <div className="max-h-[22rem] space-y-2 overflow-y-auto pr-1">
                {customers.map((c) => (
                  <button
                    key={c.customer_id}
                    onClick={() => {
                      signInCustomer(c.customer_id);
                      navigate({ to: "/portal" });
                    }}
                    className="panel-inset flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:border-primary/40"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-foreground">
                        {c.full_name}
                      </div>
                      <div className="label-mono mt-0.5 truncate">
                        {c.customer_id} · {c.city}
                      </div>
                    </div>
                    <StatusPill value={c.customer_status} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
