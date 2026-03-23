"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AIFreelancerLogo } from "./AIFreelancerLogo";

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("app-loaded");
    if (hasLoaded) {
      queueMicrotask(() => setShowLoader(false));
      return;
    }
    const timer = setTimeout(() => {
      setShowLoader(false);
      sessionStorage.setItem("app-loaded", "true");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-6">
              <AIFreelancerLogo size={80} showText={false} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <span className="text-white font-sora font-black text-2xl tracking-tighter uppercase">
                  aifreelancer.sk
                </span>
                <div className="w-48 h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="w-full h-full bg-indigo-500"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}

      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`route-overlay-${pathname}`}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[60] pointer-events-none bg-black"
        />
      </AnimatePresence>
    </>
  );
};
