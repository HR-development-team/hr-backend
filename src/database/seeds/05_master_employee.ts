import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_employees").insert([
    // Data persis dari contoh JSON Anda
    {
      employee_code: "EMP0000001",
      position_code: "PST0000001", // B. Santoso -> Backend Dev
      full_name: "Budi Santoso",
      ktp_number: "3512345678901234",
      birth_place: "Ponorogo",
      birth_date: "1998-05-11", // Format YYYY-MM-DD
      gender: "laki-laki",
      address: "Jl. Kenangan No. 42, Ponorogo",
      contact_phone: "081234567890",
      religion: "Islam",
      maritial_status: "belum menikah",
      join_date: "2024-11-30", // Format YYYY-MM-DD
      resign_date: null,
      employment_status: "Full-time",
      education: "S1 Informatika",
      blood_type: "O",
      profile_picture: "budi_profile.jpg",
      bpjs_ketenagakerjaan: "1234567890",
      bpjs_kesehatan: "9876543210",
      npwp: "123456789012345",
      bank_account: "098765432109876",
    },
    // Data dummy untuk Citra Lestari (disesuaikan dengan skema baru)
    {
      employee_code: "EMP0000002",
      position_code: "PST0000002", // C. Lestari -> Frontend Dev
      full_name: "Citra Lestari",
      ktp_number: "3201112223330002",
      birth_place: "Jakarta",
      birth_date: "1997-08-17",
      gender: "perempuan",
      address: "Jl. Merdeka No. 10, Jakarta",
      contact_phone: "081234567891",
      religion: "Islam",
      maritial_status: "belum menikah",
      join_date: "2023-03-10",
      resign_date: null,
      employment_status: "Full-time",
      education: "S1 Desain Komunikasi Visual",
      blood_type: "A",
      profile_picture: "citra_profile.jpg",
      bpjs_ketenagakerjaan: "1234567891",
      bpjs_kesehatan: "9876543211",
      npwp: "123456789012346",
      bank_account: "098765432109877",
    },
    // Data dummy untuk Admin Perusahaan (disesuaikan dengan skema baru)
    {
      employee_code: "EMP0000003",
      position_code: "PST0000003", // Admin -> HR Staff
      full_name: "Admin Perusahaan",
      ktp_number: "3201112223330003",
      birth_place: "Bandung",
      birth_date: "1995-01-20",
      gender: "perempuan",
      address: "Jl. Administrasi No. 1, Bandung",
      contact_phone: "081234567892",
      religion: "Islam",
      maritial_status: "menikah",
      join_date: "2024-01-01",
      resign_date: null,
      employment_status: "Full-time",
      education: "S1 Manajemen",
      blood_type: "B",
      profile_picture: "admin_profile.jpg",
      bpjs_ketenagakerjaan: "1234567892",
      bpjs_kesehatan: "9876543212",
      npwp: "123456789012347",
      bank_account: "098765432109878",
    },
  ]);
}
