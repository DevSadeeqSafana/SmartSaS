# Smart Attendance System - Project Explanation

This document provides a technical overview of the **Smart Attendance System**, detailng its architecture, security mechanisms, and core functionalities for academic/supervisor evaluation.

## 1. Project Overview
The Smart Attendance System is a full-stack solution designed to automate traditional attendance tracking using dynamic QR codes. It addresses common classroom issues such as manual errors, slow processing, and proxy attendance (students marking for others).

## 2. System Architecture
The system follows a modern **3-Tier Architecture**:

### 2.1 Backend (Service Layer)
- **Technology**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **Role**: Handles business logic, authentication, dynamic token generation, and secure data storage.
- **Key Feature**: Implements a TTL (Time-To-Live) index on QR sessions to ensure they expire automatically after 60 seconds.

### 2.2 Web Dashboard (Lecturer Portal)
- **Technology**: React.js & Vite
- **Styling**: Tailwind CSS
- **Role**: Allows lecturers to manage classes, visualize real-time attendance, and launch QR sessions.
- **Key Feature**: Generates an SVG-based dynamic QR code that refreshes every minute to keep the session secure.

### 2.3 Mobile App (Student Client)
- **Technology**: Expo (React Native)
- **Role**: Provides students with a secure interface to join classes and scan QR codes using the device's native camera.
- **Key Feature**: Captures Device ID and GPS location during scans to provide multi-layered security.

## 3. Security Mechanism (Anti-Fraud System)
The system's most significant technical contribution is its multi-layered anti-proxy mechanism:

1.  **Dynamic QR Expiration**: Unlike static QR codes, our system generates tokens that expire every **60 seconds**. This prevents students from taking a photo of the code and sending it to absent friends.
2.  **Device-Level Locking**: The system captures the unique **Device ID** during every scan. If a student tries to log into another's account on the same phone to mark double attendance, the backend rejects the second attempt for that session.
3.  **Geo-Tagging**: Every attendance record includes the student's **GPS coordinates**. This allows lecturers to verify if a student was actually within the classroom range during the session.
4.  **Enrollment Validation**: Only students officially enrolled in a course can generate a record for that specific session.

## 4. Database Design
The system utilizes five interconnected collections:
- **Users**: Identity management (Roles: Lecturer/Student).
- **Classes**: Course details and unique persistent join codes.
- **Enrollments**: Links students to their respective courses.
- **AttendanceSessions**: Stores temporary active QR tokens with expiration timestamps.
- **AttendanceRecords**: The final ledger of successful, secure check-ins.

## 5. Technical Challenges Solved
- **Real-time Sync**: Coordinating the lecturer dashboard refresh with student scans.
- **Secure Tokenization**: Using cryptographic random bytes for QR data rather than predictable IDs.
- **Cross-Platform Mobile**: Ensuring camera performance and location services work consistently on both iOS and Android.

## 6. Conclusion
The Smart Attendance System demonstrates how dynamic cryptographic tokens and native mobile sensors (GPS, Camera, Device ID) can be integrated into a cohesive web/mobile ecosystem to solve real-world administrative challenges in education.
