"use client";

import React from "react";
import Link from "next/link";
import { AIFreelancerLogo } from "./AIFreelancerLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="opacity-100">
            <AIFreelancerLogo size={20} variant="light" />
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 text-center md:text-left">
            © 2026 AIfreelancer.sk | Built with Cursor
          </p>
        </div>

        <div className="flex items-center space-x-8">
          <Link
            href="/cookies"
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
          >
            Cookies
          </Link>
          <Link
            href="/gdpr"
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
          >
            GDPR
          </Link>
        </div>
      </div>

      <p className="mt-8 max-w-3xl mx-auto text-center text-[10px] sm:text-xs leading-relaxed text-slate-600 tracking-tight px-4">
        AI-native vývoj a decision intelligence riešenia pre firmy v celej SR.
      </p>
    </footer>
  );
};
