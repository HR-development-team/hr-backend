# 🛡️ Permission Retrieval API

- version: 1.0
- Base URL: https://hr-backend-production-1ce0.up.railway.app
- Last Updated: December 2025

This API provides read-only endpoints to retrieve feature permissions, typically used by a frontend client to determine the access matrix for the current user or a specific role.

## Table of Contents

- [Authentication](#-authentication)
- [Common Response Formats](#-common-response-formats)
- [Endpoints](#-endpoints)
  - [Get User Permissions (Self)](#1-get-user-permission)
  - [Get Permission By Role Code](#2-get-permission-by-role-code)

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

### 1. GET User Permissions (Self)

Retrieve all feature permissions associated with the current logged-in user's role. This endpoint is used by client applications (frontends) to initialize the user interface and authorization checks. The user's role is inferred from the authentication token (Authorization header).

**Endpoints:**
```json
GET /role/permissions
```

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Permissions dengan role super_admin Berhasil Didapatkan",
    "datetime": "20251204020500",
    "role_permissions": {
        "user_code": "USR0000001",
        "role_name": "super_admin",
        "permissions": [
          {
              "feature_name": "Employee Management",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": false,
              "can_print": true
          },
          {
              "feature_name": "Student Transfer",
              "can_create": false,
              "can_read": true,
              "can_update": false,
              "can_delete": false,
              "can_print": false
          }
        ]
    }
}
```

`Field Descriptions:`

- feature_name: The unique, descriptive name of the feature..
- description: A brief explanation of the role's scope and responsibilities.

**cURL Example:**
```json
curl -X GET "https://api.example.com/v1/role/permissions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. GET Permission By Role Code

Retrieve all feature permissions associated with a specific Role, identified by its unique role_code. This is used by administrative tools to view or clone permission sets.

**Endpoints:**
```json
GET /role/permissions/{role_code}
```

**Path Parameters:**
| Parameter | Type | Required  | Description |
|----------|----------|----------|---------- |
| role_code | string | Yes | The unique code of the role (e.g., ROL0000002) to retrieve permissions for. |

**Response:**

**200 OK:**
```json
{
    "status": "00",
    "message": "Permissions Berhasil Didapatkan",
    "datetime": "20251204020600",    
    "role_permissions": [
        {
            "role_name": "HR Manager",
            "feature_name": "Employee Management",
            "can_create": true,
            "can_read": true,
            "can_update": true,
            "can_delete": false,
            "can_print": true
        },
        {
            "role_name": "HR Manager",
            "feature_name": "Attendance Report",
            "can_create": false,
            "can_read": true,
            "can_update": false,
            "can_delete": false,
            "can_print": true
        }
    ]
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
curl -X GET "https://api.example.com/v1/role/permissions/ROL0000003" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json"
```
