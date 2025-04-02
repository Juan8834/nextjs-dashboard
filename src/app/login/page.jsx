'use client'; 
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import AcmeLogo from '@/app/ui/acme-logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Prevent automatic redirect
    });

    setIsLoading(false);

    if (result.error) {
      setError('Invalid email or password');
    } else {
      // On successful login, redirect to the dashboard
      window.location.href = '/ui/dashboard'; // Change this if you want a different route
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className={`w-full py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-md`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* 🔹 Demo Login Info Box */}
        <div className="mt-4 p-3 border border-gray-300 rounded-md text-sm bg-gray-50">
          <p className="font-semibold">Try the Demo Account:</p>
          <p><strong>Email:</strong> demo@example.com</p>
          <p><strong>Password:</strong> DemoPassword123</p>
        </div>
      </div>
    </main>
  );
}
