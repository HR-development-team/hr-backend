import { db } from "@database/connection.js";
import {
  EMPLOYEE_TABLE,
  OFFICE_TABLE,
  ORG_RESPONSIBILITIES_TABLE,
  POSITION_TABLE,
} from "@constants/database.js";
import {
  CreateOffice,
  GetAllOfficesResponse,
  GetOfficeById,
  Office,
  UpdateOffice,
  OfficeOption,
} from "./office.types.js";
import {
  formatOfficeLocation,
  generateOfficeCode,
  officeHierarchyQuery,
} from "./office.helper.js";

// ==========================================================================
// 3. MAIN EXPORTED FUNCTIONS
// ==========================================================================

/**
 * Service to get all offices with pagination and search
 */
export const getAllOffices = async (
  page: number,
  limit: number,
  userOfficeCode: string | null,
  search: string,
  filterParent: string
): Promise<GetAllOfficesResponse> => {
  const offset = (page - 1) * limit;

  // Default: Root is the current user's office
  let targetRoot = userOfficeCode;

  // 1. HANDLE SUB-TREE FILTER
  if (filterParent && userOfficeCode) {
    // Security Check: Ensure the requested parent is within the user's scope
    const isAllowed = await officeHierarchyQuery(userOfficeCode)
      .where("office_tree.office_code", filterParent)
      .first();

    if (isAllowed) {
      targetRoot = filterParent;
    } else {
      // User is trying to view an office outside their permission
      return {
        data: [],
        meta: { page, limit, total: 0, total_page: 0 },
      };
    }
  }

  // 2. Build the Hierarchy Query
  const query = officeHierarchyQuery(targetRoot!).leftJoin(
    `${OFFICE_TABLE} as parent`,
    "office_tree.parent_office_code",
    "parent.office_code"
  );

  // 3. EXCLUSION LOGIC: Remove the selected parent from results
  // We only do this if a specific filter was requested
  if (filterParent) {
    query.whereNot("office_tree.office_code", filterParent);
  }

  // 4. Search Logic
  if (search) {
    query.andWhere((builder) => {
      builder
        .where("office_tree.office_code", "like", `%${search}%`)
        .orWhere("office_tree.name", "like", `%${search}%`);
    });
  }

  // 5. Count Query
  const countQuery = query
    .clone()
    .clearSelect()
    .count("office_tree.id as total")
    .first();

  // 6. Data Query
  const dataQuery = query
    .select(
      "office_tree.*",
      "parent.name as parent_office_name",

      // leader name
      `${EMPLOYEE_TABLE}.full_name as leader_name`,
      `${EMPLOYEE_TABLE}.employee_code as leader_employee_code`,

      // leader rolee
      `${ORG_RESPONSIBILITIES_TABLE}.role as leader_role`,

      // leader position
      `${POSITION_TABLE}.name as leader_position`
    )
    .leftJoin(`${ORG_RESPONSIBILITIES_TABLE}`, (join) => {
      join
        .on(
          "office_tree.office_code",
          "=",
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "office")
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.is_active`, "=", 1);
    })
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
    )
    .orderBy("office_tree.sort_order", "asc")
    .orderBy("office_tree.id", "asc")
    .limit(limit)
    .offset(offset);

  const [totalResult, rawData] = await Promise.all([countQuery, dataQuery]);

  const total = totalResult ? Number(totalResult.total) : 0;
  const totalPage = Math.ceil(total / limit);
  const data = rawData.map(formatOfficeLocation);

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

export const getOfficeOptions = async (
  userOfficeCode: string | null,
  search: string
): Promise<OfficeOption[]> => {
  if (!userOfficeCode) return [];

  const query = officeHierarchyQuery(userOfficeCode);

  // 2. Search Logic (Optional, for autocomplete dropdowns)
  if (search) {
    query.andWhere((builder) => {
      builder
        .where("office_tree.office_code", "like", `%${search}%`)
        .orWhere("office_tree.name", "like", `%${search}%`);
    });
  }

  // 3. Select ONLY what is needed
  // No limit, no offset, no count query.
  const results = await query
    .select("office_tree.office_code", "office_tree.name")
    .orderBy("office_tree.sort_order", "asc")
    .orderBy("office_tree.name", "asc");

  return results;
};

/**
 * Get office by ID.
 */
export const getMasterOfficeById = async (
  id: number,
  userOfficeCode: string | null
): Promise<GetOfficeById | null> => {
  if (!userOfficeCode) return null;

  const result = await officeHierarchyQuery(userOfficeCode)
    .select(
      "office_tree.*",
      "parent.name as parent_office_name",

      // leader name
      `${EMPLOYEE_TABLE}.full_name as leader_name`,
      `${EMPLOYEE_TABLE}.employee_code as leader_employee_code`,

      // leader role
      `${ORG_RESPONSIBILITIES_TABLE}.role as leader_role`,

      // leader position
      `${POSITION_TABLE}.name as leader_position`
    )
    .leftJoin(
      `${OFFICE_TABLE} as parent`,
      "office_tree.parent_office_code",
      "parent.office_code"
    )
    .leftJoin(`${ORG_RESPONSIBILITIES_TABLE}`, (join) => {
      join
        .on(
          "office_tree.office_code",
          "=",
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "office")
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.is_active`, "=", 1);
    })
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
    )
    .where("office_tree.id", id)
    .first();

  return formatOfficeLocation(result);
};

export const getMasterOfficeByCode = async (
  officeCodeParams: string,
  officeCode: string | null
): Promise<GetOfficeById | null> => {
  const result = await officeHierarchyQuery(officeCode)
    .select(
      "office_tree.*",
      "parent.name as parent_office_name",

      // leader name
      `${EMPLOYEE_TABLE}.full_name as leader_name`,
      `${EMPLOYEE_TABLE}.employee_code as leader_employee_code`,

      // leader rolee
      `${ORG_RESPONSIBILITIES_TABLE}.role as leader_role`,

      // leader position
      `${POSITION_TABLE}.name as leader_position`
    )
    .leftJoin(
      `${OFFICE_TABLE} as parent`,
      "office_tree.parent_office_code",
      "parent.office_code"
    )
    .leftJoin(`${ORG_RESPONSIBILITIES_TABLE}`, (join) => {
      join
        .on(
          "office_tree.office_code",
          "=",
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "office")
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.is_active`, "=", 1);
    })
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
    )
    .where("office_tree.office_code", officeCodeParams)
    .first();

  return formatOfficeLocation(result);
};

/**
 * [BARU] Mengambil SEMUA data untuk struktur ORGANIZATION (Tree)
 */
export const getAllOfficesOrganization = async (): Promise<any[]> => {
  const results = await db(OFFICE_TABLE).select(
    "id",
    "office_code",
    "name",
    "address",
    "description",
    "parent_office_code",
    "latitude",
    "longitude"
  );

  return results.map(formatOfficeLocation);
};

/**
 * Creates new office.
 */
export const addMasterOffice = async (data: CreateOffice): Promise<Office> => {
  const office_code = await generateOfficeCode();

  let finalSortOrder = data.sort_order;
  if (!finalSortOrder) {
    const maxResult = await db(OFFICE_TABLE)
      .max("sort_order as maxVal")
      .first();
    const maxVal = maxResult?.maxVal as number | null;
    finalSortOrder = (maxVal || 0) + 1;
  }

  const officeToInsert = {
    parent_office_code: data.parent_office_code || null,
    office_code,
    name: data.name,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    radius_meters: data.radius_meters,
    sort_order: finalSortOrder,
    description: data.description || null,
  };

  const [id] = await db(OFFICE_TABLE).insert(officeToInsert);

  // SELECT EKSPLISIT (Agar urutan rapi & tanpa created_at/updated_at)
  const result = await db(OFFICE_TABLE)
    .select(
      "id",
      "office_code",
      "parent_office_code",
      "name",
      "address",
      "latitude",
      "longitude",
      "radius_meters",
      "sort_order", // <--- Posisi di atas description
      "description"
    )
    .where({ id })
    .first();

  return formatOfficeLocation(result);
};

/**
 * Edit an existing office record.
 */
// FIX PRETTIER: Parameter diturunkan ke bawah
export const editMasterOffice = async (
  data: UpdateOffice
): Promise<Office | null> => {
  const { id, ...updateData } = data;

  await db(OFFICE_TABLE).where({ id }).update(updateData);

  // SELECT EKSPLISIT (Agar urutan rapi & tanpa created_at/updated_at)
  const result = await db(OFFICE_TABLE)
    .select(
      "id",
      "office_code",
      "parent_office_code",
      "name",
      "address",
      "latitude",
      "longitude",
      "radius_meters",
      "sort_order", // <--- Posisi di atas description
      "description"
    )
    .where({ id })
    .first();

  return formatOfficeLocation(result);
};

export const removeMasterOffice = async (id: number): Promise<number> =>
  await db(OFFICE_TABLE).where({ id }).delete();

export const hasChildOffices = async (officeCode: string): Promise<boolean> => {
  const result = await db(OFFICE_TABLE)
    .where("parent_office_code", officeCode)
    .first();
  return !!result; // Return true jika ada anak, false jika tidak
};
