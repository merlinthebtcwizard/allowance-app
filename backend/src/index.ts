// Backend API Structure
// This is the server-side code that would run on the backend

/**
 * Allowance App Backend API
 * 
 * Tech Stack:
 * - Node.js + Express
 * - PostgreSQL (user data, transactions)
 * - LND (Lightning payments)
 * - Stripe (card issuing)
 * 
 * All amounts in cents (dollars * 100) for precision
 */

import express from 'express';
import { LndService } from './lnd';
import { StripeService } from './stripe';
import { Database } from './database';

const app = express();
app.use(express.json());

// Initialize services
const db = new Database();
const lnd = new LndService();
const stripe = new StripeService();

// ===================
// AUTH ROUTES
// ===================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  // Create user in database
  const user = await db.users.create({
    email,
    passwordHash: await hashPassword(password),
    name,
    role: 'parent',
  });
  
  // Generate JWT
  const token = generateToken(user);
  
  res.json({ user, token });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await db.users.findByEmail(email);
  if (!user || !await verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = generateToken(user);
  res.json({ user, token });
});

// ===================
// PARENT ROUTES
// ===================

// GET /api/parent/children
app.get('/api/parent/children', authenticate, async (req, res) => {
  const children = await db.children.findByParentId(req.user.id);
  res.json(children);
});

// POST /api/parent/children
app.post('/api/parent/children', authenticate, async (req, res) => {
  const { name } = req.body;
  
  // Create virtual card with Stripe
  const card = await stripe.createVirtualCard({
    parentId: req.user.id,
    cardholderName: name,
  });
  
  // Create child record
  const child = await db.children.create({
    parentId: req.user.id,
    name,
    stripeCardId: card.id,
    cardLastFour: card.last4,
    balance: 0,
  });
  
  res.json(child);
});

// POST /api/parent/allowance
app.post('/api/parent/allowance', authenticate, async (req, res) => {
  const { childId, amount, frequency } = req.body;
  
  const allowance = await db.allowance.create({
    childId,
    amount,
    frequency, // weekly, biweekly, monthly
    nextPayout: calculateNextPayout(frequency),
  });
  
  res.json(allowance);
});

// POST /api/parent/fund
app.post('/api/parent/fund', authenticate, async (req, res) => {
  const { amount, paymentMethodId } = req.body;
  
  // Charge payment method via Stripe
  const charge = await stripe.charge({
    amount,
    paymentMethodId,
    currency: 'usd',
  });
  
  // Convert to sats and send to Lightning node
  const sats = await lnd.dollarToSats(amount);
  await lnd.sendToWallet(sats);
  
  res.json({ success: true, sats });
});

// ===================
// CHILD ROUTES  
// ===================

// GET /api/child/balance
app.get('/api/child/balance', authenticate, async (req, res) => {
  const balance = await db.children.getBalance(req.user.id);
  res.json({ balance });
});

// GET /api/child/card
app.get('/api/child/card', authenticate, async (req, res) => {
  const card = await db.children.getCard(req.user.id);
  const cardDetails = await stripe.getCardDetails(card.stripeCardId);
  res.json(cardDetails);
});

// POST /api/child/card/freeze
app.post('/api/child/card/freeze', authenticate, async (req, res) => {
  const card = await db.children.getCard(req.user.id);
  await stripe.freezeCard(card.stripeCardId);
  res.json({ status: 'frozen' });
});

// ===================
// TRANSACTION ROUTES
// ===================

// GET /api/transactions
app.get('/api/transactions', authenticate, async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  const transactions = await db.transactions.list({
    childId: req.user.id,
    limit: Number(limit),
    offset: Number(offset),
  });
  res.json(transactions);
});

// ===================
// WEBHOOKS (Stripe)
// ===================

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.constructWebhookEvent(req.body, sig);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'charge.succeeded':
        // Update child balance
        break;
      case 'virtual_card.created':
        // Card was created
        break;
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: 'Webhook error' });
  }
});

// ===================
// ALLOWANCE CRON JOB
// =

// This would run as a scheduled job (e.g., every hour)
async function processAllowancePayouts() {
  const pendingAllowances = await db.allowance.getPending();
  
  for (const allowance of pendingAllowances) {
    const child = await db.children.findById(allowance.childId);
    
    // Check if parent has sufficient balance
    const parentBalance = await lnd.getBalance(child.parentId);
    if (parentBalance < allowance.amount) {
      // Notify parent of insufficient funds
      await notifyParent(child.parentId, 'insufficient_funds');
      continue;
    }
    
    // Process payout
    await db.transactions.create({
      childId: child.id,
      amount: allowance.amount,
      type: 'allowance',
      description: `Weekly allowance - ${allowance.frequency}`,
    });
    
    // Update next payout date
    await db.allowance.update(allowance.id, {
      nextPayout: calculateNextPayout(allowance.frequency),
    });
  }
}

export default app;
