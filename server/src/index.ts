import express from 'express';
import connectDB from './config/db';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import { test } from './routes/test';
import calendarRoutes from './routes/calendar';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
