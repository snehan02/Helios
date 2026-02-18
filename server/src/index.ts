import express from 'express';
import connectDB from './config/db';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import calendarRoutes from './routes/calendar';
import dashboardRoutes from './routes/dashboard';

// ✅ Import already-wrapped handler
import { uploadThingRouter } from "./routes/uploadthing";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Debug logging
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// ✅ Mount UploadThing handler directly
app.use("/api/uploadthing", uploadThingRouter);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
