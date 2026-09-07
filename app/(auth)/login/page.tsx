"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ParticleBackground } from "@/components/particle-background";
import { PixelButton } from "@/components/pixel-button";
import { PixelInput } from "@/components/pixel-input";
import { Logo } from "@/components/logo";
import { useGame } from "@/lib/game-context";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { setPlayer, player } = useGame();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);

    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    setPlayer({ ...player, username: storedUser.name });
    router.push("/intro");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-souls-darker flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground theme="hell" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}>
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-souls-dark/80 border-4 border-souls-darker p-6 backdrop-blur-sm"
          style={{
            boxShadow: "8px 8px 0px rgba(0,0,0,0.5)",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}>
          <h2 className="font-mono text-xl text-souls-light mb-6 text-center uppercase tracking-wider">
            Enter the Gate
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <PixelInput
              type="email"
              label="Email"
              placeholder="warrior@code.souls"
              value={email}
              onChange={setEmail}
              required
            />

            <PixelInput
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              required
            />

            {error && (
              <motion.p
                className="text-red-400 font-mono text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <PixelButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2">
              {loading ? "Entering..." : "Login"}
            </PixelButton>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/signup"
              className="font-mono text-sm text-souls-light/60 hover:text-souls-red transition-colors">
              New warrior? <span className="underline">Create Account</span>
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-16 h-32 bg-souls-red/20 blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-16 h-32 bg-souls-red/20 blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: 1.5,
          }}
        />
      </motion.div>
    </div>
  );
}
