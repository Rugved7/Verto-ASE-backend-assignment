import { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService';
import mongoose from 'mongoose';

export const getProductAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;

        // Validate if productId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({ error: 'Invalid product ID' });
            return;
        }

        console.log('🔍 Controller fetching logs for:', productId);
        const auditLogs = await AuditLogService.getProductAuditLogs(productId);

        res.status(200).json(auditLogs);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
};