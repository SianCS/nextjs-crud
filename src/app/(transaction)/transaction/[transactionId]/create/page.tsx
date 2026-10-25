import TransactionFormLoader from '@/components/transaction/transaction-form-loader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Transaction'
};

type DuplicateTransactionPageProps = {
  params: Promise<{ transactionId: string }>;
};

export default async function DuplicateTransactionPage({
  params
}: DuplicateTransactionPageProps) {
  const { transactionId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create transaction</CardTitle>
        <CardDescription>
          Fill out the form to create a new transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionFormLoader id={transactionId} mode="duplicate" />
      </CardContent>
    </Card>
  );
}
