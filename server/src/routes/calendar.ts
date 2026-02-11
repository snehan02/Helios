import express from 'express';
import CalendarEntry from '../models/CalendarEntry';
import Client from '../models/Client';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get calendar entries for a client
router.get('/:clientId', authenticate, async (req: any, res: any) => {
    try {
        const { clientId } = req.params;
        const { month } = req.query; // Optional filter by month (YYYY-MM)

        // Security check
        if (req.user.role === 'client' && req.user.clientId !== clientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        let query: any = { client: clientId };

        if (month) {
            const startOfMonth = new Date(`${month}-01`);
            const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
            query.date = {
                $gte: startOfMonth,
                $lte: endOfMonth
            };
        }

        const entries = await CalendarEntry.find(query).sort({ date: 1 });
        res.json(entries);
    } catch (error) {
        console.error('Error fetching calendar:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add/Update calendar entry (Admin only)
router.post('/', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const { clientId, date, status, details } = req.body;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const entryDate = new Date(date);

        // Upsert logic: Update if exists, Create if not
        const entry = await CalendarEntry.findOneAndUpdate(
            { client: clientId, date: entryDate },
            {
                status,
                details,
                createdBy: req.user.id
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(entry);
    } catch (error) {
        console.error('Error saving calendar entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
