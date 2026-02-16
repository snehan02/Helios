import express from 'express';
import DashboardData from '../models/DashboardData';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get dashboard data (Read: Admin & Client)
router.get('/:clientId', authenticate, async (req: any, res: any) => {
    try {
        const { clientId } = req.params;

        // Security check
        if (req.user.role === 'client' && req.user.clientId !== clientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        let dashboardData = await DashboardData.findOne({ client: clientId });

        if (!dashboardData) {
            // Return empty structure if not found
            return res.json({
                payments: [],
                metrics: [],
                resources: []
            });
        }

        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Payments (Admin Only)
router.put('/:clientId/payments', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const { clientId } = req.params;
        const { payments } = req.body;

        const dashboardData = await DashboardData.findOneAndUpdate(
            { client: clientId },
            { $set: { payments } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(dashboardData);
    } catch (error) {
        console.error('Error updating payments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Metrics (Admin Only)
router.put('/:clientId/metrics', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const { clientId } = req.params;
        const { metrics } = req.body;

        const dashboardData = await DashboardData.findOneAndUpdate(
            { client: clientId },
            { $set: { metrics } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(dashboardData);
    } catch (error) {
        console.error('Error updating metrics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Resources (Admin Only)
router.put('/:clientId/resources', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const { clientId } = req.params;
        const { resources } = req.body;

        const dashboardData = await DashboardData.findOneAndUpdate(
            { client: clientId },
            { $set: { resources } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(dashboardData);
    } catch (error) {
        console.error('Error updating resources:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update dynamic layout (Admin Only)
router.put('/:clientId/layout', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const { clientId } = req.params;
        const { layout } = req.body;

        const dashboardData = await DashboardData.findOneAndUpdate(
            { client: clientId },
            { $set: { layout } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(dashboardData);
    } catch (error: any) {
        console.error('Error updating layout:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
