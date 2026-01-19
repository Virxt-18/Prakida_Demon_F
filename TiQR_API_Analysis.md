# TiQR API Integration Analysis

## Overview
The document **"TiQR API Integration (1).pdf"** outlines the API specifications for the **TiQR Events** platform. It provides RESTful endpoints for:
- **Authentication**: Usage of Bearer tokens.
- **Booking**: Creating individual and bulk bookings for events.
- **Webhooks**: Receiving booking confirmations.
- **Event Management**: Creating and managing events, uploading assets (posters, covers), and managing tickets.
- **Complimentary Booking**: onboarding guests or delegates.

## API Summary

### Base URL
`https://api.tiqr.events`

### 1. Authentication
- **Generate Token**: `POST /participant/booking/custom-token/`
  - Body: `{"session_id": "..."}`
  - Returns: `access_token` (valid 30 days).

### 2. Booking
- **Create Booking**: `POST /participant/booking/`
  - Fields: Name, Phone, Email, Ticket ID, Quantity, Meta Data.
- **Bulk Booking**: `POST /participant/booking/bulk/`
- **Get Booking**: `GET /participant/booking/:uid/`

### 3. Webhooks
- **Callback**: TiQR sends a POST request to the provided `callback_url` with booking details upon confirmation.

### 4. Event Management
- **Create Event**: `POST /planner/events/`
  - Fields: Name, Dates, Description, Address, etc.
- **Upload Assets**: `POST` endpoints for Cover and Poster images.
- **Create Ticket**: `POST /organiser/event/{{eventId}}/ticket/`
  - Fields: Price, Type, Bulk capability, etc.

### 5. Complimentary/Guest Onboarding
- **Endpoint**: `POST /participant/guest_onboarding/`

## Relevance to Current Project (Prakida_Demon / demon-slayer)

### Current Project Context
The **Prakida_Demon** project (package name `demon-slayer`) is a React-based application using Supabase, Framer Motion, and Lenis. It functions as an **Edge-Cloud Predictive Maintenance System** for the automotive domain (based on file names like `EdgeMonitor.jsx`, `Logistics.jsx`).

### Assessment
**The TiQR API (Event Management & Ticketing) is NOT relevant to the core functionality of this project.**

- **Domain Mismatch**: TiQR is for organizing events, selling tickets, and managing attendance. This project is for monitoring vehicle telemetry and sensor data.
- **Potential Use Cases (Only if scope changes)**:
  - Managing registrations for a product launch event *separate* from the main app logic.
  - If the project pivots to be a ticketing platform (unlikely).

### Conclusion
**This document cannot be used in this project** under its current scope as a Predictive Maintenance System. The API is for a completely different purpose.
