# Helios Client Portal - Feature Testing Guide

This guide provides step-by-step instructions to test each core feature of the Helios Client Portal, ensuring alignment with the project blueprint.

## prerequisites
- Ensure the backend server is running (`npm start` in `server/`).
- Ensure the frontend is running (`npm run dev` in `frontend/`).
- Have MongoDB running.

---

## 1. Admin: Client Management & Branding

**Goal**: Verify you can create a client with custom branding and see it reflected.

1.  **Log in as Admin**:
    *   Navigate to `/login`.
    *   Credentials: Use your admin account (e.g., `admin@helios.com`).
2.  **Create a Client**:
    *   On the **Dashboard**, click the **"+ Add Client"** button.
    *   **Name**: Enter "Acme Corp".
    *   **Industry**: Enter "Tech".
    *   **Colors**: Pick a distinct **Primary Color** (e.g., `#FF5733` - Orange) to test theming.
    *   **Logo**: Upload a sample image file (PNG/JPG).
    *   Click **"Create Client"**.
3.  **Verify**:
    *   Does "Acme Corp" appear in the Client List?
    *   Does it show the correct Logo?
    *   Does the "Global Status Overview" at the top update (Active Clients count increases)?

---

## 2. Admin: The "Work Log" (Status Calendar)

**Goal**: Verify you can log daily work status and see it on the calendar.

1.  **Enter Client View**:
    *   Click on the "Acme Corp" card from the Dashboard.
2.  **Log a Status**:
    *   Click heavily on **Today's Date** in the calendar.
    *   **Status**: Select **"Green" (Completed)**.
    *   **Notes**: Type "Initial Setup Complete."
    *   Click **"Save Log"**.
3.  **Verify**:
    *   Does the date square turn **Green**?
    *   Does it glow/animate?
    *   Refresh the page. Does the Green status persist?

---

## 3. Admin: Dynamic Dashboard Builder (The "No Code" Feature)

**Goal**: Verify you can add, edit, and remove widgets without code.

1.  **Enable Edit Mode**:
    *   In the Client View (Acme Corp), click the **"Edit Layout"** button (top right).
2.  **Add a Widget**:
    *   Scroll down and click the big **"+ Add Widget"** button.
    *   **Title**: "Weekly Reports".
    *   **Type**: Select **"Links / Resources"**.
    *   Click **"Add Widget"**.
3.  **Populate Widget**:
    *   In the new "Weekly Reports" box, click the **Edit (Pencil Icon)**.
    *   Click **"+ Add Item"**.
    *   **Label**: "Week 1 Report".
    *   **Value/Link**: `https://google.com`.
    *   Click **Save (Check Icon)**.
4.  **Reorder**:
    *   Use the **Up/Down Arrows** to move "Weekly Reports" above "Payments".
5.  **Verify**:
    *   Refresh the page. Is "Weekly Reports" still there and in the correct order?

---

## 4. Client: The "Client Portal" Experience

**Goal**: Verify the client sees *only* their data and the branding works.

1.  **Log in as Client**:
    *   Open a **New Incognito Window** (to simulate a separate user).
    *   Log in with the Client credentials created for "Acme Corp" (you might need to check the database or simplified flow if you didn't set a password manually; typically `acme@helios.com` / `password`).
2.  **Verify Branding**:
    *   Is the **Sidebar Logo** the one you uploaded for Acme Corp?
    *   Is the **Active Link Color** the Orange (`#FF5733`) you selected?
3.  **Verify Calendar**:
    *   Do you see the **Green square** on Today's date?
    *   Click it. Does the popup show "Initial Setup Complete"?
4.  **Verify Dashboard**:
    *   Do you see the **"Weekly Reports"** box you created?
    *   Is the "Payments" box visible?
    *   (Critical): If you left "Metrics" empty in Admin view, is it **hidden** here? (It should be).

---

## 5. Client: The "I'm Blocked" Feature

**Goal**: Verify the client can signal a blocker and it updates the system.

1.  **Trigger Blocker**:
    *   In the Client Portal, look for the big Red **"I'm Blocked ✋"** button.
    *   Click it.
    *   Accept the confirmation alert.
2.  **Verify Client View**:
    *   Does Today's date on the calendar turn **Yellow** immediately?
3.  **Verify Admin View**:
    *   Switch back to your **Admin Window**.
    *   Refresh the "Acme Corp" Client View.
    *   Is Today's date now **Yellow**?
    *   Click it. Does the note say "Client reported a blocker..."?
    *   Check the **Notifications** bell icon in the top header. Is there a new alert?

---

## 6. Security & Data Isolation

**Goal**: Ensure Client A cannot see Client B's data.

1.  **Create Client B**:
    *   As Admin, create "Globex Inc".
2.  **Log in as Client A (Acme)**:
    *   Try to manually change the URL browser address to Globex's ID (e.g., `/client/dashboard/globex-id`).
    *   **Verify**: You should receive an **"Access Denied"** or redirect error.
    *   Ensure the "Weekly Reports" for Acme do **not** show up for Globex.

---

### Troubleshooting
- **Images not loading?**: Ensure `server/uploads` folder exists and `express.static` is serving it correctly.
- **"Save Failed"?**: Check the browser console (F12) for Network errors. Ensure the backend is running.
- **Login fails?**: Check MongoDB `users` collection to confirm email/password match.
