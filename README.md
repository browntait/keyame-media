# Keyame Media — Photo Studio Management System

A production-ready SaaS application for managing a professional photo studio — clients, bookings, payments, deliveries, staff, and commissions — all in one place.

![Keyame Media Dashboard](https://placehold.co/1200x600/285fcc/white?text=Keyame+Media+Dashboard)

---

## Features

### Core Modules
| Module | Description |
|--------|-------------|
| **Dashboard** | KPI cards, revenue area chart, upcoming deliveries, recent clients |
| **Client Registration** | Full form → review screen → auto WhatsApp notification + invoice |
| **Payment Module** | Cash, Bank, M-Pesa STK Push with receipt tracking |
| **Delivery Tracker** | Live status board with overdue & due-tomorrow pop-up alerts |
| **Shoot Management** | Schedule shoots, assign photographers, status workflow |
| **Commissions** | Auto-calculated per payment; admin marks payouts as paid |
| **Transactions** | All-time transaction log with method/status/date filters |
| **Staff / Team** | Add, edit, suspend, delete; assign roles & custom commission rate |
| **Services Catalog** | CRUD for service types with pricing and delivery SLA |
| **Reports & Analytics** | Revenue bar/area charts, payment method pie, delivery breakdown |
| **Audit Logs** | Filterable log of every significant action in the system |
| **In-App Notifications** | Bell icon with unread badge; auto alerts for payments, registrations |

### Key Highlights
- **RBAC** — Admin / Manager / Staff with route and data-level enforcement
- **Auto delivery date** — 4 business days calculated on form fill (skips weekends)
- **WhatsApp booking confirmation** auto-sent after client registration
- **M-Pesa STK Push** flow with `MerchantRequestID` / `CheckoutRequestID` tracking
- **Overdue pop-up notifications** — fires 1 day before and on the due date
- **Per-client visit history** — same client can book multiple times; all records linked by phone number
- **Light / Dark mode** — follows OS preference; toggle in top bar
- **Mobile responsive** — collapsible sidebar on mobile

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript 5 + Vite 7 |
| Styling | Tailwind CSS 4 + shadcn/ui + Plus Jakarta Sans |
| Backend | Convex (reactive document DB + serverless functions) |
| Auth | Hercules Auth (OIDC) |
| Charts | Recharts |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| Notifications | Sonner toasts |
| Icons | Lucide React |

---

## Project Structure

```
keyame-media/
├── convex/                    # Backend (Convex serverless)
│   ├── schema.ts              # Full DB schema (11 tables)
│   ├── helpers.ts             # Auth helpers, RBAC, invoice generator
│   ├── users.ts               # User management + RBAC mutations
│   ├── clients.ts             # Client CRUD + dashboard stats
│   ├── payments.ts            # Payment recording + M-Pesa flow
│   ├── services.ts            # Services catalog
│   ├── shoots.ts              # Shoot scheduling
│   ├── commissions.ts         # Commission tracking + payouts
│   └── notifications.ts       # Notifications, audit logs, WhatsApp logs
│
└── src/
    ├── components/
    │   ├── StatusBadge.tsx    # Colour-coded status pill
    │   └── providers/         # Theme, Convex, Auth providers
    ├── hooks/
    │   └── use-user-role.ts   # useCurrentUser, useIsAdmin, useIsAdminOrManager
    └── pages/
        ├── layout/            # AppLayout, Sidebar, TopBar, OverdueNotifier
        ├── dashboard/         # KPI dashboard
        ├── clients/           # List, detail, register
        ├── payment/           # Cash / M-Pesa payment page
        ├── transactions/      # All transactions log
        ├── staff/             # Team management
        ├── services/          # Services catalog
        ├── shoots/            # Shoot tracker
        ├── commissions/       # Commission view
        ├── delivery/          # Delivery board
        ├── reports/           # Analytics
        └── audit-logs/        # Audit trail
```

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Staff accounts with roles and commission rates |
| `clients` | Client booking records (multiple per person) |
| `clientFiles` | Files associated with each booking |
| `payments` | Payment transactions (cash / M-Pesa / bank) |
| `services` | Service catalog |
| `shoots` | Photography session tracking |
| `commissions` | Auto-calculated commissions per payment |
| `commissionSettings` | Global default commission rate |
| `notifications` | In-app notification inbox |
| `whatsappLogs` | WhatsApp message history |
| `auditLogs` | Full action audit trail |

---

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm
- A [Hercules](https://hercules.app) account (for Auth + Convex backend)

### Setup

```bash
# Clone the repository
git clone https://github.com/browntait/keyame-media.git
cd keyame-media

# Install dependencies
pnpm install

# Start development server (starts both Vite + Convex)
pnpm dev
```

### Environment Variables

The following are managed automatically by Hercules. If self-hosting, set:

```env
HERCULES_OIDC_AUTHORITY=https://<your-app-id>.hercules-auth.com
HERCULES_OIDC_CLIENT_ID=<your-client-id>
VITE_HERCULES_OIDC_AUTHORITY=https://<your-app-id>.hercules-auth.com
VITE_HERCULES_OIDC_CLIENT_ID=<your-client-id>
```

For M-Pesa (Safaricom Daraja API), add these via the Hercules Secrets tab:

```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-app.onhercules.app/api/mpesa/callback
```

For WhatsApp Business Cloud API:

```
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

---

## Role-Based Access Control

| Feature | Admin | Manager | Staff |
|---------|-------|---------|-------|
| View own clients | ✅ | ✅ | ✅ |
| View all clients | ✅ | ✅ | ❌ |
| Delete clients | ✅ | ❌ | ❌ |
| Register clients | ✅ | ✅ | ✅ |
| Record payments | ✅ | ✅ | ✅ |
| View transactions | ✅ | ✅ | own only |
| Manage services | ✅ | ✅ | ❌ |
| Manage team | ✅ | ❌ | ❌ |
| View all commissions | ✅ | ❌ | ❌ |
| Mark commissions paid | ✅ | ❌ | ❌ |
| Reports & Analytics | ✅ | ✅ | ❌ |
| Audit Logs | ✅ | ✅ | ❌ |

---

## Deployment

The app is deployed and hosted on [Hercules Cloud](https://hercules.app). Click **Publish** in the Hercules App Builder to deploy.

---

## License

MIT
