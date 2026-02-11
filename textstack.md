Based on the PRD and your request for a **MERN stack** implementation, here is the complete technical breakdown.

### 1. Recommended Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS (Styling), Framer Motion (Animations), Lucide React (Icons), Axios (API calls).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB.
* **ORM:** Mongoose.
* **Authentication:** JSON Web Tokens (JWT) + bcryptjs.
* **Validation:** Zod (for validating request bodies).

---

### 2. Mongoose Models & Schemas

You need three primary schemas to handle Authentication, Client Branding, Calendar Data, and the Dashboard Boxes.

#### A. User & Client Schema (`models/User.js` & `models/Client.js`)

We separate the **User** (login credentials) from the **Client Profile** (branding/visuals).

```javascript
// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: { 
    type: String, 
    enum: ['admin', 'client'], 
    default: 'client' 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: function() { return this.role === 'client'; } // Only clients need this link
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

```

```javascript
// models/Client.js
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  [cite_start]// Branding Requirements [cite: 29, 45]
  logoUrl: { type: String, default: '' }, 
  brandColors: {
    primary: { type: String, default: '#000000' }, // Hex Code
    secondary: { type: String, default: '#ffffff' }
  },
  // Link back to the user login
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);

```

#### B. Calendar Task Schema (`models/CalendarEntry.js`)

This handles the "Status Calendar" requirement.

```javascript
const mongoose = require('mongoose');

const CalendarEntrySchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  date: { type: Date, required: true }, // The specific date of the task
  status: { 
    type: String, 
    [cite_start]enum: ['green', 'yellow', 'red'], // [cite: 7, 8, 9]
    required: true 
  },
  [cite_start]details: { type: String }, // The popup content (SEO stats, links, etc.) [cite: 12]
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Admin who created it
}, { timestamps: true });

// Compound index to ensure one entry per client per day
CalendarEntrySchema.index({ client: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('CalendarEntry', CalendarEntrySchema);

```

#### C. Dashboard Boxes Schema (`models/DashboardData.js`)

This handles the 3 specific columns: Payment, Metric, and Resource.

```javascript
const mongoose = require('mongoose');

const DashboardDataSchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true, 
    unique: true 
  },
  // Box 1: Payments
  payments: [{
    invoiceName: String,
    status: { type: String, enum: ['Pending', 'Completed', 'Overdue'] },
    amount: String,
    date: Date
  }],
  // Box 2: Metrics
  metrics: [{
    label: String, // e.g., "Follower Count"
    value: String, // e.g., "10.5k"
    trend: String  // e.g., "+5%" (Optional)
  }],
  // Box 3: Resources
  resources: [{
    label: String, // e.g., "Brand Kit"
    link: String,  // URL to Drive/Figma
    type: { type: String, default: 'link' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('DashboardData', DashboardDataSchema);

```

---

### 3. API Endpoints (Routes)

These endpoints cover the requirement for Admin (Read/Write) and Client (Read Only).

#### A. Authentication

* `POST /api/auth/login`
* **Body:** `{ email, password }`
* **Response:** `{ token, user: { role, clientId, name } }`
* **Note:** If the user is a client, return their `clientId` immediately so the frontend knows whose data to fetch.



#### B. Client Management (Admin Only)

* `POST /api/admin/clients`
* 
**Purpose:** Onboard new client with branding.


* **Body:** `{ name, email, password, logoUrl, primaryColor, secondaryColor }`
* **Logic:** Creates a `User` doc (hashes password) AND a `Client` doc. Returns success.


* `GET /api/admin/clients`
* **Purpose:** List all clients for the Admin sidebar.



#### C. Calendar Management

* `POST /api/calendar` **(Admin Only)**
* 
**Purpose:** Onboard task to specific client on specific date.


* **Body:** `{ clientId, date, status, details }`
* **Logic:** Uses `findOneAndUpdate` with `upsert: true`. If an entry exists for that date, update it; otherwise, create new.


* `GET /api/calendar/:clientId` **(Read Access: Admin & Client)**
* **Query Params:** `?month=2026-02` (Optional, for performance).
* **Purpose:** Fetches the color-coded grid.
* **Logic:** Returns array of objects: `[{ date: '2026-02-01', status: 'green', details: '...' }]`.



#### D. Information Grid (The 3 Boxes)

* `GET /api/dashboard/:clientId` **(Read Access: Admin & Client)**
* 
**Purpose:** Populates the Payment, Metric, and Resource boxes.




* `PUT /api/dashboard/:clientId/payments` **(Admin Only)**
* **Body:** `{ payments: [ { invoiceName, status, ... } ] }`
* **Purpose:** Full replace or push updates to the payment list.


* `PUT /api/dashboard/:clientId/metrics` **(Admin Only)**
* **Body:** `{ metrics: [ { label, value } ] }`


* `PUT /api/dashboard/:clientId/resources` **(Admin Only)**
* **Body:** `{ resources: [ { label, link } ] }`



---

### 4. Middleware Strategy (Security)

To ensure strict "Read Only" access for clients and "Write" for admins, use two middleware functions:

1. `verifyToken`: Decodes the JWT.
2. `requireAdmin`: Checks if `req.user.role === 'admin'`.

**Example Route Protection:**

```javascript
// routes/calendar.js

// Admin can WRITE (Create/Update tasks)
router.post('/', verifyToken, requireAdmin, createCalendarEntry);

// Clients (and Admins) can READ
router.get('/:clientId', verifyToken, (req, res, next) => {
    // Security Check: If role is client, ensure they are requesting THEIR OWN id
    if (req.user.role === 'client' && req.user.clientId !== req.params.clientId) {
        return res.status(403).json({ msg: "Access denied" });
    }
    next();
}, getCalendarEntries);

```

### 5. Summary of Workflow

1. **Admin** logs in.
2. **Admin** goes to `/clients` -> clicks "Add Client". Uploads logo, sets Hex colors (e.g., #FF5733), creates credentials.
3. **Admin** clicks "Calendar" for that client -> clicks Feb 14th -> Selects "Green" -> Types "SEO Report Done".
4. **Admin** clicks "Dashboard" -> Edits the "Metric Box" to say "Followers: 500".
5. **Client** logs in.
6. **Client** sees the Calendar (with Feb 14th Green) and the Metric Box (500 Followers). They cannot edit anything. 