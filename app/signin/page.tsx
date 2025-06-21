"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      router.push("/dashboard");
    } catch (error) {
      setError(
        (error instanceof Error && error.message) ||
          "An error occurred during sign-in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden md:flex items-center">
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">Sign In</h1>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please enter your email"
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 cursor-pointer"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
        <div className="w-full md:w-1/2 p-8 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            Demo Login Credentials
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-1">
                <strong className="text-blue-700">For Admin:</strong>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> admin@example.com
              </p>
              <p className="text-sm text-gray-600">
                <strong>Password:</strong> password123
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-1">
                <strong className="text-green-700">For User:</strong>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> user@example.com
              </p>
              <p className="text-sm text-gray-600">
                <strong>Password:</strong> password123
              </p>
            </div>
          </div>
          <p className="mt-6 text-xs text-center text-gray-500">
            You can use these credentials to test the sign-in functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
