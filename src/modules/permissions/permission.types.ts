export interface RolePermission {
  role_code: string;
  feature_code: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_print: boolean;
}

export interface GetRolePermission extends RolePermission {
  feature_name: string;
}

export interface UpdateRolePermission {
  permissions: {
    feature_code: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_print: boolean;
  }[];
}
