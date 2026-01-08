export interface OrganizationNode {
  key: string;
  type: "office" | "department" | "division" | "position";
  label: string;
  expanded: boolean;
  data?: unknown;
  children: OrganizationNode[];
}

export interface OfficeNode {
  id: number;
  office_code: string;
  name: string;
  parent_office_code: string;
  address: string;
}

export interface DepartmentNode {
  id: number;
  department_code: string;
  office_code: string;
  name: string;
  description: string;
}

export interface DivisionNode {
  id: number;
  department_code: string;
  division_code: string;
  name: string;
  description: string;
}

export interface PositionNode {
  id: number;
  position_code: string;
  division_code: string | null;
  name: string;
  employee_name: string;
  employee_code: string;
}
