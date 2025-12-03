# 👤 CRUD Role API Documentation

- version: 1.0
- Base URL: https://hr-backend-production-1ce0.up.railway.app
- Last Updated: December 2025

The Role Management API provides standard CRUD capabilities for defining and managing user roles within the system.

## Table of Contents

- [Authentication](#-authentication)
- [Common Response Formats](#-common-response-formats)
- [Endpoints](#-endpoints)
  - [Get Role List](#1-get-role-list)
  - [Get Role By Id](#2-get-role-by-id)
  - [Get Role By Code](#3-get-role-by-code)
  - [Create Role](#4-create-role)
  - [Update Role](#5-update-role)
  - [Delete Role](#6-delete-role)

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

### 1. GET Role List

Get a list of all defined system Roles. This endpoint is ideal for table displays, dropdown menus, and data processing.

**Endpoints:**
```json
GET /roles
```

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Daftar Role (Peran) Berhasil Didapatkan",
    "datetime": "20251203105600",
    "roles": [
        {
            "id": 1,
            "role_code": "ROL0000001",
            "role_name": "Administrator",
            "description": "Hak akses tertinggi, dapat mengelola semua data."
        },
        {
            "id": 2,
            "role_code": "ROL0000002",
            "role_name": "HR Manager",
            "description": "Dapat mengelola data karyawan dan posisi."
        },
        {
            "id": 3,
            "role_code": "ROL0000003",
            "role_name": "Finance Staff",
            "description": "Peran untuk staf departemen keuangan dan akuntansi."
        }
    ]
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- role_code: A unique identifier for the role.
- role_name: The unique, full name of the role.
- description: A brief explanation of the role's scope and responsibilities.

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/roles" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Role By Id

Retrieve the detailed data for a single Role using its unique internal database ID.

**Endpoints:**
```json
GET /roles/{id}
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
    "message": "Role Berhasil Didapatkan",
    "datetime": "20251203113000",
    "roles": {
        "id": 2,
        "role_code": "ROL0000002",
        "role_name": "HR Manager",
        "description": "Dapat mengelola data karyawan, posisi, dan melakukan otorisasi cuti.",
        "created_at": "2025-11-01T09:00:00Z",
        "updated_at": "2025-12-03T11:30:00Z"
    }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- role_code: A unique identifier for the role.
- role_name: The unique, full name of the role.
- description: A brief explanation of the role's scope and responsibilities.
- created_at: The timestamp (ISO 8601 format) when the role was created.
- updated_at: The timestamp (ISO 8601 format) when the role was last updated.

**404 Not Found:**
```json
{
    "status": "03",
    "message": "Role tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/roles/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 3. GET Role By Code

Retrieve the detailed data for a single Role using its unique role code identifier. This endpoint is provided for systems that rely on external identifiers rather than the internal ID.

**Endpoints:**
```json
GET /roles/code/{role_code}
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
    "message": "Role Berhasil Didapatkan",
    "datetime": "20251203113500",
    "roles": {
        "id": 2,
        "role_code": "ROL0000002",
        "role_name": "HR Manager",
        "description": "Dapat mengelola data karyawan, posisi, dan melakukan otorisasi cuti.",
        "created_at": "2025-11-01T09:00:00Z",
        "updated_at": "2025-12-03T11:35:00Z"
    }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- role_code: A unique identifier for the role.
- role_name: The unique, full name of the role.
- description: A brief explanation of the role's scope and responsibilities.
- created_at: The timestamp (ISO 8601 format) when the role was created.
- updated_at: The timestamp (ISO 8601 format) when the role was last updated.

**404 Not Found:**
```json
{
    "status": "03",
    "message": "Role tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/roles/code/ROL0000002" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
``` 

### 4. CREATE Role

Add a new system role (e.g., 'Administrator', 'HR Manager'). The id and unique role_code are automatically generated by the system upon creation.

**Endpoints:**
```json
POST /roles
```

**Request Body:**
```json
{
    "role_name": "Marketing Analyst",
    "description": "Peran untuk menganalisis tren pasar dan performa kampanye."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| role_name | string | Yes | The unique name of the new role. | PK, Max 20 characters. |
| description | string | No | A brief description of the role's responsibilities or scope. | Max 1000 characters.|

**Response:**

**201 Created:**
```json
{
    "status": "00",
    "message": "Role Berhasil Ditambahkan",
    "datetime": "20251203113800",
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
    "message": "Role name sudah ada atau data tidak lengkap.",
    "datetime": "20251203113801"
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/roles" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "role_name": "Marketing Analyst",
        "description": "Peran untuk menganalisis tren pasar dan performa kampanye."
    }'
```

### 5. Update Role

Update the details of an existing Role using its unique database ID. This endpoint supports partial updates, typically for the role's description.

**Endpoints:**

```json
PUT /roles/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the role to retrieve (e.g., 2). |

**Request Body:**

```json
{
    "description": "Dapat mengelola data karyawan, posisi, dan melakukan otorisasi cuti."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| role_name | string | No | The unique name of the new role. | PK, Max 20 characters. |
| description | string | No | A brief description of the role's responsibilities or scope. | Max 1000 characters.|


**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Role Berhasil Diperbarui",
    "datetime": "20251203114000",
    "roles": {
        "id": 2,
        "role_code": "ROL0000002",
        "role_name": "HR Manager",
        "description": "Dapat mengelola data karyawan, posisi, dan melakukan otorisasi cuti.",
        "updated_at": "2025-12-03T11:40:00Z"
    }
}
```

**404 Not Found:**

```json
{
    "status": "03",
    "message": "Role tidak ditemukan",
    "datetime": "20251203114001"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/roles/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "description": "Dapat mengelola data karyawan, posisi, dan melakukan otorisasi cuti."
    }'
```

### 6. DELETE Role

Remove an existing Role from the system using its unique database ID. This operation will fail if the role is currently assigned to any users or if any permissions are defined against it.

**Endpoints:**
```json
DELETE /roles/{id}
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
    "message": "Role Berhasil Dihapus",
    "datetime": "20251203114200"
}
```

**409 Conflict:**
```json
{
    "status": "05",
    "message": "Tidak dapat menghapus role yang masih memiliki user atau permission terasosiasi.",
    "datetime": "20251203114201"
}
```

**404 Not Found:**
```json
{
    "status": "04",
    "message": "Role tidak ditemukan",
    "datetime": "20251203114202"
}
```

**cURL Example:**
```json
curl -X DELETE "https://api.example.com/v1/roles/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```
