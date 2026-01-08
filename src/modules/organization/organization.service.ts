import { buildOrganizationTree } from "./organization.helper.js";
import * as OrgModel from "./organization.model.js";
import { OrganizationNode } from "./organization.type.js";

export const getOrgStructureService = async (
  targetOfficeCode: string
): Promise<OrganizationNode[]> => {
  const officeInfo = await OrgModel.getOfficeInfo(targetOfficeCode);

  if (!officeInfo) {
    throw new Error("Office not found");
  }

  const officeCodes = [targetOfficeCode];

  const [departments, divisions, positions] = await Promise.all([
    OrgModel.getDepartmentsByScope(officeCodes),
    OrgModel.getDivisionsByScope(officeCodes),
    OrgModel.getPositionsByScope(officeCodes),
  ]);

  const treeData = buildOrganizationTree(
    officeInfo,
    departments,
    divisions,
    positions
  );

  return treeData;
};
