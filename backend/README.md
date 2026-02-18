# Allowance App Backend

Express API server with PostgreSQL database for the Allowance App.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Set Up Database

Make sure PostgreSQL is running, then:

```bash
# Create database
createdb allowance_app

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Database Commands

```bash
# Run migrations
npm run prisma:migrate

# Generate Prisma client (after schema changes)
npm run prisma:generate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Push schema to database (dev only, skips migrations)
npm run db:push

# Seed database with test data
npm run db:seed
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── services/
│   │   ├── database.ts       # Prisma database operations ✅
│   │   ├── lnd.ts            # Lightning payments (TODO)
│   │   └── stripe.ts         # Card issuing (TODO)
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication (TODO)
│   └── utils/
│       └── helpers.ts        # Utility functions
├── prisma/
│   ├── schema.prisma         # Database schema ✅
│   └── seed.ts               # Seed data (TODO)
└── package.json
```

## API Endpoints (Planned)

### Auth
- `POST /api/auth/register` - Create parent account
- `POST /api/auth/login` - Login

### Parent
- `GET /api/parent/children` - List children
- `POST /api/parent/children` - Add child
- `POST /api/parent/allowance` - Set up recurring allowance
- `POST /api/parent/fund` - Add funds via bank/card

### Child
- `GET /api/child/balance` - Get balance
- `GET /api/child/card` - Get card details
- `POST /api/child/card/freeze` - Freeze card
- `POST /api/child/card/unfreeze` - Unfreeze card

### Transactions
- `GET /api/transactions` - List transactions

### Webhooks
- `POST /api/webhooks/stripe` - Stripe events

## Development

- **TypeScript** for type safety
- **Prisma** for database operations
- **Express** for API routing
- **PostgreSQL** for data storage

## Next Steps

- [ ] Implement JWT authentication middleware
- [ ] Add password hashing (bcrypt)
- [ ] Implement Stripe integration
- [ ] Implement Lightning (LND) integration
- [ ] Add request validation (zod or joi)
- [ ] Add rate limiting
- [ ] Add logging (winston or pino)
- [ ] Write tests

## Environment Variables

See `.env.example` for required configuration.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for signing JWTs
- `STRIPE_SECRET_KEY` - Stripe API key
- `LND_*` - Lightning node connection details
