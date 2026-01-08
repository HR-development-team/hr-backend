import {
  DepartmentNode,
  DivisionNode,
  OrganizationNode,
  PositionNode,
} from "./organization.type.js";

export const buildOrganizationTree = (
  rootOffice: any,
  department: DepartmentNode[],
  division: DivisionNode[],
  position: PositionNode[]
): OrganizationNode[] => {
  const positionMap: Record<string, OrganizationNode[]> = {};

  position.forEach((pos) => {
    const divKey = pos.division_code || "direct_dept";

    if (!positionMap[divKey]) positionMap[divKey] = [];

    positionMap[divKey].push({
      key: `pos-${pos.position_code}`,
      type: "position",
      label: pos.name,
      expanded: false,
      data: {
        ...pos,
        holder: pos.employee_name || "Vacant",
      },
      children: [],
    });
  });

  const divisionMap: Record<string, OrganizationNode[]> = {};

  division.forEach((div) => {
    const deptKey = div.department_code;
    if (!divisionMap[deptKey]) divisionMap[deptKey] = [];

    const childPosition = positionMap[div.division_code] || [];

    divisionMap[deptKey].push({
      key: `div-${div.division_code}`,
      type: "division",
      label: div.name,
      expanded: true,
      data: div,
      children: childPosition,
    });
  });

  const departmentNodes: OrganizationNode[] = [];

  department.forEach((dept) => {
    const childDivision = divisionMap[dept.department_code] || [];

    departmentNodes.push({
      key: `dept-${dept.department_code}`,
      type: "department",
      label: dept.name,
      expanded: true,
      data: dept,
      children: childDivision,
    });
  });

  const rootNode: OrganizationNode = {
    key: `office-${rootOffice.office_code}`,
    type: "office",
    label: rootOffice.name,
    expanded: true,
    data: rootOffice,
    children: departmentNodes,
  };

  return [rootNode];
};
