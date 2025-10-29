# 💼 Marstech HR — Simple HR Management System

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Knex.js](https://img.shields.io/badge/Knex.js-E65933?style=for-the-badge&logo=knex-dot-js&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-000000?style=for-the-badge&logo=helmet&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-000000?style=for-the-badge&logo=cors&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-N--Tier-blueviolet?style=for-the-badge&logo=layers&logoColor=white)

---

A **secure**, **scalable**, and **simple** Human Resource Management System (HRMS) backend built with **Express.js**, **TypeScript**, and **MySQL**.  
It provides **role-based access control** for **Employees** and **System Administrators**.

---

## ✨ Key Features

### 👩‍💼 Employee Self-Service (ESS)

- 🔐 **JWT-Based Authentication** (HS512)
- 👤 **View & Edit Personal Profile**
- 🕒 **Daily Attendance** — Check-in & Check-out
- 📄 **Leave Management** — Apply for leave & track status

### 🧑‍💻 Admin Dashboard

- 👨‍💼 **Employee CRUD** — Create, update, and manage employee data
- 🏢 **Master Data Management** — Departments & Positions
- ✅ **Leave Approvals** — Approve or reject requests
- 📊 **Attendance Monitoring** — Track all employees’ presence

### ⚙️ Technical Stack

- ⚡ **Express.js v5** (with full TypeScript support)
- 🛡️ **Security-first setup**: Helmet, CORS, JWT
- 🐘 **MySQL + Knex.js** (query builder, migrations, seeders)
- 🧩 **Zod Validation** — Type-safe input validation
- 🚦 **Standardized API Response Format**
- 🧱 **N-Tier Architecture** — Clear separation of concerns

---

## 🏗️ Project Structure

```bash
src/
├── constants/       # Application constants (status codes, keys, etc.)
├── controllers/     # Request & response handlers
├── database/
│   ├── migrations/  # Knex database migrations
│   └── seeds/       # Knex seed files
├── middleware/      # Authentication & role-based access middleware
├── models/          # Database operations (Knex.js models)
├── routes/          # API endpoint definitions
├── schemas/         # Zod validation schemas
├── types/           # Shared TypeScript types & interfaces
└── utils/           # Utility helpers (JWT, bcrypt, response formatter)
```

## 🚀 Getting Started

### 🧩 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v18 or newer**
- [npm](https://www.npmjs.com/)
- [Docker & Docker Compose](https://www.docker.com/)

---

### ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://your-repo-url/marstech-hr.git
cd marstech-hr

# 2. Setup environment variables
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start the database container
docker-compose up -d mysql

# 5. Run database migrations & seed initial data
npm run migrate
npm run seed

# 6. Start the development server
npm run dev
```

# 🌱 Environment Variables

Environment variables are used to configure the application without hardcoding values directly in the source code.  
Create a `.env` file in the project root directory to store these variables.

## ⚙️ Basic Configuration

```bash
# ------------------------------------------------------------------
# ENVIRONMENT VARIABLE
# ------------------------------------------------------------------
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# ------------------------------------------------------------------
# DATABASE CONFIGURATION
# These variables configure the database connection for Knex or your ORM.
# ------------------------------------------------------------------
DB_CLIENT=mysql2
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=marstech_hr

# ------------------------------------------------------------------
# AUTHENTICATION & SECURITY
# ------------------------------------------------------------------

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Cookie or session settings
SESSION_SECRET=your_session_secret
COOKIE_SECURE=false

```

---

## 🧩 Contributing

We welcome contributions!  
If you find a bug or want to propose an improvement, feel free to:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request 🚀

---
