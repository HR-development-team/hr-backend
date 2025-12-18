import { POSITION_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";
import { OrganizationTree, PositionRaw } from "./position.types.js";

// --- [HELPER 1] ALGORITMA PENYUSUN POHON ---
export const buildOrganizationTree = (
  items: PositionRaw[]
): OrganizationTree[] => {
  const dataMap: { [key: string]: OrganizationTree } = {};

  items.forEach((item) => {
    dataMap[item.position_code] = {
      position_code: item.position_code,
      name: item.name,
      employee_code: item.employee_code,
      employee_name: item.employee_name,
      children: [],
    };
  });

  const tree: OrganizationTree[] = [];

  items.forEach((item) => {
    const node = dataMap[item.position_code];
    if (item.parent_position_code && dataMap[item.parent_position_code]) {
      dataMap[item.parent_position_code].children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
};

export const isPositionNameExist = async (
  divisionCode: string,
  name: string
): Promise<Boolean> => {
  const result = await db(POSITION_TABLE)
    .where({
      division_code: divisionCode,
      name: name,
    })
    .first();

  return !!result;
};

export const positionSortOrder = async (): Promise<number> => {
  const maxResult = await db(POSITION_TABLE)
    .max("sort_order as maxVal")
    .first();
  const maxVal = maxResult?.maxVal as number | null;

  return (maxVal || 0) + 1;
};
