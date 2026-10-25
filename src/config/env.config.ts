// ใช้ || แทน ?? เพื่อให้ค่าว่างใน .env (เช่น NEXT_PUBLIC_APP_NAME=) ใช้ค่า default ด้วย
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Expense Tracker';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Track your income and expenses in one place';
