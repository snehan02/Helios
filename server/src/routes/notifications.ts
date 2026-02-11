import { Router } from 'express';
import BlockingNotification from '../models/BlockingNotification';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const notificationSchema = z.object({
    clientId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    message: z.string().min(1),
});

// Get notifications (Admin only)
router.get('/', authenticate, authorize(['SUPER_ADMIN', 'ACCOUNT_MANAGER']), async (req, res) => {
    try {
        const notifications = await BlockingNotification.find()
            .populate('clientId') // Note: In schema it's ref: 'Client', path is 'clientId'
            .populate('resolvedByUserId') // Path in schema
            .sort({ createdAt: -1 });

        // Map to match expected structure if needed, but Mongoose populate returns objects under the path name.
        // Prisma returned `client` and `resolvedBy`. 
        // We might need to map `clientId` (populated) to `client` to match frontend expectations if it expects `notification.client`.
        // However, Mongoose populates *in place*. So `notification.clientId` will be the client object.
        // If frontend expects `notification.client`, we can map it or adjust frontend.
        // For least friction, let's map it.

        const formattedNotifications = notifications.map(n => {
            const obj = n.toObject();
            return {
                ...obj,
                client: obj.clientId, // Map populated field to expected name
                resolvedBy: obj.resolvedByUserId, // Map populated field to expected name
                // keep original IDs if needed, but they are now objects.
            };
        });

        res.json(formattedNotifications);
    } catch (error) {
        console.error(error);
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

        const notification = await BlockingNotification.create({
            clientId,
            message,
            blockingDate: new Date(),
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
        const notification = await BlockingNotification.findByIdAndUpdate(
            id,
            {
                isResolved: true,
                resolvedAt: new Date(),
                resolvedByUserId: req.user!.id,
            },
            { new: true }
        );
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error resolving notification' });
    }
});

export default router;
