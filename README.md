# Horizon Community

## Smart Society Management Platform

Horizon Community is a responsive society/community management application designed to connect residents, security personnel and administrators through a single digital platform.

The application focuses on simplifying everyday community operations such as visitor management, complaints, facility bookings, announcements, events, polls and emergency communication.

---

## Features

### Resident
- Personalized dashboard
- Community announcements
- Complaint registration and tracking
- Visitor registration
- Facility booking
- Community events
- Event registration
- Community polls
- Emergency contacts
- Maintenance payment interface
- Recent activity tracking
- Community health insights

### Security
- Visitor approval management
- Visitor check-in/check-out
- Pending visitor queue
- Security operations dashboard
- Emergency status
- Quick access to security tools

### Administrator
- Community control center
- Resident overview
- Complaint analytics
- Visitor analytics
- Facility usage analytics
- Latest request monitoring
- Community intelligence insights

---

## Technology Stack

- React
- TypeScript
- Vite
- CSS
- Zustand-ready architecture
- Recharts
- Lucide React
- LocalStorage
- Mock JSON data

---

## Architecture

The current prototype follows a layered architecture:

```text
                 ┌──────────────────────┐
                 │      User Interface  │
                 │ React Components     │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │       Pages          │
                 │ Dashboard / Modules  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Application Logic    │
                 │ State / Validation   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Data / Service Layer │
                 │ LocalStorage / Mock  │
                 └──────────────────────┘