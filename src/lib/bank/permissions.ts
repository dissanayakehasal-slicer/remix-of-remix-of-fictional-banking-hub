import type { Permission, RoleId } from "./types";

export const ROLE_LABELS: Record<RoleId, string> = {
  customer: "Customer",
  teller: "Teller",
  csr: "Customer Service Representative",
  manager: "Branch Manager",
  fraud: "Fraud & Security Officer",
  compliance: "Compliance Officer",
  admin: "System Administrator",
};

const TELLER: Permission[] = [
  "customer.view",
  "customer.search",
  "account.view",
  "card.view",
  "fd.view",
  "loan.view",
  "case.create",
];

const CSR: Permission[] = [
  ...TELLER,
  "customer.edit",
  "identity.verify",
  "card.block",
  "card.unblock",
  "card.replace",
  "fd.create",
  "case.assign",
];

const MANAGER: Permission[] = [
  ...CSR,
  "account.freeze",
  "account.unfreeze",
  "account.open",
  "account.close",
  "fd.close",
  "fraud.view",
  "audit.view",
];

const FRAUD: Permission[] = [
  "customer.view",
  "customer.search",
  "account.view",
  "account.freeze",
  "account.unfreeze",
  "card.view",
  "card.block",
  "fd.view",
  "loan.view",
  "case.create",
  "case.assign",
  "fraud.view",
  "fraud.manage",
  "audit.view",
];

const COMPLIANCE: Permission[] = [
  "customer.view",
  "customer.search",
  "identity.verify",
  "account.view",
  "card.view",
  "fd.view",
  "loan.view",
  "fraud.view",
  "audit.view",
];

const ALL: Permission[] = [
  ...new Set<Permission>([
    ...MANAGER,
    ...FRAUD,
    ...COMPLIANCE,
    "admin.manage",
  ]),
];

export const ROLE_PERMISSIONS: Record<RoleId, Permission[]> = {
  customer: [],
  teller: TELLER,
  csr: CSR,
  manager: MANAGER,
  fraud: FRAUD,
  compliance: COMPLIANCE,
  admin: ALL,
};

export const ALL_PERMISSIONS: Permission[] = ALL;

export function can(role: RoleId | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}
