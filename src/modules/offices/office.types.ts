// FILE: src/modules/offices/office.types.ts

export interface Office {
  id: number;
  office_code: string;
  // [BARU] Tambahan field untuk hierarki
  parent_office_code?: string | null;
  name: string;
  address: string;

  // Update: Ubah jadi nullable agar kompatibel dengan database jika kosong
  latitude: number | null;
  longitude: number | null;

  radius_meters: number;

  // [BARU] Tambahan field urutan & deskripsi
  sort_order: number;
  description?: string | null;

  created_at?: Date;
  updated_at?: Date;
}

export interface GetOfficeById extends Office {
  // [BARU] Tambahan untuk menampung nama parent dari hasil JOIN
  parent_office_name?: string | null;
}

export interface GetAllOffices extends Office {
  // Used for list views
}

export interface CreateOffice {
  // [BARU] Inputan baru
  parent_office_code?: string | null;

  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius_meters?: number; // Optional di Zod, jadi di sini juga sebaiknya optional

  // [BARU] Inputan baru
  sort_order?: number;
  description?: string | null;
}

// UpdateOffice mewarisi CreateOffice, jadi otomatis dapat field baru juga
export interface UpdateOffice extends Partial<CreateOffice> {
  id: number;
}

// Interface ini digunakan untuk Logic Pohon (Tree)
export interface OfficeRawWithParent extends Office {
  // Field ini sudah ada di Office di atas, tapi dibiarkan di sini juga tidak masalah (override)
  parent_office_code?: string | null;
  description?: string | null;
}

export interface OfficeTree extends OfficeRawWithParent {
  children: OfficeTree[];
}

export interface UserScope {
  office_code: string | null;
}

export interface OfficeReference {
  name: string;
  office_code: string;
}

export interface GetAllOfficesResponse {
  data: GetAllOffices[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}
