export interface BankAccount {
  id: number;
  bank_account_code: string;
  employee_code: string;
  bank_code: string;
  account_name: string;
  account_number: string;
  created_at: string;
  updated_at: string;
}

export interface GetAllBankAccount
  extends Omit<BankAccount, "created_at" | "updated_at"> {}

export interface GetBankAccountById extends BankAccount {}

export interface CreateBankAccount
  extends Pick<
    BankAccount,
    "employee_code" | "bank_code" | "account_number" | "account_name"
  > {}

export interface UpdateBankAccount {
  employee_code?: string;
  bank_code?: string;
  account_name?: string;
  account_number?: string;
}

export interface GetAllBankAccountResponse {
  data: GetAllBankAccount[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}
