import { OFFICE_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";
import { Knex } from "knex";
import { GetOfficeById } from "./office.types.js";

// ==========================================================================
// 2. INTERNAL HELPER
// ==========================================================================
export async function generateOfficeCode() {
  const PREFIX = "OFC";
  const PAD_LENGTH = 7;

  const lastRow = await db(OFFICE_TABLE)
    .select("office_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.office_code;
  const lastNumberString = lastCode.replace(PREFIX, "");
  const lastNumber = parseInt(lastNumberString, 10);

  if (isNaN(lastNumber)) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

// ==========================================================================
// office hierarchy query helper
// ==========================================================================

export const officeHierarchyQuery = (
  rootOfficeCode: string | null
): Knex.QueryBuilder => {
  return db
    .withRecursive("office_tree", (qb) => {
      qb.select("*")
        .from(OFFICE_TABLE)
        .where("office_code", rootOfficeCode)

        .unionAll((qbRecursive) => {
          qbRecursive
            .select(`${OFFICE_TABLE}.*`)
            .from(OFFICE_TABLE)
            .join(
              "office_tree",
              "office_tree.office_code",
              "=",
              `${OFFICE_TABLE}.parent_office_code`
            );
        });
    })
    .from("office_tree");
};

// ==========================================================================
// format office location to number helper
// ==========================================================================
export const formatOfficeLocation = (item: any) => {
  const {
    leader_name,
    leader_employee_code,
    leader_role,
    leader_position,
    latitude,
    longitude,
    ...officeData
  } = item;

  if (!item) return null;
  return {
    ...officeData,
    // Konversi string ke float, atau null jika datanya kosong
    latitude: latitude ? parseFloat(item.latitude) : null,
    longitude: longitude ? parseFloat(item.longitude) : null,
    leader: leader_employee_code
      ? {
          employee_code: leader_employee_code,
          name: leader_name,
          role: leader_role,
          position: leader_position,
        }
      : null,
  };
};

// ==========================================================================
// check user scope
// ==========================================================================
export const checkOfficeScope = async (
  userOfficeCode: string | null,
  targetOfficeCode: string | null
): Promise<boolean> => {
  if (userOfficeCode === targetOfficeCode) return true;

  const found = await officeHierarchyQuery(userOfficeCode)
    .where("office_tree.office_code", targetOfficeCode)
    .first();

  return !!found;
};

// ==========================================================================
// check is office exist
// ==========================================================================

export const isOfficeExist = async (id: number): Promise<GetOfficeById> => {
  const result = await db(OFFICE_TABLE).where("id", id).first();

  return result;
};
