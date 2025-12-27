export interface RolePermission {
  role_code: string;
  feature_code: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_print: boolean;
}

export interface Role {
  id: number;
  role_code: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetRoleById extends Role {}

export interface GetAllRole {
  id: number;
  role_code: string;
  name: string;
  description?: string;
}

export interface CreateRole {
  name: string;
  description?: string;
}

export interface UpdateRole {
  id: number;
  name?: string;
  description?: string;
}

export interface GetAllRoleResponse {
  data: GetAllRole[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}

export interface RoleOption {
  role_code: string;
  name: string;
}
