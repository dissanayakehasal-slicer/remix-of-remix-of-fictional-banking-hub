import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useBank } from "@/lib/bank/store";
import { EmptyState, Panel, StatusPill } from "@/components/bank/ui";
import { PageTitle } from "@/components/bank/shell";
import { compactMoney, fmtDate } from "@/lib/bank/format";

export const Route = createFileRoute("/staff/customers/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Customer search — Meridian Trust" },
      {
        name: "description",
        content: "Search the fictional customer register by name, customer ID, account number or card.",
      },
      { property: "og:title", content: "Customer search — Meridian Trust" },
      { property: "og:description", content: "Locate any simulated customer record." },
    ],
  }),
  component: CustomerSearch,
});

const STATUSES = ["ALL", "ACTIVE", "SUSPENDED", "FROZEN", "UNDER_REVIEW", "CLOSED"] as const;
const RISKS = ["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

function CustomerSearch() {
  const { state, allow } = useBank();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("ALL");
  const [risk, setRisk] = useState<(typeof RISKS)[number]>("ALL");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const accountMatch = new Set(
      q
        ? state.accounts
            .filter((a) => a.account_number.toLowerCase().includes(q))
            .map((a) => a.customer_id)
        : [],
    );
    const cardMatch = new Set(
      q
        ? state.cards
            .filter((c) => c.masked_card_number.toLowerCase().includes(q))
            .map((c) => c.customer_id)
        : [],
    );
    return state.customers
      .filter((c) => {
        if (status !== "ALL" && c.customer_status !== status) return false;
        if (risk !== "ALL" && c.risk_level !== risk) return false;
        if (!q) return true;
        return (
          c.full_name.toLowerCase().includes(q) ||
          c.customer_id.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone_number.toLowerCase().includes(q) ||
          accountMatch.has(c.customer_id) ||
          cardMatch.has(c.customer_id)
        );
      })
      .slice(0, 60);
  }, [state, query, status, risk]);

  const balanceOf = (customerId: string) =>
    state.accounts
      .filter((a) => a.customer_id === customerId)
      .reduce((sum, a) => sum + a.balance, 0);

  if (!allow("customer.search")) {
    return <EmptyState message="Your role does not permit customer search." />;
  }

  return (
    <>
      <PageTitle
        title="Customer register"
        subtitle={`${state.customers.length} fictional customers on file`}
      />
      <Panel className="mb-5">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, customer ID, email, phone, account number or masked card"
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Status: {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value as (typeof RISKS)[number])}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          >
            {RISKS.map((s) => (
              <option key={s} value={s}>
                Risk: {s}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      {results.length === 0 ? (
        <EmptyState message="No customers match those filters." />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Customer", "ID", "Branch", "Since", "Holdings", "Risk", "Verification", "Status"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 label-mono">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((c) => (
                <tr key={c.customer_id} className="border-b border-border/50 last:border-0 hover:bg-neutral-soft/60">
                  <td className="px-4 py-3">
                    <Link
                      to="/staff/customers/$customerId"
                      params={{ customerId: c.customer_id }}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {c.full_name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{c.customer_id}</td>
                  <td className="px-4 py-3 text-xs">
                    {state.branches.find((b) => b.branch_id === c.branch_id)?.branch_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">{fmtDate(c.customer_since)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{compactMoney(balanceOf(c.customer_id))}</td>
                  <td className="px-4 py-3">
                    <StatusPill value={c.risk_level} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill value={c.verification_status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill value={c.customer_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
