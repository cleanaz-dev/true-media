"use client";

import { useState } from "react";
// Import your better-auth client (adjust the path to where your auth client is configured)
// import { signIn } from "@/lib/auth-client"; 

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Better-Auth email sign in example
      /*
      const { data, error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Failed to sign in");
        return;
      }
      
      // Success! Redirect to dashboard
      window.location.href = "/dashboard";
      */
      
      // Temporary mock timeout for UI testing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Signing in with:", email, password);
      
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-white">
      {/* Brand Section (Left Side - Hidden on Mobile) */}
      <section className="hidden w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white lg:flex relative overflow-hidden">
        {/* Optional background image or pattern could go here */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950 opacity-80" />
        
        <div className="relative z-10 flex items-center gap-2">
          {/* Replace with your actual logo */}
          <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold text-xl">
            T
          </div>
          <span className="text-xl font-semibold tracking-tight">True Media</span>
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              "This platform has completely transformed how we manage our studio bookings. Everything is seamless and completely automated."
            </p>
            <footer className="text-sm text-zinc-400">
              Sofia Davis &mdash; Studio Manager
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Login Section (Right Side - Full width on Mobile) */}
      <section className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 sm:px-16 md:px-24">
        <div className="mx-auto w-full max-w-sm">
          
          {/* Mobile Header (Only shows on mobile since brand section is hidden) */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center font-bold">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">True Media</span>
          </div>

          <div className="flex flex-col space-y-2 text-left mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500">
              Enter your email and password to sign in to your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                  Password
                </label>
                <a href="#" className="text-xs text-zinc-500 hover:text-black">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <a href="/register" className="font-semibold text-black hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}