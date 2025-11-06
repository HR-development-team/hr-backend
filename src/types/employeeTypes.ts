// Tipe untuk membuat data baru (dari req.body POST)
// Ini SESUAI dengan kolom-kolom yang 'NOT NULL' di database Anda
export interface CreateEmployeeData {
  first_name: string;
  last_name: string;
  contact_phone: string | null | undefined;
  address: string | null | undefined;
  join_date: string; // DB type 'date', dikirim sebagai string
  position_id: number;
}

// Tipe untuk update data (dari req.body PUT)
// 'id' TIDAK ADA di sini, karena 'id' datang dari req.params
export interface UpdateEmployeeData {
  first_name?: string;
  last_name?: string;
  contact_phone?: string | null;
  address?: string | null;
  join_date?: string;
  position_id?: number;
}

// Tipe ini mewakili data LENGKAP yang dikembalikan dari database
// Ini adalah gabungan dari 'master_employees' dan data JOIN
export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  contact_phone: string | null; // DB: Yes NULL
  address: string | null; // DB: Yes NULL
  join_date: string; // DB: 'date' (dikembalikan sebagai string)
  position_id: number;
  created_at: string; // DB: 'timestamp' (dikembalikan sebagai string)
  updated_at: string; // DB: 'timestamp' (dikembalikan sebagai string)

  // Kolom-kolom ini berasal dari JOIN di model Anda
  position_name: string;
  department_id: number;
  department_name: string;
}
