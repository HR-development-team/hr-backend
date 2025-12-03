# ⚙️ CRUD Feature API

- version: 1.0
- Base URL: https://hr-backend-production-1ce0.up.railway.app
- Last Updated: December 2025

The Feature Management API provides standard CRUD capabilities for defining and managing the distinct application modules or screens (Features) that require access control via user roles.

## Table of Contents

- [Authentication](#-authentication)
- [Common Response Formats](#-common-response-formats)
- [Endpoints](#-endpoints)
  - [Get Feature List](#1-get-feature-list)
  - [Get Feature By Id](#2-get-feature-by-id)
  - [Get Feature By Code](#3-get-feature-by-code)
  - [Create Feature](#4-create-feature)
  - [Update Feature](#5-update-feature)
  - [Delete Feature](#6-delete-feature)

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

### 1. GET Feature List

Get a complete, non-paginated list of all defined application Features.

**Endpoints:**
```json
GET /features
```

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Daftar Feature Berhasil Didapatkan",
    "datetime": "20251203115600",
    "features": [
        {
            "id": 1,
            "feature_code": "FTR0000001",
            "name": "Employee Management",
            "description": "Modul untuk mengelola data detail karyawan."
        },
        {
            "id": 2,
            "feature_code": "FTR0000002",
            "name": "Attendance Report",
            "description": "Laporan absensi dan kehadiran karyawan."
        }
    ]
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- feature_code: A unique identifier for the feature.
- feature_name: The unique, descriptive name of the feature..
- description: A brief explanation of the role's scope and responsibilities.

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/features" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Feature By Id

Retrieve the detailed data for a single Feature using its unique internal database ID.

**Endpoints:**
```json
GET /features/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the feature to retrieve (e.g., 2). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Feature Berhasil Didapatkan",
    "datetime": "20251203120100",
    "features": {
        "id": 1,
        "feature_code": "FTR0000001",
        "feature_name": "Employee Management",
        "description": "Modul untuk mengelola data detail karyawan.",
        "created_at": "2025-11-01T09:00:00Z",
        "updated_at": "2025-12-03T12:01:00Z"
    }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- feature_code: A unique identifier for the feature.
- feature_name: The unique, descriptive name of the feature..
- description: A brief explanation of the role's scope and responsibilities.

**404 Not Found:**
```json
{
    "status": "03",
    "message": "Feature tidak ditemukan",
    "datetime": "20251203120101"
}
```

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/features/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 3. GET Feature By Code

Retrieve the detailed data for a single Feature using its unique feature code identifier.

**Endpoints:**
```json
GET /features/code/{feature_code}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| feature_code | string | Yes | The unique code of the feature to retrieve (e.g., FTR0000001). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Feature Berhasil Didapatkan",
    "datetime": "20251203120200",
    "features": {
        "id": 1,
        "feature_code": "FTR0000001",
        "feature_name": "Employee Management",
        "description": "Modul untuk mengelola data detail karyawan.",
        "created_at": "2025-11-01T09:00:00Z",
        "updated_at": "2025-12-03T12:02:00Z"
    }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- feature_code: A unique identifier for the feature.
- feature_name: The unique, descriptive name of the feature..
- description: A brief explanation of the role's scope and responsibilities.

**404 Not Found:**
```json
{
    "status": "03",
    "message": "Feature tidak ditemukan",
    "datetime": "20251203120201"
}
```

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/features/code/ROL0000002" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
``` 

### 4. CREATE Role

Add a new application feature (e.g., 'User Management', 'Attendance Report') to the system. The id and unique feature_code are automatically generated by the system.

**Endpoints:**
```json
POST /features
```

**Request Body:**
```json
{
    "feature_name": "Employee Management",
    "description": "Modul untuk mengelola data detail karyawan."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| feature_name | string | Yes | The unique name of the feature. | PK, Max 50 characters. |
| description | string | No | A brief description of the feature's responsibilities or scope. | Max 1000 characters.|

**Response:**

**201 Created:**
```json
{
    "status": "00",
    "message": "Feature Berhasil Ditambahkan",
    "datetime": "20251203115500",
    "features": {
        "id": 1,
        "feature_code": "FTR0000001",
        "feature_name": "Employee Management",
        "description": "Modul untuk mengelola data detail karyawan."
    }
}
```

**400 Bad Request:**
```json
{
    "status": "99",
    "message": "Feature name sudah ada atau data tidak lengkap.",
    "datetime": "20251203115501"
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/features" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "feature_name": "Employee Management",
        "description": "Modul untuk mengelola data detail karyawan."
    }'
```

### 5. Update Feature

Update the details of an existing Feature using its unique database ID. The name and description are typically mutable.

**Endpoints:**

```json
PUT /features/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the feature to retrieve (e.g., 2). |

**Request Body:**

```json
{
    "feature_name": "Employee Detail Management",
    "description": "Modul untuk mengelola dan melihat semua data detail karyawan."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| feature_name | string | No | The unique name of the feature. | PK, Max 50 characters. |
| description | string | No | A brief description of the feature's responsibilities or scope. | Max 1000 characters.|


**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Feature Berhasil Diperbarui",
    "datetime": "20251203120300",
    "features": {
        "id": 1,
        "feature_code": "FTR0000001",
        "feature_name": "Employee Detail Management",
        "description": "Modul untuk mengelola dan melihat semua data detail karyawan.",
        "updated_at": "2025-12-03T12:03:00Z"
    }
}
```

**404 Not Found:**

```json
{
    "status": "03",
    "message": "Feature tidak ditemukan",
    "datetime": "20251203120302"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/features/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "description": "Dapat mengelola data karyawan, posisi, dan melakukan otorisasi cuti."
    }'
```

### 6. DELETE Feature

Remove an existing Feature from the system using its unique database ID. This operation will fail if any roles currently have permissions defined for this feature.

**Endpoints:**
```json
DELETE /features/{id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the feature to retrieve (e.g., 2). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Feature Berhasil Dihapus",
    "datetime": "20251203120400"
}
```

**409 Conflict:**
```json
{
    "status": "05",
    "message": "Tidak dapat menghapus feature yang memiliki permission terasosiasi dengan role.",
    "datetime": "20251203120401"
}
```

**404 Not Found:**
```json
{
    "status": "04",
    "message": "Feature tidak ditemukan",
    "datetime": "20251203120402"
}
```

**cURL Example:**
```json
curl -X DELETE "https://api.example.com/v1/features/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```
