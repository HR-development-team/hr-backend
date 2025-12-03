# 🏢 Office Organization API

- version: 1.0
- Base URL: https://hr-backend-production-1ce0.up.railway.app
- Last Updated: December 2025

Manage organizational hierarchies offices. This API allows you to create, retrieve, update, and delete offices in a hierarchical tree structure.

## Table of Contents

- [Authentication](#-authentication)
- [Common Response Formats](#-common-response-formats)
- [Endpoints](#-endpoints)
  - [Get Organization Tree](#1-get-office-organization-tree)
  - [Get Office List](#2-get-office-list)
  - [Get Office By Id](#3-get-office-by-id)
  - [Get Office By Code](#4-get-office-by-code)
  - [Create Office](#5-create-office)
  - [Update Office](#6-update-office)
  - [Delete Office](#7-delete-office)

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

### 1. GET Office Organization Tree

Get the complete organization structure as a nested hierarchical tree, perfect for rendering org charts.

**Endpoints:**

```json
GET /offices/organization
```

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Data Organisasi Kantor Berhasil Didapatkan",
    "datetime": "20251103101550",
    "offices": [
        {
            "id": 1,
            "office_code": "OFC0000001",
            "name": "Kantor Pusat Jakarta",
            "address": "Jl. Pahlawan no. 31 Jakarta Pusat",
            "description": "Kantor Pusat yang berada di Jakarta",
            "children": [
                {
                    "id": 2,
                    "office_code": "OFC0000002",
                    "name": "Kantor Cabang Jawa Timur",
                    "address": "Jl. Pahlawan no. 22 Surabaya",
                    "description": "Kantor Cabang yang berada di Surabaya",
                    "children": [
                        {
                            "id": 3,
                            "office_code": "OFC0000003", // Corrected code for uniqueness
                            "name": "Kantor Unit Madiun", // Changed name slightly to fit 'Unit'
                            "address": "Jl. Pahlawan no. 11 Madiun",
                            "description": "Kantor Unit yang berada di Madiun",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "id": 4,
            "office_code": "OFC0000004", // Corrected code for uniqueness
            "name": "Kantor Cabang Jawa Tengah",
            "address": "Jl. Pahlawan no. 10 Semarang",
            "description": "Kantor Cabang yang berada di Semarang",
            "children": []
        }
    ]
}
```

`Field Descriptions:`

- id: The internal database primary key (integer) for the office.
- office_code: Unique identifier for the office
- name: Display name of the office
- address: Display address of the office
- description: Display the description of the office
- children: Array of subordinate offices (recursive structure)

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/offices/organization" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Office List

Get a list of all office with their direct parent relationships. Ideal for table displays and data processing.

**Endpoints:**
```json
GET /offices
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|----------|----------|----------|----------|----------
| page | integer | No | 1 | Page number for pagination |
| limit | integer | No | 100 | Items per page (max: 500) |

**Response:**

**200 OK:**
```json
"status": "00",
    "message": "Data Kantor Berhasil Didapatkan",
    "datetime": "20251103101550",
    "offices": [
        {
            "id": 1,
            "office_code": "OFC0000001",
            "parent_office_code": null,
            "name": "Kantor Pusat Jakarta",
            "address": "Jl. Jend. Sudirman Kav. 1, Jakarta Pusat",
            "latitude": -6.200000,
            "longitude": 106.800000,
            "radius_meters": 50,
            "sort_order": 1,
            "description": "Kantor pusat dan administrasi utama."
        },
        {
            "id": 2,
            "office_code": "OFC0000002",
            "parent_office_code": "OFC0000001",
            "name": "Kantor Cabang Bandung",
            "address": "Jl. Asia Afrika No. 100, Bandung",
            "latitude": -6.917464,
            "longitude": 107.619125,
            "radius_meters": 75,
            "sort_order": 2,
            "description": "Kantor cabang regional untuk wilayah Jawa Barat."
        },
        {
            "id": 3,
            "office_code": "OFC0000003",
            "parent_office_code": "OFC0000001",
            "name": "Kantor Operasional Surabaya",
            "address": "Jl. Gubernur Suryo No. 1, Surabaya",
            "latitude": -7.257472,
            "longitude": 112.752077,
            "radius_meters": 60,
            "sort_order": 3,
            "description": "Pusat operasional dan distribusi di Jawa Timur."
        }
    ]
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- office_code: A unique code that serves as the primary identifier for each office.
- parent_office_code: The code pointing to the direct supervising office in the hierarchy. This field allows for the creation of a parent-child organizational structure.  Null value just for the Head Office.
- name: The official name or designation of the office (e.g., "Jakarta Headquarters," "Medan Branch Office").
- address: The complete physical location address of the office.
- latitude: The latitude coordinate of the office location, used along with longitude to define the geographic point.
- longitude: The longitude coordinate of the office location.
- radius_meters: The distance radius (in meters) from the office's latitude/longitude point. This is used to define the boundary for geofencing purposes (e.g., attendance check-in).
- sort_order: A number that determines the display order of the office. This order only applies to offices that share the same parent_office_code (sibling offices). Lower numbers will appear earlier in the list.
- description: A brief explanation or note regarding the main function, duties, or coverage area of the office.

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/offices" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 3. GET Office By Id

Retrieve the detailed data for a single office using its unique identifier (office_code).

**Endpoints:**
```json
GET /offices/{id}
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
    "message": "Data Kantor Berhasil Didapatkan",
    "datetime": "20251103101550"
    "offices": {
        "id": 2,
        "office_code": "OFC0000002",
        "parent_office_code": "OFC0000001",
        "name": "Kantor Cabang Bandung",
        "parent_office_name": "Kantor Pusat Jakarta",
        "address": "Jl. Asia Afrika No. 100, Bandung",
        "latitude": -6.917464,
        "longitude": 107.619125,
        "radius_meters": 75,
        "sort_order": 2,
        "description": "Kantor cabang regional untuk wilayah Jawa Barat."
    }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- office_code: A unique code that serves as the primary identifier for each office.
- parent_office_code: The code pointing to the direct supervising office in the hierarchy. This field allows for the creation of a parent-child organizational structure.  Null value just for the Head Office.
- name: The official name or designation of the office (e.g., "Jakarta Headquarters," "Medan Branch Office").
- parent_office_name: The official name of the parent office.
- address: The complete physical location address of the office.
- latitude: The latitude coordinate of the office location, used along with longitude to define the geographic point.
- longitude: The longitude coordinate of the office location.
- radius_meters: The distance radius (in meters) from the office's latitude/longitude point. This is used to define the boundary for geofencing purposes (e.g., attendance check-in).
- sort_order: A number that determines the display order of the office. This order only applies to offices that share the same parent_office_code (sibling offices). Lower numbers will appear earlier in the list.
- description: A brief explanation or note regarding the main function, duties, or coverage area of the office.

**404 Not Found:**
```json
{
    "status": "03",
    "message": "Kantor tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/offices/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```

### 4. GET Office By Code

Retrieve the detailed data for a single office using its unique office code identifier. This endpoint is provided for systems that rely on the external code rather than the internal ID.

**Endpoints:**
```json
GET /offices/code/{office_code}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| office_code | string | Yes | The unique code of the office to retrieve (e.g., OFC0000002). |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Data Kantor Berhasil Didapatkan",
    "datetime": "20251103101550"
    "offices": {
        "id": 2,
        "office_code": "OFC0000002",
        "parent_office_code": "OFC0000001",
        "name": "Kantor Cabang Bandung",
        "parent_office_name": "Kantor Pusat Jakarta",
        "address": "Jl. Asia Afrika No. 100, Bandung",
        "latitude": -6.917464,
        "longitude": 107.619125,
        "radius_meters": 75,
        "sort_order": 2,
        "description": "Kantor cabang regional untuk wilayah Jawa Barat."
    }
}
```

`Field Descriptions:`

- id: The internal database primary key (auto-incremented integer).
- office_code: A unique code that serves as the primary identifier for each office.
- parent_office_code: The code pointing to the direct supervising office in the hierarchy. This field allows for the creation of a parent-child organizational structure.  Null value just for the Head Office.
- name: The official name or designation of the office (e.g., "Jakarta Headquarters," "Medan Branch Office").
- parent_office_name: The official name of the parent office.
- address: The complete physical location address of the office.
- latitude: The latitude coordinate of the office location, used along with longitude to define the geographic point.
- longitude: The longitude coordinate of the office location.
- radius_meters: The distance radius (in meters) from the office's latitude/longitude point. This is used to define the boundary for geofencing purposes (e.g., attendance check-in).
- sort_order: A number that determines the display order of the office. This order only applies to offices that share the same parent_office_code (sibling offices). Lower numbers will appear earlier in the list.
- description: A brief explanation or note regarding the main function, duties, or coverage area of the office.

**404 Not Found:**
```json
{
    "status": "03",
    "message": "Kantor tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/offices/code/OFC0000002" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
``` 

### 5. CREATE Office

Add a new physical office location record to the system.

**Endpoints:**
```json
POST /offices
```

**Request Body:**
```json
{
    "parent_office_code": "OFC0000001",
    "name": "Kantor Cabang Semarang",
    "address": "Jl. Pemuda No. 1, Semarang",
    "latitude": -6.985694,
    "longitude": 110.409393,
    "radius_meters": 70,
    "sort_order": 4,
    "description": "Kantor cabang di wilayah Jawa Tengah."
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| parent_office_code | string | No | Code of the parent/supervising office. | null for the Head Office; must exist if provided. |
| name | string | Yes | The official name of the office. | Max 100 characters.|
| address | string | Yes | Complete physical location address. | Max 500 characters. |
| latitude | number | Yes | Geographical latitude coordinate. | Valid decimal number. |
| longitude | number | Yes | Geographical longitude coordinate. | Valid decimal number. |
| radius_meters | integer | No | Geofencing radius in meters. | Positive integer, Default: 50. |
| sort_order | integer | No | Display order among sibling offices. | Positive integer, Default: auto increment. |
| description | string | No | Brief explanation of the office's function. | Positive integer, Max 1000 characters. |

**Response:**

**201 Created:**
```json
{
    "status": "00",
    "message": "Data Kantor Berhasil Diperbarui",
    "datetime": "20251103101550",
    "offices": {
        "id": 2,
        "office_code": "OFC0000002",
        "parent_office_code": "OFC0000001",
        "name": "Kantor Cabang Semarang",
        "address": "Jl. Pemuda No. 1, Semarang",
        "latitude": -6.985694,
        "longitude": 110.409393,
        "radius_meters": 70,
        "sort_order": 4,
        "description": "Kantor cabang di wilayah Jawa Tengah."
    }
}
```

**400 Bad Request:**
```json
{
    "status": "99",
    "message": "Tidak dapat membuat referensi melingkar dalam organisasi kantor",
    "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X POST "https://api.example.com/v1/offices" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
          "parent_office_code": "OFC0000001",
          "name": "Kantor Cabang Semarang",
          "address": "Jl. Pemuda No. 1, Semarang",
          "latitude": -6.985694,
          "longitude": 110.409393,
          "radius_meters": 70,
          "sort_order": 4,
          "description": "Kantor cabang di wilayah Jawa Tengah."
    }'
```

### 6. Update Office

Update the details of an existing office location, including its geographic boundaries and position within the office hierarchy.

**Endpoints:**

```json
PUT /offices/{id}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| id | integer | Yes | The unique database ID of the office to retrieve (e.g., 2). |

**Request Body:**

```json
{
    "parent_office_code": "OFC0000001",
    "name": "Kantor Cabang Bandung Raya",
    "address": "Jl. Asia Afrika No. 100A, Bandung",
    "radius_meters": 80,
    "sort_order": 2
}
```

**Body Parameters**:
| Parameter | Type | Required | Description | Constraints |
|----------|----------|----------|----------|----------|
| parent_office_code | string | No | Code of the parent/supervising office. | null for the Head Office; must exist if provided. |
| name | string | Yes | The official name of the office. | Max 100 characters.|
| address | string | Yes | Complete physical location address. | Max 500 characters. |
| latitude | number | Yes | Geographical latitude coordinate. | Valid decimal number. |
| longitude | number | Yes | Geographical longitude coordinate. | Valid decimal number. |
| radius_meters | integer | No | Geofencing radius in meters. | Positive integer, Default: 50. |
| sort_order | integer | No | Display order among sibling offices. | Positive integer, Default: auto increment. |
| description | string | No | Brief explanation of the office's function. | Positive integer, Max 1000 characters. |


**Response:**

**200 OK:**

```json
{
    "status": "00",
    "message": "Data Kantor Berhasil Diperbarui",
    "datetime": "20251103101550"
    "offices": {
        "id": 2,
        "office_code": "OFC0000002",
        "parent_office_code": "OFC0000001",
        "name": "Kantor Cabang Bandung Raya",
        "address": "Jl. Asia Afrika No. 100A, Bandung",
        "latitude": -6.917464,
        "longitude": 107.619125,
        "radius_meters": 80,
        "sort_order": 2,
        "description": "Kantor cabang regional untuk wilayah Jawa Barat."
    }
}
```

**400 Bad Request:**

```json
{
  "status": "99",
  "message": "Tidak dapat membuat referensi melingkar dalam organisasi",
  "datetime": "20251103101550"
}
```

**404 Not Found:**

```json
{
    "status": "03",
    "message": "Kantor tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**

```json
curl -X PUT "https://api.example.com/v1/offices/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "parent_office_code": "OFC0000001",
        "name": "Kantor Cabang Bandung Raya",
        "address": "Jl. Asia Afrika No. 100A, Bandung",
        "radius_meters": 80,
        "sort_order": 2
    }'
```

### 7. DELETE Office

Remove an existing office record from the system using its unique identifier.

**Endpoints:**
```json
DELETE /offices/{id}
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
    "message": "Data Kantor Berhasil Dihapus",
    "datetime": "20251103101550"
}
```

**409 Conflict:**
```json
{
    "status": "05",
    "message": "Tidak dapat menghapus kantor yang memiliki kantor anak atau karyawan terasosiasi.",
    "datetime": "20251103101551"
}
```

**404 Not Found:**
```json
{
    "status": "04",
    "message": "Kantor tidak ditemukan",
    "datetime": "20251103101551"
}
```

**cURL Example:**
```json
curl -X DELETE "https://api.example.com/v1/offices/2" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```
