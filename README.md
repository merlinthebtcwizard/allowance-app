# Allowance App

Parent-funded virtual card app for kids. Dollar-denominated. Bitcoin invisible.

## The Idea

A mobile app where:
- Parents fund allowance
- Kids get a virtual card
- Everything in dollars - no Bitcoin visible

## Quick Start

```bash
# Install dependencies
cd allowance-app
npm install

# Run with Expo
npm start
```

## Project Structure

```
src/
├── api/          # Mock API layer (replace with real backend)
├── components/   # Reusable UI components
├── screens/      # App screens
├── types/        # TypeScript interfaces
├── utils/        # Helper functions
└── App.tsx       # Main app entry
```

## Tech Stack

- **Frontend:** React Native + Expo
- **Backend:** Node.js (to be built)
- **Payments:** Lightning (LND) - invisible to users
- **Cards:** Stripe or similar

## Key Principles

1. **No Bitcoin visible** - always dollars
2. **Simple, boring, useful** - not a Bitcoin product
3. **Recurring revenue** - $1-99/month per parent

## MVP Features

- [x] Parent signup/login
- [x] Add child
- [x] View balance (in dollars)
- [x] Virtual card display
- [x] Freeze/unfreeze card
- [ ] Connect funding source
- [ ] Set allowance schedule
- [ ] Real card issuing

## Status

Day 1 - Scaffolded. Core UI working with mock data.
