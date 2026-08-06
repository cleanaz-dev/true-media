"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

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
      const { data, error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Failed to sign in");
        return;
      }

      const hrefPath = data?.user?.role === "ADMIN" ? "/admin" : "/rooms";
      window.location.href = hrefPath;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/rooms", // where to send them after login
      });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-white">
      {/* Brand Section (Left Side - Hidden on Mobile) */}
      <section
        className="hidden w-1/2 flex-col justify-between p-12 text-white lg:flex relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/new-logo-white-text.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950 opacity-80" />

        <div className="relative z-10 flex items-center gap-2">
          {/* <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold text-xl">
            T
          </div>
          <span className="text-xl font-semibold tracking-tight">
            True Media
          </span> */}
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              "This platform has completely transformed how we manage our studio
              bookings. Everything is seamless and completely automated."
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
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center font-bold">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              True Media
            </span>
          </div>

          <div className="flex flex-col space-y-2 text-left mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500">
              Enter your email and password to sign in to your account.
            </p>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-400">OR</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700"
              >
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
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-700"
                >
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
              <div className="text-sm text-red-500 font-medium">{error}</div>
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
            <a
              href="/register"
              className="font-semibold text-black hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}