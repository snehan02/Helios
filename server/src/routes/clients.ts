import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const clientSchema = z.object({
    companyName: z.string().min(2),
    primaryContactName: z.string().min(2),
    logoUrl: z.string().url().optional().nullable(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
});

// Get all clients (Admin only)
router.get('/', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            include: {
                _count: {
                    select: { users: true, workLogs: true }
                }
            }
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients' });
    }
});

// Create client (Super Admin only)
router.post('/', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
    try {
        const data = clientSchema.parse(req.body);
        const client = await prisma.client.create({ data });
        res.status(201).json(client);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid data', errors: error.issues });
        }
        res.status(500).json({ message: 'Error creating client' });
    }
});

// Get single client (Admin or assigned Client)
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
    const { id } = req.params;

    // Authorization check
    if (req.user?.role === 'CLIENT' && req.user.clientId !== id) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                dashboardBoxes: {
                    where: { isVisible: true },
                    orderBy: { displayOrder: 'asc' }
                }
            }
        });

        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client' });
    }
});

export default router;
