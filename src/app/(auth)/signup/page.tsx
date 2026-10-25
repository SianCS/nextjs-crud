import SignUpForm from '@/components/auth/signup-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ROUTE } from '@/constants/route';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign Up'
};

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create new account</CardTitle>
        <CardDescription>Get Started - It&apos;s free</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <div className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link
            href={ROUTE.SIGN_IN}
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
