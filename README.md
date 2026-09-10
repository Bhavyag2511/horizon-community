## Architecture

Horizon Community follows a layered frontend architecture that separates presentation, application logic and data persistence.

```text
                    HORIZON COMMUNITY
              Smart Society Management
                         │
                         ▼
              ┌─────────────────────┐
              │ React + TypeScript  │
              │   Presentation UI   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Role-Based Pages  │
              │                     │
              │ Resident            │
              │ Security            │
              │ Admin               │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Application Logic   │
              │                     │
              │ Validation          │
              │ State Updates       │
              │ Business Rules      │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Data / Persistence  │
              │                     │
              │ LocalStorage        │
              │ Mock Data           │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │      Modules        │
              │                     │
              │ Complaints          │
              │ Visitors            │
              │ Facilities          │
              │ Events              │
              │ Polls               │
              │ Announcements       │
              │ Emergency           │
              └─────────────────────┘