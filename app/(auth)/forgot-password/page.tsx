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

  const onSubmit = async (data: ForgotPasswordInputs) => {
    // Example: Replace with real forgot password logic
    alert('Password reset link sent to ' + data.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormControl>
                  <Input
                    {...field}
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
