'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

type ResetPasswordInputs = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordPage = () => {
  const form = useForm<ResetPasswordInputs>({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const [apiMessage, setApiMessage] = React.useState<string | null>(null);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const router = useRouter()
  const onSubmit = async (data: ResetPasswordInputs) => {
    setApiMessage(null);
    setApiError(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (!token) {
        setApiError('Missing token.');
        return;
      }
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password, confirmPassword: data.confirmPassword, token }),
      });
      const result = await res.json();
      if (!res.ok) {
        setApiError(result.error || 'Something went wrong.');
        return;
      }
      setApiMessage(result.message || 'Password has been reset!');
      setIsSuccess(true);
      router.push('/login')
    } catch (err: any) {
      setApiError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        >
          {apiMessage && (
            <div className="text-green-600 text-sm mb-4 text-center">{apiMessage}</div>
          )}
          {apiError && (
            <div className="text-red-500 text-sm mb-4 text-center">{apiError}</div>
          )}
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
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
                    placeholder="New Password"
                    preicon={<Lock className="w-5 h-5 text-muted-foreground" />}
                    error={!!form.formState.errors.password}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    type="password"
                    placeholder="Confirm Password"
                    preicon={<Lock className="w-5 h-5 text-muted-foreground" />}
                    error={!!form.formState.errors.confirmPassword}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting || isSuccess} size={"lg"}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
