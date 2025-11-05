export interface PayrollPeriod {
  id: number;
  period_code: string;
  start_date: string;
  end_date: string;
  status: "open" | "processing" | "finalized" | "paid" | "canceled";
  created_at?: Date;
  updated_at?: Date;
}

export interface CreatePayrollPeriodData {
  period_code: string;
  start_date: string;
  end_date: string;
}

export interface UpdatePayrollPeriodStatus {
  id: number;
  status: "processing" | "finalized" | "paid" | "canceled";
}
