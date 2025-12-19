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
};
