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

// Add/Update calendar entry (Admin or Client for Blocked status)
router.post('/', authenticate, async (req: any, res: any) => {
    try {
        const { clientId, date, status, details, notes } = req.body;

        // Security Check
        if (req.user.role === 'client') {
            // Client can only update their own calendar
            if (req.user.clientId.toString() !== clientId) {
                return res.status(403).json({ message: 'Access denied: You can only update your own calendar.' });
            }
            // Client can only set status to 'yellow' (Blocked)
            if (status !== 'yellow') {
                return res.status(403).json({ message: 'Access denied: Clients can only mark themselves as blocked.' });
            }
        }

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Normalize date: Strip time to ensure consistency (midnight UTC)
        const d = new Date(date);
        const entryDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

        // Upsert logic: Update if exists, Create if not
        const entry = await CalendarEntry.findOneAndUpdate(
            { client: clientId, date: entryDate },
            {
                status,
                details,
                notes,
                createdBy: req.user.id
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (status === 'yellow') {
            // TODO: Real notification implementation (Email/Push/Socket)
            console.log(`[NOTIFICATION] Client ${client.name} is BLOCKED on ${date}. Details: ${details}`);
        }

        res.json(entry);
    } catch (error) {
        console.error('Error saving calendar entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
