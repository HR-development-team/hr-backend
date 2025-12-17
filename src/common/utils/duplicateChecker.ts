import { Knex } from "knex";

export const isDuplicate = async (
  db: Knex,
  tableName: string,
  criteria: Record<string, any>,
  excludeId?: string | number,
  idColumn: string = "id"
): Promise<boolean> => {
  const query = db(tableName).where(criteria);

  if (excludeId) {
    query.whereNot(idColumn, excludeId);
  }

  const result = await query.first();

  return !!result;
};
