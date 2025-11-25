import { Router } from "express";

import masterDepartmentRoutes from "@modules/departments/department.routes.js";
import masterDivisionRoutes from "@modules/divisions/division.routes.js";
import masterPositionRoutes from "@modules/positions/position.routes.js";
import masterOfficeRoutes from "@modules/offices/office.routes.js";
import masterShiftRoutes from "@modules/shifts/shift.routes.js";
import masterEmployeeRoutes from "@modules/employees/employee.routes.js";
import userRoutes from "@modules/users/user.routes.js";
import profileRoutes from "@modules/profiles/profile.routes.js";
import authRoutes from "@modules/auth/auth.routes.js";
import masterLeaveTypeRoutes from "@modules/leave-types/leave-type.routes.js";
import payrollPeriodRoutes from "@modules/payroll-periods/payroll-period.routes.js";
import payrollRoutes from "@modules/payroll/payroll.routes.js";
import attendanceSessionRoutes from "@modules/attendance-sessions/session.routes.js";

// Employee Specific Routes
import employeeAttendanceRoutes from "@modules/attendances/employee-attendance.routes.js";
import employeeLeaveRequestRoutes from "@modules/leave-requests/employee-leave-request.routes.js";
import employeeLeaveBalanceRoutes from "@modules/leave-balances/employee-leave-balance.routes.js";
import employeeDashboardRoutes from "@modules/dashboard/employee-dashboard.routes.js";

// Admin Specific Routes
import adminAttendanceRoutes from "@modules/attendances/admin-attendance.routes.js";
import adminLeaveRequestRoutes from "@modules/leave-requests/admin-leave-request.route.js";
import adminLeaveBalanceRoutes from "@modules/leave-balances/admin-leave-balance.routes.js";
import adminDashboardRoutes from "@modules/dashboard/admin-dashboard.routes.js";

const router = Router();

// ==========================
// ||    Master Data       ||
// ==========================
router.use("/master-departments", masterDepartmentRoutes);
router.use("/master-divisions", masterDivisionRoutes);
router.use("/master-positions", masterPositionRoutes);
router.use("/master-employees", masterEmployeeRoutes);
router.use("/master-leave-types", masterLeaveTypeRoutes);
router.use("/master-offices", masterOfficeRoutes);
router.use("/master-shifts", masterShiftRoutes);

// ==========================
// ||    Core Features     ||
// ==========================
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/attendance-sessions", attendanceSessionRoutes);
router.use("/payroll-periods", payrollPeriodRoutes);
router.use("/payrolls", payrollRoutes);

// ==========================
// ||   Employee Portal    ||
// ==========================
router.use("/employee/attendances", employeeAttendanceRoutes);
router.use("/employee/leave-requests", employeeLeaveRequestRoutes);
router.use("/employee/leave-balances", employeeLeaveBalanceRoutes);
router.use("/employee/dashboards", employeeDashboardRoutes);

// ==========================
// ||    Admin Portal      ||
// ==========================
router.use("/admin/attendances", adminAttendanceRoutes);
router.use("/admin/dashboard", adminDashboardRoutes);
router.use("/admin/leave-requests", adminLeaveRequestRoutes);
router.use("/admin/leave-balances", adminLeaveBalanceRoutes);

export default router;
