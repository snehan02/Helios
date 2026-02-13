Here is the comprehensive **prd.txt** tailored to your specific backend and dashboard requirements.

---

# Project Helios - Product Requirements Document (PRD)

**Project Name:** Project Helios
**Version:** 2.1
**Scope:** Full-Stack Implementation (Admin & Client Dashboards)

## 1. Executive Summary

Project Helios is a high-end client portal designed to replace static checklists with a visual "proof of work" dashboard. The system allows Agency Admins to manage client projects via a color-coded calendar and modular information boxes, while Clients have a secure, view-only interface to track progress and access resources.

## 2. User Roles & Permissions

### 2.1 Agency Admin (Super User)

* **Access:** Read/Write (CRUD) on all modules.
* 
**Responsibilities:** Onboard new clients, configure branding, assign daily tasks, and manage the Information Grid data.



### 2.2 Client

* **Access:** Read-Only (Restricted).
* 
**Responsibilities:** View status calendar, check invoice status, and access resource links.


* 
**Constraint:** Strictly view-only; cannot modify data or statuses.



## 3. Backend Modules & Functional Requirements

### Module 1: Authentication & Security

* 
**Requirement:** Secure login system using Email and Password.


* **Admin Functionality:**
* `POST /api/login`: Authenticate admin credentials.
* `POST /api/invite`: Send login credentials/setup emails to new clients.


* **Client Functionality:**
* `POST /api/login`: Authenticate client credentials.
* 
**Data Isolation:** Middleware must ensure clients can strictly access only their own `client_id` data.





### Module 2: Client Management (Onboarding)

* 
**Requirement:** Admin must onboard clients with specific branding requirements.


* **Admin Functionality (Write):**
* **Create Client:** Input Client Name, Email, Industry.
* 
**Branding Configuration:** Upload **Logo** and set **Brand Colors** (Primary/Secondary hex codes) to customize the dashboard UI.




* **Backend Data Structure:**
* `Client` Table: `id`, `name`, `email`, `logo_url`, `brand_color_primary`, `brand_color_secondary`.



### Module 3: Status Calendar (Task Management)

* 
**Requirement:** Admin onboards tasks to specific clients on specific dates.


* **Admin Functionality (Write):**
* 
**Log Work:** Select Date + Client → Assign Status Color + Add Notes.
* **Add Multiple Notes:** A "plus" button to add multiple distinct notes for a single calendar entry. **Multi-status:** If multiple notes exist with different statuses, display colored dots for each status instead of a single block color.

* **Status Logic:**
* **Green:** Task Completed (or Note Status).
* **Yellow:** Blocked (Waiting on Client) (or Note Status).
* **Red:** Agency Delay/Failure (or Note Status).


* 
**Detail View:** Input specific task details (e.g., SEO stats, links) for the popup. Allows adding notes with specific status.




* **Client Functionality (Read):**
* 
**Fetch Calendar:** `GET /api/calendar?month=X` returns the visual grid of colored status blocks or dots.


* 
**View Detail:** Clicking a date triggers a popup with the notes/stats entered by the admin.





### Module 4: Information Grid (The 3 Default Boxes)

* **Requirement:** Admin has 3 default columns (Payment, Metric, Resource) with Read/Write access; Client has Read access.


* **Default Columns:**
1. 
**Payment Box:** Tracks invoices (e.g., "Invoice #101: Pending").


2. 
**Metric Box:** Custom key performance data (e.g., "Follower Count: 10k").


3. 
**Resource Box:** Links to assets (e.g., "Brand Kit Link", "Drive Folder").




* **Admin Functionality (Write):**
* 
**Edit Box Content:** Add/Edit/Delete rows within any of the 3 default boxes.


* 
**Visibility Control:** If a box is empty, the backend should flag it as hidden.




* **Client Functionality (Read):**
* `GET /api/dashboard-boxes`: specific data for the 3 columns.
* 
**Rendering:** Frontend renders the boxes in a grid layout below the calendar.





## 4. API Endpoints Summary

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | All | Email/Password login. |
| `POST` | `/admin/clients` | Admin | Create new client (w/ Logo & Colors). |
| `POST` | `/admin/calendar` | Admin | Add/Update daily task status (Green/Yellow/Red). |
| `GET` | `/client/calendar` | Client | Fetch monthly status view (Read Only). |
| `POST` | `/admin/boxes` | Admin | Update content for Payment, Metric, or Resource boxes. |
| `GET` | `/client/boxes` | Client | Fetch content for the 3 info grid boxes (Read Only). |

## 5. Non-Functional Requirements

* **Performance:** Dashboard load time under 2 seconds.
* 
**Responsiveness:** Calendar and Grid must be mobile-responsive for clients checking on phones.


* 
**Privacy:** Strict Row-Level Security (RLS) in the database to prevent cross-client data leakage.

## 6. UI/UX Enhancements

* **Dark Mode:** Implement a system-wide dark mode toggle.
    - Default to user preference or light mode.
    - Persist preference across sessions.
    - **Attributes:** Placed in the top Header bar (Admin & Client Dashboards).
    - Apply to all components (Dashboard, Calendar, Login).