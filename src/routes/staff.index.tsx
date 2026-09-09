import { Link, createFileRoute } from "@tanstack/react-router";

import { useBank } from "@/lib/bank/store";
import { EmptyState, Panel, Stat, StatusPill } from "@/components/bank/ui";
import { PageTitle } from "@/components/bank/shell";
import { compactMoney, fmtDateTime } from "@/lib/bank/format";
import { ROLE_LABELS } from "@/lib/bank/permissions";

export const Route = createFileRoute("/staff/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Operations dashboard — Meridian Trust" },
      {
        name: "description",
        content: "Live simulation snapshot of customers, accounts, open cases and fraud alerts.",
      },
      { property: "og:title", content: "Operations dashboard — Meridian Trust" },
      { property: "og:description", content: "Bank staff overview of the fictional record set." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state, employee } = useBank();

  const openCases = state.cases.filter((c) => !["RESOLVED", "CLOSED"].includes(c.status));
  const newAlerts = state.alerts.filter((a) => ["NEW", "REVIEWING", "ESCALATED"].includes(a.status));
  const frozen = state.accounts.filter((a) => a.status === "FROZEN" || a.status === "SUSPENDED");
  const blockedCards = state.cards.filter((c) => c.card_status === "BLOCKED");
  const deposits = state.accounts.reduce((sum, a) => sum + a.balance, 0);
  const myCases = openCases.filter((c) => c.assigned_employee === employee?.employee_id);

  return (
    <>
      <PageTitle
        title={`Good day, ${employee?.name.split(" ")[0]}`}
        subtitle={`${ROLE_LABELS[employee!.role]} · simulation clock ${fmtDateTime(state.simClock)}`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Customers" value={state.customers.length} hint={`${state.accounts.length} accounts`} />
        <Stat label="Total deposits" value={compactMoney(deposits)} hint="Across all account types" />
        <Stat
          label="Open cases"
          value={openCases.length}
          hint={`${myCases.length} assigned to you`}
          tone={openCases.length > 20 ? "warning" : "neutral"}
        />
        <Stat
          label="Active alerts"
          value={newAlerts.length}
          hint={`${blockedCards.length} blocked cards · ${frozen.length} restricted accounts`}
          tone={newAlerts.length ? "danger" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Suspicious activity queue" subtitle="Newest detections first">
          {newAlerts.length === 0 ? (
            <EmptyState message="No open alerts." />
          ) : (
            <ul className="space-y-2">
              {newAlerts.slice(0, 7).map((a) => (
                <li key={a.alert_id} className="panel-inset px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">{a.alert_type}</span>
                    <StatusPill value={a.severity} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Link
                      to="/staff/customers/$customerId"
                      params={{ customerId: a.customer_id }}
                      className="font-mono text-[11px] text-primary hover:underline"
                    >
                      {a.customer_id}
                    </Link>
                    <span className="label-mono">{fmtDateTime(a.detected_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Service case backlog" subtitle="Unresolved customer cases">
          {openCases.length === 0 ? (
            <EmptyState message="No open cases." />
          ) : (
            <ul className="space-y-2">
              {openCases.slice(0, 7).map((c) => (
                <li key={c.case_id} className="panel-inset px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-foreground">{c.subject}</span>
                    <StatusPill value={c.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Link
                      to="/staff/customers/$customerId"
                      params={{ customerId: c.customer_id }}
                      className="font-mono text-[11px] text-primary hover:underline"
                    >
                      {c.customer_id}
                    </Link>
                    <span className="label-mono">
                      {c.priority} · {fmtDateTime(c.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel className="mt-5" title="Recent system activity" subtitle="Audit trail, newest first">
        <div className="space-y-1.5">
          {state.auditLogs.slice(0, 10).map((log) => (
            <div
              key={log.log_id}
              className="flex flex-wrap items-center gap-3 border-b border-border/60 py-2 last:border-0"
            >
              <StatusPill value={log.severity} />
              <span className="font-mono text-[11px] text-muted-foreground">{log.action}</span>
              <span className="min-w-0 flex-1 truncate text-xs text-foreground">{log.description}</span>
              <span className="label-mono">{fmtDateTime(log.timestamp)}</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
