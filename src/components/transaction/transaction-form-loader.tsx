import TransactionForm from '@/components/transaction/transaction-form';
import { TRANSACTION_TYPE } from '@/constants/transaction.constant';
import {
  createTransaction,
  updateTransaction
} from '@/lib/actions/transaction.action';
import {
  fetchCategoryByType,
  fetchTransactionById
} from '@/lib/datas/transaction.data';
import { notFound } from 'next/navigation';

type TransactionFormLoader = {
  id?: string;
  mode: 'create' | 'edit' | 'duplicate';
};

export default async function TransactionFormLoader({
  id,
  mode
}: TransactionFormLoader) {
  const [incomes, expenses, transaction] = await Promise.all([
    fetchCategoryByType(TRANSACTION_TYPE.INCOME),
    fetchCategoryByType(TRANSACTION_TYPE.EXPENSE),
    id ? fetchTransactionById(id) : null
  ]);

  if (id && !transaction) {
    notFound();
  }

  if (transaction) {
    if (mode === 'duplicate') {
      return (
        <TransactionForm
          mode="duplicate"
          action={createTransaction}
          incomes={incomes}
          expenses={expenses}
          transaction={{
            ...transaction,
            amount: transaction.amount.toFixed(2)
          }}
        />
      );
    }

    return (
      <TransactionForm
        mode="edit"
        action={updateTransaction}
        incomes={incomes}
        expenses={expenses}
        transaction={{ ...transaction, amount: transaction.amount.toFixed(2) }}
      />
    );
  }

  return (
    <TransactionForm
      mode="create"
      incomes={incomes}
      expenses={expenses}
      action={createTransaction}
    />
  );
}
