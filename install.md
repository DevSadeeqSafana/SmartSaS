# Installation & Setup Guide

Follow these steps to set up the **Smart Attendance System** locally.

## 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance or Atlas URI)
- **Expo Go** app (on your mobile device for testing the student app)

---

## 2. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    - Open the `.env` file.
    - Ensure `MONGODB_URI` points to your MongoDB instance.
    - Set a secure `JWT_SECRET`.
4.  Start the server:
    ```bash
    npm run dev
    ```
    *The API will run at `http://localhost:5000`.*

---

## 3. Web Dashboard Setup (Lecturer)
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

## 4. Mobile App Setup (Student)
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
    - If testing on a **physical device**, change `localhost` to your computer's **Local IP Address** (e.g., `192.168.x.x`).
4.  Start the Expo project:
    ```bash
    npx expo start
    ```
5.  **Run on Device**:
    - Scan the QR code in the terminal using the **Expo Go** app.

---

## 5. Usage Workflow
1.  **Lecturer**: Register on the Web Portal -> Create a Class -> Get the **Class Code**.
2.  **Student**: Register on the Mobile App -> Enter the **Class Code** to join.
3.  **Attendance**: Lecturer clicks "Start Attendance" on Web -> Student selects the class on Mobile and scans the refreshed QR code.
