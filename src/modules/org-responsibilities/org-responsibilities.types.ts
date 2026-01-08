export interface OrgResponsibilities {
  id: number;
  scope_type: "office" | "department" | "division";
  scope_code: string;
  employee_code: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetAllOrgResponsibilities
  extends Omit<OrgResponsibilities, "created_at" | "updated_at"> {
  employee_name: string;
  unit_name: string;
}

export interface GetOrgResponsibilitiesById extends OrgResponsibilities {
  employee_name: string;
  unit_name: string;
}

export interface CreateOrgResponsibilites {
  scope_type: string;
  scope_code: string;
  employee_code: string;
  role: string;
  start_date: string;
}

export interface UnassignLeader {
  scope_type: string;
  scope_code: string;
  end_date?: string;
}

export interface UpdateOrgResponsibilities {
  role?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface OrgResponsibilitiesResponse {
  data: GetAllOrgResponsibilities[] | GetOrgResponsibilitiesById;
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}
