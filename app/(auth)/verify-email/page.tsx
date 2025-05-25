
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (!token) return;
      const res = await fetch(`/api/verify-email?token=${token}`);
      if (res.redirected) {
        // If backend redirects, follow it
        window.location.href = res.url;
        return;
      }
      const data = await res.json();
      if (res.ok) {
        router.push('/login');
      } else {
        alert(data.error || 'Verification failed.');
      }
    };
    verify();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-6">Verifying Email…</h2>
        <p className="mb-4">Please wait while we verify your email.</p>
      </div>
    </div>
  );
}
