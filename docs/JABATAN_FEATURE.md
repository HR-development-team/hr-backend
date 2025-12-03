# 🏢 Position (Jabatan) Organization API

- version: 1.0
- Base URL: https://hr-backend-production-1ce0.up.railway.app
- Last Updated: Desember 2025

Manage organizational hierarchies and position structures within offices. This API allows you to create, retrieve, update, and delete positions in a hierarchical tree structure.

## Table of Contents

- [Authentication](#-authentication)
- [Common Response Formats](#-common-response-formats)
- [Endpoints](#-endpoints)
  - [Get Organization Tree](#1-get-organization-tree)
  - [Get Position List](#2-get-position-list)
  - [Get Position By Id](#3-get-position-by-id)
  - [Get Position By Code](#4-get-position-by-code)
  - [Create Position](#5-create-position)
  - [Update Position](#6-update-position)
  - [Delete Position](#7-delete-position)

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
  "error": true,
  "message": "Error description",
  "datetime": "20251103101550"
}
```

**Field Descriptions**

- status: "00" for success, other codes indicate specific errors
- datetime: Response timestamp in YYYYMMDDHHmmss format (Asia/Jakarta timezone)
- error: Boolean indicating if an error occurred

## 🔌 Endpoints

### 1. GET Organization Tree

Get the complete organization structure as a nested hierarchical tree, perfect for rendering org charts.

**Endpoints:**

```json
GET /positions/organization/:office_id
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| office_id | string | Yes | Unique identifier for the office |

**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Organisasi Kantor Pusat Berhasil Didapatkan",
    "office_code": "OFC0000001",
    "datetime": "20251103101550"
    "organizations": [
        {
            "position_code": "JBT0000001",
            "name": "Direktur Perusahaan",
            "employee_code": "EMP0000001",
            "employee_name": "Budi Hartono",
            "children": [
                {
                    "position_code": "JBT0000002",
                    "name": "Manajer HR",
                    "employee_code": "EMP0000002",
                    "employee_name": "Patrick Star",
                    "children": [
                        {
                            "position_code": "JBT0000003",
                            "name": "Staff HR",
                            "employee_code": "EMP0000003",
                            "employee_name": "Spongebob Squarepants",
                            "children": []
                        },
                        {
                            "position_code": "JBT0000003",
                            "name": "Staff HR",
                            "employee_code": "EMP0000004",
                            "employee_name": "Gary The Snail",
                            "children": []
                        },
                    ]
                },
            ]
        },
        {
            "position_code": "JBT0000004",
            "name": "Manajer IT",
            "employee_code": null,
            "employee_name": null,
            "children": []
        }
    ]
}
```

`Field Descriptions:`

- position_code: Unique identifier for the position
- name: Display name of the position
- employee_code: Code of employee currently assigned
- employee_name: Name of employee currently assigned
- children: Array of subordinate positions (recursive structure)

**404 Not Found:**

```json
{
  "error": true,
  "message": "Kantor tidak ditemukan",
  "datetime": "20251103101550"
}
```

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/positions/organization/1" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Position List

Get a  list of all positions (Jabatan). The list can be filtered to include only positions associated with a specific office using an optional query parameter. This endpoint is ideal for general selection menus, dropdowns, and basic data tables.

**Endpoints:**

```json
GET /positions
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|----------|----------|----------|---------- | ---------- |
| office_code | string | No | N/A | Unique identifier for the office (e.g., OFC0000001) to filter the positions by. |

**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Jabatan Berhasil Didapatkan",
    "datetime": "20251203102605",
    "positions": [
        {
            "id": 1,
            "position_code": "JBT0000001",
            "division_code": "DIV0000001",
            "parent_position_code": null,
            "name": "Direktur Perusahaan",
            "base_salary": 50000000.00,
            "sort_order": 1,
            "description": "Posisi tertinggi, bertanggung jawab atas arah strategis perusahaan."
        },
        {
            "id": 2,
            "position_code": "JBT0000002",
            "division_code": "DIV0000001",
            "parent_position_code": "JBT0000001",
            "name": "Manajer HR",
            "base_salary": 15000000.00,
            "sort_order": 1,
            "description": "Mengelola semua fungsi sumber daya manusia."
        },
        {
            "id": 3,
            "position_code": "JBT0000003",
            "division_code": "DIV0000002",
            "parent_position_code": "JBT0000001",
            "name": "Manajer Keuangan",
            "base_salary": 18000000.00,
            "sort_order": 2,
            "description": "Bertanggung jawab atas manajemen kas dan pelaporan keuangan."
        }
    ]
}
```

`Field Descriptions:`

- id: The internal database primary key.
- position_code: The unique external identifier for the position.
- division_code: The code pointing to the parent Division (master_divisions.division_code).
- parent_position_code: The code of the direct superior position. null for root/top-level positions.
- name: The official name of the position.
- base_salary: The standard base salary amount for this position.
- sort_order: A number defining the display order among positions sharing the same parent. Lower numbers appear first.
- description: A brief explanation of the position's main role.

**404 Not Found:**

```json
{
  "error": true,
  "message": "Kantor tidak ditemukan",
  "datetime": "20251103101550"
}
```

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/positions?office_code=OFC0000001" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 3. GET Position By ID

Retrieve the detailed data for a single Position (Jabatan) using its unique internal database ID. The response includes all schema fields and the name of the parent division and reporting position for context.

**Endpoints:**

```json
GET /positions/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the office to retrieve (e.g., 2). |

**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Posisi Berhasil Didapatkan",
    "datetime": "20251203102605",
    "positions": {
        "id": 2,
        "position_code": "JBT0000002",
        "division_code": "DIV0000001",
        "department_code": "DPT0000001",
        "division_name": "Recruitment & Staffing",
        "parent_position_code": "JBT0000001",
        "parent_position_name": "Direktur Perusahaan",
        "name": "Manajer HR",
        "base_salary": 15000000.00,
        "sort_order": 1,
        "description": "Mengelola semua fungsi sumber daya manusia.",
        "created_at": "2025-11-01T09:00:00Z",
        "updated_at": "2025-12-01T10:30:00Z"
    }
}
```

**404 Not Found:**

```json
{
    "status": "03",
    "message": "Posisi tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/positions/2" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" 
```

### 4. GET Position By Code

Retrieve the detailed data for a single Position (Jabatan) using its unique position code identifier. This endpoint is useful for systems that rely on external identifiers rather than the internal database ID.

**Endpoints:**

```json
GET /positions/code/{position_code}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| position_code | string | Yes | The unique code of the position to retrieve (e.g., JBT0000002). |

**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Posisi Berhasil Didapatkan",
    "datetime": "20251203102605",
    "positions": {
        "id": 2,
        "position_code": "JBT0000002",        
        "department_code": "DPT0000001",
        "department_name": "Human Resources",
        "division_code": "DIV0000001",
        "division_name": "Recruitment & Staffing",
        "parent_position_code": "JBT0000001",
        "parent_position_name": "Direktur Perusahaan",
        "name": "Manajer HR",
        "base_salary": 15000000.00,
        "sort_order": 1,
        "description": "Mengelola semua fungsi sumber daya manusia.",
        "created_at": "2025-11-01T09:00:00Z",
        "updated_at": "2025-12-01T10:30:00Z"
    }
}
```

**404 Not Found:**

```json
{
    "status": "03",
    "message": "Posisi tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X GET "https://api.example.com/v1/positions/code/JBT0000002" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 5. CREATE Position

Add a new Position (Jabatan) record to the system, associating it with a parent Division and defining its place in the organizational hierarchy.

**Endpoints:**
```json
POST /positions
```

**Request Body:**
```json
{
    "division_code": "DIV0000001",
    "parent_position_code": "JBT0000002",
    "name": "Staff HR Generalist",
    "base_salary": 8000000.00,
    "sort_order": 5,
    "description": "Melaksanakan tugas administrasi umum dan spesialisasi HR."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| division_code | string | Yes | Code of the mandatory parent Division this position belongs to. | Must exist in master_divisions. |
| parent_position_code | string | No | Code of the direct superior position. | Must exist if provided; null for root positions (e.g., CEO, Directors). |
| name | string | Yes | The official name of the position. | Max 100 characters. |
| base_salary | number | Yes | The standard base salary amount for this position. | Decimal (12, 2). |
| sort_order | integer | No | Display order among sibling positions (sharing the same parent). | Positive integer, Default: auto increment. |
| description | string | No | Brief explanation of the position's function. | Max 1000 characters. |

**Response:**

**201 Created:**
```json
{
    "status": "00",
    "message": "Data Posisi Berhasil Ditambahkan",
    "datetime": "20251203104200",
    "positions": {
        "id": 10,
        "position_code": "JBT0000010",
        "division_code": "DIV0000001",
        "parent_position_code": "JBT0000002",
        "name": "Staff HR Generalist",
        "base_salary": 8000000.00,
        "sort_order": 5,
        "description": "Melaksanakan tugas administrasi umum dan spesialisasi HR."
    }
}
```

**400 Bad Request:**
```json
{
    "status": "99",
    "message": "Tidak dapat membuat referensi melingkar dalam organisasi posisi.",
    "datetime": "20251203104200"
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/positions" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "division_code": "DIV0000001",
        "parent_position_code": "JBT0000002",
        "name": "Staff HR Generalist",
        "base_salary": 8000000.00,
        "sort_order": 5,
        "description": "Melaksanakan tugas administrasi umum dan spesialisasi HR."
    }'
```


### 6. Update Position

Update the details of an existing Position (Jabatan) using its unique database ID. This endpoint supports partial updates, allowing modifications to any field, including its divisional assignment or reporting structure.

**Endpoints:**

```json
PUT /positions/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the office to retrieve (e.g., 2). |

**Request Body:**

```json
{
    "name": "Manajer HR & Talent Acquisition",
    "base_salary": 16500000.00,
    "sort_order": 1
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| division_code | string | No | Code of the mandatory parent Division this position belongs to. | Must exist in master_divisions. |
| parent_position_code | string | No | Code of the direct superior position. | Must exist if provided; null for root positions (e.g., CEO, Directors). |
| name | string | No | The official name of the position. | Max 100 characters. |
| base_salary | number | No | The standard base salary amount for this position. | Decimal (12, 2). |
| sort_order | integer | No | Display order among sibling positions (sharing the same parent). | Positive integer, Default: auto increment. |
| description | string | No | Brief explanation of the position's function. | Max 1000 characters. |


**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Posisi Berhasil Diperbarui",
    "datetime": "20251203104831",
    "positions": {
        "id": 2,
        "position_code": "JBT0000002",
        "division_code": "DIV0000001",
        "parent_position_code": "JBT0000001",
        "name": "Manajer HR & Talent Acquisition",
        "base_salary": 16500000.00,
        "sort_order": 1,
        "description": "Mengelola semua fungsi sumber daya manusia.",
        "updated_at": "2025-12-03T10:48:31Z"
    }
}
```

**400 Bad Request:**

```json
{
    "status": "99",
    "message": "Tidak dapat membuat referensi melingkar dalam organisasi posisi.",
    "datetime": "20251203104200"
}
```

**404 Not Found:**

```json
{
    "status": "03",
    "message": "Posisi tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/positions/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Manajer HR & Talent Acquisition",
        "base_salary": 16500000.00
    }'
```

### 7. DELETE Position

Remove an existing Position (Jabatan) record from the system using its unique database ID. This operation will fail if the position is occupied or if other positions report to it.

**Endpoints:**
```json
DELETE /positions/{id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the office to retrieve (e.g., 2). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Data Posisi Berhasil Dihapus",
    "datetime": "20251103101550"
}
```

**409 Conflict:**
```json
{
    "status": "05",
    "message": "Tidak dapat menghapus posisi yang memiliki karyawan terasosiasi atau posisi bawahan.",
    "datetime": "20251103101551"
}
```

**404 Not Found:**
```json
{
    "status": "04",
    "message": "Posisi tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**
```json
curl -X DELETE "https://api.example.com/v1/positions/10" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```
