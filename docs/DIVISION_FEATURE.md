# 🏢 CRUD Division API

- version: 1.0
- Base URL: https://hr-backend-production-1ce0.up.railway.app
- Last Updated: December 2025

The Division Management API provides standard CRUD capabilities to manage, retrieve, and modify organizational Division records. It serves as the primary interface for Division data.

## Table of Contents

- [Authentication](#-authentication)
- [Common Response Formats](#-common-response-formats)
- [Endpoints](#-endpoints)
  - [Get Division List](#1-get-division-list)
  - [Get Division By Id](#2-get-division-by-id)
  - [Get Division By code](#3-get-division-by-code)
  - [Create Division](#4-create-division)
  - [Update Division](#5-update-division)
  - [Delete Division](#6-delete-division)

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

### 1. GET Division List

Get a list of all divisions, including their associated parent department code and name. This endpoint is ideal for table displays and data processing.

**Endpoints:**

```json
GET /divisions
```

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Divisi Berhasil Didapatkan",
  "datetime": "20251103101550",
  "divisions": [
    {
      "id": 101,
      "office_code": "OFC0000001",
      "office_name": "Kantor Pusat Jakarta",
      "division_code": "DIV0000001",
      "department_code": "DPT0000001",
      "department_name": "Human Resources",
      "name": "Recruitment & Staffing",
      "description": "Bertanggung jawab atas proses perekrutan dan penempatan karyawan."
    },
    {
      "id": 102,
      "office_code": "OFC0000001",
      "office_name": "Kantor Pusat Jakarta",
      "division_code": "DIV0000002",
      "department_code": "DPT0000002",
      "department_name": "Finance and Accounting",
      "name": "Payroll & Benefits",
      "description": "Mengelola penggajian dan tunjangan karyawan."
    },
    {
      "id": 103,
      "office_code": "OFC0000002",
      "office_name": "Kantor Cabang Jawa Tengah",
      "division_code": "DIV0000003",
      "department_code": "DPT0000002",
      "department_name": "Finance and Accounting",
      "name": "Accounts Payable",
      "description": "Mengurus semua pembayaran ke vendor dan pemasok."
    }
  ]
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer). Used for system efficiency but often omitted in public-facing documentation.
- office_code: The code pointing to the parent Office (master_offices.office_code) that this division belongs to.
- office_name: The official name of the Parent Office associated with this division.
- division_code: A unique code that serves as the primary identifier for the division in API requests and business logic.
- department_code: The code pointing to the parent Department (master_departments.department_code) that this division belongs to.
- department_name: The official name of the Parent Department associated with this division.
- name: The official name or designation of the division (e.g., "Field Sales," "IT Support").
- description: A brief explanation or note regarding the main function or duties of the division.

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/divisions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Division By ID

Retrieve the detailed data for a single Division using its unique internal database ID (primary key).

**Endpoints:**

```json
GET /divisions/{id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| id | string | Yes | The unique database ID of the department to retrieve (e.g., 2). |

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Divisi Berhasil Didapatkan",
  "datetime": "20251103101550",
  "divisions": {
    "id": 2,
    "office_code": "OFC0000001",
    "office_name": "Kantor Pusat Jakarta",
    "division_code": "DIV0000002",
    "department_code": "DPT0000001",
    "department_name": "Human Resources",
    "name": "Compensation & Benefits",
    "description": "Bertanggung jawab atas program kompensasi dan tunjangan karyawan.",
    "created_at": "2025-11-01T09:00:00Z",
    "updated_at": "2025-11-01T09:00:00Z"
  }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer). Used for system efficiency but often omitted in public-facing documentation.
- office_code: The code pointing to the parent Office (master_offices.office_code) that this division belongs to.
- office_name: The official name of the Parent Office associated with this division.
- division_code: A unique code that serves as the primary identifier for the division in API requests and business logic.
- department_code: The code pointing to the parent Department (master_departments.department_code) that this division belongs to.
- department_name: The official name of the Parent Department associated with this division.
- name: The official name or designation of the division (e.g., "Field Sales," "IT Support").
- description: A brief explanation or note regarding the main function or duties of the division.
- created_at: The timestamp (ISO 8601 format) when the division record was created.
- updated_at: The timestamp (ISO 8601 format) when the division record was last updated.

**404 Not Found:**

```json
{
  "status": "03",
  "message": "Divisi tidak ditemukan",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/divisions/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 3. GET Division By Code

Retrieve the detailed data for a single Division using its unique division code identifier. The response includes all associated division and parent department details.

**Endpoints:**

```json
GET /divisions/code/{division_code}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| division_code | string | Yes | The unique code of the division to retrieve (e.g., DIV0000002). |

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Divisi Berhasil Didapatkan",
  "datetime": "20251103101550",
  "divisions": {
    "id": 2,
    "office_code": "OFC0000001",
    "office_name": "Kantor Pusat Jakarta",
    "division_code": "DIV0000002",
    "department_code": "DPT0000001",
    "department_name": "Human Resources",
    "name": "Compensation & Benefits",
    "description": "Bertanggung jawab atas program kompensasi dan tunjangan karyawan.",
    "created_at": "2025-11-01T09:00:00Z",
    "updated_at": "2025-11-01T09:00:00Z"
  }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer). Used for system efficiency but often omitted in public-facing documentation.
- office_code: The code pointing to the parent Office (master_offices.office_code) that this division belongs to.
- office_name: The official name of the Parent Office associated with this division.
- division_code: A unique code that serves as the primary identifier for the division in API requests and business logic.
- department_code: The code pointing to the parent Department (master_departments.department_code) that this division belongs to.
- department_name: The official name of the Parent Department associated with this division.
- name: The official name or designation of the division (e.g., "Field Sales," "IT Support").
- description: A brief explanation or note regarding the main function or duties of the division.
- created_at: The timestamp (ISO 8601 format) when the division record was created.
- updated_at: The timestamp (ISO 8601 format) when the division record was last updated.

**404 Not Found:**

```json
{
  "status": "03",
  "message": "Divisi tidak ditemukan",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/divisions/code/DIV0000002" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 4. CREATE Division

Add a new Division record to the system, automatically assigning a unique ID and code, and associating it with a mandatory parent Department.

**Endpoints:**

```json
POST /divisions
```

**Request Body:**

```json
{
  "department_code": "DPT0000002",
  "name": "Tax Compliance",
  "description": "Bertanggung jawab atas kepatuhan perpajakan perusahaan dan pelaporan."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| department_code | string | Yes | Code of the mandatory parent department this division belongs to. | Must exist in master_departments. |
| name | string | Yes | The official name of the division. | Max 100 characters.|
| description | string | No | Brief explanation of the division's function. | Max 500 characters. |

**Response:**

**201 Created:**

```json
{
  "status": "00",
  "message": "Data Divisi Berhasil Ditambahkan",
  "datetime": "20251103101550",
  "id": 4,
  "divisions": {
    "id": 4,
    "division_code": "DIV0000004",
    "department_code": "DPT0000002",
    "name": "Tax Compliance",
    "description": "Bertanggung jawab atas kepatuhan perpajakan perusahaan dan pelaporan."
  }
}
```

**400 Bad Request:**

```json
{
  "status": "99",
  "message": "Departemen tidak ditemukan atau data yang diperlukan tidak lengkap.",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/divisions" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "department_code": "DPT0000002",
        "name": "Tax Compliance",
        "description": "Bertanggung jawab atas kepatuhan perpajakan perusahaan dan pelaporan."
    }'
```

### 5. UPDATE Division

Update the details of an existing Division using its unique database ID. This endpoint supports partial updates; you only need to send the fields you wish to change.

**Endpoints:**

```json
PUT /divisions/{id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the division to update (e.g., 1). |

**Request Body:**

```json
{
  "department_code": "DPT0000002",
  "name": "Tax Compliance and Reporting",
  "description": "Bertanggung jawab atas kepatuhan perpajakan perusahaan dan pelaporan."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| department_code | string | No | Code of the parent department this division belongs to. | Must exist in master_departments. |
| name | string | Yes | No official name of the division. | Max 100 characters.|
| description | string | No | Brief explanation of the division's function. | Max 500 characters. |

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Divisi Berhasil Diperbarui",
  "datetime": "20251103101550",
  "divisions": {
    "id": 1,
    "division_code": "DIV0000001",
    "department_code": "DPT0000002",
    "name": "Tax Compliance and Reporting",
    "description": "Bertanggung jawab atas kepatuhan perpajakan perusahaan dan pelaporan."
  }
}
```

**400 Bad Request:**

```json
{
  "status": "99",
  "message": "Departemen tidak ditemukan",
  "datetime": "20251103101550"
}
```

**404 Not Found:**

```json
{
  "status": "03",
  "message": "Divisi tidak ditemukan",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/divisions/1" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Tax Compliance and Reporting",
        "department_code": "DPT0000002"
    }'
```

### 6. DELETE Division

Remove an existing Division record from the system using its unique database ID.

**Endpoints:**

```json
DELETE /divisions/{id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the division to delete (e.g., 1). |

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Divisi Berhasil Dihapus",
  "datetime": "20251103101550"
}
```

**409 Conflict:**

```json
{
  "status": "05",
  "message": "Tidak dapat menghapus divisi yang masih memiliki karyawan terasosiasi.",
  "datetime": "20251103101551"
}
```

**404 Not Found:**

```json
{
  "status": "04",
  "message": "Divisi tidak ditemukan",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X DELETE "https://api.example.com/v1/divisions/1" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```
