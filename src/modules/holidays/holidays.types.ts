export interface Holiday {
  id: number;
  office_code?: string;
  department_code?: string;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface GetAllHolidays {
  id: number;
  office_code?: string;
  department_code?: string;
  date: string;
  description?: string;
}

export interface GetHolidayById extends Holiday {
  created_at: string;
  updated_at: string;
}

export interface GetHolidayByDate extends GetHolidayById {}

export interface CreateHoliday {
  office_code?: string;
  department_code?: string;
  date: string;
  description?: string;
}

export interface UpdateHoliday {
  office_code?: string;
  department_code?: string;
  date?: string;
  description?: string;
}
