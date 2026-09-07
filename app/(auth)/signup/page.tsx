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

export default function SignupPage() {
  const router = useRouter();
  const { setPlayer, player } = useGame();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const result = signup(name, email, password);
    if (!result.ok) {
      setErrors({ general: result.error });
      setLoading(false);
      return;
    }

    setPlayer({ ...player, username: name.trim() });
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
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* Signup Form */}
        <motion.div
          className="bg-souls-dark/80 border-4 border-souls-darker p-6 backdrop-blur-sm"
          style={{
            boxShadow: "8px 8px 0px rgba(0,0,0,0.5)",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}>
          <h2 className="font-mono text-xl text-souls-light mb-6 text-center uppercase tracking-wider">
            Begin Your Journey
          </h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {errors.general && (
              <motion.p
                className="text-red-400 font-mono text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                {errors.general}
              </motion.p>
            )}

            <PixelInput
              type="text"
              label="Name"
              placeholder="CodeWarrior"
              value={name}
              onChange={setName}
              error={errors.name}
            />

            <PixelInput
              type="email"
              label="Email"
              placeholder="warrior@code.souls"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />

            <PixelInput
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              error={errors.password}
            />

            <PixelInput
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
            />

            <PixelButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2">
              {loading ? "Creating..." : "Create Account"}
            </PixelButton>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="font-mono text-sm text-souls-light/60 hover:text-souls-red transition-colors">
              Already a warrior? <span className="underline">Login</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
