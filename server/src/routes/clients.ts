import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Client from '../models/Client';
import { authenticate, authorize } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename: client-name-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    }
});

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
        console.log("Received body:", req.body);

        const { name, email, password, industry, primaryColor, secondaryColor, status, logoUrl } = req.body;

        // Basic Validation
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 1. Create Client Profile first
        const newClient = new Client({
            name,
            industry,
            logoUrl: logoUrl || '',
            status: status || 'Onboarding',
            brandColors: {
                primary: primaryColor || '#000000',
                secondary: secondaryColor || '#ffffff'
            }
        });
        await newClient.save();

        // 2. Create User linked to the Client
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            passwordHash,
            role: 'client',
            clientId: newClient._id
        });
        await newUser.save();

        // 3. Link User back to Client
        newClient.userId = newUser._id as any;
        await newClient.save();

        res.status(201).json({
            message: 'Client created successfully',
            client: newClient,
            user: {
                id: newUser._id,
                email: newUser.email
            }
        });
    } catch (error: any) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// Get single client details
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

// Update client details
router.put('/:id', authenticate, authorize(['admin']), upload.single('logo'), async (req: any, res: any) => {
    try {
        const { name, industry, primaryColor, secondaryColor, status } = req.body;
        const clientId = req.params.id;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        client.name = name || client.name;
        client.industry = industry || client.industry;
        client.status = status || client.status;
        client.brandColors = {
            primary: primaryColor || client.brandColors.primary,
            secondary: secondaryColor || client.brandColors.secondary
        };

        if (req.file) {
            // Optional: delete old logo file if it exists
            client.logoUrl = `/uploads/${req.file.filename}`;
        }

        await client.save();
        res.json({ message: 'Client updated successfully', client });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete client
router.delete('/:id', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const clientId = req.params.id;
        const client = await Client.findById(clientId);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Delete associated user
        if (client.userId) {
            await User.findByIdAndDelete(client.userId);
        }

        // Delete client profile
        await Client.findByIdAndDelete(clientId);

        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
