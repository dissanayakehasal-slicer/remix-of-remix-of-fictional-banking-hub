// Fictional banking simulation — all records are invented for roleplay only.

export type RoleId =
  | "customer"
  | "teller"
  | "csr"
  | "manager"
  | "fraud"
  | "compliance"
  | "admin";

export type Permission =
  | "customer.view"
  | "customer.edit"
  | "customer.search"
  | "identity.verify"
  | "account.view"
  | "account.freeze"
  | "account.unfreeze"
  | "account.open"
  | "account.close"
  | "card.view"
  | "card.block"
  | "card.unblock"
  | "card.replace"
  | "fd.view"
  | "fd.create"
  | "fd.close"
  | "loan.view"
  | "case.create"
  | "case.assign"
  | "fraud.view"
  | "fraud.manage"
  | "audit.view"
  | "admin.manage";

export interface Branch {
  branch_id: string;
  branch_code: string;
  branch_name: string;
  address: string;
  telephone: string;
  manager: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface Employee {
  employee_id: string;
  employee_code: string;
  name: string;
  role: RoleId;
  branch_id: string;
  department: string;
  status: "ACTIVE" | "SUSPENDED";
  last_login: string;
}

export type CustomerStatus = "ACTIVE" | "SUSPENDED" | "FROZEN" | "UNDER_REVIEW" | "CLOSED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type VerificationStatus =
  | "NOT_VERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "FAILED"
  | "EXPIRED"
  | "REVIEW_REQUIRED";

export interface Customer {
  id: string;
  customer_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  preferred_name: string;
  gender: string;
  date_of_birth: string;
  age: number;
  occupation: string;
  employer: string;
  marital_status: string;
  nationality: string;
  residential_address: string;
  mailing_address: string;
  city: string;
  postal_code: string;
  phone_number: string;
  email: string;
  mothers_name: string;
  fathers_name: string;
  emergency_contact: string;
  customer_since: string;
  branch_id: string;
  customer_status: CustomerStatus;
  risk_level: RiskLevel;
  verification_status: VerificationStatus;
  last_login: string;
  failed_logins: number;
  created_at: string;
  updated_at: string;
}

export interface IdentityRecord {
  identity_id: string;
  customer_id: string;
  identification_type: string;
  fictional_document_number: string;
  issuing_country: string;
  issue_date: string;
  expiry_date: string;
  verification_status: VerificationStatus;
  verification_date: string | null;
  verification_method: string;
  verified_by: string | null;
  verification_notes: string;
}

export type AccountStatus =
  | "ACTIVE"
  | "DORMANT"
  | "FROZEN"
  | "SUSPENDED"
  | "CLOSED"
  | "UNDER_REVIEW";

export interface Account {
  id: string;
  account_id: string;
  customer_id: string;
  account_number: string;
  account_type: string;
  currency: string;
  balance: number;
  available_balance: number;
  opened_date: string;
  branch_id: string;
  status: AccountStatus;
  account_nickname: string;
  interest_rate: number;
  overdraft_limit: number;
  last_activity: string;
  closed_date: string | null;
  closure_reason: string | null;
}

export type TransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "DECLINED"
  | "REVERSED"
  | "UNDER_REVIEW";

export interface Transaction {
  transaction_id: string;
  account_id: string;
  customer_id: string;
  transaction_reference: string;
  transaction_type: string;
  amount: number;
  currency: string;
  description: string;
  merchant_name: string;
  channel: string;
  location: string;
  transaction_date: string;
  status: TransactionStatus;
  resulting_balance: number;
  risk_flag: boolean;
  created_at: string;
}

export type CardStatus =
  | "ACTIVE"
  | "BLOCKED"
  | "EXPIRED"
  | "REPLACEMENT_PENDING"
  | "CANCELLED"
  | "SUSPENDED";

export interface Card {
  card_id: string;
  customer_id: string;
  linked_account_id: string;
  card_type: string;
  fictional_card_number: string;
  masked_card_number: string;
  issue_date: string;
  expiry_date: string;
  card_status: CardStatus;
  card_holder_name: string;
  replacement_count: number;
  block_reason: string | null;
  blocked_at: string | null;
  blocked_by: string | null;
  pin_status: string;
  card_limit: number;
  daily_cash_limit: number;
}

export type FdStatus = "ACTIVE" | "MATURED" | "CLOSED" | "BROKEN" | "RENEWED";

export interface FixedDeposit {
  fd_id: string;
  customer_id: string;
  linked_account_id: string;
  principal_amount: number;
  interest_rate: number;
  tenure: number;
  start_date: string;
  maturity_date: string;
  expected_interest: number;
  maturity_amount: number;
  payout_instruction: string;
  status: FdStatus;
  early_withdrawal_allowed: boolean;
  created_by: string;
  created_at: string;
}

export type LoanStatus = "ACTIVE" | "PAID" | "OVERDUE" | "DEFAULT" | "UNDER_REVIEW" | "CLOSED";

export interface Loan {
  loan_id: string;
  customer_id: string;
  account_id: string;
  loan_type: string;
  original_amount: number;
  outstanding_amount: number;
  interest_rate: number;
  monthly_payment: number;
  start_date: string;
  maturity_date: string;
  payment_status: string;
  loan_status: LoanStatus;
  branch_id: string;
}

export type CaseStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING_CUSTOMER"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export interface ServiceCase {
  case_id: string;
  customer_id: string;
  assigned_employee: string | null;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: CaseStatus;
  subject: string;
  description: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface CustomerNote {
  note_id: string;
  customer_id: string;
  author: string;
  employee_id: string;
  timestamp: string;
  note_type: string;
  content: string;
  visibility: "INTERNAL" | "RESTRICTED";
  related_case: string | null;
}

export interface AuditLog {
  log_id: string;
  employee_id: string;
  employee_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  customer_id: string | null;
  timestamp: string;
  ip_placeholder: string;
  session_placeholder: string;
  description: string;
  previous_value: string | null;
  new_value: string | null;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export type AlertStatus = "NEW" | "REVIEWING" | "ESCALATED" | "CLEARED" | "CONFIRMED" | "CLOSED";

export interface SuspiciousAlert {
  alert_id: string;
  customer_id: string;
  account_id: string;
  transaction_id: string | null;
  alert_type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: AlertStatus;
  detected_at: string;
  assigned_to: string | null;
  description: string;
  resolution: string | null;
}

export interface Notification {
  notification_id: string;
  customer_id: string;
  category: "Security" | "Account" | "Card" | "Transaction" | "FD" | "Loan" | "Service Request";
  title: string;
  body: string;
  created_at: string;
  read: boolean;
}

export interface SecurityEvent {
  event_id: string;
  customer_id: string;
  event_type: string;
  device: string;
  location: string;
  timestamp: string;
  outcome: "SUCCESS" | "FAILED";
}

export interface TimelineEvent {
  event_id: string;
  customer_id: string;
  category: "account" | "card" | "security" | "case" | "transaction" | "identity" | "fd" | "loan";
  title: string;
  detail: string;
  timestamp: string;
}

export interface BankState {
  branches: Branch[];
  employees: Employee[];
  customers: Customer[];
  identities: IdentityRecord[];
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  fixedDeposits: FixedDeposit[];
  loans: Loan[];
  cases: ServiceCase[];
  notes: CustomerNote[];
  auditLogs: AuditLog[];
  alerts: SuspiciousAlert[];
  notifications: Notification[];
  securityEvents: SecurityEvent[];
  timeline: TimelineEvent[];
  simClock: string;
}

export interface Session {
  kind: "employee" | "customer";
  employeeId?: string;
  customerId?: string;
}
