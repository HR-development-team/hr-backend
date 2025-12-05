# 🏢 CRUD Department API

- version: 1.0
- Base URL: https://api.example.com/v1
- Last Updated: November 2025

The Department Management API provides standard CRUD capabilities to manage, retrieve, and modify organizational Department records. It serves as the primary interface for department data.

## Table of Contents

- [Authentication](#-authentication)
- [Common Response Formats](#-common-response-formats)
- [Endpoints](#-endpoints)
  - [Get Department List](#1-get-department-list)
  - [Get Department By Id](#2-get-office-by-id)
  - [Get Department By code](#3-get-office-by-code)
  - [Create Department](#4-create-office)
  - [Update Department](#5-update-office)
  - [Delete Department](#6-delete-office)

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

### 1. GET Depatment List

Get a list of all departments, including their associated parent office code. This endpoint is ideal for table displays and data processing.

**Endpoints:**

```json
GET /departments
```

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Departemen Berhasil Didapatkan",
  "datetime": "20251103101550",
  "departments": [
    {
      "id": 1,
      "department_code": "DPT0000001",
      "office_code": "OFC0000001",
      "office_name": "Kantor Pusat Jakarta",
      "name": "Human Resources",
      "description": "Mengelola perekrutan, kompensasi, dan hubungan karyawan."
    },
    {
      "id": 2,
      "department_code": "DPT0000002",
      "office_code": "OFC0000001",
      "office_name": "Kantor Pusat Jakarta",
      "name": "Finance and Accounting",
      "description": "Bertanggung jawab atas pembukuan, penganggaran, dan pelaporan keuangan."
    },
    {
      "id": 3,
      "department_code": "DPT0000003",
      "office_code": "OFC0000002",
      "office_name": "Kantor Cabang Bandung",
      "name": "Sales Regional West",
      "description": "Tim penjualan yang beroperasi di wilayah Jawa Barat."
    }
  ]
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer). Used for system efficiency but often omitted in public-facing documentation.
- department_code: A unique code that serves as the primary identifier for the department in API requests and business logic.
- office_code: The code pointing to the parent Office (master_offices.office_code) that this department belongs to.
- name: The official name or designation of the department (e.g., "IT Department," "Marketing").
- office_name: The official name of the Parent Office associated with this department.
- description: A brief explanation or note regarding the main function or duties of the department.

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/departments" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Department By Id

Retrieve the detailed data for a single department using its unique internal database ID (primary key).

**Endpoints:**

```json
GET /departments/{id}
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
  "message": "Data Departemen Berhasil Didapatkan",
  "datetime": "20251103101550",
  "departments": {
    "id": 2,
    "department_code": "DPT0000002",
    "office_code": "OFC0000001",
    "office_name": "Kantor Pusat Jakarta",
    "name": "Finance and Accounting",
    "description": "Bertanggung jawab atas pembukuan, penganggaran, dan pelaporan keuangan.",
    "created_at": "2025-11-01T09:00:00Z",
    "updated_at": "2025-11-01T09:00:00Z"
  }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- department_code: A unique code that serves as the primary identifier for the department.
- office_code: The code pointing to the parent Office (master_offices.office_code) that this department belongs to.
- name: The official name or designation of the department (e.g., "IT Department," "Marketing").
- office_name: The official name of the Parent Office associated with this department.
- description: A brief explanation or note regarding the main function or duties of the department.
- created_at: The timestamp (ISO 8601 format) when the department record was created.
- updated_at: The timestamp (ISO 8601 format) when the department record was last updated.

**404 Not Found:**

```json
{
  "status": "03",
  "message": "Departemen tidak ditemukan",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/departments/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 3. GET Department By Code

Retrieve the detailed data for a single department using its unique department code identifier. The response includes all associated department and office details.

**Endpoints:**

```json
GET /departments/code/{department_code}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| department_code | string | Yes | The unique code of the department to retrieve (e.g., DPT0000002). |

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Departemen Berhasil Didapatkan",
  "datetime": "20251103101550",
  "departments": {
    "id": 2,
    "department_code": "DPT0000002",
    "office_code": "OFC0000001",
    "office_name": "Kantor Pusat Jakarta",
    "name": "Finance and Accounting",
    "description": "Bertanggung jawab atas pembukuan, penganggaran, dan pelaporan keuangan.",
    "created_at": "2025-11-01T09:00:00Z",
    "updated_at": "2025-11-01T09:00:00Z"
  }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- department_code: A unique code that serves as the primary identifier for the department.
- office_code: The code pointing to the parent Office (master_offices.office_code) that this department belongs to.
- name: The official name or designation of the department (e.g., "IT Department," "Marketing").
- office_name: The official name of the Parent Office associated with this department.
- description: A brief explanation or note regarding the main function or duties of the department.
- created_at: The timestamp (ISO 8601 format) when the department record was created.
- updated_at: The timestamp (ISO 8601 format) when the department record was last updated.

**404 Not Found:**

```json
{
  "status": "03",
  "message": "Departemen tidak ditemukan",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/departments/code/DPT0000002" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 4. CREATE Department

Add a new department record to the system, associating it with a parent office.

**Endpoints:**

```json
POST /departments
```

**Request Body:**

```json
{
  "office_code": "OFC0000003",
  "name": "Warehouse Management",
  "description": "Bertanggung jawab atas pengelolaan stok dan inventaris di gudang Surabaya."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| office_code | string | Yes | Code of the mandatory parent office this department belongs to. | Must exist in master_offices. |
| name | string | Yes | The official name of the department. | Max 100 characters.|
| description | string | No | Brief explanation of the department's function. | Max 500 characters. |

**Response:**

**201 Created:**

```json
{
  "status": "00",
  "message": "Data Departemen Berhasil Ditambahkan",
  "datetime": "20251103101550",
  "id": 4,
  "departments": {
    "department_code": "DPT0000003",
    "office_code": "OFC0000003",
    "name": "Warehouse Management",
    "description": "Bertanggung jawab atas pengelolaan stok dan inventaris di gudang Surabaya."
  }
}
```

**400 Bad Request:**

```json
{
  "status": "99",
  "message": "Kantor tidak ditemukan.",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/departments" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "office_code": "OFC0000003",
        "name": "Warehouse Management",
        "description": "Bertanggung jawab atas pengelolaan stok dan inventaris di gudang Surabaya."
    }'
```

### 5. UPDATE Department

Update the details of an existing department, including its name, description, or parent office association.

**Endpoints:**

```json
PUT /departments/{id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the department to update (e.g., 1). |

**Request Body:**

```json
{
  "office_code": "OFC0000001",
  "name": "Human Resources & Talent Acquisition",
  "description": "Mengelola perekrutan, kompensasi, dan hubungan karyawan pusat."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| office_code | string | No | Code of the mandatory parent office this department belongs to. | Must exist in master_offices. |
| name | string | Yes | No official name of the department. | Max 100 characters.|
| description | string | No | Brief explanation of the department's function. | Max 500 characters. |

**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Departemen Berhasil Diperbarui",
    "datetime": "20251103101550",
    "departments": {
        "id": 1
        "department_code": "DPT0000001",
        "office_code": "OFC0000001",
        "name": "Human Resources & Talent Acquisition",
        "description": "Mengelola perekrutan, kompensasi, dan hubungan karyawan pusat."
    }
}
```

**400 Bad Request:**

```json
{
  "status": "99",
  "message": "Kantor tidak ditemukan",
  "datetime": "20251103101550"
}
```

**404 Not Found:**

```json
{
  "status": "03",
  "message": "Departemen tidak ditemukan",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/departments/1" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Human Resources & Talent Acquisition",
        "description": "Mengelola perekrutan, kompensasi, dan hubungan karyawan pusat."
    }'
```

### 6. DELETE Department

Remove an existing department record from the system using its unique identifier.

**Endpoints:**

```json
DELETE /departments/{id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the department to delete (e.g., 1). |

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Departemen Berhasil Dihapus",
  "datetime": "20251103101550"
}
```

**409 Conflict:**

```json
{
  "status": "05",
  "message": "Tidak dapat menghapus departemen yang masih memiliki karyawan terasosiasi.",
  "datetime": "20251103101551"
}
```

**404 Not Found:**

```json
{
  "status": "04",
  "message": "Departemen tidak ditemukan",
  "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X DELETE "https://api.example.com/v1/departments/1" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```
