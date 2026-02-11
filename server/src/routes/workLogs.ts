import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const workLogSchema = z.object({
    clientId: z.string().uuid(),
    date: z.string().transform((val) => new Date(val)),
    status: z.enum(['GREEN', 'YELLOW', 'RED']),
    description: z.string().max(2000),
    attachments: z.array(z.object({ title: z.string(), url: z.string().url() })).optional(),
});

// Get logs for a client
router.get('/', authenticate, async (req: AuthRequest, res) => {
    const { clientId, startDate, endDate } = req.query;

    if (req.user?.role === 'CLIENT' && req.user.clientId !== clientId) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const logs = await prisma.workLog.findMany({
            where: {
                clientId: clientId as string,
                date: {
                    gte: startDate ? new Date(startDate as string) : undefined,
                    lte: endDate ? new Date(endDate as string) : undefined,
                },
            },
            orderBy: { date: 'desc' },
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching work logs' });
    }
});

// Create/Update work log (Admin only)
router.post('/', authenticate, authorize(['SUPER_ADMIN', 'ACCOUNT_MANAGER']), async (req: AuthRequest, res) => {
    try {
        const { clientId, date, status, description, attachments } = workLogSchema.parse(req.body);

        const log = await prisma.workLog.upsert({
            where: {
                clientId_date: { clientId, date }
            },
            update: {
                status,
                description,
                attachments: attachments ? JSON.stringify(attachments) : undefined,
                updatedAt: new Date(),
            },
            create: {
                clientId,
                date,
                status,
                description,
                attachments: attachments ? JSON.stringify(attachments) : undefined,
                createdByUserId: req.user!.id,
            },
        });

        res.json(log);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid data', errors: error.issues });
        }
        console.error(error);
        res.status(500).json({ message: 'Error saving work log' });
    }
});

export default router;
