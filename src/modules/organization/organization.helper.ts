import {
  DepartmentNode,
  DivisionNode,
  OrganizationNode,
  PositionNode,
  OfficeNode,
  OfficeHierarchyRow,
} from "./organization.type.js";

export const buildOrganizationTree = (
  rootOffice: OfficeNode,
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
        id: pos.id,
        code: pos.position_code,
        name: pos.name,
        employee_name: pos.employee_name || "Vacant",
        employee_code: pos.employee_code,
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
      data: {
        id: div.id,
        code: div.division_code,
        name: div.name,
        description: div.description,
        leader_position: div.leader_position_name || "-",
        leader_name: div.leader_employee_name || "-",
      },
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
      data: {
        id: dept.id,
        code: dept.department_code,
        name: dept.name,
        description: dept.description,
        leader_position: dept.leader_position_name || "-",
        leader_name: dept.leader_employee_name || "-",
      },
      children: childDivision,
    });
  });

  const rootNode: OrganizationNode = {
    key: `office-${rootOffice.office_code}`,
    type: "office",
    label: rootOffice.name,
    expanded: true,
    data: {
      id: rootOffice.id,
      code: rootOffice.office_code,
      name: rootOffice.name,
      address: rootOffice.address,
      description: rootOffice.description,
      leader_position: rootOffice.leader_position_name || "-",
      leader_name: rootOffice.leader_employee_name || "-",
    },
    children: departmentNodes,
  };

  return [rootNode];
};

/**
 * Builds a recursive tree of Offices (Global Hierarchy)
 */
export const buildOfficeTree = (
  offices: OfficeHierarchyRow[]
): OrganizationNode[] => {
  // 1. Create a Map for O(1) access
  const officeMap = new Map<string, OrganizationNode>();

  // 2. Initialize Nodes
  offices.forEach((office) => {
    officeMap.set(office.office_code, {
      key: `office-${office.office_code}`,
      type: "office", // Consistent type
      label: office.name,
      expanded: true,
      data: {
        id: office.id,
        code: office.office_code,
        name: office.name,
        address: office.address,
        description: office.description,
        latitude: office.latitude,
        longitude: office.longitude,
        // Leader Mapping
        leader_position: office.leader_position_name || "-",
        leader_name: office.leader_employee_name || "-",
      },
      children: [],
    });
  });

  const tree: OrganizationNode[] = [];

  // 3. Build Hierarchy
  offices.forEach((office) => {
    const node = officeMap.get(office.office_code)!;

    if (office.parent_office_code && officeMap.has(office.parent_office_code)) {
      const parent = officeMap.get(office.parent_office_code)!;
      parent.children!.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
};
