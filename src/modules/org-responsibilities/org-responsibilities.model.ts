import { Knex } from "knex";
import {
  CreateOrgResponsibilites,
  GetOrgResponsibilitiesById,
  OrgResponsibilities,
  UnassignLeader,
  UpdateOrgResponsibilities,
} from "./org-responsibilities.types.js";
import { format } from "date-fns";
import {
  DEPARTMENT_TABLE,
  DIVISION_TABLE,
  EMPLOYEE_TABLE,
  OFFICE_TABLE,
  ORG_RESPONSIBILITIES_TABLE,
  POSITION_TABLE,
} from "@common/constants/database.js";
import { db } from "@database/connection.js";
import { toOrgResponsibilitiesSimpleResponse } from "./org-responsibilities.helper.js";

/**
 * Get all organization leader
 */
export const getAllOrganizationLeader = async (
  page: number,
  limit: number,
  filterEmployeeCode?: string,
  filterScopeType?: string,
  filterIsActive?: string,
  search?: string
) => {
  const offset = (page - 1) * limit;

  const query = db(`${ORG_RESPONSIBILITIES_TABLE}`)
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(`${OFFICE_TABLE}`, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${OFFICE_TABLE}.office_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "office");
    })
    .leftJoin(`${DEPARTMENT_TABLE}`, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${DEPARTMENT_TABLE}.department_code`
        )
        .andOnVal(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_type`,
          "=",
          "department"
        );
    })
    .leftJoin(`${DIVISION_TABLE}`, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${DIVISION_TABLE}.division_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "division");
    });

  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${EMPLOYEE_TABLE}.full_name`, "like", `%${search}%`)
        .orWhere(`${OFFICE_TABLE}.name`, "like", `%${search}%`)
        .orWhere(`${DEPARTMENT_TABLE}.name`, "like", `%${search}%`)
        .orWhere(`${DIVISION_TABLE}.name`, "like", `%${search}%`);
    });
  }

  if (filterEmployeeCode) {
    query.where(
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      "like",
      `%${filterEmployeeCode}%`
    );
  }

  if (filterScopeType) {
    query.where(
      `${ORG_RESPONSIBILITIES_TABLE}.scope_type`,
      "like",
      `%${filterScopeType}%`
    );
  }

  if (filterIsActive) {
    const isActive = parseInt(filterIsActive, 10);

    query.where(
      `${ORG_RESPONSIBILITIES_TABLE}.is_active`,
      "like",
      `%${isActive}%`
    );
  }

  const countQuery = query
    .clone()
    .clearSelect()
    .count(`${ORG_RESPONSIBILITIES_TABLE}.id as total`)
    .first();

  const dataQuery = query
    .select(
      `${ORG_RESPONSIBILITIES_TABLE}.id`,
      `${ORG_RESPONSIBILITIES_TABLE}.scope_type`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${ORG_RESPONSIBILITIES_TABLE}.role`,
      `${ORG_RESPONSIBILITIES_TABLE}.start_date`,
      `${ORG_RESPONSIBILITIES_TABLE}.end_date`,
      `${ORG_RESPONSIBILITIES_TABLE}.is_active`,
      `${EMPLOYEE_TABLE}.full_name as employee_name`,

      // LOGIC PINTAR: Gabungkan 3 tabel jadi satu kolom 'unit_name'
      db.raw(`
        COALESCE(${OFFICE_TABLE}.name, ${DEPARTMENT_TABLE}.name, ${DIVISION_TABLE}.name) as unit_name
      `)
    )
    .orderBy(`${ORG_RESPONSIBILITIES_TABLE}.start_date`, "desc") // Urutkan dari yang terbaru (PENTING)
    .limit(limit)
    .offset(offset);

  const [totalResult, rawData] = await Promise.all([countQuery, dataQuery]);

  const total = totalResult ? Number(totalResult.total) : 0;
  const totalPage = Math.ceil(total / limit);

  const data = rawData.map(toOrgResponsibilitiesSimpleResponse);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      total_page: totalPage,
    },
  };
};

/**
 * Get organization leader by id
 */
export const getOrganizationLeaderById = async (
  id: number
): Promise<GetOrgResponsibilitiesById> => {
  return await db(ORG_RESPONSIBILITIES_TABLE)
    .select(
      `${ORG_RESPONSIBILITIES_TABLE}.*`,

      `${EMPLOYEE_TABLE}.full_name as employee_name`,

      // LOGIC PINTAR: Gabungkan 3 tabel jadi satu kolom 'unit_name'
      db.raw(`
        COALESCE(${OFFICE_TABLE}.name, ${DEPARTMENT_TABLE}.name, ${DIVISION_TABLE}.name) as unit_name
      `)
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(`${OFFICE_TABLE}`, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${OFFICE_TABLE}.office_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "office");
    })
    .leftJoin(`${DEPARTMENT_TABLE}`, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${DEPARTMENT_TABLE}.department_code`
        )
        .andOnVal(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_type`,
          "=",
          "department"
        );
    })
    .leftJoin(`${DIVISION_TABLE}`, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${DIVISION_TABLE}.division_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "division");
    })
    .where(`${ORG_RESPONSIBILITIES_TABLE}.id`, id)
    .first();
};

/**
 * Create organization leader
 */
export const addOrganizationLeader = async (
  connection: Knex.Transaction,
  data: CreateOrgResponsibilites
): Promise<OrgResponsibilities> => {
  const { employee_code, scope_type, scope_code, role, start_date } = data;

  const dateObj = start_date ? new Date(start_date) : new Date();

  const effectiveDate = format(dateObj, "yyyy-MM-dd");

  await connection(ORG_RESPONSIBILITIES_TABLE)
    .where({
      scope_type,
      scope_code,
      is_active: true,
    })
    .update({
      is_active: false,
      end_date: effectiveDate,
    });

  const [id] = await connection(ORG_RESPONSIBILITIES_TABLE).insert({
    employee_code,
    scope_type,
    scope_code,
    role,
    start_date: effectiveDate,
    is_active: true,
  });

  return connection(ORG_RESPONSIBILITIES_TABLE).where({ id }).first();
};

/**
 * Unassign organization leader
 */
export const unassignOrganizationLeader = async (
  connection: Knex.Transaction,
  data: UnassignLeader
): Promise<GetOrgResponsibilitiesById | null> => {
  const { scope_type, scope_code, end_date } = data;

  // 1. Cari Pimpinan yang Sedang Menjabat (Active)
  const currentLeader = await connection(ORG_RESPONSIBILITIES_TABLE)
    .where({
      scope_type,
      scope_code,
      is_active: 1, // Cari yang aktif
    })
    .first();

  // Jika tidak ada pimpinan aktif, kembalikan null
  if (!currentLeader) {
    return null;
  }

  // 2. Tentukan Tanggal Berhenti
  // Jika user kirim tanggal, pakai itu. Jika tidak, pakai waktu sekarang.
  const dateObj = end_date ? new Date(end_date) : new Date();

  const effectiveEndDate = format(dateObj, "yyyy-MM-dd");

  // 3. Non-aktifkan Pimpinan Tersebut
  await connection(ORG_RESPONSIBILITIES_TABLE)
    .where({ id: currentLeader.id }) // Update berdasarkan ID yang ditemukan
    .update({
      is_active: 0, // Matikan
      end_date: effectiveEndDate,
      updated_at: new Date(),
    });

  // 4. Return data pimpinan yang baru saja diberhentikan (untuk info response)
  return await connection(ORG_RESPONSIBILITIES_TABLE)
    // Join Employee
    .leftJoin(
      EMPLOYEE_TABLE,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )

    // Join Office (Polymorphic)
    .leftJoin(OFFICE_TABLE, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${OFFICE_TABLE}.office_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "office");
    })

    // Join Department (Polymorphic)
    .leftJoin(DEPARTMENT_TABLE, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${DEPARTMENT_TABLE}.department_code`
        )
        .andOnVal(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_type`,
          "=",
          "department"
        );
    })

    // Join Division (Polymorphic)
    .leftJoin(DIVISION_TABLE, (join) => {
      join
        .on(
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`,
          "=",
          `${DIVISION_TABLE}.division_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "division");
    })

    // Join Position (Untuk ambil nama pangkat fungsional)
    .leftJoin(
      POSITION_TABLE,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
    )

    // Select Columns dengan Template Literals
    .select(
      `${ORG_RESPONSIBILITIES_TABLE}.*`,
      `${EMPLOYEE_TABLE}.full_name as employee_name`,
      `${POSITION_TABLE}.name as position_name`,

      // Logic COALESCE menggunakan variabel tabel
      connection.raw(
        `COALESCE(${OFFICE_TABLE}.name, ${DEPARTMENT_TABLE}.name, ${DIVISION_TABLE}.name) as unit_name`
      )
    )
    .where(`${ORG_RESPONSIBILITIES_TABLE}.id`, currentLeader.id)
    .first();
};

/**
 * Update organization leader
 */
export const editOrganizationLeader = async (
  connection: Knex.Transaction,
  id: number,
  data: UpdateOrgResponsibilities
): Promise<OrgResponsibilities> => {
  const { role, start_date, end_date } = data;

  await connection(ORG_RESPONSIBILITIES_TABLE)
    .where({ id })
    .update({ role, start_date, end_date });

  return await connection(ORG_RESPONSIBILITIES_TABLE).where({ id }).first();
};

/**
 * Delete organization leader
 */
export const removeOrganizationLeader = async (id: number): Promise<number> => {
  // Mengembalikan jumlah row yang dihapus (0 = tidak ketemu, 1 = sukses)
  return await db(ORG_RESPONSIBILITIES_TABLE).where({ id }).del();
};
