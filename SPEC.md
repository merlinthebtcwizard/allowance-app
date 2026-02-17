# Allowance App - Specification

## Overview
A parent-funded virtual card app for kids. Parents fund allowance, kids spend via virtual card. Dollar-denominated. Bitcoin invisible.

## Core Features

### Parent Flow
- Sign up / login
- Add child (name, phone)
- Set recurring allowance amount and schedule (weekly/bi-weekly/monthly)
- Fund account (connect bank / Lightning)
- View child's spending history
- Freeze/unfreeze card

### Kid Flow  
- View balance in dollars
- See virtual card details
- View transaction history
- Card works anywhere Visa is accepted

### Technical Stack
- Frontend: React Native (iOS/Android)
- Backend: Node.js API
- Card Issuing: Stripe (or similar)
- Payments: Lightning (LND/hypernode) - invisible to users

## Key Principles
- **No Bitcoin visible to users** - always dollars
- **Simple, boring, useful** - not a Bitcoin product
- **Recurring revenue** - $1-2/month per parent

## MVP Scope
1. Parent creates account
2. Parent adds one child
3. Parent funds account (simulated for now)
4. Child sees balance
5. Virtual card display (simulated for now)

## Revenue Model
- $1.99/month per parent
- Optional: small fee on card transactions
