"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client"; 

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Better-Auth email sign up example
      
      const { data, error } = await signUp.email({
        email,
        password,
        name,
        phone
      });

      if (error) {
        setError(error.message || "Failed to create account");
        return;
      }
      
      // Success! Redirect to dashboard or login
      window.location.href = "/booking";
      
      
      // Temporary mock timeout for UI testing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Registering with:", { name, email, phone, password });
      
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
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-zinc-950 opacity-80" />
        
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
              "Booking studio time has never been easier. The tenant dashboard gives us full control over our schedule and payments."
            </p>
            <footer className="text-sm text-zinc-400">
              Marcus Chen &mdash; Producer
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Register Section (Right Side - Full width on Mobile) */}
      <section className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 sm:px-16 md:px-24">
        <div className="mx-auto w-full max-w-sm">
          
          {/* Mobile Header */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center font-bold">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">True Media</span>
          </div>

          <div className="flex flex-col space-y-2 text-left mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Create an account
            </h1>
            <p className="text-sm text-zinc-500">
              Enter your details below to create your tenant account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-zinc-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

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
              <label htmlFor="phone" className="text-sm font-medium text-zinc-700">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Password
              </label>
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
              className="mt-2 w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <a href="/sign-in" className="font-semibold text-black hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}