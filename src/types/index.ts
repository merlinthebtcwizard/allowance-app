// Types for Allowance App

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'child';
  createdAt: number;
}

export interface Parent extends User {
  role: 'parent';
  children: Child[];
  subscriptionTier: 'free' | 'premium';
}

export interface Child extends User {
  role: 'child';
  parentId: string;
  balance: number; // in cents (dollars * 100)
  cardLastFour: string;
  cardStatus: 'active' | 'frozen' | 'pending';
}

export interface Transaction {
  id: string;
  childId: string;
  amount: number; // in cents
  type: 'deposit' | 'spending' | 'allowance';
  description: string;
  timestamp: number;
}

export interface AllowanceSchedule {
  amount: number; // in cents
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextPayout: number; // timestamp
}

export interface Card {
  id: string;
  childId: string;
  lastFour: string;
  status: 'active' | 'frozen';
  virtualCardNumber: string;
  expiryDate: string;
  cvv: string;
}
