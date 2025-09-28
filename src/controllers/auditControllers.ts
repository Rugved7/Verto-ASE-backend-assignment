import { Request, Response } from "express"
import { AuditLogService } from '../services/auditLogService'

export const getProductAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params
        const auditLogs = await AuditLogService.getProductAuditLogs(productId)

        res.status(200).json(auditLogs)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch audit logs" })
    }
}