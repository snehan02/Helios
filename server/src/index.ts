
import express from 'express';
import connectDB from './config/db';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateEnv } from './utils/validateEnv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import clientRoutes from './routes/clientRoutes';
import calendarRoutes from './routes/calendar';
import dashboardRoutes from './routes/dashboard';

// ✅ Import already-wrapped handler
import { uploadThingRouter } from "./routes/uploadthing";

dotenv.config();

// Validate critical env vars before starting
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure DB is connected before handling any request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err: any) {
        console.error('Database connection error in middleware:', err);
        res.status(500).json({ message: 'Database connection failed' });
    }
});

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Debug logging
// Debug logging
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// ✅ Mount UploadThing handler directly
app.use("/api/uploadthing", uploadThingRouter);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling Middleware (Must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Only listen if running directly (not in Vercel/Lambda)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log("🚀 Server v1.1 - Busboy Active (No Multer)");
    });
}

export default app;
