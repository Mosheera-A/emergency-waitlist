# Hospital Triage Database Design

## Overview
This database supports a simple hospital triage system.  
It stores patients, their assigned priority level, and the room they are placed in.  
The design is optimized for use in the final interactive project (with APIs).

---

## Tables

### 1. `priority`
This table stores the triage categories used in the application.

It includes:
- an `id` (auto-increment primary key)
- a `description` field that can only be: *urgent*, *non-urgent*, or *critical*
- an optional `approxWaitTime` value that represents estimated wait time in minutes

---

### 2. `room`
This table represents the rooms available in the hospital.

It includes:
- an `id` (auto-increment primary key)
- a `status` field that can be: *available*, *occupied*, or *cleaning*

---

### 3. `patient`
This is the main table that stores each patient who enters triage.

It includes:
- an `id` (auto-increment primary key)
- the patient’s `name`  
- the `injury_type` selected in the UI  
- the `pain_level` (1–10)  
- an optional `date_of_birth`
- an optional `gender`
- the patient’s `card_nb` (hospital card number)
- the `arrival_time` timestamp
- a `priority_id` (linking the patient to a row in the **priority** table)
- a `room_id` (linking the patient to a row in the **room** table)

---

## Relationships

### Patient → Priority  
Each patient is assigned one priority level.  
A single priority level (e.g., *urgent*) can be connected to many patients.  
This is a **non-identifying** relationship.

### Patient → Room  
Each patient is placed in one room.  
A room can have many patients over time.  
This is also a **non-identifying** relationship.

---

## Notes
- `ENUM` is used for controlled fields such as injury type, priority description, and room status.
- The `patient` table acts as the central triage record and connects directly to both the `priority` and `room` tables.
- This structure is designed to cleanly support your upcoming API and UI implementation in the final project.
