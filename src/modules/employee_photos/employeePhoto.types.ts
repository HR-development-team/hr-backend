// employeePhoto.types.ts
export interface EmployeePhoto {
  id: number;
  employee_code: string;
  photo: Buffer;
  mimetype: string;
  file_size?: number;
  uploaded_at: Date;
  updated_at: Date;
}

export interface PhotoResponse {
  success: boolean;
  message: string;
  data?: {
    employee_code: string;
    mimetype: string;
    file_size: number;
    uploaded_at: Date;
  };
}