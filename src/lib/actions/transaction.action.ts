'use server';

import { ROUTE } from '@/constants/route';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { transactionFormSchema } from '@/lib/schemas/transaction.schema';
import { ActionResult } from '@/types/action-result.type';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Server Action เป็น endpoint ที่ใครก็ POST เรียกได้ จึงต้องเช็ค session และเจ้าของข้อมูลที่ฝั่ง server ทุกครั้ง
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Session not found');
  return session.user.id;
}

// ตรวจข้อมูลฟอร์ม และเช็คว่า category ตรงกับประเภท (รายรับ/รายจ่าย) ที่เลือก
async function parseTransactionInput(input: unknown) {
  const { data, success } = transactionFormSchema.safeParse(input);
  if (!success) throw new Error('Validation Error');

  const { type, ...transaction } = data;
  const category = await prisma.category.findUnique({
    where: { id: transaction.categoryId }
  });
  if (!category || category.type !== type)
    throw new Error('Category does not match transaction type');

  return transaction;
}

export async function createTransaction(input: unknown): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const data = await parseTransactionInput(input);

    await prisma.transaction.create({ data: { ...data, userId } });
    revalidatePath(ROUTE.TRANSACTION);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
  redirect(ROUTE.TRANSACTION);
}

export async function deleteTransaction(id: string) {
  const userId = await requireUserId();

  // ใส่ userId ใน where ด้วย ถ้า id เป็นของคนอื่นจะไม่มีอะไรถูกลบ
  await prisma.transaction.deleteMany({ where: { id, userId } });
  revalidatePath(ROUTE.TRANSACTION);
}

export async function updateTransaction(
  id: string,
  input: unknown
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const data = await parseTransactionInput(input);

    const { count } = await prisma.transaction.updateMany({
      data,
      where: { id, userId }
    });
    if (count === 0) throw new Error('Transaction with this id was not found');
    revalidatePath(ROUTE.TRANSACTION);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
  redirect(ROUTE.TRANSACTION);
}
