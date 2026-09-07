"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { HUD } from "@/components/hud";
import { ParticleBackground } from "@/components/particle-background";
import { PixelButton } from "@/components/pixel-button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { player } = useGame();
  const { logout } = useAuth();
  const router = useRouter();

  const getIQTitle = (iq: number) => {
    if (iq >= 146) return "Genius";
    if (iq >= 131) return "Expert";
    if (iq >= 111) return "Scholar";
    if (iq >= 96) return "Apprentice";
    return "Novice";
  };

  const stats = [
    { label: "Total Stages", value: 12, icon: "STAGE" },
    { label: "Total Stars", value: 28, icon: "STAR" },
    { label: "Bosses Defeated", value: 2, icon: "BOSS" },
    { label: "Perfect Stages", value: 8, icon: "PERFECT" },
    { label: "Current Streak", value: 5, icon: "FIRE" },
    { label: "Best Streak", value: 12, icon: "TROPHY" },
  ];

  const achievements = [
    { name: "First Blood", desc: "Complete your first stage", unlocked: true },
    {
      name: "Speed Demon",
      desc: "Beat a stage in under 3 minutes",
      unlocked: true,
    },
    { name: "Perfect Run", desc: "Get 3 stars on a stage", unlocked: true },
    { name: "Boss Slayer", desc: "Defeat your first boss", unlocked: true },
    { name: "World Conqueror", desc: "Complete World 1", unlocked: false },
    { name: "Code Master", desc: "Reach IQ 120", unlocked: false },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-souls-darker relative">
      <ParticleBackground theme="hell" />

      {/* HUD */}
      <HUD />

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            className="bg-souls-dark border-4 border-souls-darker p-6 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div
                className="w-24 h-24 border-4 border-souls-red overflow-hidden"
                style={{ imageRendering: "pixelated" }}>
                <img
                  src={player.avatar || "/placeholder.svg?height=96&width=96"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-mono text-2xl text-souls-light uppercase">
                  {player.username}
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2">
                  <span className="px-3 py-1 bg-souls-red text-souls-light font-mono text-sm uppercase">
                    {getIQTitle(player.iq)}
                  </span>
                  <span className="font-mono text-sm text-souls-light/60">
                    IQ: {player.iq}
                  </span>
                  <span className="font-mono text-sm text-souls-light/60">
                    Level: {player.level}
                  </span>
                </div>
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-yellow-900">
                    G
                  </div>

                  <span className="font-mono text-souls-gold">
                    {Number(player.gold ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-cyan-400 rotate-45 flex items-center justify-center">
                    <span className="-rotate-45 text-xs font-bold text-cyan-900">
                      D
                    </span>
                  </div>
                  <span className="font-mono text-lg text-cyan-400">
                    {player.diamonds}
                  </span>
                </div>
              </div>
            </div>

            {/* HP/IQ Bars */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-xs text-souls-light/60">
                    Health
                  </span>
                  <span className="font-mono text-xs text-souls-light/60">
                    {player.hp}/{player.maxHp}
                  </span>
                </div>
                <div className="h-4 bg-souls-darker border border-souls-darker">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-xs text-souls-light/60">
                    IQ Progress
                  </span>
                  <span className="font-mono text-xs text-souls-light/60">
                    {player.iq}/160
                  </span>
                </div>
                <div className="h-4 bg-souls-darker border border-souls-darker">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((player.iq - 85) / (160 - 85)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-souls-dark border-2 border-souls-darker p-4 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}>
                <span className="font-mono text-2xl text-souls-light">
                  {stat.value}
                </span>
                <p className="font-mono text-xs text-souls-light/60 mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="bg-souls-dark border-4 border-souls-darker p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}>
            <h2 className="font-mono text-xl text-souls-light uppercase mb-4">
              Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  className={`p-3 border-2 flex items-center gap-3 ${
                    achievement.unlocked
                      ? "border-souls-gold bg-souls-gold/10"
                      : "border-souls-darker bg-souls-darker/50 opacity-50"
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: achievement.unlocked ? 1 : 0.5 }}
                  transition={{ delay: 0.5 + index * 0.05 }}>
                  <div
                    className={`w-10 h-10 flex items-center justify-center ${
                      achievement.unlocked
                        ? "bg-souls-gold text-souls-darker"
                        : "bg-souls-dark text-souls-light/30"
                    }`}>
                    <span className="text-lg">
                      {achievement.unlocked ? "ACH" : "?"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-mono text-sm text-souls-light">
                      {achievement.name}
                    </h3>
                    <p className="font-mono text-xs text-souls-light/60">
                      {achievement.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="mt-6 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}>
            <PixelButton
              variant="secondary"
              onClick={() => router.push("/world/1")}>
              Back to Game
            </PixelButton>
            <PixelButton variant="danger" onClick={handleLogout}>
              Logout
            </PixelButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
