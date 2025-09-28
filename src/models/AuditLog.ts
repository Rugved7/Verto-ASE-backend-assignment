import { Schema, model, Document } from "mongoose"

export interface IAuditLog extends Document {
  product_id: Schema.Types.ObjectId
  action_type: 'CREATE' | 'UPDATE' | 'DELETE' | 'STOCK_INCREASE' | 'STOCK_DECREASE'
  old_values?: any
  new_value?: any
  timestamp: Date
}

const auditLogSchema = new Schema<IAuditLog>({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    requried: true
  },
  action_type: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'STOCK_INCREASE', 'STOCK_DECREASE']
  },
  old_values: { type: Schema.Types.Mixed },
  new_value: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
})

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema)