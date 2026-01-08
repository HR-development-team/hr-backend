export const API_STATUS = {
  SUCCESS: "00",
  FAILED: "01",
  PENDING: "02",
  NOT_FOUND: "03",
  UNAUTHORIZED: "04",
  CONFLICT: "05",
  BAD_REQUEST: "99",
};

export const RESPONSE_DATA_KEYS = {
  // Master Data
  DEPARTMENTS: "master_departments",
  DIVISIONS: "master_divisions",
  POSITIONS: "master_positions",
  EMPLOYEES: "master_employees",
  OFFICES: "master_offices",
  SHIFTS: "master_shifts",
  LEAVE_TYPES: "leave_types",
  USERS: "users",
  ROLES: "roles",
  FEATURES: "features",
  PERMISSIONS: "role_permissions",
  AUTH: "auth",
  EMPLOYMENT_STATUS: "employment_status",

  // transaction Data
  ATTENDANCES: "attendances",
  ATTENDANCE_SESSIONS: "attendance_sessions",
  LEAVE_REQUESTS: "leave_requests",
  LEAVE_BALANCES: "leave_balances",
  PAYROLL_PERIODS: "payroll_periods",
  PAYROLLS: "payrolls",

  // holidays data
  HOLIDAYS: "holidays",

  // Bank Account
  BANK_ACCOUNT: "bank_accounts",

  // Master Bank
  BANK: "master_banks",

  // Leader
  ORG_RESPONSIBILITIES: "org_responsibilities",
};

export const FEATURES = {
  USER_MANAGEMENT: "FTR0000001",
  ROLE_MANAGEMENT: "FTR0000002",
  EMPLOYEE_MANAGEMENT: "FTR0000003",
  OFFICE_MANAGEMENT: "FTR0000004",
  DEPARTMENT_MANAGEMENT: "FTR0000005",
  DIVISION_MANAGEMENT: "FTR0000006",
  POSITION_MANAGEMENT: "FTR0000007",
  ORGANIZATION_MANAGEMENT: "FTR0000008",
  LEAVE_REQUEST_MANAGEMENT: "FTR0000009",
  LEAVE_BALANCE_MANAGEMENT: "FTR0000010",
  SHIFT_MANAGEMENT: "FTR0000011",
};

export const PERMISSIONS = {
  READ: "can_read",
  CREATE: "can_create",
  UPDATE: "can_update",
  DELETE: "can_delete",
  PRINT: "can_print",
};
