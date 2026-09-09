// Deterministic generator of fully fictional bank data.
import type {
  Account,
  AuditLog,
  BankState,
  Branch,
  Card,
  Customer,
  CustomerNote,
  Employee,
  FixedDeposit,
  IdentityRecord,
  Loan,
  Notification,
  SecurityEvent,
  ServiceCase,
  SuspiciousAlert,
  TimelineEvent,
  Transaction,
} from "./types";

export const SIM_EPOCH = Date.UTC(2026, 8, 18, 19, 12, 0);

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = [
  "Nadeera","Rohan","Ishara","Tharindu","Sanuka","Amaya","Dilini","Kasun","Maleesha","Chamath",
  "Hasini","Ruwan","Sachini","Pramod","Nethmi","Janith","Yasas","Upeksha","Dinuka","Piyumi",
  "Anushka","Nimal","Sithara","Lakmal","Oshadi","Gayan","Tehani","Buddhika","Rashmi","Nuwan",
];
const MIDDLE = ["A.", "B.", "C.", "D.", "K.", "M.", "P.", "R.", "S.", "T.", ""];
const LAST = [
  "Perera","Silva","Fernando","Jayasuriya","Wijesinghe","Bandara","Gunawardena","Ratnayake",
  "Dissanayake","Herath","Ekanayake","Weerasinghe","Rajapaksha","Karunaratne","Alwis","Mendis",
];
const OCCUPATIONS = [
  "Software Engineer","Teacher","Accountant","Nurse","Civil Engineer","Shop Owner","Architect",
  "Pharmacist","Logistics Officer","Graphic Designer","Bank Officer","Chef","Electrician","Lecturer",
];
const EMPLOYERS = [
  "Havelock Systems","Marina Textiles","Orient Logistics","Kandy Grammar School","Peninsula Health",
  "Northline Constructions","Verdant Foods","Silvercrest Media","Blueharbour Trading","Self-employed",
];
const STREETS = ["Lotus Lane","Harbour Road","Temple Street","Fern Avenue","Marina Crescent","Palm Grove","Cedar Walk","Station Road"];
const MERCHANTS = [
  "Verdant Supermart","Orient Fuel","Silvercrest Cinema","Blueharbour Cafe","Northline Pharmacy",
  "Peninsula Clinic","Marina Textiles","Lotus Bookstore","Skyline Electronics","Fernwood Bakery",
];

const BRANCH_DEFS: Array<[string, string, string, string]> = [
  ["BR-01", "Kaldhav Central", "12 Harbour Road, Kaldhav", "Ruwan Ekanayake"],
  ["BR-02", "Galle East", "88 Fern Avenue, Galle East", "Dilini Herath"],
  ["BR-03", "Kandy North", "5 Temple Street, Kandy North", "Kasun Bandara"],
  ["BR-04", "Jaffna West", "31 Palm Grove, Jaffna West", "Amaya Mendis"],
  ["BR-05", "Negombo Bay", "2 Marina Crescent, Negombo", "Janith Alwis"],
];

const EMPLOYEE_DEFS: Array<[string, string, Employee["role"], string, string]> = [
  ["EMP-2214", "Ayesha Marikkar", "teller", "BR-01", "Branch Operations"],
  ["EMP-2287", "Dinuka Rajapaksha", "csr", "BR-01", "Customer Service"],
  ["EMP-2301", "Ruwan Ekanayake", "manager", "BR-01", "Branch Management"],
  ["EMP-2404", "Tehani Wickrama", "fraud", "BR-02", "Fraud & Security"],
  ["EMP-2450", "Buddhika Senanayake", "compliance", "BR-03", "Compliance"],
  ["EMP-2500", "Oshadi Kariyawasam", "admin", "BR-01", "Systems Administration"],
];

const pick = <T,>(rng: () => number, arr: T[]): T => arr[Math.floor(rng() * arr.length)]!;
const int = (rng: () => number, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
const iso = (ms: number) => new Date(ms).toISOString();
const DAY = 86400000;

export function generateBankState(): BankState {
  const rng = mulberry32(20260918);

  const branches: Branch[] = BRANCH_DEFS.map(([code, name, address, manager], i) => ({
    branch_id: `BRN-${i + 1}`,
    branch_code: code,
    branch_name: name,
    address,
    telephone: `+94 11 ${400 + i} ${1000 + i * 37}`,
    manager,
    status: "ACTIVE",
  }));

  const employees: Employee[] = EMPLOYEE_DEFS.map(([code, name, role, branchCode, dept], i) => ({
    employee_id: code,
    employee_code: code,
    name,
    role,
    branch_id: branches.find((b) => b.branch_code === branchCode)!.branch_id,
    department: dept,
    status: "ACTIVE",
    last_login: iso(SIM_EPOCH - int(rng, 1, 20) * 3600000),
  }));

  const customers: Customer[] = [];
  const identities: IdentityRecord[] = [];
  const accounts: Account[] = [];
  const transactions: Transaction[] = [];
  const cards: Card[] = [];
  const fixedDeposits: FixedDeposit[] = [];
  const loans: Loan[] = [];
  const cases: ServiceCase[] = [];
  const notes: CustomerNote[] = [];
  const auditLogs: AuditLog[] = [];
  const alerts: SuspiciousAlert[] = [];
  const notifications: Notification[] = [];
  const securityEvents: SecurityEvent[] = [];
  const timeline: TimelineEvent[] = [];

  const statuses: Customer["customer_status"][] = [
    "ACTIVE","ACTIVE","ACTIVE","ACTIVE","ACTIVE","ACTIVE","UNDER_REVIEW","SUSPENDED","FROZEN",
  ];
  const risks: Customer["risk_level"][] = ["LOW","LOW","LOW","MEDIUM","MEDIUM","HIGH","CRITICAL"];
  const verifications: Customer["verification_status"][] = [
    "VERIFIED","VERIFIED","VERIFIED","PENDING","REVIEW_REQUIRED","NOT_VERIFIED","EXPIRED",
  ];
  const accountTypes = ["Savings","Current","Student","Premium","Business","Salary"];
  const txnTypes = ["Deposit","Withdrawal","Transfer","Card purchase","ATM withdrawal","Fee","Interest","Refund"];
  const channels = ["Branch","ATM","Online","Mobile","Card","System"];

  for (let i = 0; i < 124; i++) {
    const first = pick(rng, FIRST);
    const middle = pick(rng, MIDDLE);
    const last = pick(rng, LAST);
    const full = [first, middle, last].filter(Boolean).join(" ");
    const branch = branches[i % branches.length]!;
    const age = int(rng, 21, 68);
    const dob = Date.UTC(2026 - age, int(rng, 0, 11), int(rng, 1, 28));
    const since = SIM_EPOCH - int(rng, 200, 3600) * DAY;
    const cid = `CUS-${String(i + 1).padStart(4, "0")}`;
    const status = pick(rng, statuses);
    const risk = pick(rng, risks);
    const verification = pick(rng, verifications);
    const city = branch.branch_name.split(" ")[0]!;
    const address = `${int(rng, 1, 240)} ${pick(rng, STREETS)}, ${city}`;

    const customer: Customer = {
      id: cid,
      customer_id: cid,
      first_name: first,
      middle_name: middle,
      last_name: last,
      full_name: full,
      preferred_name: first,
      gender: rng() > 0.5 ? "Female" : "Male",
      date_of_birth: iso(dob),
      age,
      occupation: pick(rng, OCCUPATIONS),
      employer: pick(rng, EMPLOYERS),
      marital_status: pick(rng, ["Single", "Married", "Divorced", "Widowed"]),
      nationality: "Alvaran",
      residential_address: address,
      mailing_address: address,
      city,
      postal_code: String(int(rng, 10000, 82000)),
      phone_number: `+94 7${int(rng, 0, 8)} ${int(rng, 100, 999)} ${int(rng, 1000, 9999)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@examplemail.test`,
      mothers_name: `${pick(rng, FIRST)} ${pick(rng, LAST)}`,
      fathers_name: `${pick(rng, FIRST)} ${pick(rng, LAST)}`,
      emergency_contact: `${pick(rng, FIRST)} ${pick(rng, LAST)} · +94 7${int(rng, 0, 8)} ${int(rng, 100, 999)} ${int(rng, 1000, 9999)}`,
      customer_since: iso(since),
      branch_id: branch.branch_id,
      customer_status: status,
      risk_level: risk,
      verification_status: verification,
      last_login: iso(SIM_EPOCH - int(rng, 1, 300) * 3600000),
      failed_logins: rng() > 0.85 ? int(rng, 1, 5) : 0,
      created_at: iso(since),
      updated_at: iso(SIM_EPOCH - int(rng, 1, 40) * DAY),
    };
    customers.push(customer);

    identities.push({
      identity_id: `IDR-${String(i + 1).padStart(4, "0")}`,
      customer_id: cid,
      identification_type: pick(rng, ["National ID (fictional)", "Passport (fictional)", "Driving Licence (fictional)"]),
      fictional_document_number: `FID-${int(rng, 100000, 999999)}-${int(rng, 10, 99)}`,
      issuing_country: "Republic of Alvara (fictional)",
      issue_date: iso(since - int(rng, 100, 2000) * DAY),
      expiry_date: iso(SIM_EPOCH + int(rng, -200, 2200) * DAY),
      verification_status: verification,
      verification_date: verification === "VERIFIED" ? iso(since + 2 * DAY) : null,
      verification_method: verification === "VERIFIED" ? "In-branch document check (simulated)" : "—",
      verified_by: verification === "VERIFIED" ? "EMP-2287" : null,
      verification_notes: verification === "VERIFIED" ? "Simulated document check passed." : "Pending simulated review.",
    });

    timeline.push({
      event_id: `TL-${cid}-open`,
      customer_id: cid,
      category: "account",
      title: "Customer relationship opened",
      detail: `Onboarded at ${branch.branch_name}`,
      timestamp: customer.customer_since,
    });

    // Accounts
    const accountCount = int(rng, 1, 3);
    const customerAccounts: Account[] = [];
    for (let a = 0; a < accountCount; a++) {
      const balance = Math.round(int(rng, 1200, 4200000) * 100) / 100;
      const accStatus: Account["status"] =
        status === "FROZEN" ? "FROZEN" : status === "SUSPENDED" ? "SUSPENDED" : a === 0 ? "ACTIVE" : pick(rng, ["ACTIVE", "ACTIVE", "DORMANT"]);
      const account: Account = {
        id: `ACC-${cid}-${a + 1}`,
        account_id: `ACC-${cid}-${a + 1}`,
        customer_id: cid,
        account_number: `${int(rng, 1000, 9999)}-${int(rng, 100, 999)}-${int(rng, 10, 99)}`,
        account_type: a === 0 ? pick(rng, accountTypes) : pick(rng, accountTypes),
        currency: "LKR",
        balance,
        available_balance: balance,
        opened_date: iso(since + a * 30 * DAY),
        branch_id: branch.branch_id,
        status: accStatus,
        account_nickname: a === 0 ? "Primary" : `Secondary ${a}`,
        interest_rate: Math.round(rng() * 800) / 100,
        overdraft_limit: rng() > 0.7 ? int(rng, 10000, 200000) : 0,
        last_activity: iso(SIM_EPOCH - int(rng, 1, 30) * DAY),
        closed_date: null,
        closure_reason: null,
      };
      accounts.push(account);
      customerAccounts.push(account);

      // Transactions
      let running = balance;
      const txnCount = int(rng, 6, 14);
      for (let t = 0; t < txnCount; t++) {
        const type = pick(rng, txnTypes);
        const amount = Math.round(int(rng, 500, 240000) * 100) / 100;
        const when = SIM_EPOCH - int(rng, 1, 120) * DAY - int(rng, 0, 23) * 3600000;
        const bigFlag = amount > 200000;
        const txn: Transaction = {
          transaction_id: `TXN-${cid}-${a + 1}-${t + 1}`,
          account_id: account.account_id,
          customer_id: cid,
          transaction_reference: `REF${int(rng, 100000000, 999999999)}`,
          transaction_type: type,
          amount: type === "Deposit" || type === "Interest" || type === "Refund" ? amount : -amount,
          currency: "LKR",
          description: type === "Card purchase" ? `Purchase — ${pick(rng, MERCHANTS)}` : `${type} — ${account.account_type}`,
          merchant_name: type === "Card purchase" ? pick(rng, MERCHANTS) : "—",
          channel: pick(rng, channels),
          location: city,
          transaction_date: iso(when),
          status: rng() > 0.93 ? pick(rng, ["PENDING", "DECLINED", "UNDER_REVIEW"]) : "COMPLETED",
          resulting_balance: Math.round(running * 100) / 100,
          risk_flag: bigFlag && rng() > 0.6,
          created_at: iso(when),
        };
        running -= txn.amount * 0.02;
        transactions.push(txn);

        if (txn.risk_flag) {
          const alertId = `SA-${alerts.length + 1000}`;
          alerts.push({
            alert_id: alertId,
            customer_id: cid,
            account_id: account.account_id,
            transaction_id: txn.transaction_id,
            alert_type: pick(rng, [
              "Unusually large transaction",
              "Rapid consecutive transactions",
              "Unusual transaction location",
              "Unusual withdrawal activity",
              "Repeated card declines",
            ]),
            severity: pick(rng, ["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
            status: pick(rng, ["NEW", "NEW", "REVIEWING", "ESCALATED", "CLEARED"]),
            detected_at: txn.transaction_date,
            assigned_to: rng() > 0.5 ? "EMP-2404" : null,
            description: `Simulated monitoring rule triggered on ${txn.transaction_reference}.`,
            resolution: null,
          });
          timeline.push({
            event_id: `TL-${alertId}`,
            customer_id: cid,
            category: "security",
            title: "Fraud monitoring alert created",
            detail: `${txn.transaction_reference} flagged by simulation rules`,
            timestamp: txn.transaction_date,
          });
        }
      }
    }

    // Cards
    const cardCount = int(rng, 0, 2);
    for (let c = 0; c < cardCount; c++) {
      const linked = customerAccounts[c % customerAccounts.length]!;
      const digits = `${int(rng, 4000, 4999)} ${int(rng, 1000, 9999)} ${int(rng, 1000, 9999)} ${int(rng, 1000, 9999)}`;
      const cardStatus: Card["card_status"] =
        status === "FROZEN" ? "BLOCKED" : pick(rng, ["ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "BLOCKED", "EXPIRED", "SUSPENDED"]);
      const cardId = `CRD-${cid}-${c + 1}`;
      cards.push({
        card_id: cardId,
        customer_id: cid,
        linked_account_id: linked.account_id,
        card_type: pick(rng, ["Debit", "ATM", "Premium Debit", "Business Debit"]),
        fictional_card_number: digits,
        masked_card_number: `•••• •••• •••• ${digits.slice(-4)}`,
        issue_date: iso(since + 3 * DAY),
        expiry_date: iso(since + 1460 * DAY),
        card_status: cardStatus,
        card_holder_name: full.toUpperCase(),
        replacement_count: int(rng, 0, 2),
        block_reason: cardStatus === "BLOCKED" ? pick(rng, ["Lost", "Stolen", "Security", "Customer Request"]) : null,
        blocked_at: cardStatus === "BLOCKED" ? iso(SIM_EPOCH - int(rng, 1, 60) * DAY) : null,
        blocked_by: cardStatus === "BLOCKED" ? "EMP-2287" : null,
        pin_status: pick(rng, ["SET", "SET", "RESET_PENDING"]),
        card_limit: int(rng, 50, 500) * 1000,
        daily_cash_limit: int(rng, 20, 150) * 1000,
      });
      timeline.push({
        event_id: `TL-${cardId}`,
        customer_id: cid,
        category: "card",
        title: "Debit card issued",
        detail: `Card ${digits.slice(-4)} linked to ${linked.account_number}`,
        timestamp: iso(since + 3 * DAY),
      });
    }

    // Fixed deposits
    if (rng() > 0.55) {
      const principal = int(rng, 50, 2500) * 1000;
      const rate = Math.round((6 + rng() * 6) * 100) / 100;
      const tenure = pick(rng, [6, 12, 18, 24, 36]);
      const start = SIM_EPOCH - int(rng, 10, 500) * DAY;
      const maturity = start + tenure * 30 * DAY;
      const interest = Math.round(((principal * rate) / 100) * (tenure / 12) * 100) / 100;
      fixedDeposits.push({
        fd_id: `FD-${cid}-1`,
        customer_id: cid,
        linked_account_id: customerAccounts[0]!.account_id,
        principal_amount: principal,
        interest_rate: rate,
        tenure,
        start_date: iso(start),
        maturity_date: iso(maturity),
        expected_interest: interest,
        maturity_amount: principal + interest,
        payout_instruction: pick(rng, ["Credit to linked account", "Renew principal", "Renew principal + interest"]),
        status: maturity < SIM_EPOCH ? "MATURED" : "ACTIVE",
        early_withdrawal_allowed: rng() > 0.4,
        created_by: "EMP-2287",
        created_at: iso(start),
      });
      timeline.push({
        event_id: `TL-FD-${cid}`,
        customer_id: cid,
        category: "fd",
        title: "Fixed deposit placed",
        detail: `Principal ${principal.toLocaleString()} LKR for ${tenure} months`,
        timestamp: iso(start),
      });
    }

    // Loans
    if (rng() > 0.7) {
      const original = int(rng, 200, 9000) * 1000;
      const outstanding = Math.round(original * (0.2 + rng() * 0.7));
      const start = SIM_EPOCH - int(rng, 100, 1400) * DAY;
      loans.push({
        loan_id: `LN-${cid}-1`,
        customer_id: cid,
        account_id: customerAccounts[0]!.account_id,
        loan_type: pick(rng, ["Personal", "Vehicle", "Education", "Business", "Home"]),
        original_amount: original,
        outstanding_amount: outstanding,
        interest_rate: Math.round((8 + rng() * 9) * 100) / 100,
        monthly_payment: Math.round(original / int(rng, 24, 120)),
        start_date: iso(start),
        maturity_date: iso(start + int(rng, 700, 4000) * DAY),
        payment_status: pick(rng, ["On time", "On time", "1 instalment late", "2 instalments late"]),
        loan_status: pick(rng, ["ACTIVE", "ACTIVE", "ACTIVE", "OVERDUE", "UNDER_REVIEW", "PAID"]),
        branch_id: branch.branch_id,
      });
    }

    // Cases
    if (rng() > 0.7) {
      const created = SIM_EPOCH - int(rng, 1, 60) * DAY;
      cases.push({
        case_id: `CSE-${4000 + cases.length}`,
        customer_id: cid,
        assigned_employee: rng() > 0.4 ? pick(rng, employees).employee_id : null,
        category: pick(rng, [
          "Card issue","Account issue","Identity verification","Transfer issue","FD request",
          "Loan request","Suspicious activity","Complaint","General inquiry",
        ]),
        priority: pick(rng, ["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        status: pick(rng, ["OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_CUSTOMER", "ESCALATED", "RESOLVED", "CLOSED"]),
        subject: pick(rng, [
          "Card not working at ATM","Requesting statement copy","Unrecognised transaction",
          "Address change request","Fixed deposit maturity query","Loan rescheduling request",
        ]),
        description: "Simulated service request raised for roleplay purposes.",
        created_at: iso(created),
        updated_at: iso(created + int(rng, 1, 10) * DAY),
        resolved_at: null,
      });
    }

    // Notes
    if (rng() > 0.6) {
      notes.push({
        note_id: `NOT-${notes.length + 1}`,
        customer_id: cid,
        author: "Dinuka Rajapaksha",
        employee_id: "EMP-2287",
        timestamp: iso(SIM_EPOCH - int(rng, 1, 90) * DAY),
        note_type: pick(rng, ["Customer service note", "Identity note", "Account note", "Fraud note", "Manager note"]),
        content: "Customer contacted the branch for a simulated service enquiry. No action required.",
        visibility: "INTERNAL",
        related_case: null,
      });
    }

    // Security events
    for (let s = 0; s < 3; s++) {
      securityEvents.push({
        event_id: `SEC-${cid}-${s}`,
        customer_id: cid,
        event_type: s === 0 ? "Login" : pick(rng, ["Login", "Password change", "Failed login", "Device added"]),
        device: pick(rng, ["Chrome — Windows", "Safari — macOS", "Mobile App — Android", "Mobile App — iOS"]),
        location: city,
        timestamp: iso(SIM_EPOCH - int(rng, 1, 200) * 3600000),
        outcome: rng() > 0.85 ? "FAILED" : "SUCCESS",
      });
    }

    // Notifications
    notifications.push({
      notification_id: `NTF-${cid}-1`,
      customer_id: cid,
      category: "Account",
      title: "Welcome to Kaldhav Bank",
      body: "Your simulated banking relationship is active. All data here is fictional.",
      created_at: customer.customer_since,
      read: true,
    });
  }

  // Seed audit history
  const actions: Array<[string, AuditLog["severity"], string]> = [
    ["CUSTOMER_PROFILE_VIEWED", "INFO", "Employee opened a customer master profile"],
    ["CARD_BLOCKED", "HIGH", "Card blocked following customer report"],
    ["ACCOUNT_FROZEN", "CRITICAL", "Account frozen pending investigation"],
    ["IDENTITY_VERIFICATION_PASSED", "LOW", "Simulated identity verification passed"],
    ["FD_CREATED", "MEDIUM", "Fixed deposit opened by representative"],
    ["CUSTOMER_NOTE_ADDED", "INFO", "Internal note added to customer record"],
    ["RISK_LEVEL_CHANGED", "MEDIUM", "Customer risk classification updated"],
    ["SUSPICIOUS_ACTIVITY_FLAGGED", "HIGH", "Monitoring rule raised an alert"],
  ];
  for (let i = 0; i < 160; i++) {
    const emp = pick(rng, employees);
    const cust = pick(rng, customers);
    const [action, severity, description] = pick(rng, actions);
    auditLogs.push({
      log_id: `LOG-${10000 + i}`,
      employee_id: emp.employee_id,
      employee_name: emp.name,
      action,
      entity_type: action.startsWith("CARD") ? "card" : action.startsWith("ACCOUNT") ? "account" : "customer",
      entity_id: cust.customer_id,
      customer_id: cust.customer_id,
      timestamp: iso(SIM_EPOCH - int(rng, 1, 720) * 3600000),
      ip_placeholder: `10.${int(rng, 0, 40)}.${int(rng, 0, 255)}.${int(rng, 2, 250)}`,
      session_placeholder: `SES-${int(rng, 100000, 999999)}`,
      description,
      previous_value: null,
      new_value: null,
      severity,
    });
  }
  auditLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  transactions.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
  timeline.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return {
    branches,
    employees,
    customers,
    identities,
    accounts,
    transactions,
    cards,
    fixedDeposits,
    loans,
    cases,
    notes,
    auditLogs,
    alerts,
    notifications,
    securityEvents,
    timeline,
    simClock: iso(SIM_EPOCH),
  };
}
