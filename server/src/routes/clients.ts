import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Client from '../models/Client';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get all clients (Admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new client (Admin only)
router.post('/', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const { name, email, password, industry, logoUrl, brandColors } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 1. Create User
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            passwordHash,
            role: 'client'
        });
        await newUser.save();

        // 2. Create Client Profile
        const newClient = new Client({
            name,
            industry,
            logoUrl,
            brandColors: {
                primary: brandColors?.primary || '#000000',
                secondary: brandColors?.secondary || '#ffffff'
            },
            userId: newUser._id
        });
        await newClient.save();

        // 3. Link Client to User
        newUser.clientId = newClient._id as any;
        await newUser.save();

        res.status(201).json({
            message: 'Client created successfully',
            client: newClient,
            user: {
                id: newUser._id,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single client details
router.get('/:id', authenticate, async (req: any, res: any) => {
    try {
        const clientId = req.params.id;

        // Security check: Clients can only view their own profile
        if (req.user.role === 'client' && req.user.clientId !== clientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
