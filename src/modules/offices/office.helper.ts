import { OFFICE_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";
import { Knex } from "knex";
import { GetOfficeById } from "./office.types.js";

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
  if (!item) return null;
  return {
    ...item,
    // Konversi string ke float, atau null jika datanya kosong
    latitude: item.latitude ? parseFloat(item.latitude) : null,
    longitude: item.longitude ? parseFloat(item.longitude) : null,
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
