import { appLogger } from "@common/utils/logger.js";
import { db } from "@database/connection.js";
import { format, getDay } from "date-fns";
import cron from "node-cron";
import { bulkCreateAttendance, fetchAutoAlphaData } from "./autoAlpha.repo.js";
import {
  checkIsHoliday,
  checkIsWorkDay,
  shouldMarkAlpha,
} from "./autoAlpha.helper.js";

export const runAutoAlphoJob = () => {
  // const scheduleTesting = "* * * * *"; // for testing purposes

  const scheduleProd = "0,30 * * * *"; // for production purposes

  cron.schedule(scheduleProd, async () => {
    appLogger.info("[CRON] Starting Checking Auto Alpha");

    const trx = await db.transaction();

    try {
      const now = new Date();
      const todayDate = format(now, "yyyy-MM-dd");
      const dateForCode = format(now, "yyyyMMdd");

      const { employees, presentEmployeeCodes, todayHolidays } =
        await fetchAutoAlphaData(trx);

      let alphaRecords = [];

      const todayIndex = getDay(now);

      for (const emp of employees) {
        // Skip if already attend
        if (presentEmployeeCodes.has(emp.employee_code)) continue;

        // Skip if shift data is incomplete
        if (!emp.start_time || !emp.end_time) continue;

        if (!checkIsWorkDay(emp.work_days, todayIndex)) continue;

        if (checkIsHoliday(todayHolidays, emp.office_code)) continue;

        if (shouldMarkAlpha(now, todayDate, emp.start_time, emp.end_time)) {
          const code = `ATT-${dateForCode}-${emp.employee_code}`;

          alphaRecords.push({
            attendance_code: code,
            employee_code: emp.employee_code,
            shift_code: emp.shift_code,
            date: todayDate,
            check_in_time: null, // Explicitly null
            check_out_time: null, // Explicitly null
            check_in_status: "absent",
            check_out_status: "missed",
            late_minutes: 0,
            overtime_minutes: 0,
            created_at: now,
            updated_at: now,
          });
        }
      }

      if (alphaRecords.length > 0) {
        await bulkCreateAttendance(trx, alphaRecords);
      } else {
        appLogger.info(
          "[CRON] Semua karyawan (yang memiliki shift) sudah absen/alpha hari ini"
        );
      }

      await trx.commit();
      appLogger.info(`[CRON] Done. ${alphaRecords.length} employees Alpha`);
    } catch (error) {
      await trx.rollback();
      appLogger.error(`[CRON] Error: ${error}`);
    }
  });
};
