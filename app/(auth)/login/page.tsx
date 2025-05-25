'use client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUserInfo } from '@/components/hooks/useUserInfo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { user } = useUserInfo(); // if you want to check loading or user state
  const form = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const [apiError, setApiError] = React.useState<string | null>(null);
  const onSubmit = async (data: LoginFormInputs) => {
    setApiError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setApiError(result.error || 'Login failed.');
        return;
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      setApiError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        >
          {apiError && (
            <div className="text-red-500 text-sm mb-4 text-center">{apiError}</div>
          )}
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    error={!!form.formState.errors.email}
                    placeholder="Email"
                    preicon={<Mail className="w-5 h-5 text-muted-foreground" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    type="password"
                    error={!!form.formState.errors.password}
                    placeholder="Password"
                    preicon={<Lock className="w-5 h-5 text-muted-foreground" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Remember me checkbox */}
          <div className="flex items-center justify-between mb-6">
            <Checkbox id="rememberMe" label="Remember me" />
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting} size={"lg"}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          {/* Create account link */}
          <div className="mt-4 text-center">
            <span className="text-sm">Don't have an account? </span>
            <Link href="/signup" className="text-sm text-primary hover:underline">Create account</Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
