import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const notificationSchema = z.object({
    clientId: z.string().uuid(),
    message: z.string().min(1),
});

// Get notifications (Admin only)
router.get('/', authenticate, authorize(['SUPER_ADMIN', 'ACCOUNT_MANAGER']), async (req, res) => {
    try {
        const notifications = await prisma.blockingNotification.findMany({
            include: {
                client: true,
                resolvedBy: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Create notification (Client only - though Admin could too)
router.post('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const { clientId, message } = notificationSchema.parse(req.body);

        // Security check: Client can only notify for themselves
        if (req.user?.role === 'CLIENT' && req.user.clientId !== clientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const notification = await prisma.blockingNotification.create({
            data: {
                clientId,
                message,
                blockingDate: new Date(),
            }
        });

        res.status(201).json(notification);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid data', errors: error.issues });
        }
        res.status(500).json({ message: 'Error creating notification' });
    }
});

// Resolve notification
router.put('/:id/resolve', authenticate, authorize(['SUPER_ADMIN', 'ACCOUNT_MANAGER']), async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.blockingNotification.update({
            where: { id },
            data: {
                isResolved: true,
                resolvedAt: new Date(),
                resolvedByUserId: req.user!.id,
            }
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error resolving notification' });
    }
});

export default router;
