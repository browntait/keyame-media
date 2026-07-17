import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("staff")),
    isActive: v.boolean(),
    avatar: v.optional(v.string()),
    commissionRate: v.optional(v.number()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_role", ["role"])
    .index("by_email", ["email"]),

  services: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("indoor_shoot"),
      v.literal("outdoor_shoot"),
      v.literal("events"),
      v.literal("passport_photos"),
      v.literal("still_photos"),
      v.literal("cv_generation"),
      v.literal("printing"),
      v.literal("framing"),
      v.literal("other"),
    ),
    price: v.number(),
    estimatedDeliveryDays: v.number(),
    isActive: v.boolean(),
    description: v.optional(v.string()),
  }).index("by_category", ["category"]).index("by_active", ["isActive"]),

  clients: defineTable({
    fullName: v.string(),
    phone: v.string(),
    whatsappNumber: v.string(),
    email: v.optional(v.string()),
    registeredBy: v.id("users"),
    invoiceNumber: v.string(),
    serviceCategory: v.union(
      v.literal("indoor_shoot"),
      v.literal("outdoor_shoot"),
      v.literal("events"),
      v.literal("passport_photos"),
      v.literal("still_photos"),
      v.literal("cv_generation"),
      v.literal("printing"),
      v.literal("framing"),
      v.literal("other"),
    ),
    serviceName: v.string(),
    unitPrice: v.number(),
    quantity: v.number(),
    totalAmount: v.number(),
    dateReceived: v.string(),
    expectedDeliveryDate: v.string(),
    remarks: v.optional(v.string()),
    deliveryStatus: v.union(
      v.literal("pending"),
      v.literal("editing"),
      v.literal("ready"),
      v.literal("delivered"),
    ),
    paymentStatus: v.union(
      v.literal("unpaid"),
      v.literal("partial"),
      v.literal("paid"),
    ),
    amountPaid: v.number(),
    balance: v.number(),
    whatsappSent: v.boolean(),
    whatsappSentAt: v.optional(v.string()),
  })
    .index("by_registered_by", ["registeredBy"])
    .index("by_delivery_status", ["deliveryStatus"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_invoice", ["invoiceNumber"])
    .index("by_phone", ["phone"])
    .index("by_date_received", ["dateReceived"]),

  clientFiles: defineTable({
    clientId: v.id("clients"),
    fileName: v.string(),
    fileType: v.string(),
    storageId: v.optional(v.string()),
    uploadedBy: v.id("users"),
    uploadDate: v.string(),
    isDelivered: v.boolean(),
  })
    .index("by_client", ["clientId"])
    .index("by_uploaded_by", ["uploadedBy"]),

  payments: defineTable({
    clientId: v.id("clients"),
    invoiceNumber: v.string(),
    amount: v.number(),
    paymentMethod: v.union(v.literal("cash"), v.literal("mpesa"), v.literal("bank")),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled"),
    ),
    mpesaReceiptNumber: v.optional(v.string()),
    mpesaMerchantRequestId: v.optional(v.string()),
    mpesaCheckoutRequestId: v.optional(v.string()),
    mpesaPhone: v.optional(v.string()),
    transactionDate: v.string(),
    recordedBy: v.id("users"),
    notes: v.optional(v.string()),
  })
    .index("by_client", ["clientId"])
    .index("by_invoice", ["invoiceNumber"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_method", ["paymentMethod"])
    .index("by_transaction_date", ["transactionDate"]),

  shoots: defineTable({
    clientId: v.id("clients"),
    photographerId: v.id("users"),
    shootDate: v.string(),
    location: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("editing"),
      v.literal("ready"),
      v.literal("delivered"),
    ),
    notes: v.optional(v.string()),
    createdBy: v.id("users"),
  })
    .index("by_client", ["clientId"])
    .index("by_photographer", ["photographerId"])
    .index("by_status", ["status"])
    .index("by_shoot_date", ["shootDate"]),

  commissions: defineTable({
    staffId: v.id("users"),
    clientId: v.id("clients"),
    paymentId: v.id("payments"),
    amount: v.number(),
    rate: v.number(),
    status: v.union(v.literal("pending"), v.literal("paid")),
    paidAt: v.optional(v.string()),
    paidBy: v.optional(v.id("users")),
  })
    .index("by_staff", ["staffId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"]),

  commissionSettings: defineTable({
    globalRate: v.number(),
    updatedBy: v.id("users"),
  }),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("registration"),
      v.literal("payment"),
      v.literal("mpesa"),
      v.literal("whatsapp"),
      v.literal("delivery_due"),
      v.literal("delivery_overdue"),
      v.literal("new_client"),
    ),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    relatedId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_read", ["userId", "isRead"]),

  whatsappLogs: defineTable({
    clientId: v.id("clients"),
    phone: v.string(),
    message: v.string(),
    status: v.union(v.literal("sent"), v.literal("failed"), v.literal("pending")),
    sentAt: v.optional(v.string()),
    failureReason: v.optional(v.string()),
    retryCount: v.number(),
    sentBy: v.id("users"),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"]),

  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.union(
      v.literal("login"),
      v.literal("logout"),
      v.literal("client_created"),
      v.literal("client_updated"),
      v.literal("client_deleted"),
      v.literal("payment_recorded"),
      v.literal("file_uploaded"),
      v.literal("file_deleted"),
      v.literal("whatsapp_sent"),
      v.literal("mpesa_initiated"),
      v.literal("mpesa_completed"),
      v.literal("staff_created"),
      v.literal("staff_updated"),
      v.literal("staff_deleted"),
      v.literal("service_created"),
      v.literal("service_updated"),
      v.literal("shoot_created"),
      v.literal("shoot_updated"),
      v.literal("commission_paid"),
      v.literal("settings_updated"),
    ),
    resourceType: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    description: v.string(),
    ipAddress: v.optional(v.string()),
    metadata: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_action", ["action"]),
});
