"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    // Auto sign in
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center shadow-glow mx-auto mb-4">
            <span className="text-2xl">✦</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-800 mb-2">ASCEND</h1>
          <p className="text-gray-500 text-sm tracking-wide">Begin your ascent today</p>
        </div>

        <div className="card p-8">
          <h2 className="font-display text-2xl font-semibold text-gray-800 mb-1">Create account</h2>
          <p className="text-gray-500 text-sm mb-7">Your life operating system awaits.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-coral-400 transition-colors"
                placeholder="Radhika"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-coral-400 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-coral-400 transition-colors"
                placeholder="Min 8 characters"
                minLength={8}
                required
              />
            </div>

            {error && (
              <p className="text-coral-500 text-sm bg-coral-50 px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-400 text-white font-medium text-sm flex items-center justify-center gap-2 hover:shadow-glow transition-all duration-300 disabled:opacity-60 mt-2"
            >
              {loading ? <span className="animate-pulse">Creating account...</span> : <>Start ascending <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-coral-500 hover:text-coral-600 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
