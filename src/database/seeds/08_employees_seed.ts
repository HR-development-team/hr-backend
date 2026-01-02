import { fakerID_ID as faker } from "@faker-js/faker";
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Bersihkan tabel
  await knex("master_employees").del();

  // ==========================================================
  // CONFIG & DATA REFERENSI
  // ==========================================================

  // Mapping Jabatan ke Kantor (Berdasarkan urutan di 04_positions_seed.ts)
  // JBT01 - JBT20 = Kantor Pusat (OFC01)
  // JBT21 - JBT40 = Kantor Cabang (OFC02)
  const getOfficeByPosition = (posIndex: number) => {
    return posIndex <= 20 ? "OFC0000001" : "OFC0000002";
  };

  const employmentStatuses = [
    "EPS0000001", // Tetap
    "EPS0000002", // Kontrak
    "EPS0000003", // Training
    "EPS0000004", // Keluar
    "EPS0000005", // Magang
  ];

  // ==========================================================
  // 1. KARYAWAN UTAMA (HARDCODED) - 6 Orang
  // ==========================================================
  const existingEmployees = [
    {
      employee_code: "MR0001",
      user_code: "USR0000001",
      position_code: "JBT0000001",
      office_code: "OFC0000001",
      employment_status_code: "EPS0000001",
      full_name: "Budi Pratama",
      ktp_number: "3578123409876543",
      birth_place: "Surabaya",
      birth_date: "1997-08-15",
      gender: "laki-laki",
      address: "Surabaya",
      contact_phone: "081234567890",
      religion: "Islam",
      maritial_status: "Single",
      join_date: "2024-11-20",
      education: "S1",
      blood_type: "O",
      bpjs_ketenagakerjaan: "23098",
      bpjs_kesehatan: "12098",
      npwp: "54.321",
      bank_account: "BCA",
    },
    {
      employee_code: "MR0002",
      user_code: "USR0000002",
      position_code: "JBT0000006",
      office_code: "OFC0000002",
      employment_status_code: "EPS0000004",
      full_name: "Siti Rahmawati",
      ktp_number: "3578012345678912",
      birth_place: "Malang",
      birth_date: "1995-03-28",
      gender: "perempuan",
      address: "Malang",
      contact_phone: "08234",
      religion: "Islam",
      maritial_status: "Married",
      join_date: "2023-07-10",
      education: "S1",
      blood_type: "A",
      bpjs_ketenagakerjaan: "23012",
      bpjs_kesehatan: "12012",
      npwp: "45.678",
      bank_account: "Mandiri",
    },
    {
      employee_code: "MR0003",
      user_code: "USR0000003",
      position_code: "JBT0000014",
      office_code: "OFC0000002",
      employment_status_code: "EPS0000001",
      full_name: "Andi Setiawan",
      ktp_number: "3578456712345678",
      birth_place: "Jakarta",
      birth_date: "1992-12-05",
      gender: "laki-laki",
      address: "Jakarta",
      contact_phone: "08321",
      religion: "Kristen",
      maritial_status: "Married",
      join_date: "2022-01-17",
      education: "S1",
      blood_type: "B",
      bpjs_ketenagakerjaan: "23987",
      bpjs_kesehatan: "12987",
      npwp: "12.987",
      bank_account: "BRI",
    },
    {
      employee_code: "MR0005",
      user_code: "USR0000005",
      position_code: "JBT0000014",
      office_code: "OFC0000001",
      employment_status_code: "EPS0000002",
      full_name: "Rina Kusuma",
      ktp_number: "3171012345678901",
      birth_place: "Jakarta",
      birth_date: "1996-02-14",
      gender: "perempuan",
      address: "Jl. Tebet Raya No. 15, Jakarta Selatan",
      contact_phone: "085612345678",
      religion: "Islam",
      maritial_status: "Single",
      join_date: "2024-01-10",
      education: "S1 Akuntansi",
      blood_type: "O",
      bpjs_ketenagakerjaan: "112233445566",
      bpjs_kesehatan: "665544332211",
      npwp: "11.222.333.4-555.000",
      bank_account: "BCA 5566778899",
    },
    {
      employee_code: "MR0006",
      user_code: "USR0000006",
      position_code: "JBT0000004",
      office_code: "OFC0000002",
      employment_status_code: "EPS0000003",
      full_name: "Dimas Anggara",
      ktp_number: "3273012345678901",
      birth_place: "Bandung",
      birth_date: "1999-07-20",
      gender: "laki-laki",
      address: "Jl. Dago No. 88, Bandung, Jawa Barat",
      contact_phone: "081908765432",
      religion: "Islam",
      maritial_status: "Single",
      join_date: "2024-03-01",
      education: "D3 Teknik Komputer",
      blood_type: "B",
      bpjs_ketenagakerjaan: "778899001122",
      bpjs_kesehatan: "223344556677",
      npwp: "99.888.777.6-555.000",
      bank_account: "Mandiri 1231231234",
    },
    {
      employee_code: "MR0007",
      user_code: "USR0000007",
      position_code: "JBT0000004",
      office_code: "OFC0000002",
      employment_status_code: "EPS0000003",
      full_name: "Eko Prasetyo",
      ktp_number: "3273012345678821",
      birth_place: "Surabaya",
      birth_date: "1999-07-20",
      gender: "laki-laki",
      address: "Jl. Dago No. 88, Bandung, Jawa Barat",
      contact_phone: "081908765432",
      religion: "Islam",
      maritial_status: "Single",
      join_date: "2024-03-01",
      education: "D3 Teknik Komputer",
      blood_type: "B",
      bpjs_ketenagakerjaan: "778899001123",
      bpjs_kesehatan: "223344556678",
      npwp: "99.888.777.6-777.000",
      bank_account: "Mandiri 1231231234",
    },
  ];

  // Helper untuk menghitung berapa user yang sudah ada di posisi tertentu
  const countByPosition = existingEmployees.reduce(
    (acc, emp) => {
      acc[emp.position_code] = (acc[emp.position_code] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // ==========================================================
  // 2. GENERATE DUMMY (SISANYA)
  // Target: 40 Posisi x 5 Orang = 200 Orang
  // ==========================================================
  const dummyEmployees = [];
  let employeeIdCounter = 8; // Mulai dari MR0008

  // Loop untuk 40 posisi (JBT0000001 - JBT0000040)
  for (let i = 1; i <= 40; i++) {
    const positionCode = `JBT${i.toString().padStart(7, "0")}`;
    const officeCode = getOfficeByPosition(i);

    // Cek berapa yang sudah ada (hardcoded)
    const currentCount = countByPosition[positionCode] || 0;
    const targetCount = 5;
    const needed = targetCount - currentCount;

    // Generate kekurangan karyawan untuk posisi ini
    for (let j = 0; j < needed; j++) {
      const gender = faker.person.sexType();

      // Rotasi status karyawan supaya tidak random (1,2,3,4,5,1...)
      // Menggunakan modulo untuk memilih status secara berurutan
      const statusIndex = (i + j) % employmentStatuses.length;
      const statusCode = employmentStatuses[statusIndex];

      dummyEmployees.push({
        employee_code: `MR${employeeIdCounter.toString().padStart(4, "0")}`,
        user_code: null, // Kosongkan sesuai request

        position_code: positionCode,
        office_code: officeCode,
        employment_status_code: statusCode,

        full_name: faker.person.fullName({ sex: gender }),
        ktp_number: faker.string.numeric(16),
        birth_place: faker.location.city(),
        birth_date: faker.date
          .birthdate({ min: 20, max: 50, mode: "age" })
          .toISOString()
          .split("T")[0],
        gender: gender === "male" ? "laki-laki" : "perempuan",
        address: faker.location.streetAddress(false),
        contact_phone: faker.phone.number().replace(/^(\+62|62)/, "08"),

        religion: faker.helpers.arrayElement([
          "Islam",
          "Kristen",
          "Katolik",
          "Hindu",
          "Buddha",
        ]),
        maritial_status: faker.helpers.arrayElement(["Single", "Married"]),
        join_date: faker.date.past({ years: 3 }).toISOString().split("T")[0],

        education: faker.helpers.arrayElement(["SMA", "D3", "S1"]),
        blood_type: faker.helpers.arrayElement(["A", "B", "O", "AB"]),

        bpjs_ketenagakerjaan: faker.string.numeric(11),
        bpjs_kesehatan: faker.string.numeric(13),
        npwp: faker.string.numeric(15),
        bank_account: faker.finance.accountName(),
      });

      employeeIdCounter++;
    }
  }

  // Gabungkan dan Insert
  await knex("master_employees").insert([
    ...existingEmployees,
    ...dummyEmployees,
  ]);
}
