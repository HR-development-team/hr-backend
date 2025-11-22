export interface Office {
  id: number;
  office_code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetOfficeById extends Office {
  // Currently, Master Office is standalone.
  // If you later link it to a "Region" or "Country" table,
  // you would add fields like 'region_name' here.
}

export interface GetAllOffices extends Office {
  // Used for list views (e.g., tables in the frontend)
}

export interface CreateOffice {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
}

export interface UpdateOffice {
  id: number;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  radius_meters?: number;
}
