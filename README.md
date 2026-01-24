# Prakida Demon - College Program Management System

## Overview
**Prakida Demon** is a comprehensive web application designed to manage college events, ticket sales, and team registrations. Built with modern web technologies, it provides a seamless experience for students to register for events ("Battles"), purchase tickets ("Passes"), and for administrators to oversee the entire process.

The project features a high-performance, visually striking interface with a focus on dark-mode aesthetics ("Demon" theme).

## Features

### 🛡️ For Students (Slayers)
-   **Authentication**: Secure Sign-Up and Login using Email/Password or **Google Sign-In**.
-   **Dashboard**: A personalized command center to view purchased tickets and registered events.
-   **Event Registration**: Easy registration for solo and team-based sports/events.
-   **Ticketing**: Digital ticket generation with QR code integration (TiQR).
-   **Contact Us**: "Send a Crow" messaging system to contact the council directly.

### ⚔️ For Administrators (Hashiras)
-   **Admin Dashboard**: comprehensive overview of total sales, revenue, and registration stats.
-   **Management**: Tools to view detailed lists of teams and ticket holders, and manually verify payments.

## Tech Stack

-   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (Animations)
-   **Backend / Database**: [Firebase](https://firebase.google.com/)
    -   **Authentication**: Email/Password & Google Auth.
    -   **Firestore**: NoSQL database for users, tickets, registrations, and contact messages.
-   **Icons**: [Lucide React](https://lucide.dev/)

## Setup Instructions

### Prerequisites
-   Node.js (v18 or higher)
-   npm (v9 or higher)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ShiftainAhmad/Prakida_Demon.git
    cd Prakida_Demon
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory. You can use `.env.example` as a reference. Add your Firebase and other API keys:

    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

    # EmailJS (Optional)
    VITE_EMAILJS_SERVICE_ID=your_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_public_key

    # TiQR Configuration (Optional/Mock)
    VITE_TIQR_MOCK_MODE=true
    ```

4.  **Run the application**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Database Rules (Firestore)

Ensure your Firestore Security Rules allow the application to function:

```groovy
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Contact_us/{document=**} { allow read, write: if true; }
    match /users/{userId} { allow read, write: if request.auth != null && request.auth.uid == userId; }
    match /{document=**} { allow read, write: if request.auth != null; }
  }
}
```

## License
Private Project - BIT Mesra
