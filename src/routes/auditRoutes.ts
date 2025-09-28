import { Router } from "express"
import {getProductAuditLogs} from '../controllers/auditControllers'

const router = Router();

// Audit Logs endpoint of a product
router.get('/:productId/audit-logs', getProductAuditLogs)

export default router;