import { AuditLog } from "../models/AuditLog";
import { Model, Types } from "mongoose";

export class AuditLogService {
  static async logAction(
    product_id: string,
    action_type:
      | "CREATE"
      | "UPDATE"
      | "DELETE"
      | "STOCK_INCREASE"
      | "STOCK_DECREASE",
    old_values?: any,
    new_values?: any
  ): Promise<void> {
    try {
      await AuditLog.create({
        product_id,
        action_type,
        old_values,
        new_values,
      });
    } catch (error) {
      console.error("Failed to create audit log:", error);
    }
  }

  static async getProductAuditLogs(product_id: string): Promise<any[]> {
    try {
      console.log('Fetching audit logs for product:', product_id);
      
      const auditLogs = await AuditLog.find({ product_id })
        .sort({ timestamp: -1 })
        .lean(); // Use lean() for better performance
      
      console.log('Found audit logs:', auditLogs.length);
      
      return auditLogs;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }
  }
}
