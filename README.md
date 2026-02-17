# Allowance App

A parent-funded virtual card app for kids. Parents fund allowance, kids spend via virtual card. Dollar-denominated, Bitcoin invisible.

## Current Status

🚧 **MVP Development Phase**

### Implemented Features
- ✅ Login/Signup screen with authentication
- ✅ Parent dashboard with child management
- ✅ Child dashboard with balance display
- ✅ Virtual card screen with freeze/unfreeze
- ✅ Transaction history view
- ✅ Settings screen
- ✅ Mock API for development

### TODO (MVP Scope)
- [ ] Real backend API implementation
- [ ] Database setup (PostgreSQL + Prisma)
- [ ] Stripe integration for card issuing
- [ ] Lightning integration (LND) for payments
- [ ] Recurring allowance automation
- [ ] Bank account linking
- [ ] Push notifications
- [ ] App store deployment

## Tech Stack

### Frontend
- **React Native** - Cross-platform mobile app (iOS/Android)
- **TypeScript** - Type safety

### Backend
- **Node.js + Express** - REST API
- **PostgreSQL** - User data, transactions
- **Prisma** - Type-safe ORM
- **Stripe** - Virtual card issuing
- **LND** - Lightning Network payments

## Project Structure

```
allowance-app/
├── src/                  # Frontend (React Native)
│   ├── screens/          # UI screens
│   │   ├── LoginScreen.tsx
│   │   ├── ParentDashboard.tsx
│   │   ├── ChildDashboard.tsx
│   │   ├── CardScreen.tsx
│   │   ├── TransactionScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── api/              # API client (mock for now)
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app entry point
│
└── backend/              # Backend API
    └── src/
        ├── index.ts      # Express app & routes
        ├── services/     # Business logic
        │   ├── database.ts
        │   ├── lnd.ts
        │   └── stripe.ts
        └── middleware/   # Auth, etc.
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- React Native development environment
  - For iOS: Xcode, CocoaPods
  - For Android: Android Studio, JDK

### Installation

1. **Clone the repo**
   ```bash
   cd ~/src/allowance-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install

   # iOS (Mac only)
   cd ios && pod install && cd ..
   ```

3. **Run the app**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

### Backend Setup (Coming Soon)
```bash
cd backend
npm install
npm run dev
```

## Development

### Mock API
Currently using mock API (`src/api/index.ts`) with fake data for rapid frontend development.

**Demo credentials:** Any email/password will work in MVP mode.

### Running Tests (TODO)
```bash
npm test
```

### Building for Production (TODO)
```bash
npm run build:ios
npm run build:android
```

## MVP Scope

See [SPEC.md](./SPEC.md) for full product specification.

**Core MVP Features:**
1. Parent creates account ✅
2. Parent adds one child ✅ (UI done, needs backend)
3. Parent funds account (simulated for now)
4. Child sees balance ✅
5. Virtual card display ✅

## Revenue Model
- $1.99/month per parent
- Optional: Small fee on card transactions

## Key Principles
- **No Bitcoin visible to users** - Always display in dollars
- **Simple, boring, useful** - Not a "Bitcoin product"
- **Recurring revenue** - Subscription-based

## Contributing

This is a private project. Contact the team for access.

## License

Proprietary - All rights reserved.

---

**Last updated:** February 17, 2026
