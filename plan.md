# Smart Attendance System – Project Plan

## 1. Project Overview

The Smart Attendance System is a QR-code-based attendance tracking platform designed for academic institutions. It consists of:

* A **web application (React)** for lecturers to manage classes and generate QR codes.
* A **mobile application (Expo/React Native)** for students to join classes and scan QR codes to mark attendance.

The system ensures secure, fast, and real-time attendance recording.

---

## 2. Objectives

* Eliminate manual attendance processes
* Prevent proxy attendance (students marking for others)
* Provide real-time attendance tracking
* Maintain accurate and centralized attendance records

---

## 3. System Architecture

### 3.1 Components

* **Frontend (Web)**: React.js (Lecturer dashboard)
* **Frontend (Mobile)**: Expo (React Native)
* **Backend**: Node.js (Express) or Firebase
* **Database**: MongoDB / Firestore
* **Authentication**: JWT / Firebase Auth

---

## 4. User Roles

### 4.1 Lecturer

* Register/Login
* Create class
* Generate QR code for attendance
* View attendance records

### 4.2 Student

* Register/Login
* Join class using class code
* Scan QR code
* View attendance history

---

## 5. Core Features

### 5.1 Authentication

* Secure login/signup for both users
* Role-based access (Lecturer / Student)

### 5.2 Class Management

* Lecturer creates class
* Unique **class code** generated
* Students join via class code

### 5.3 QR Code Attendance

* Lecturer generates QR code per session
* QR code contains:

  * Class ID
  * Session ID
  * Timestamp (important for expiry)

⚠️ Important:
QR codes must **expire (e.g., after 30–60 seconds)** to prevent sharing.

### 5.4 QR Code Scanning (Mobile)

* Student selects class
* Camera opens automatically
* QR code scanned
* Attendance marked via API call

### 5.5 Attendance Records

* Stored per:

  * Student
  * Class
  * Date
* Lecturer can view/export records

---

## 6. Database Design (Simplified)

### Users

```
id
name
email
password
role (lecturer/student)
```

### Classes

```
id
name
lecturerId
classCode
```

### Enrollments

```
id
studentId
classId
```

### Attendance Sessions

```
id
classId
createdAt
expiresAt
qrToken
```

### Attendance Records

```
id
studentId
sessionId
timestamp
```

---

## 7. API Design (Sample)

### Auth

* POST /register
* POST /login

### Classes

* POST /classes
* GET /classes
* POST /classes/join

### Attendance

* POST /attendance/generate
* POST /attendance/mark
* GET /attendance/:classId

---

## 8. Workflow

### Lecturer Flow

1. Login
2. Create class
3. Share class code
4. Start session → Generate QR code
5. Display QR code to students

### Student Flow

1. Login
2. Join class using class code
3. Select class
4. Scan QR code
5. Attendance recorded

---

## 9. Security Considerations

* QR codes must be **time-limited**
* Prevent duplicate attendance submissions
* Validate:

  * Student belongs to class
  * Session is active
* Optional improvements:

  * GPS validation (same location as lecturer)
  * Device ID tracking

---

## 10. Tech Stack

### Web

* React.js
* Axios
* TailwindCSS (optional)

### Mobile

* Expo (React Native)
* Expo Camera / Barcode Scanner

### Backend

* Node.js + Express OR Firebase

### Database

* MongoDB OR Firestore

---

## 11. Challenges & Considerations

* Preventing QR code sharing
* Network reliability during scanning
* Handling large classes
* Camera performance on low-end devices

---

## 12. Future Enhancements

* Facial recognition attendance
* Offline attendance sync
* Push notifications
* Analytics dashboard
* Integration with school systems

---

## 13. Timeline (Suggested)

### Week 1–2

* Requirements & UI design

### Week 3–4

* Backend + Authentication

### Week 5–6

* Web dashboard (lecturer)

### Week 7–8

* Mobile app (student)

### Week 9

* QR system integration

### Week 10

* Testing & debugging

---

## 14. Success Criteria

* Students can successfully scan QR codes
* Attendance recorded accurately
* System prevents invalid attendance
* Lecturer can view all records easily

---
