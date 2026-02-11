import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Client from '../models/Client';
import connectDB from '../config/db';

dotenv.config();

const seed = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Client.deleteMany({});
        // Use dynamic imports for models that might be circular or just to be safe in script
        const { default: WorkLog } = await import('../models/WorkLog');
        const { default: DashboardBox } = await import('../models/DashboardBox');
        const { default: BlockingNotification } = await import('../models/BlockingNotification');

        await WorkLog.deleteMany({});
        await DashboardBox.deleteMany({});
        await BlockingNotification.deleteMany({});

        console.log('Data cleared');

        const passwordHash = await bcrypt.hash('Admin123!', 12);

        // Create Super Admin
        const admin = await User.create({
            email: 'admin@helios.com',
            passwordHash,
            role: 'admin',
        });

        console.log('Seed: Super Admin created', admin.email);

        // Create a sample client
        const client = await Client.create({
            name: 'Acme Corp',
            industry: 'Technology',
            brandColors: {
                primary: '#0066FF',
                secondary: '#ffffff'
            }
        });

        console.log('Seed: Sample Client created', client.name);

        // Create a client user
        const clientUser = await User.create({
            email: 'client@acme.com',
            passwordHash,
            role: 'client',
            clientId: client._id,
        });

        // Link user to client
        client.userId = clientUser._id as any;
        await client.save();

        console.log('Seed: Client User created', clientUser.email);

        // Create some WorkLogs
        // Use dynamic imports for models that might be circular or just to be safe in script
        // const { default: WorkLog } = await import('../models/WorkLog'); // Already imported
        await WorkLog.create([
            {
                clientId: client._id,
                date: new Date(),
                status: 'GREEN',
                description: 'Routine maintenance check completed.',
                createdByUserId: clientUser._id,
            },
            {
                clientId: client._id,
                date: new Date(Date.now() - 86400000), // Yesterday
                status: 'YELLOW',
                description: 'Minor issues found in payment gateway integration.',
                createdByUserId: clientUser._id,
            }
        ]);
        console.log('Seed: WorkLogs created');

        // Create Dashboard Boxes
        // const { default: DashboardBox } = await import('../models/DashboardBox'); // Already imported
        await DashboardBox.create([
            {
                clientId: client._id,
                type: 'METRIC',
                title: 'System Uptime',
                data: { value: '99.9%', trend: 'up' },
                displayOrder: 1,
            },
            {
                clientId: client._id,
                type: 'PAYMENT',
                title: 'Next Invoice',
                data: { amount: 500, dueDate: '2024-12-01' },
                displayOrder: 2,
            }
        ]);
        console.log('Seed: DashboardBoxes created');

        // Create Blocking Notification
        // const { default: BlockingNotification } = await import('../models/BlockingNotification'); // Already imported
        await BlockingNotification.create({
            clientId: client._id,
            message: 'Please update your billing information.',
            blockingDate: new Date(),
            isResolved: false
        });
        console.log('Seed: BlockingNotification created');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
