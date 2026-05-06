# Installation & Setup Guide

Follow these steps to set up the **Smart Attendance System** locally.

## 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (Local instance)
- **Expo Go** app (on your mobile device for testing the student app)

---

## 2. Database Setup
1.  Open your MySQL terminal or a GUI like MySQL Workbench / phpMyAdmin.
2.  Create a new database named `sas_db`:
    ```sql
    CREATE DATABASE sas_db;
    ```
3.  Import the schema:
    - Execute the contents of [backend/schema.sql](backend/schema.sql) in your new database to create all tables and relationships.

---

## 3. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    - Open the `.env` file and update your MySQL credentials:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=your_mysql_password
    DB_NAME=sas_db
    JWT_SECRET=your_super_secret_jwt_key
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    *The API will run at `http://localhost:5000`.*

---

## 4. Web Dashboard Setup (Lecturer)
1.  Navigate to the `web` directory:
    ```bash
    cd web
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The dashboard will be available at `http://localhost:5173`.*

---

## 5. Mobile App Setup (Student)
1.  Navigate to the `mobile` directory:
    ```bash
    cd mobile
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure API URL**:
    - Open `src/api/axios.js`.
    - Change `BASE_URL` to match your computer's **Local IP Address** (e.g., `192.168.x.x:5000`).
4.  Start the Expo project:
    ```bash
    npx expo start
    ```
5.  **Run on Device**:
    - Scan the QR code in the terminal using the **Expo Go** app.

---

## 6. Usage Workflow
1.  **Lecturer**: Register on the Web Portal -> Create a Class -> Get the **Class Code**.
2.  **Student**: Register on the Mobile App -> Enter the **Class Code** to join.
3.  **Attendance**: Lecturer clicks "Launch QR Session" on Web -> Student scans the dynamic QR code via the Mobile App.
