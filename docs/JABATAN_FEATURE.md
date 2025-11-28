# 🏢 Position (Jabatan) Organization API

- version: 1.0
- Base URL: https://api.example.com/v1
- Last Updated: November 2025

Manage organizational hierarchies and position structures within offices. This API allows you to create, retrieve, update, and delete positions in a hierarchical tree structure.

## Table of Contents

- [Authentication](#authentication)
- [Common Response Formats](#common)
- [Endpoints](#endpoints)
  - [Get Organization Tree](#get-organization-tree)
  - [Get Flat Organization List](#get-flat-organization-list)
  - [Add Position to Organization](#add-position-organization)
  - [Update Position Organization](#update-position-organization)
  - [Delete Position Organization](#delete-position-organization)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

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
GET /positions/:office_code/organization
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| office_code | string | Yes | Unique identifier for the office (e.g., "OFC0000001") |

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
                    ]
                },
            ]
        },
        {
            "position_code": "JBT0000004",
            "name": "Manajer IT",
            "employee_code": "EMP0000004",
            "employee_name": "Squidward Tentacles",
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
curl -X GET "https://api.example.com/v1/positions/OFC0000001/organization" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Flat Organization List

Get a flat list of all positions with their direct parent relationships. Ideal for table displays and data processing.

**Endpoints:**

```json
GET /positions/:office_code/organization/flat
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| office_code | string | Yes | Unique identifier for the office (e.g., "OFC0000001") |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|----------|----------|----------|----------|----------
| page | integer | No | 1 | Page number for pagination |
| limit | integer | No | 100 | Items per page (max: 500) |

**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Organisasi Kantor Pusat Berhasil Didapatkan",
    "datetime": "20251103101550"
    "organizations": [
        {
            "position_code": "JBT0000001",
            "name": "Direktur Perusahaan",
            "parent_position_code": null,
            "sort_order": 1,
        },
        {
            "position_code": "JBT0000002",
            "name": "Manajer HR",
            "parent_position_code": "JBT0000001",
            "sort_order": 1,
        },
        {
            "position_code": "JBT0000003",
            "name": "HR Staff",
            "parent_position_code": "JBT0000002",
            "sort_order": 1,
        },
        {
            "position_code": "JBT0000004",
            "name": "Manajer Keuangan",
            "parent_position_code": "JBT0000001",
            "sort_order": 2,
        }
   ]

}
```

`Field Descriptions:`

- parent_position_code: Code of the direct supervisor position (null for root positions)
- sort_order: Display order among siblings (lower numbers appear first)
- level: Depth in the hierarchy (0 = root, 1 = first level, etc.)

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
curl -X GET "https://api.example.com/v1/positions/OFC0000001/organization/flat?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 3. ADD Position to Organization

Add a new position to the office organizational structure.

**Endpoints:**

```json
POST /positions/:office_code/organization
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| office_code | string | Yes | Unique identifier for the office (e.g., "OFC0000001") |

**Request Body:**

```json
{
  "position_code": "JBT0000002",
  "parent_position_code": "JBT0000001",
  "sort_order": 1
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | |
|----------|----------|----------|----------|----------|
| position_code | string | Yes | Code of the position to add | Must exist in positions master table |
| parent_position_code | string | No | Code of parent position | null for root positions; must exist if provided |
| sort_order | integer | No | Display order among siblings | Positive integer, default: 999 |

**Response:**

**201 Created:**

```json
{
    "status": "00",
    "message": "Data Organisasi Kantor Pusat Berhasil Ditambahkan",
    "datetime": "20251103101550"
    "organizations": {
        "position_code": "JBT0000002",
        "name": "Manajer HR",
        "parent_position_code": "JBT0000001",
        "sort_order": 1,
    },
}
```

**404 Not Found:**

```json
{
  "error": true,
  "message": "Parent jabatan tidak ditemukan",
  "datetime": "20251103101550"
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/positions/OFC0000001/organization" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "position_code": "JBT0000005",
    "parent_position_code": "JBT0000001",
    "sort_order": 3
  }'
```

### 4. Update Position Organization

Update an existing position's placement in the organizational hierarchy.

**Endpoints:**

```json
PUT /positions/:office_code/organization/:position_code
```

**Request Body:**

```json
{
  "parent_position_code": "JBT0000002",
  "sort_order": 2
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Validation |
|----------|----------|----------|----------|----------|
| parent_position_code | string | No | New parent position | Cannot create circular references |
| sort_order | integer | No | New display order | Positive integer |

**Request Body:**

```json
{
  "position_code": "JBT0000002",
  "parent_position_code": "JBT0000001",
  "sort_order": 1
}
```

**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Organisasi Kantor Pusat Berhasil Diperbarui",
    "datetime": "20251103101550"
    "organization": {
        "position_code": "JBT0000003",
        "name": "HR Staff",
        "parent_position_code": "JBT0000002",
        "sort_order": 2,
        "level": 2
    }
}
```

**400 Bad Request:** Circular reference detected

```json
{
  "error": true,
  "message": "Tidak dapat membuat referensi melingkar dalam organisasi",
  "datetime": "20251103101550"
}
```

**404 Not Found:**

```json
{
  "error": true,
  "message": "Position tidak ditemukan dalam organisasi",
  "datetime": "20251103101550"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/positions/OFC0000001/organization/JBT0000003" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "parent_position_code": "JBT0000002",
    "sort_order": 2
  }'
```

### 5. Delete Position Organization

Remove a position from the organizational structure.

**Endpoints:**

```json
DELETE /positions/:office_code/organization/:position_code
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|----------|----------|----------|---------- |
| office_code | string | Yes | Unique identifier for the office |
| position_code | string | Yes | Code of the position to delete |

**Response:**

**200 OK:**

```json
{
  "status": "00",
  "message": "Data Organisasi Berhasil Dihapus",
  "datetime": "20251103101550"
}
```

**400 Bad Request:** Position has children

```json
{
  "error": true,
  "message": "Tidak dapat menghapus position yang memiliki anak.",
  "datetime": "20251103101550"
}
```

**404 Not Found:**

```json
{
  "error": true,
  "message": "Position tidak ditemukan dalam organisasi",
  "datetime": "20251103101550"
}
```

**cURL Example:**

```json
curl -X DELETE "https://api.example.com/v1/positions/OFC0000001/organization/JBT0000005" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## ⚠️ Error Handling

**Common Error Codes:**
| Code | HTTP Status | Description |
|----------|----------|----------|
| OFFICE_NOT_FOUND | 404 | The specified office does not exist |
| POSITION_NOT_FOUND | 404 | The position is not in the organization structure |
| PARENT_NOT_FOUND | 404 | The specified parent position does not exist |
| POSITION_ALREADY_EXISTS | 400 | Position is already in the organization |
| CIRCULAR_REFERENCE | 400 | Operation would create a circular reference |
| HAS_CHILDREN | 400 | Cannot delete position with children (use cascade) |
| INVALID_SORT_ORDER | 400 | Sort order must be a positive integer |
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | Insufficient permissions for this operation |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests, please slow down |

## 🚦 Rate Limiting

- Rate Limit: 1000 requests per hour per API key
- Burst Limit: 100 requests per minute

**Rate Limit Headers:**

```json
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 850
X-RateLimit-Reset: 1699012800
```

**When rate limit is exceeded:**

```json
    "error": true,
    "message": "Rate limit exceeded. Please retry after 300 seconds",
    "datetime": "20251103101550",
```

## 📚 Additional Resources

- Postman Collection — Import ready-to-use API requests
