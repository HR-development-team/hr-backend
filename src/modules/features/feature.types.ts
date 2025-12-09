export interface RolePermission {
  role_code: string;
  feature_code: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_print: boolean;
}

export interface Feature {
  id: number;
  feature_code: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetFeatureById extends Feature {}

export interface GetAllFeature {
  id: number;
  feature_code: string;
  name: string;
  description?: string;
}

export interface CreateFeature {
  name: string;
  description?: string;
}

export interface UpdateFeature {
  id: number;
  name?: string;
  description?: string;
}
