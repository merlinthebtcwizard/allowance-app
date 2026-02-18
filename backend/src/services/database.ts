import { PrismaClient } from '@prisma/client';
import type { User, Child, Transaction, AllowancePlan } from '@prisma/client';

/**
 * Database Service
 * 
 * Wraps Prisma Client with typed operations for:
 * - User management (parents & children)
 * - Child accounts and cards
 * - Transactions
 * - Allowance plans
 */
export class Database {
  private prisma: PrismaClient;
  
  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  
  // User operations
  users = {
    create: async (data: {
      email: string;
      passwordHash: string;
      name: string;
      role?: 'PARENT' | 'CHILD';
    }): Promise<User> => {
      return this.prisma.user.create({ data });
    },
    
    findByEmail: async (email: string): Promise<User | null> => {
      return this.prisma.user.findUnique({
        where: { email },
      });
    },
    
    findById: async (id: string): Promise<User | null> => {
      return this.prisma.user.findUnique({
        where: { id },
      });
    },
    
    update: async (id: string, data: Partial<User>): Promise<User> => {
      return this.prisma.user.update({
        where: { id },
        data,
      });
    },
  };
  
  // Child operations
  children = {
    create: async (data: {
      parentId: string;
      name: string;
      stripeCardId?: string;
      cardLastFour?: string;
    }): Promise<Child> => {
      return this.prisma.child.create({ data });
    },
    
    findById: async (id: string): Promise<Child | null> => {
      return this.prisma.child.findUnique({
        where: { id },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          allowances: {
            where: { isActive: true },
          },
        },
      });
    },
    
    findByParentId: async (parentId: string): Promise<Child[]> => {
      return this.prisma.child.findMany({
        where: { parentId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          allowances: {
            where: { isActive: true },
          },
        },
      });
    },
    
    getBalance: async (childId: string): Promise<number> => {
      const child = await this.prisma.child.findUnique({
        where: { id: childId },
        select: { balance: true },
      });
      return child?.balance ?? 0;
    },
    
    getCard: async (childId: string): Promise<{ stripeCardId: string; cardLastFour: string; cardStatus: string } | null> => {
      const child = await this.prisma.child.findUnique({
        where: { id: childId },
        select: {
          stripeCardId: true,
          cardLastFour: true,
          cardStatus: true,
        },
      });
      
      if (!child?.stripeCardId) return null;
      
      return {
        stripeCardId: child.stripeCardId,
        cardLastFour: child.cardLastFour!,
        cardStatus: child.cardStatus,
      };
    },
    
    updateBalance: async (childId: string, amountCents: number): Promise<Child> => {
      return this.prisma.child.update({
        where: { id: childId },
        data: {
          balance: {
            increment: amountCents,
          },
        },
      });
    },
    
    updateCardStatus: async (childId: string, status: 'PENDING' | 'ACTIVE' | 'FROZEN' | 'CANCELLED'): Promise<Child> => {
      return this.prisma.child.update({
        where: { id: childId },
        data: { cardStatus: status },
      });
    },
  };
  
  // Transaction operations
  transactions = {
    create: async (data: {
      childId: string;
      amount: number;
      type: 'DEPOSIT' | 'WITHDRAWAL' | 'ALLOWANCE' | 'SPENDING' | 'REFUND';
      description: string;
      stripeTxId?: string;
    }): Promise<Transaction> => {
      // Create transaction and update child balance atomically
      return this.prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({ data });
        
        await tx.child.update({
          where: { id: data.childId },
          data: {
            balance: {
              increment: data.amount,
            },
          },
        });
        
        return transaction;
      });
    },
    
    list: async (options: {
      childId: string;
      limit?: number;
      offset?: number;
    }): Promise<Transaction[]> => {
      return this.prisma.transaction.findMany({
        where: { childId: options.childId },
        orderBy: { createdAt: 'desc' },
        take: options.limit ?? 20,
        skip: options.offset ?? 0,
      });
    },
    
    sumByType: async (childId: string, type: string): Promise<number> => {
      const result = await this.prisma.transaction.aggregate({
        where: {
          childId,
          type: type as any,
        },
        _sum: {
          amount: true,
        },
      });
      return result._sum.amount ?? 0;
    },
  };
  
  // Allowance operations
  allowance = {
    create: async (data: {
      parentId: string;
      childId: string;
      amount: number;
      frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
      nextPayout: Date;
    }): Promise<AllowancePlan> => {
      return this.prisma.allowancePlan.create({ data });
    },
    
    getPending: async (): Promise<AllowancePlan[]> => {
      return this.prisma.allowancePlan.findMany({
        where: {
          isActive: true,
          nextPayout: {
            lte: new Date(),
          },
        },
        include: {
          child: true,
          parent: true,
        },
      });
    },
    
    update: async (id: string, data: Partial<AllowancePlan>): Promise<AllowancePlan> => {
      return this.prisma.allowancePlan.update({
        where: { id },
        data,
      });
    },
    
    deactivate: async (id: string): Promise<AllowancePlan> => {
      return this.prisma.allowancePlan.update({
        where: { id },
        data: { isActive: false },
      });
    },
  };
  
  // Cleanup
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

export default Database;
