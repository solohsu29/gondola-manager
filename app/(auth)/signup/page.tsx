'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useUserInfo } from '@/components/hooks/useUserInfo';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const router = useRouter();
  const { storeUserInfo, storeToken } = useUserInfo();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [showVerifyMessage, setShowVerifyMessage] = React.useState(false);
  const form = useForm<SignupFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SignupFormInputs) => {
    setApiError(null);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setApiError(result.error || 'Signup failed.');
        return;
      }
      setShowVerifyMessage(true); // Show message to check email
      // Do not redirect to dashboard until email is verified
    } catch (err: any) {
      setApiError(err.message || 'Signup failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {showVerifyMessage ? (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-6">Check your email</h2>
          <p className="mb-4">We've sent a verification link to your email address. Please verify your email to complete registration and access your dashboard.</p>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded shadow-md w-full max-w-sm"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Name"
                      preicon={<UserIcon className="w-5 h-5 text-muted-foreground" />}
                      error={!!form.formState.errors.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
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
            <Button type="submit" className="w-full" disabled={isSubmitting} size={"lg"}>
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </Button>
            {apiError && (
              <div className="text-red-500 text-sm mt-2 text-center">{apiError}</div>
            )}
          </form>
        </Form>
      )}
    </div>
  );
};

export default SignupPage;
