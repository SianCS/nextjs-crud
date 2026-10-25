import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ROUTE } from '@/constants/route';
import { deleteTransaction } from '@/lib/actions/transaction.action';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';

export default function TransactionItemAction({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="focus-visible:ring-0">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-20">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ROUTE.DUPLICATE_TRANSACTION(id)}>Duplicate</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ROUTE.EDIT_TRANSACTION(id)}>Edit</Link>
        </DropdownMenuItem>
        {/* ให้ทั้งแถวเมนูเป็นปุ่ม submit กดตรงไหนของแถว (หรือกด Enter) ก็ลบได้ */}
        <form action={deleteTransaction.bind(null, id)}>
          <DropdownMenuItem asChild className="cursor-pointer w-full">
            <button type="submit">Delete</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
