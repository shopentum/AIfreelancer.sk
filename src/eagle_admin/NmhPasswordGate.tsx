"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

const SESSION_KEY = "nmh_access_granted";
const ACCESS_KEY = "nmh2026";

interface Props {
  children: React.ReactNode;
}

export default function NmhPasswordGate({ children }: Props) {
  const [granted, setGranted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored === "1") setGranted(true);
    }
    setChecked(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === ACCESS_KEY) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setGranted(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (!checked) return null;
  if (granted) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F2F5]">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2C5282]/10">
            <ShieldAlert size={24} className="text-[#2C5282]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            EAGLE <span className="font-normal text-gray-400">Admin</span>
          </h1>
          <p className="text-center text-xs text-gray-500 leading-relaxed">
            Toto je interný prototyp pre NMH.<br />
            Pre prístup zadajte heslo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              placeholder="Heslo"
              className={[
                "w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition-all",
                error
                  ? "border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#2C5282] focus:ring-1 focus:ring-[#2C5282]",
              ].join(" ")}
            />
            {error && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                Nesprávne heslo. Skúste znova.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#2C5282] py-3 text-sm font-bold text-white transition-colors hover:bg-[#2B4F8F]"
          >
            Vstúpiť
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-gray-400">
          Prístup len pre autorizovaných používateľov NMH demo session.
        </p>
      </div>
    </div>
  );
}
