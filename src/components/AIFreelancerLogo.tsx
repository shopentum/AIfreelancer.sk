"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LogoProps {
  size?: number;
  className?: string;
  variant?: "dark" | "light";
  showText?: boolean;
}

const LOGO_ANIM_STORAGE_KEY = "logo-animated";
const LOGO_INTRO_MS = 2500;

export const AIFreelancerLogo: React.FC<LogoProps> = ({
  size = 40,
  className = "",
  variant = "light",
  showText = true,
}) => {
  const textColor = variant === "light" ? "text-white" : "text-slate-900";
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const skipIntro =
    hydrated && typeof window !== "undefined" && !!sessionStorage.getItem(LOGO_ANIM_STORAGE_KEY);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    if (sessionStorage.getItem(LOGO_ANIM_STORAGE_KEY)) return;
    const id = window.setTimeout(() => {
      sessionStorage.setItem(LOGO_ANIM_STORAGE_KEY, "true");
    }, LOGO_INTRO_MS);
    return () => window.clearTimeout(id);
  }, [hydrated]);

  return (
    <div className={`flex items-center gap-3 ${className} shrink-0`} style={{ width: "fit-content" }}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="1"
            className={variant === "light" ? "text-white/10" : "text-slate-900/10"}
            initial={skipIntro ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <motion.path
            d="M50 20L80 80H65L50 50L35 80H20L50 20Z"
            fill="url(#ai_grad_1)"
            initial={skipIntro ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />

          <motion.circle
            cx="50"
            cy="45"
            r="8"
            fill="#32317D"
            stroke="#6366F1"
            strokeWidth="2"
            initial={skipIntro ? { scale: 1 } : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.6,
            }}
          />

          <motion.path
            d="M50 45L80 80"
            stroke="#6366F1"
            strokeWidth="2"
            strokeLinecap="round"
            initial={skipIntro ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
          <motion.path
            d="M50 45L20 80"
            stroke="#6366F1"
            strokeWidth="2"
            strokeLinecap="round"
            initial={skipIntro ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />

          <motion.circle
            cx="80"
            cy="80"
            r="3"
            fill="#818CF8"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="20"
            cy="80"
            r="3"
            fill="#818CF8"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />

          <defs>
            <linearGradient id="ai_grad_1" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#312E81" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <motion.span
          className={`font-sora font-black tracking-tighter uppercase ${textColor}`}
          style={{ fontSize: size * 0.45 }}
          initial={skipIntro ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          aifreelancer.sk
        </motion.span>
      )}
    </div>
  );
};
