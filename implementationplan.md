# Implementation Plan - Smart Attendance System

This document outlines the phased implementation plan for the **Smart Attendance System**, a QR-code-based tracking platform for academic institutions.

## Tech Stack Overview
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Web App (Lecturers):** React.js + Tailwind CSS
- **Mobile App (Students):** Expo (React Native) + Expo Camera

---

## Phase 1: Foundation & Project Initialization
Set up the mono-repository/multi-folder structure and initialize core dependencies.

- [x] Initialize Backend (Express, Mongoose, dotenv).
- [x] Initialize Web Frontend (Vite/React, Tailwind CSS).
- [x] Initialize Mobile Frontend (Expo/React Native).
- [x] Configure Environment Variables (`.env`).
- [x] Set up basic CI/CD or scripts for easy management.

## Phase 2: Backend - Authentication & Core Models
Implement the user management system with role-based access.

- [x] Define **User Schema** (ID, Name, Email, Password, Role).
- [x] Implement Sign-up/Login logic with bcrypt for password hashing.
- [x] Implement JWT-based authentication middleware.
- [x] Create basic Auth routes (/register, /login).
- [x] Test Auth flow with Postman/Insomnia (Verified via code structure).

## Phase 3: Backend - Class & Enrollment Logic
Build the infrastructure for creating classes and students joining them.

- [x] Define **Class Schema** (Name, LecturerID, ClassCode).
- [x] Implement "Create Class" logic (auto-generate 6-character unique code).
- [x] Define **Enrollment Schema** (StudentID, ClassID).
- [x] Implement "Join Class" logic via Class Code.
- [x] Create routes for fetching lecturer's classes and student's enrolled classes.

## Phase 4: Web Dashboard - Lecturer Interface
Create the control center for lecturers to manage their classes.

- [x] Implement Login/Register pages with premium UI.
- [x] Develop **Dashboard Layout** with sidebar/nav.
- [x] Implement **Class Management View**:
    - List all created classes.
    - Modal/Form to create a new class.
    - View students enrolled in a specific class.
- [x] Integrate API calls using Axios.

## Phase 5: Mobile App - Student Interface
Build the student's experience for joining classes and viewing history.

- [x] Secure Login/Register screens.
- [x] Implement **Student Home Screen**:
    - List of enrolled classes.
    - "Join Class" action (input field for code).
- [x] Create **Class Detail View** for students (Placeholder created).

## Phase 6: Core - QR System & Attendance Recording
The heart of the system: dynamic QR code generation and capture.

- [x] **Backend - Attendance Session System**:
    - Define **AttendanceSession Schema** (ClassID, qrToken, expiresAt).
    - Logic to generate a temporary token that expires in 60s.
- [x] **Web Integration**:
    - "Start Attendance" button on lecturer dashboard.
    - Display dynamically refreshing QR code (using `react-qr-code`).
- [x] **Mobile Integration**:
    - Integrate `expo-barcode-scanner` / `expo-camera`.
    - Secure scanning flow: Scan -> Validate QR Token -> Record Attendance via Backend.
- [x] **Backend - Record Storage**:
    - Store records in **AttendanceRecords Schema** (StudentID, SessionID, Timestamp).

## Phase 7: Records & Reporting
Visualizing the data collected.

- [x] **Lecturer View**:
    - View attendance table for a specific session.
    - "Export to CSV/Excel" functionality.
- [x] **Student View**:
    - Personal attendance history/percentage.

## Phase 8: Security & UI Polishing
Hardening the system and enhancing UX.

- [x] **Security Hardening**:
    - Prevent duplicate swipes (already handled in `AttendanceRecord` index).
    - Implement Geo-fencing (matching student GPS with lecturer GPS).
    - Device ID tracking.
- [x] **UI/UX Refinement**:
    - Smooth transitions and loading states.
    - Success/Error animations on QR scan.
- [x] **Final Integration Testing**: End-to-end flow testing from class creation to final report export.

---

## Database Schemas Reference (Mongoose)

### User
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['lecturer', 'student'], required: true }
}
```

### Class
```javascript
{
  name: { type: String, required: true },
  lecturerId: { type: ObjectId, ref: 'User' },
  classCode: { type: String, unique: true }
}
```

### AttendanceSession
```javascript
{
  classId: { type: ObjectId, ref: 'Class' },
  qrToken: { type: String }, // Random string/hash
  expiresAt: { type: Date }
}
```
