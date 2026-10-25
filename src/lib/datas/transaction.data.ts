import { TRANSACTION_TYPE } from '@/constants/transaction.constant';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';

export async function fetchCategory() {
  return prisma.category.findMany({
    orderBy: [{ sequence: 'desc' }, { name: 'asc' }]
  });
}

export function fetchCategoryByType(
  type: (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]
) {
  return prisma.category.findMany({
    orderBy: [{ sequence: 'desc' }, { name: 'asc' }],
    where: { type }
  });
}

export async function fetchTransaction() {
  const session = await auth();

  if (!session || !session.user || !session.user.id)
    throw new Error('Session not found');

  return prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    include: {
      category: {
        select: { image: true, type: true }
      }
    }
  });
}

export async function fetchTransactionById(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    throw new Error('Session not found');

  return prisma.transaction.findUnique({
    where: { id, userId: session.user.id },
    include: {
      category: {
        select: { type: true, id: true }
      }
    }
  });
}
