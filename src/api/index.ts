// Mock API for Allowance App
// Simulates backend responses for MVP development

import { Parent, Child, Transaction, AllowanceSchedule, Card } from '../types';

// Mock data store
const store = {
  parent: null as Parent | null,
  child: null as Child | null,
  transactions: [] as Transaction[],
  card: null as Card | null,
};

// Helper to generate IDs
const genId = () => Math.random().toString(36).substr(2, 9);

// Initialize with some mock data
const initMockData = () => {
  store.parent = {
    id: genId(),
    email: 'parent@example.com',
    name: 'Mom',
    role: 'parent',
    createdAt: Date.now(),
    children: [],
    subscriptionTier: 'premium',
  };

  store.child = {
    id: genId(),
    email: 'kid@example.com',
    name: 'Alex',
    role: 'child',
    parentId: '',
    balance: 5000, // $50.00
    cardLastFour: '4242',
    cardStatus: 'active',
    createdAt: Date.now(),
  };

  store.parent.children.push(store.child);
  store.child.parentId = store.parent.id;

  store.card = {
    id: genId(),
    childId: store.child.id,
    lastFour: '4242',
    status: 'active',
    virtualCardNumber: '4242424242424242',
    expiryDate: '12/28',
    cvv: '123',
  };

  store.transactions = [
    {
      id: genId(),
      childId: store.child.id,
      amount: 5000,
      type: 'deposit',
      description: 'Weekly allowance',
      timestamp: Date.now() - 86400000,
    },
    {
      id: genId(),
      childId: store.child.id,
      amount: -450,
      type: 'spending',
      description: 'Coffee shop',
      timestamp: Date.now() - 3600000,
    },
  ];
};

initMockData();

// API Methods
export const api = {
  // Auth
  login: async (email: string, _password: string): Promise<Parent> => {
    await delay(300);
    if (!store.parent) throw new Error('No parent found');
    return store.parent;
  },

  // Parent actions
  getParent: async (): Promise<Parent | null> => {
    await delay(200);
    return store.parent;
  },

  addChild: async (name: string): Promise<Child> => {
    await delay(300);
    const child: Child = {
      id: genId(),
      email: '',
      name,
      role: 'child',
      parentId: store.parent?.id || '',
      balance: 0,
      cardLastFour: Math.floor(1000 + Math.random() * 9000).toString(),
      cardStatus: 'pending',
      createdAt: Date.now(),
    };
    
    store.child = child;
    if (store.parent) {
      store.parent.children.push(child);
    }
    
    return child;
  },

  setAllowance: async (amount: number, frequency: AllowanceSchedule['frequency']): Promise<AllowanceSchedule> => {
    await delay(300);
    return {
      amount,
      frequency,
      nextPayout: Date.now() + 86400000 * 7,
    };
  },

  // Child actions
  getChild: async (): Promise<Child | null> => {
    await delay(200);
    return store.child;
  },

  getBalance: async (): Promise<number> => {
    await delay(100);
    return store.child?.balance || 0;
  },

  // Card
  getCard: async (): Promise<Card | null> => {
    await delay(200);
    return store.card;
  },

  toggleCardFreeze: async (): Promise<Card> => {
    await delay(300);
    if (!store.card) throw new Error('No card');
    store.card.status = store.card.status === 'active' ? 'frozen' : 'active';
    return store.card;
  },

  // Transactions
  getTransactions: async (limit = 10): Promise<Transaction[]> => {
    await delay(200);
    return store.transactions.slice(0, limit);
  },
};

// Helper for simulating network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default api;
