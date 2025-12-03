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
GET /role/features
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
curl -X GET "https://api.example.com/v1/role/features" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Feature By Id

Retrieve the detailed data for a single Feature using its unique internal database ID.

**Endpoints:**
```json
GET /role/features/{id}
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
curl -X GET "https://api.example.com/v1/role/features/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 3. GET Feature By Code

Retrieve the detailed data for a single Feature using its unique feature code identifier.

**Endpoints:**
```json
GET /role/features/code/{feature_code}
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
curl -X GET "https://api.example.com/v1/role/features/code/ROL0000002" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
``` 

### 4. CREATE Feature

Add a new application feature. The provided permission flags (can_create, etc.) define the default access granted to ALL existing Roles upon feature creation via a bulk process. The id and unique feature_code are automatically generated.

**Endpoints:**
```json
POST /role/features
```

**Request Body:**
```json
{
    "feature_name": "Employee Management",
    "description": "Modul untuk mengelola data detail karyawan."
    "can_create": false,
    "can_read": true,
    "can_update": false,
    "can_delete": false,
    "can_print": false
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| feature_name | string | Yes | The unique name of the feature. | PK, Max 50 characters. |
| description | string | No | A brief description of the feature's responsibilities or scope. | Max 1000 characters.|
| can_create | boolean | No | Default permission to create records. | Default: false. |
| can_read | boolean | No | Default permission to view records. | Default: false. |
| can_update | boolean | No | Default permission to modify records. | Default: false. |
| can_delete | boolean | No | Default permission to remove records. | Default: false. |
| can_print | boolean | No | Default permission to export or print data. | Default: false. |

**Response:**

**201 Created:**
```json
{
    "status": "00",
    "message": "Feature Berhasil Ditambahkan",
    "datetime": "20251203115500",
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
curl -X POST "https://api.example.com/v1/role/features" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "feature_name": "Employee Management",
        "description": "Modul untuk mengelola data detail karyawan."
    }'
```

### 5. Update Feature

Update the details of an existing Feature using its unique database ID. This endpoint is restricted to updating the non-key metadata, specifically the description, to preserve system integrity and avoid complex cascading updates in the permission matrix.

**Endpoints:**

```json
PUT /role/features/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the feature to retrieve (e.g., 2). |

**Request Body:**

```json
{
    "description": "Modul utama untuk mengelola semua data detail dan riwayat karyawan."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| description | string | No | The updated brief description of the feature's function. | Max 1000 characters. |


**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Feature Berhasil Diperbarui",
    "datetime": "20251204013700",
    "features": {
        "id": 1,
        "feature_code": "FCR0000001",
        "feature_name": "Employee Detail Management",
        "description": "Modul utama untuk mengelola semua data detail dan riwayat karyawan.",
        "updated_at": "2025-12-04T01:37:00Z"
    }
}
```

**404 Not Found:**

```json
{
    "status": "03",
    "message": "Feature tidak ditemukan",
    "datetime": "20251204013701"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/role/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "description": "Modul utama untuk mengelola semua data detail dan riwayat karyawan."
    }'
```

### 6. DELETE Feature

Remove an existing Feature from the system using its unique feature code. This operation will automatically delete all associated permission records (role_permissions) defined for this feature across all roles.

**Endpoints:**
```json
DELETE /role/features/{feature_code}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| feature_code | integer | Yes | The unique code of the feature to delete (e.g., FCR0000002). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Feature dan seluruh permission terkait Berhasil Dihapus",
    "datetime": "20251203155200"
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
curl -X DELETE "https://api.example.com/v1/role/features/FCR0000002" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```
