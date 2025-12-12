
# Project Title

A brief description of what this project does and who it's for

# 👤 CRUD Employee API

- version: 1.0
- Base URL: https://hr-backend-production-d2b1.up.railway.app
- Last Updated: December 2025

The Employee Management API provides standard CRUD capabilities for defining and managing user roles within the system.

## Table of Contents

- [Authentication](#-authentication)
- [Common Response Formats](#-common-response-formats)
- [Endpoints](#-endpoints)
  - [Get Employee List](#1-get-employee-list)
  - [Get Employee By Id](#2-get-employee-by-id)
  - [Get Employee By Code](#3-get-employee-by-code)
  - [Create Employee](#4-create-employee)
  - [Delete Employee](#5-delete-employee)

## 🔐 Authentication

All endpoints require authentication using a Bearer Token in the Authorization header.
```json
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Authentication Methods

- Bearer Token: Include your API key in the Authorization header as shown above
- Obtain your API key from the admin dashboard or contact support

### Authentication Methods

- 401 Unauthorized — Missing, invalid, or expired token
- 403 Forbidden — Valid token but insufficient permissions

## 📦 Common Response Formats

**Success Response Structure**
```json
{
  "status": "00",
  "message": "Success message in Indonesian",
  "datetime": "20251103101550",
  "data": {
    /* endpoint-specific data */
  }
}
```

**Error Response Structure**
```json
{
  "status": "03",
  "message": "Error Not Found",
  "datetime": "20251103101550"
}
```

**Field Descriptions**

- status: "00" for success, other codes indicate specific errors
- datetime: Response timestamp in YYYYMMDDHHmmss format (Asia/Jakarta timezone)
- error: Boolean indicating if an error occurred

## 🔌 Endpoints

### 1. GET Employee List

Get a list of all employees. This endpoint is ideal for table displays, dropdown menus, and data processing.

**Endpoints:**
```json
GET /master-employees
```

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Data Karyawan berhasil di dapatkan",
    "datetime": "20251212094709",
    "master_employees": [
        {
            "id": 1,
            "employee_code": "KWN0000001",
            "full_name": "Budi Pratama",
            "join_date": "2024-11-19T17:00:00.000Z",
            "position_code": "POS0000001",
            "employment_status": "aktif",
            "office_code": "OFC0000001",
            "office_name": "Kantor Pusat Jakarta",
            "position_name": "Software Engineer",
            "division_code": "DIV0000001",
            "division_name": "Software Engineering",
            "department_code": "DPT0000001",
            "department_name": "Technology"
        },
        {
            "id": 2,
            "employee_code": "KWN0000002",
            "full_name": "Siti Rahmawati",
            "join_date": "2023-07-09T17:00:00.000Z",
            "position_code": "POS0000006",
            "employment_status": "aktif",
            "office_code": "OFC0000002",
            "office_name": "Kantor Cabang Jawa Timur",
            "position_name": "Recruitment Officer",
            "division_code": "DIV0000003",
            "division_name": "Recruitment",
            "department_code": "DPT0000002",
            "department_name": "Human Resources"
        },
        {
            "id": 3,
            "employee_code": "KWN0000003",
            "full_name": "Andi Setiawan",
            "join_date": "2022-01-16T17:00:00.000Z",
            "position_code": "POS0000014",
            "employment_status": "aktif",
            "office_code": "OFC0000002",
            "office_name": "Kantor Cabang Jawa Timur",
            "position_name": "Accountant",
            "division_code": "DIV0000007",
            "division_name": "Accounting",
            "department_code": "DPT0000004",
            "department_name": "Finance"
        }
    ]
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- employee_code: A unique alphanumeric code or Employee ID used to identify the employee within the organization.
- full_name: The employee's full legal name.
- join_date: The official date and time the employee started working at the company.
- position_code: A unique reference code identifying the employee's specific job position.
- employment_status: The current working status of the employee (e.g., "aktif", "in-aktif).
- office_code: A unique reference code for the office location where the employee is assigned.
- office_name: The descriptive name of the office location (e.g., "East Java Branch Office").
- position_name: The job title or designation held by the employee (e.g., "Accountant").
- division_code: A unique reference code for the specific division within the organization.
- division_name: The name of the division the employee belongs to (e.g., "Accounting").
- department_code: A unique reference code for the broader department.
- department_name: The name of the department that oversees the division (e.g., "Finance").

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/master-employees" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Employee By Id

Retrieve the detailed data for a single Employee using its unique internal database ID.

**Endpoints:**
```json
GET /master-employees/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the role to retrieve (e.g., 2). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Data Karyawan berhasil didapatkan",
    "datetime": "20251212095322",
    "master_employees": {
        "id": 1,
        "employee_code": "KWN0000001",
        "user_code": "USR0000001",
        "position_code": "POS0000001",
        "office_code": "OFC0000001",
        "full_name": "Budi Pratama",
        "ktp_number": "3578123409876543",
        "birth_place": "Surabaya",
        "birth_date": "1997-08-14T17:00:00.000Z",
        "gender": "laki-laki",
        "address": "Jl. Kenanga No. 24, Surabaya, Jawa Timur",
        "contact_phone": "081234567890",
        "religion": "Islam",
        "maritial_status": "Single",
        "join_date": "2024-11-19T17:00:00.000Z",
        "resign_date": null,
        "employment_status": "aktif",
        "education": "S1 Informatika",
        "blood_type": "O",
        "profile_picture": null,
        "bpjs_ketenagakerjaan": "230987654321",
        "bpjs_kesehatan": "120987654321",
        "npwp": "54.321.987.4-123.000",
        "bank_account": "BCA 1234567890",
        "created_at": "2025-12-11T14:41:34.000Z",
        "updated_at": "2025-12-11T14:41:34.000Z",
        "office_name": "Kantor Pusat Jakarta",
        "position_name": "Software Engineer",
        "division_code": "DIV0000001",
        "division_name": "Software Engineering",
        "department_code": "DPT0000001",
        "department_name": "Technology"
    }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- employee_code: A unique alphanumeric code or Employee ID used to identify the employee within the organization.
- full_name: The employee's full legal name.
- join_date: The official date and time the employee started working at the company.
- position_code: A unique reference code identifying the employee's specific job position.
- employment_status: The current working status of the employee (e.g., "aktif", "in-aktif).
- office_code: A unique reference code for the office location where the employee is assigned.
- office_name: The descriptive name of the office location (e.g., "East Java Branch Office").
- position_name: The job title or designation held by the employee (e.g., "Accountant").
- division_code: A unique reference code for the specific division within the organization.
- division_name: The name of the division the employee belongs to (e.g., "Accounting").
- department_code: A unique reference code for the broader department.
- department_name: The name of the department that oversees the division (e.g., "Finance").
- user_code: A unique code linking this employee record to a registered system user account (used for application login/authentication).
- ktp_number: The employee's National Identity Number (Indonesian Resident Identity Card/KTP).
- birth_place: The city or location where the employee was born.
- birth_date: The employee's date of birth.
- gender: The employee's biological sex or gender identity (e.g., "laki-laki" for Male).
- address: The full residential address of the employee.
- contact_phone: The employee's primary mobile phone contact number.
- religion: The employee's religious affiliation.
- maritial_status: The employee's current marital status (e.g., "Single", "Married").
- resign_date: The official date the employee left the company. null indicates the employee is still currently employed.
- education: The highest level of education or major degree obtained by the employee (e.g., "S1 Informatika").
- blood_type: The employee's blood group.
- profile_picture: A URL or file path pointing to the employee's profile photo. null indicates no photo is uploaded.
- bpjs_ketenagakerjaan: The employee's registration number for the National Employment Social Security (Indonesian Workers Social Security Agency).
- bpjs_kesehatan: The employee's registration number for the National Healthcare Social Security (Indonesian Health Social Security Agency).
- npwp: The employee's Tax Identification Number (Nomor Pokok Wajib Pajak).
- bank_account: The employee's bank account details (typically includes Bank Name and Account Number) for payroll purposes.
- created_at: The timestamp indicating when this record was originally created in the database.
- updated_at: The timestamp indicating when this record was last modified.

**404 Not Found:**
```json
{
    "status": "03",
    "message": "Data Karyawan tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/master-employees/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 3. GET Employee By Code

Retrieve the detailed data for a single Employee using its unique role code identifier. This endpoint is provided for systems that rely on external identifiers rather than the internal ID.

**Endpoints:**
```json
GET /role/roles/code/{role_code}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| role_code | string | Yes | The unique code of the role to retrieve (e.g., ROL0000002). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Data Karyawan berhasil didapatkan",
    "datetime": "20251212095322",
    "master_employees": {
        "id": 1,
        "employee_code": "KWN0000001",
        "user_code": "USR0000001",
        "position_code": "POS0000001",
        "office_code": "OFC0000001",
        "full_name": "Budi Pratama",
        "ktp_number": "3578123409876543",
        "birth_place": "Surabaya",
        "birth_date": "1997-08-14T17:00:00.000Z",
        "gender": "laki-laki",
        "address": "Jl. Kenanga No. 24, Surabaya, Jawa Timur",
        "contact_phone": "081234567890",
        "religion": "Islam",
        "maritial_status": "Single",
        "join_date": "2024-11-19T17:00:00.000Z",
        "resign_date": null,
        "employment_status": "aktif",
        "education": "S1 Informatika",
        "blood_type": "O",
        "profile_picture": null,
        "bpjs_ketenagakerjaan": "230987654321",
        "bpjs_kesehatan": "120987654321",
        "npwp": "54.321.987.4-123.000",
        "bank_account": "BCA 1234567890",
        "created_at": "2025-12-11T14:41:34.000Z",
        "updated_at": "2025-12-11T14:41:34.000Z",
        "office_name": "Kantor Pusat Jakarta",
        "position_name": "Software Engineer",
        "division_code": "DIV0000001",
        "division_name": "Software Engineering",
        "department_code": "DPT0000001",
        "department_name": "Technology"
    }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- employee_code: A unique alphanumeric code or Employee ID used to identify the employee within the organization.
- full_name: The employee's full legal name.
- join_date: The official date and time the employee started working at the company.
- position_code: A unique reference code identifying the employee's specific job position.
- employment_status: The current working status of the employee (e.g., "aktif", "in-aktif).
- office_code: A unique reference code for the office location where the employee is assigned.
- office_name: The descriptive name of the office location (e.g., "East Java Branch Office").
- position_name: The job title or designation held by the employee (e.g., "Accountant").
- division_code: A unique reference code for the specific division within the organization.
- division_name: The name of the division the employee belongs to (e.g., "Accounting").
- department_code: A unique reference code for the broader department.
- department_name: The name of the department that oversees the division (e.g., "Finance").
- user_code: A unique code linking this employee record to a registered system user account (used for application login/authentication).
- ktp_number: The employee's National Identity Number (Indonesian Resident Identity Card/KTP).
- birth_place: The city or location where the employee was born.
- birth_date: The employee's date of birth.
- gender: The employee's biological sex or gender identity (e.g., "laki-laki" for Male).
- address: The full residential address of the employee.
- contact_phone: The employee's primary mobile phone contact number.
- religion: The employee's religious affiliation.
- maritial_status: The employee's current marital status (e.g., "Single", "Married").
- resign_date: The official date the employee left the company. null indicates the employee is still currently employed.
- education: The highest level of education or major degree obtained by the employee (e.g., "S1 Informatika").
- blood_type: The employee's blood group.
- profile_picture: A URL or file path pointing to the employee's profile photo. null indicates no photo is uploaded.
- bpjs_ketenagakerjaan: The employee's registration number for the National Employment Social Security (Indonesian Workers Social Security Agency).
- bpjs_kesehatan: The employee's registration number for the National Healthcare Social Security (Indonesian Health Social Security Agency).
- npwp: The employee's Tax Identification Number (Nomor Pokok Wajib Pajak).
- bank_account: The employee's bank account details (typically includes Bank Name and Account Number) for payroll purposes.
- created_at: The timestamp indicating when this record was originally created in the database.
- updated_at: The timestamp indicating when this record was last modified.

**404 Not Found:**
```json
{
    "status": "03",
    "message": "Data Karyawan tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/master-employees/code/MR0001" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
``` 

### 4. CREATE Employee

Add a new Employee. The system automatically assigns a unique id and employee_code. Crucially, upon creation, the backend performs a bulk operation to create a corresponding permission record (role_permissions) for this new role for every existing Feature, granting can_read: true access by default.

**Endpoints:**
```json
POST /master-employees
```

**Request Body:**
```json
{
  "position_code": "POS0000001",
  "user_code": "USR0000001",
  "office_code": "OFC0000001",
  "full_name": "Budi Santoso",
  "join_date": "2024-12-01",

  "ktp_number": "3512345678901234",
  "birth_place": "Ponorogo",
  "birth_date": "1998-05-12",
  "gender": "laki-laki",
  "address": "Jl. Kenangan No. 42, Ponorogo",
  "contact_phone": "081234567890",
  "religion": "Islam",
  "maritial_status": "belum menikah",
  "resign_date": null,
  "employment_status": "inaktif",
  "education": "S1 Informatika",
  "blood_type": "O",
  "profile_picture": "budi_profile.jpg",
  "bpjs_ketenagakerjaan": "1234567890",
  "bpjs_kesehatan": "9876543210",
  "npwp": "123456789012345",
  "bank_account": "098765432109876"
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| position_code | string | Yes | The unique code representing the job position | PK, Max 20 characters. |
| user_code | string | Yes |The unique user ID linking this employee to a system account. | Max 20 characters.|
| office_code | string | Yes |The unique code representing the office location. | Max 20 characters.|
| full_name | string | Yes |The full legal name of the employee. | String (Max 255 chars)|
| join_date | string | Yes |Date of joining in YYYY-MM-DD format.| Date (YYYY-MM-DD) |
| ktp_number | string | No |The 16-digit National Identity Number (NIK/KTP). | String (Numeric, 16 chars)|
| birth_place | string | No |City or place of birth. | String (Max 100 chars)|
| birth_date | string | No |Date of birth in YYYY-MM-DD format.| Date (YYYY-MM-DD)|
| gender | string | No |Gender of the employee (e.g., laki-laki or perempuan). | MaxEnum String|
| address | string | No |Full residential address. | Text / String|
| contact_phone | string | No |Active mobile phone number.| String (Numeric)|
| religion | string | No |Religious affiliation.| String|
| maritial_status | string | No |Marital status (e.g., belum menikah, menikah).| Enum String|
| employment_status | string | Yes |Status of employment (e.g., aktif, inaktif). | Enum String|
| education | string | No |Last education degree or major. | String|
| blood_type | string | No |Blood type of the employee. | Enum String|
| bpjs_ketenagakerjaan | string | No |Employment Social Security number.| String (Numeric)|
| bpjs_kesehatan | string | No |Healthcare Social Security number.| String (Numeric)|
| npwp | string | No |Tax Identification Number (NPWP). | String|
| bank_account | string | No |Bank account number for payroll. | String|
| profile_picture | string | No |Filename or URL of the profile picture. | String (URL / Filename)|
| resign_date | string | No |Date of resignation (usually null for new employees). | Date (YYYY-MM-DD)|




**Response:**

**201 Created:**
```json
{
    "status": "00",
    "message": "Data master karyawan berhasil dibuat",
    "datetime": "20251204015800",
    "roles": {
        "id": 4,
        "role_code": "ROL0000004",
        "role_name": "Marketing Analyst",
        "description": "Peran untuk menganalisis tren pasar dan performa kampanye."
    }
}
```

**400 Bad Request:**
```json
{
    "status": "99",
    "message": "Validasi Gagal",
    "datetime": "20251203113801",
    errors: [
        {
            field: "address",
            message: "Alamat minimal 3 karakter"
        }
    ]
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/master-employees" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d {
        "position_code": "POS0000001",
        "user_code": "USR0000001",
        "office_code": "OFC0000001",
        "full_name": "Budi Santoso",
        "join_date": "2024-12-01",

        "ktp_number": "3512345678901234",
        "birth_place": "Ponorogo",
        "birth_date": "1998-05-12",
        "gender": "laki-laki",
        "address": "Jl. Kenangan No. 42, Ponorogo",
        "contact_phone": "081234567890",
        "religion": "Islam",
        "maritial_status": "belum menikah",
        "resign_date": null,
        "employment_status": "inaktif",
        "education": "S1 Informatika",
        "blood_type": "O",
        "profile_picture": "budi_profile.jpg",
        "bpjs_ketenagakerjaan": "1234567890",
        "bpjs_kesehatan": "9876543210",
        "npwp": "123456789012345",
        "bank_account": "098765432109876"
        }'
```

### 5. Update Employee

Update the details of an existing Employee using its unique database ID. This endpoint is restricted to updating the non-key metadata, specifically the description, to preserve system integrity and avoid complex cascading updates in the permission matrix.

**Endpoints:**

```json
PUT /master-employees/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the role to retrieve (e.g., 2). |

**Request Body:**

```json
{
    "ktp_number": "3512345678901234",
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| description | string | No | The updated brief description of the role's function. | Max 1000 characters. |


**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data master karyawan berhasil diperbarui",
    "datetime": "20251212102634",
    "master_employees": {
        "id": 1,
        "employee_code": "KWN0000001",
        "user_code": "USR0000001",
        "position_code": "POS0000001",
        "office_code": "OFC0000001",
        "full_name": "Budi Pratama",
        "ktp_number": "3512345678901233",
        "birth_place": "Surabaya",
        "birth_date": "1997-08-14T17:00:00.000Z",
        "gender": "laki-laki",
        "address": "Jl. Kenanga No. 24, Surabaya, Jawa Timur",
        "contact_phone": "081234567890",
        "religion": "Islam",
        "maritial_status": "Single",
        "join_date": "2024-11-19T17:00:00.000Z",
        "resign_date": null,
        "employment_status": "aktif",
        "education": "S1 Informatika",
        "blood_type": "O",
        "profile_picture": null,
        "bpjs_ketenagakerjaan": "230987654321",
        "bpjs_kesehatan": "120987654321",
        "npwp": "54.321.987.4-123.000",
        "bank_account": "BCA 1234567890",
        "created_at": "2025-12-11T14:41:34.000Z",
        "updated_at": "2025-12-11T14:41:34.000Z"
    }
}
```

**404 Not Found:**

```json
{
    "status": "03",
    "message": "Data Karyawan tidak ditemukan",
    "datetime": "20251212102816"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/master-employees/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "position_code": "POS0000001",
        "user_code": "USR0000001",
        "office_code": "OFC0000001",
        "full_name": "Budi Santoso",
        "join_date": "2024-12-01",

        "ktp_number": "3512345678901234",
        "birth_place": "Ponorogo",
        "birth_date": "1998-05-12",
        "gender": "laki-laki",
        "address": "Jl. Kenangan No. 42, Ponorogo",
        "contact_phone": "081234567890",
        "religion": "Islam",
        "maritial_status": "belum menikah",
        "resign_date": null,
        "employment_status": "inaktif",
        "education": "S1 Informatika",
        "blood_type": "O",
        "profile_picture": "budi_profile.jpg",
        "bpjs_ketenagakerjaan": "1234567890",
        "bpjs_kesehatan": "9876543210",
        "npwp": "123456789012345",
        "bank_account": "098765432109876"
        }'
```

### 6. DELETE Employee

Remove an existing Employee from the system using its unique database ID. This operation will fail if any users are currently assigned to this role. If successful, all associated permission records will be automatically deleted.

**Endpoints:**
```json
DELETE /master-employees/{id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the role to retrieve (e.g., 2). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Data master karyawan berhasil dihapus",
    "datetime": "20251203114200"
}
```

**400 BAD Request:**
```json
{
    "status": "02",
    "message": "ID karyawan tidak valid.",
    "datetime": "20251203114201"
}
```

**404 Not Found:**
```json
{
    "status": "04",
    "message": "ID karyawan tidak valid",
    "datetime": "20251203114202"
}
```

**cURL Example:**
```json
curl -X DELETE "https://api.example.com/v1/master-employees/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```