import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const boxSchema = z.object({
    clientId: z.string().uuid(),
    type: z.enum(['PAYMENT', 'RESOURCE', 'METRIC', 'CUSTOM']),
    title: z.string().min(1),
    data: z.any(),
    displayOrder: z.number().optional(),
    isVisible: z.boolean().optional(),
});

// Get boxes for a client
router.get('/:clientId', authenticate, async (req: AuthRequest, res) => {
    const { clientId } = req.params;

    if (req.user?.role === 'CLIENT' && req.user.clientId !== clientId) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const boxes = await prisma.dashboardBox.findMany({
            where: { clientId, isVisible: true },
            orderBy: { displayOrder: 'asc' },
        });
        res.json(boxes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard boxes' });
    }
});

// Create box (Admin only)
router.post('/', authenticate, authorize(['SUPER_ADMIN', 'ACCOUNT_MANAGER']), async (req, res) => {
    try {
        const validatedData = boxSchema.parse(req.body);
        const box = await prisma.dashboardBox.create({
            data: {
                ...validatedData,
                data: JSON.stringify(validatedData.data)
            }
        });
        res.status(201).json(box);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid data', errors: error.issues });
        }
        res.status(500).json({ message: 'Error creating dashboard box' });
    }
});

// Update box
router.put('/:id', authenticate, authorize(['SUPER_ADMIN', 'ACCOUNT_MANAGER']), async (req, res) => {
    try {
        const { id } = req.params;
        const data = boxSchema.partial().parse(req.body);
        const box = await prisma.dashboardBox.update({
            where: { id },
            data,
        });
        res.json(box);
    } catch (error) {
        res.status(500).json({ message: 'Error updating dashboard box' });
    }
});

// Delete box
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'ACCOUNT_MANAGER']), async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.dashboardBox.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting dashboard box' });
    }
});

export default router;
