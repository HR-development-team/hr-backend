export interface OrganizationNode {
  key: string;
  type: "office" | "department" | "division" | "position";
  label: string;
  expanded: boolean;
  data: any;
  children: OrganizationNode[];
}

export interface OfficeHierarchyRow {
  id: number;
  office_code: string;
  parent_office_code: string | null;
  name: string;
  address: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  leader_position_name: string | null;
  leader_employee_name: string | null;
}

export interface OfficeNode {
  id: number;
  office_code: string;
  name: string;
  address: string;
  description: string | null;
  leader_position_name: string | null;
  leader_employee_name: string | null;
}

export interface DepartmentNode {
  id: number;
  department_code: string;
  office_code: string;
  name: string;
  description: string | null;
  leader_position_name: string | null;
  leader_employee_name: string | null;
}

export interface DivisionNode {
  id: number;
  department_code: string;
  division_code: string;
  name: string;
  description: string | null;
  leader_position_name: string | null;
  leader_employee_name: string | null;
}

export interface PositionNode {
  id: number;
  position_code: string;
  division_code: string | null;
  name: string;
  employee_name: string | null;
  employee_code: string | null;
}

export interface OfficeHierarchyNode {
  id: number;
  office_code: string;
  parent_office_code: string | null;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  leader_position_name: string | null;
  leader_employee_name: string | null;
}
