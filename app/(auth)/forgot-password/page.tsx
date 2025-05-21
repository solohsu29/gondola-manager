'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Mail } from 'lucide-react';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

type ForgotPasswordInputs = {
  email: string;
};

const ForgotPasswordPage = () => {
  const form = useForm<ForgotPasswordInputs>({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const [apiMessage, setApiMessage] = React.useState<string | null>(null);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const onSubmit = async (data: ForgotPasswordInputs) => {
    setApiMessage(null);
    setApiError(null);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setApiError(result.error || 'Something went wrong.');
        return;
      }
      setApiMessage(result.message || 'If this email exists, a reset link has been sent.');
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
          <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Email"
                    preicon={<Mail className="w-5 h-5 text-muted-foreground" />}
                    error={!!form.formState.errors.email}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting} size={"lg"}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;
