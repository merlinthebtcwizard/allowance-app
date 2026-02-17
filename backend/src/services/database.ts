// Database Schema & Operations
// Uses Prisma ORM for type safety

// This would be a Prisma schema file
/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(PARENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  children       Child[]
  allowancePlans AllowancePlan[]
}

model Child {
  id            String   @id @default(uuid())
  parentId      String
  name          String
  balance       Int      @default(0) // in cents
  stripeCardId  String?
  cardLastFour String?
  cardStatus   CardStatus @default(PENDING)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  parent     User      @relation(fields: [parentId], references: [id])
  transactions Transaction[]
  allowances AllowancePlan[]
}

model Transaction {
  id          String      @id @default(uuid())
  childId     String
  amount      Int         // in cents (negative = spending, positive = deposit)
  type        TransactionType
  description String
  stripeTxId  String?
  createdAt   DateTime    @default(now())
  
  child Child @relation(fields: [childId], references: [id])
}

model AllowancePlan {
  id          String          @id @default(uuid())
  childId     String
  amount      Int             // in cents
  frequency   Frequency
  nextPayout  DateTime
  isActive    Boolean         @default(true)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  child Child @relation(fields: [childId], references: [id])
}

enum Role {
  PARENT
  CHILD
}

enum CardStatus {
  PENDING
  ACTIVE
  FROZEN
  CANCELLED
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  ALLOWANCE
  SPENDING
  REFUND
}

enum Frequency {
  WEEKLY
  BIWEEKLY
  MONTHLY
}
*/

// Database service class
export class Database {
  private prisma: any;
  
  constructor() {
    // In production: this.prisma = new PrismaClient();
  }
  
  // User operations
  async users = {
    create: async (data: any) => ({ id: 'user_' + Math.random().toString(36).substr(2, 9), ...data }),
    findByEmail: async (email: string) => null,
    findById: async (id: string) => null,
    update: async (id: string, data: any) => ({ id, ...data }),
  };
  
  // Child operations
  async children = {
    create: async (data: any) => ({ 
      id: 'child_' + Math.random().toString(36).substr(2, 9), 
      balance: 0,
      cardStatus: 'PENDING',
      ...data 
    }),
    findById: async (id: string) => null,
    findByParentId: async (parentId: string) => [],
    getBalance: async (childId: string) => 0,
    getCard: async (childId: string) => null,
    updateBalance: async (childId: string, amount: number) => {},
  };
  
  // Transaction operations
  async transactions = {
    create: async (data: any) => ({ 
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      ...data 
    }),
    list: async (options: { childId: string; limit: number; offset: number }) => [],
    sumByType: async (childId: string, type: string) => 0,
  };
  
  // Allowance operations
  async allowance = {
    create: async (data: any) => ({ 
      id: 'allow_' + Math.random().toString(36).substr(2, 9),
      isActive: true,
      ...data 
    }),
    findPending: async () => [],
    update: async (id: string, data: any) => ({ id, ...data }),
  };
}

export default Database;
