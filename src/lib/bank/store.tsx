import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { generateBankState, SIM_EPOCH } from "./seed";
import { can } from "./permissions";
import type {
  Account,
  BankState,
  Card,
  CustomerNote,
  Employee,
  FixedDeposit,
  Notification,
  Permission,
  RoleId,
  ServiceCase,
  Session,
  SuspiciousAlert,
  TimelineEvent,
  AuditLog,
} from "./types";

const STORAGE_KEY = "kaldhav-bank-sim-v1";
const SESSION_KEY = "kaldhav-bank-session-v1";

let counter = 0;
function uid(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${counter}`;
}

function nowIso() {
  return new Date().toISOString();
}

interface AuditInput {
  action: string;
  entity_type: string;
  entity_id: string;
  customer_id: string | null;
  description: string;
  severity: AuditLog["severity"];
  previous_value?: string | null;
  new_value?: string | null;
}

interface TimelineInput {
  customer_id: string;
  category: TimelineEvent["category"];
  title: string;
  detail: string;
}

interface NotifyInput {
  customer_id: string;
  category: Notification["category"];
  title: string;
  body: string;
}

export interface BankContextValue {
  state: BankState;
  session: Session | null;
  hydrated: boolean;
  employee: Employee | null;
  role: RoleId | null;
  allow: (permission: Permission) => boolean;
  signInEmployee: (employeeId: string) => void;
  signInCustomer: (customerId: string) => void;
  signOut: () => void;
  resetSimulation: () => void;
  // actions
  blockCard: (cardId: string, reason: string) => void;
  unblockCard: (cardId: string) => void;
  replaceCard: (cardId: string) => void;
  setAccountStatus: (accountId: string, status: Account["status"], reason: string) => void;
  verifyIdentity: (identityId: string, outcome: "VERIFIED" | "FAILED", notes: string) => void;
  addNote: (input: {
    customer_id: string;
    note_type: string;
    content: string;
    visibility: CustomerNote["visibility"];
    related_case?: string | null;
  }) => void;
  createCase: (input: {
    customer_id: string;
    category: string;
    priority: ServiceCase["priority"];
    subject: string;
    description: string;
  }) => void;
  updateCaseStatus: (caseId: string, status: ServiceCase["status"]) => void;
  assignCase: (caseId: string, employeeId: string) => void;
  updateAlert: (alertId: string, status: SuspiciousAlert["status"], resolution: string) => void;
  setRiskLevel: (customerId: string, level: Customer0["risk_level"]) => void;
  setCustomerStatus: (customerId: string, status: Customer0["customer_status"]) => void;
  updateContact: (
    customerId: string,
    patch: { phone_number: string; email: string; residential_address: string },
  ) => void;
  createFixedDeposit: (input: {
    customer_id: string;
    linked_account_id: string;
    principal_amount: number;
    tenure: number;
  }) => void;
  closeFixedDeposit: (fdId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  reportCardLost: (cardId: string) => void;
  raiseSupportCase: (input: { customer_id: string; category: string; subject: string; description: string }) => void;
  setEmployeeStatus: (employeeId: string, status: Employee["status"]) => void;
}

type Customer0 = BankState["customers"][number];

const BankContext = createContext<BankContextValue | null>(null);

export function BankProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BankState>(() => generateBankState());
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as BankState);
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) setSession(JSON.parse(rawSession) as Session);
    } catch {
      /* start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [session, hydrated]);

  const employee = useMemo(
    () =>
      session?.kind === "employee"
        ? (state.employees.find((e) => e.employee_id === session.employeeId) ?? null)
        : null,
    [session, state.employees],
  );

  const role: RoleId | null = session?.kind === "customer" ? "customer" : (employee?.role ?? null);

  const allow = useCallback((permission: Permission) => can(role ?? undefined, permission), [role]);

  const actor = employee
    ? { id: employee.employee_id, name: employee.name }
    : { id: session?.customerId ?? "SELF", name: "Customer self-service" };

  const commit = useCallback(
    (
      mutate: (draft: BankState) => void,
      extras?: { audit?: AuditInput; timeline?: TimelineInput; notify?: NotifyInput },
    ) => {
      setState((prev) => {
        const draft: BankState = structuredClone(prev);
        mutate(draft);
        if (extras?.audit) {
          draft.auditLogs.unshift({
            log_id: uid("LOG"),
            employee_id: actor.id,
            employee_name: actor.name,
            timestamp: nowIso(),
            ip_placeholder: "10.12.0.44",
            session_placeholder: "SES-LIVE",
            previous_value: extras.audit.previous_value ?? null,
            new_value: extras.audit.new_value ?? null,
            ...extras.audit,
          });
        }
        if (extras?.timeline) {
          draft.timeline.unshift({
            event_id: uid("TL"),
            timestamp: nowIso(),
            ...extras.timeline,
          });
        }
        if (extras?.notify) {
          draft.notifications.unshift({
            notification_id: uid("NTF"),
            created_at: nowIso(),
            read: false,
            ...extras.notify,
          });
        }
        return draft;
      });
    },
    [actor.id, actor.name],
  );

  const value: BankContextValue = {
    state,
    session,
    hydrated,
    employee,
    role,
    allow,
    signInEmployee: (employeeId) => setSession({ kind: "employee", employeeId }),
    signInCustomer: (customerId) => setSession({ kind: "customer", customerId }),
    signOut: () => setSession(null),
    resetSimulation: () => {
      setState(generateBankState());
      setSession(null);
    },

    blockCard: (cardId, reason) =>
      commit(
        (d) => {
          const card = d.cards.find((c) => c.card_id === cardId);
          if (!card) return;
          card.card_status = "BLOCKED";
          card.block_reason = reason;
          card.blocked_at = nowIso();
          card.blocked_by = actor.name;
        },
        (() => {
          const card = state.cards.find((c) => c.card_id === cardId);
          return {
            audit: {
              action: "CARD_BLOCKED",
              entity_type: "card",
              entity_id: cardId,
              customer_id: card?.customer_id ?? null,
              description: `Card ${card?.masked_card_number} blocked — ${reason}`,
              severity: "HIGH",
              previous_value: card?.card_status ?? null,
              new_value: "BLOCKED",
            },
            timeline: {
              customer_id: card?.customer_id ?? "",
              category: "card",
              title: "Card blocked",
              detail: `${card?.card_type} ${card?.masked_card_number} — ${reason}`,
            },
            notify: {
              customer_id: card?.customer_id ?? "",
              category: "Card",
              title: "Your card was blocked",
              body: `Card ${card?.masked_card_number} is now blocked. Reason: ${reason}.`,
            },
          };
        })(),
      ),

    unblockCard: (cardId) =>
      commit(
        (d) => {
          const card = d.cards.find((c) => c.card_id === cardId);
          if (!card) return;
          card.card_status = "ACTIVE";
          card.block_reason = null;
          card.blocked_at = null;
          card.blocked_by = null;
        },
        (() => {
          const card = state.cards.find((c) => c.card_id === cardId);
          return {
            audit: {
              action: "CARD_UNBLOCKED",
              entity_type: "card",
              entity_id: cardId,
              customer_id: card?.customer_id ?? null,
              description: `Card ${card?.masked_card_number} unblocked`,
              severity: "MEDIUM",
              previous_value: "BLOCKED",
              new_value: "ACTIVE",
            },
            timeline: {
              customer_id: card?.customer_id ?? "",
              category: "card",
              title: "Card unblocked",
              detail: `${card?.card_type} ${card?.masked_card_number} restored to active`,
            },
            notify: {
              customer_id: card?.customer_id ?? "",
              category: "Card",
              title: "Your card is active again",
              body: `Card ${card?.masked_card_number} has been unblocked.`,
            },
          };
        })(),
      ),

    replaceCard: (cardId) =>
      commit(
        (d) => {
          const card = d.cards.find((c) => c.card_id === cardId);
          if (!card) return;
          card.card_status = "REPLACEMENT_PENDING";
          card.replacement_count += 1;
        },
        (() => {
          const card = state.cards.find((c) => c.card_id === cardId);
          return {
            audit: {
              action: "CARD_REPLACEMENT_REQUESTED",
              entity_type: "card",
              entity_id: cardId,
              customer_id: card?.customer_id ?? null,
              description: `Replacement issued for ${card?.masked_card_number}`,
              severity: "MEDIUM",
            },
            timeline: {
              customer_id: card?.customer_id ?? "",
              category: "card",
              title: "Replacement card requested",
              detail: `A new ${card?.card_type} will be dispatched to the registered address`,
            },
            notify: {
              customer_id: card?.customer_id ?? "",
              category: "Card",
              title: "Replacement card on the way",
              body: `A replacement for ${card?.masked_card_number} has been ordered.`,
            },
          };
        })(),
      ),

    setAccountStatus: (accountId, status, reason) =>
      commit(
        (d) => {
          const acc = d.accounts.find((a) => a.account_id === accountId);
          if (!acc) return;
          acc.status = status;
          if (status === "CLOSED") {
            acc.closed_date = nowIso();
            acc.closure_reason = reason;
          }
        },
        (() => {
          const acc = state.accounts.find((a) => a.account_id === accountId);
          return {
            audit: {
              action: `ACCOUNT_STATUS_${status}`,
              entity_type: "account",
              entity_id: accountId,
              customer_id: acc?.customer_id ?? null,
              description: `Account ${acc?.account_number} set to ${status} — ${reason}`,
              severity: status === "FROZEN" || status === "CLOSED" ? "CRITICAL" : "MEDIUM",
              previous_value: acc?.status ?? null,
              new_value: status,
            },
            timeline: {
              customer_id: acc?.customer_id ?? "",
              category: "account",
              title: `Account ${status.toLowerCase()}`,
              detail: `${acc?.account_type} ${acc?.account_number} — ${reason}`,
            },
            notify: {
              customer_id: acc?.customer_id ?? "",
              category: "Account",
              title: `Account status changed to ${status}`,
              body: `Account ${acc?.account_number}: ${reason}`,
            },
          };
        })(),
      ),

    verifyIdentity: (identityId, outcome, notes) =>
      commit(
        (d) => {
          const rec = d.identities.find((i) => i.identity_id === identityId);
          if (!rec) return;
          rec.verification_status = outcome;
          rec.verification_date = nowIso();
          rec.verified_by = actor.name;
          rec.verification_notes = notes;
          const cust = d.customers.find((c) => c.customer_id === rec.customer_id);
          if (cust) cust.verification_status = outcome;
        },
        (() => {
          const rec = state.identities.find((i) => i.identity_id === identityId);
          return {
            audit: {
              action: outcome === "VERIFIED" ? "IDENTITY_VERIFICATION_PASSED" : "IDENTITY_VERIFICATION_FAILED",
              entity_type: "identity",
              entity_id: identityId,
              customer_id: rec?.customer_id ?? null,
              description: `Simulated identity check ${outcome} — ${notes}`,
              severity: outcome === "VERIFIED" ? "LOW" : "HIGH",
              new_value: outcome,
            },
            timeline: {
              customer_id: rec?.customer_id ?? "",
              category: "identity",
              title: `Identity check ${outcome.toLowerCase()}`,
              detail: notes,
            },
          };
        })(),
      ),

    addNote: (input) =>
      commit(
        (d) => {
          d.notes.unshift({
            note_id: uid("NOTE"),
            customer_id: input.customer_id,
            author: actor.name,
            employee_id: actor.id,
            timestamp: nowIso(),
            note_type: input.note_type,
            content: input.content,
            visibility: input.visibility,
            related_case: input.related_case ?? null,
          });
        },
        {
          audit: {
            action: "CUSTOMER_NOTE_ADDED",
            entity_type: "customer",
            entity_id: input.customer_id,
            customer_id: input.customer_id,
            description: `Internal note added (${input.note_type})`,
            severity: "INFO",
          },
        },
      ),

    createCase: (input) =>
      commit(
        (d) => {
          d.cases.unshift({
            case_id: uid("CASE"),
            customer_id: input.customer_id,
            assigned_employee: actor.id.startsWith("EMP") ? actor.id : null,
            category: input.category,
            priority: input.priority,
            status: "OPEN",
            subject: input.subject,
            description: input.description,
            created_at: nowIso(),
            updated_at: nowIso(),
            resolved_at: null,
          });
        },
        {
          audit: {
            action: "CASE_CREATED",
            entity_type: "case",
            entity_id: input.customer_id,
            customer_id: input.customer_id,
            description: `Case opened: ${input.subject}`,
            severity: "MEDIUM",
          },
          timeline: {
            customer_id: input.customer_id,
            category: "case",
            title: "Service case opened",
            detail: input.subject,
          },
          notify: {
            customer_id: input.customer_id,
            category: "Service Request",
            title: "Service case opened",
            body: input.subject,
          },
        },
      ),

    updateCaseStatus: (caseId, status) =>
      commit(
        (d) => {
          const c = d.cases.find((x) => x.case_id === caseId);
          if (!c) return;
          c.status = status;
          c.updated_at = nowIso();
          if (status === "RESOLVED" || status === "CLOSED") c.resolved_at = nowIso();
        },
        (() => {
          const c = state.cases.find((x) => x.case_id === caseId);
          return {
            audit: {
              action: "CASE_STATUS_CHANGED",
              entity_type: "case",
              entity_id: caseId,
              customer_id: c?.customer_id ?? null,
              description: `Case moved to ${status}`,
              severity: "INFO",
              previous_value: c?.status ?? null,
              new_value: status,
            },
            notify: {
              customer_id: c?.customer_id ?? "",
              category: "Service Request",
              title: `Case ${status.toLowerCase().replace(/_/g, " ")}`,
              body: c?.subject ?? "Your service case was updated.",
            },
          };
        })(),
      ),

    assignCase: (caseId, employeeId) =>
      commit(
        (d) => {
          const c = d.cases.find((x) => x.case_id === caseId);
          if (!c) return;
          c.assigned_employee = employeeId;
          if (c.status === "OPEN") c.status = "ASSIGNED";
          c.updated_at = nowIso();
        },
        {
          audit: {
            action: "CASE_ASSIGNED",
            entity_type: "case",
            entity_id: caseId,
            customer_id: state.cases.find((x) => x.case_id === caseId)?.customer_id ?? null,
            description: `Case assigned to ${employeeId}`,
            severity: "INFO",
            new_value: employeeId,
          },
        },
      ),

    updateAlert: (alertId, status, resolution) =>
      commit(
        (d) => {
          const a = d.alerts.find((x) => x.alert_id === alertId);
          if (!a) return;
          a.status = status;
          a.resolution = resolution || a.resolution;
          a.assigned_to = actor.id;
        },
        (() => {
          const a = state.alerts.find((x) => x.alert_id === alertId);
          return {
            audit: {
              action: "SUSPICIOUS_ALERT_UPDATED",
              entity_type: "alert",
              entity_id: alertId,
              customer_id: a?.customer_id ?? null,
              description: `Alert set to ${status} — ${resolution || "no note"}`,
              severity: status === "CONFIRMED" ? "CRITICAL" : "HIGH",
              previous_value: a?.status ?? null,
              new_value: status,
            },
          };
        })(),
      ),

    setRiskLevel: (customerId, level) =>
      commit(
        (d) => {
          const c = d.customers.find((x) => x.customer_id === customerId);
          if (!c) return;
          c.risk_level = level;
          c.updated_at = nowIso();
        },
        {
          audit: {
            action: "RISK_LEVEL_CHANGED",
            entity_type: "customer",
            entity_id: customerId,
            customer_id: customerId,
            description: `Risk classification set to ${level}`,
            severity: level === "CRITICAL" ? "CRITICAL" : "MEDIUM",
            previous_value: state.customers.find((x) => x.customer_id === customerId)?.risk_level ?? null,
            new_value: level,
          },
        },
      ),

    setCustomerStatus: (customerId, status) =>
      commit(
        (d) => {
          const c = d.customers.find((x) => x.customer_id === customerId);
          if (!c) return;
          c.customer_status = status;
          c.updated_at = nowIso();
        },
        {
          audit: {
            action: "CUSTOMER_STATUS_CHANGED",
            entity_type: "customer",
            entity_id: customerId,
            customer_id: customerId,
            description: `Customer status set to ${status}`,
            severity: "HIGH",
            new_value: status,
          },
          notify: {
            customer_id: customerId,
            category: "Account",
            title: "Profile status updated",
            body: `Your relationship status is now ${status}.`,
          },
        },
      ),

    updateContact: (customerId, patch) =>
      commit(
        (d) => {
          const c = d.customers.find((x) => x.customer_id === customerId);
          if (!c) return;
          c.phone_number = patch.phone_number;
          c.email = patch.email;
          c.residential_address = patch.residential_address;
          c.updated_at = nowIso();
        },
        {
          audit: {
            action: "CUSTOMER_CONTACT_UPDATED",
            entity_type: "customer",
            entity_id: customerId,
            customer_id: customerId,
            description: "Contact details amended",
            severity: "LOW",
            new_value: `${patch.phone_number} / ${patch.email}`,
          },
          notify: {
            customer_id: customerId,
            category: "Security",
            title: "Contact details changed",
            body: "Your phone, email or address was updated. Contact us if this wasn't you.",
          },
        },
      ),

    createFixedDeposit: ({ customer_id, linked_account_id, principal_amount, tenure }) => {
      const rate = tenure >= 24 ? 12.5 : tenure >= 12 ? 11.25 : 9.75;
      const interest = Math.round(principal_amount * (rate / 100) * (tenure / 12) * 100) / 100;
      const start = Date.now();
      const maturity = new Date(start + tenure * 30.44 * 86400000).toISOString();
      const fd: FixedDeposit = {
        fd_id: uid("FD"),
        customer_id,
        linked_account_id,
        principal_amount,
        interest_rate: rate,
        tenure,
        start_date: nowIso(),
        maturity_date: maturity,
        expected_interest: interest,
        maturity_amount: principal_amount + interest,
        payout_instruction: "Credit to linked account on maturity",
        status: "ACTIVE",
        early_withdrawal_allowed: true,
        created_by: actor.name,
        created_at: nowIso(),
      };
      commit(
        (d) => {
          d.fixedDeposits.unshift(fd);
          const acc = d.accounts.find((a) => a.account_id === linked_account_id);
          if (acc) {
            acc.balance = Math.round((acc.balance - principal_amount) * 100) / 100;
            acc.available_balance = Math.round((acc.available_balance - principal_amount) * 100) / 100;
            d.transactions.unshift({
              transaction_id: uid("TXN"),
              account_id: acc.account_id,
              customer_id,
              transaction_reference: uid("REF"),
              transaction_type: "FD_PLACEMENT",
              amount: -principal_amount,
              currency: acc.currency,
              description: `Fixed deposit placement ${fd.fd_id}`,
              merchant_name: "Kaldhav Bank",
              channel: "BRANCH",
              location: "Kaldhav Central",
              transaction_date: nowIso(),
              status: "COMPLETED",
              resulting_balance: acc.balance,
              risk_flag: false,
              created_at: nowIso(),
            });
          }
        },
        {
          audit: {
            action: "FD_CREATED",
            entity_type: "fixed_deposit",
            entity_id: fd.fd_id,
            customer_id,
            description: `Fixed deposit of ${principal_amount} for ${tenure} months at ${rate}%`,
            severity: "MEDIUM",
            new_value: fd.fd_id,
          },
          timeline: {
            customer_id,
            category: "fd",
            title: "Fixed deposit opened",
            detail: `${tenure}-month deposit at ${rate}% p.a.`,
          },
          notify: {
            customer_id,
            category: "FD",
            title: "Fixed deposit opened",
            body: `Your ${tenure}-month deposit is active at ${rate}% p.a.`,
          },
        },
      );
    },

    closeFixedDeposit: (fdId) =>
      commit(
        (d) => {
          const fd = d.fixedDeposits.find((f) => f.fd_id === fdId);
          if (!fd) return;
          fd.status = "CLOSED";
          const acc = d.accounts.find((a) => a.account_id === fd.linked_account_id);
          if (acc) {
            acc.balance = Math.round((acc.balance + fd.principal_amount) * 100) / 100;
            acc.available_balance = Math.round((acc.available_balance + fd.principal_amount) * 100) / 100;
          }
        },
        (() => {
          const fd = state.fixedDeposits.find((f) => f.fd_id === fdId);
          return {
            audit: {
              action: "FD_CLOSED",
              entity_type: "fixed_deposit",
              entity_id: fdId,
              customer_id: fd?.customer_id ?? null,
              description: "Fixed deposit closed and principal returned",
              severity: "MEDIUM",
            },
            notify: {
              customer_id: fd?.customer_id ?? "",
              category: "FD",
              title: "Fixed deposit closed",
              body: "Your deposit principal has been returned to the linked account.",
            },
          };
        })(),
      ),

    markNotificationRead: (notificationId) =>
      commit((d) => {
        const n = d.notifications.find((x) => x.notification_id === notificationId);
        if (n) n.read = true;
      }),

    reportCardLost: (cardId) =>
      commit(
        (d) => {
          const card = d.cards.find((c) => c.card_id === cardId);
          if (!card) return;
          card.card_status = "BLOCKED";
          card.block_reason = "Reported lost by customer";
          card.blocked_at = nowIso();
          card.blocked_by = "Customer self-service";
          d.cases.unshift({
            case_id: uid("CASE"),
            customer_id: card.customer_id,
            assigned_employee: null,
            category: "Card Services",
            priority: "HIGH",
            status: "OPEN",
            subject: `Lost card reported — ${card.masked_card_number}`,
            description: "Customer reported the card lost through the online portal.",
            created_at: nowIso(),
            updated_at: nowIso(),
            resolved_at: null,
          });
        },
        (() => {
          const card = state.cards.find((c) => c.card_id === cardId);
          return {
            audit: {
              action: "CARD_REPORTED_LOST",
              entity_type: "card",
              entity_id: cardId,
              customer_id: card?.customer_id ?? null,
              description: `Customer reported ${card?.masked_card_number} lost`,
              severity: "HIGH",
              new_value: "BLOCKED",
            },
            timeline: {
              customer_id: card?.customer_id ?? "",
              category: "card",
              title: "Card reported lost",
              detail: `${card?.masked_card_number} blocked immediately`,
            },
            notify: {
              customer_id: card?.customer_id ?? "",
              category: "Card",
              title: "Card blocked after loss report",
              body: "We blocked the card and opened a case for a replacement.",
            },
          };
        })(),
      ),

    raiseSupportCase: ({ customer_id, category, subject, description }) =>
      commit(
        (d) => {
          d.cases.unshift({
            case_id: uid("CASE"),
            customer_id,
            assigned_employee: null,
            category,
            priority: "MEDIUM",
            status: "OPEN",
            subject,
            description,
            created_at: nowIso(),
            updated_at: nowIso(),
            resolved_at: null,
          });
        },
        {
          audit: {
            action: "CASE_CREATED_BY_CUSTOMER",
            entity_type: "case",
            entity_id: customer_id,
            customer_id,
            description: `Customer raised: ${subject}`,
            severity: "INFO",
          },
          timeline: {
            customer_id,
            category: "case",
            title: "Support request submitted",
            detail: subject,
          },
        },
      ),

    setEmployeeStatus: (employeeId, status) =>
      commit(
        (d) => {
          const e = d.employees.find((x) => x.employee_id === employeeId);
          if (e) e.status = status;
        },
        {
          audit: {
            action: "EMPLOYEE_STATUS_CHANGED",
            entity_type: "employee",
            entity_id: employeeId,
            customer_id: null,
            description: `Employee access set to ${status}`,
            severity: "HIGH",
            new_value: status,
          },
        },
      ),
  };

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank(): BankContextValue {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used inside BankProvider");
  return ctx;
}

export function useCustomerBundle(customerId: string | undefined) {
  const { state } = useBank();
  return useMemo(() => {
    if (!customerId) return null;
    const customer = state.customers.find((c) => c.customer_id === customerId);
    if (!customer) return null;
    const accounts = state.accounts.filter((a) => a.customer_id === customerId);
    const accountIds = new Set(accounts.map((a) => a.account_id));
    return {
      customer,
      branch: state.branches.find((b) => b.branch_id === customer.branch_id) ?? null,
      identities: state.identities.filter((i) => i.customer_id === customerId),
      accounts,
      cards: state.cards.filter((c) => c.customer_id === customerId),
      transactions: state.transactions.filter((t) => accountIds.has(t.account_id)),
      fixedDeposits: state.fixedDeposits.filter((f) => f.customer_id === customerId),
      loans: state.loans.filter((l) => l.customer_id === customerId),
      cases: state.cases.filter((c) => c.customer_id === customerId),
      notes: state.notes.filter((n) => n.customer_id === customerId),
      alerts: state.alerts.filter((a) => a.customer_id === customerId),
      notifications: state.notifications.filter((n) => n.customer_id === customerId),
      securityEvents: state.securityEvents.filter((s) => s.customer_id === customerId),
      timeline: state.timeline.filter((t) => t.customer_id === customerId),
      auditLogs: state.auditLogs.filter((l) => l.customer_id === customerId),
    };
  }, [customerId, state]);
}

export type CustomerBundle = NonNullable<ReturnType<typeof useCustomerBundle>>;

export { SIM_EPOCH };
