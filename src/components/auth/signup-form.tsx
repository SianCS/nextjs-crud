'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignUpFormInput } from '@/types/auth.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpFormSchema } from '@/lib/schemas/auth.schema';
import { useTransition } from 'react';
import { signUpWithCredentials } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/constants/route';
import { Loader2 } from 'lucide-react';

export default function SignUpForm() {
  const form = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: '', password: '', firstName: '', lastName: '' }
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpFormInput> = data => {
    startTransition(async () => {
      try {
        const res = await signUpWithCredentials(data);
        if (!res.success) {
          const emailError = res.details?.email;
          if (typeof emailError === 'string') {
            form.setError('email', { message: emailError });
          } else {
            toast.error(res.message);
          }
        } else {
          toast.success('Account has been created');
          router.push(ROUTE.SIGN_IN);
        }
      } catch {
        toast.error('Something went wrong');
      }
    });
  };

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your first name" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your last name" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}
