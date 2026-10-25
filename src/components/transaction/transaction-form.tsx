"use client";

import DatePicker from "@/components/shared/date-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTE } from "@/constants/route";
import { TRANSACTION_TYPE } from "@/constants/transaction.constant";
import { Category, TransactionType } from "@/generated/prisma";
import { transactionFormSchema } from "@/lib/schemas/transaction.schema";
import { ActionResult } from "@/types/action-result.type";
import { TransactionFormInput } from "@/types/transaction.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Transaction = {
  id: string;
  payee: string;
  date: Date;
  amount: string;
  category: {
    id: string;
    type: TransactionType;
  };
};

type EditMode = {
  mode: "edit";
  action: (id: string, input: unknown) => Promise<ActionResult>;
  transaction: Transaction;
};

type CreateMode = {
  mode: "create";
  action: (input: unknown) => Promise<ActionResult>;
};

type DuplicateMode = {
  mode: "duplicate";
  action: (input: unknown) => Promise<ActionResult>;
  transaction: Transaction;
};

type TransactionFormProps = {
  incomes: Category[];
  expenses: Category[];
} & (CreateMode | EditMode | DuplicateMode);

export default function TransactionForm(props: TransactionFormProps) {
  const { incomes, expenses, mode, action } = props;

  let transaction: Transaction | undefined;

  if (mode !== "create") {
    transaction = props.transaction;
  }

  const form = useForm<TransactionFormInput>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: transaction?.amount ?? "",
      date: transaction?.date ?? new Date(),
      payee: transaction?.payee ?? "",
      type: transaction?.category?.type ?? TRANSACTION_TYPE.EXPENSE,
      categoryId: transaction?.category?.id ?? expenses?.[0]?.id ?? "",
    },
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    if (selectedType === TRANSACTION_TYPE.EXPENSE) {
      form.setValue(
        "categoryId",
        transaction?.category?.type === TRANSACTION_TYPE.EXPENSE
          ? transaction.category.id
          : (expenses?.[0]?.id ?? ""),
      );
    } else {
      form.setValue(
        "categoryId",
        transaction?.category?.type === TRANSACTION_TYPE.INCOME
          ? transaction.category.id
          : (incomes?.[0]?.id ?? ""),
      );
    }
  }, [selectedType]);

  const categories =
    selectedType === TRANSACTION_TYPE.EXPENSE ? expenses : incomes;

  const onSubmit: SubmitHandler<TransactionFormInput> = async (data) => {
    const successMessage =
      mode === "edit"
        ? "Updated transaction successfully"
        : "Created transaction successfully";

    try {
      if (mode === "edit") {
        await action(props.transaction.id, data);
      } else {
        await action(data);
      }
      toast.success(successMessage);
    } catch (error) {
      // action สำเร็จจะ redirect กลับหน้ารายการ ซึ่ง Next.js ส่งมาในรูป error
      if (isRedirectError(error)) toast.success(successMessage);
      else toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-xs">Transaction Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className="flex gap-0"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value={TRANSACTION_TYPE.EXPENSE}
                        className="hidden"
                      />
                    </FormControl>
                    <FormLabel>
                      <Button
                        asChild
                        className="w-24 rounded-r-none border-r-0 cursor-pointer"
                        variant={
                          field.value === TRANSACTION_TYPE.EXPENSE
                            ? "default"
                            : "outline"
                        }
                      >
                        <span>Expense</span>
                      </Button>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value={TRANSACTION_TYPE.INCOME}
                        className="hidden"
                      />
                    </FormControl>
                    <FormLabel>
                      <Button
                        asChild
                        className="w-24 rounded-l-none cursor-pointer"
                        variant={
                          field.value === TRANSACTION_TYPE.INCOME
                            ? "default"
                            : "outline"
                        }
                      >
                        <span>Income</span>
                      </Button>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Payee</FormLabel>
              <FormControl>
                <Input placeholder="Enter a payee" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Transaction Date</FormLabel>
              <DatePicker field={field} placeholder="Pick a transaction date" />
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((el) => (
                    <SelectItem key={el.id} value={el.id}>
                      {el.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Amount</FormLabel>
              <FormControl>
                <Input placeholder="Enter an amount" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex gap-6">
          <Button className="w-30">Create</Button>
          <Button variant="outline" className="w-30" asChild>
            <Link href={ROUTE.TRANSACTION}>Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
