import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Client from '../models/Client';

const router = express.Router();

// Login Route
router.post('/login', async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role === 'client' && !user.clientId) {
            // Edge case: Client user without linked Client profile
            console.warn(`User ${user.id} has role client but no clientId`);
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                clientId: user.clientId
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        // Fetch client details if user is a client
        let clientDetails = null;
        if (user.clientId) {
            clientDetails = await Client.findById(user.clientId);
        }

        // Return user info
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                clientId: user.clientId,
                client: clientDetails
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
