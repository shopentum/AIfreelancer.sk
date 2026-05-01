"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppState } from "@/cashflow/types/finance";
import { loadAppState, saveAppState } from "@/cashflow/services/storageService";
import { createDefaultAppState } from "@/cashflow/state/defaultState";
import { runCashflowEngine } from "@/cashflow/services/cashflowEngine";
import { formatMoneyEUR } from "@/cashflow/utils/moneyUtils";

export function CashflowShell() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  const persist = useCallback((next: AppState) => {
    setState(next);
    saveAppState(next);
  }, []);

  if (state === null) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-6 text-zinc-400">
        Načítavam…
      </div>
    );
  }

  const engine = runCashflowEngine(state, 30);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          OMEGA · osobný cashflow
        </p>
        <h1 className="text-2xl font-semibold text-zinc-100">Prehľad</h1>
        <p className="text-sm text-zinc-400">
          Modul je oddelený od zvyšku webu. Dáta ostávajú len v tomto prehliadači.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-lg shadow-black/40">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-zinc-400">Aktuálny zostatok (EUR)</span>
          <input
            type="number"
            step="0.01"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={state.settings.currentBalance}
            onChange={(e) => {
              const v = Number(e.target.value);
              persist({
                ...state,
                settings: {
                  ...state.settings,
                  currentBalance: Number.isFinite(v) ? v : 0,
                },
              });
            }}
          />
        </label>
        <label className="mt-4 flex flex-col gap-2 text-sm">
          <span className="text-zinc-400">Bezpečná rezerva (EUR)</span>
          <input
            type="number"
            step="0.01"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={state.settings.safetyBuffer}
            onChange={(e) => {
              const v = Number(e.target.value);
              persist({
                ...state,
                settings: {
                  ...state.settings,
                  safetyBuffer: Number.isFinite(v) ? v : 0,
                },
              });
            }}
          />
        </label>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-sm font-medium text-zinc-300">Stav (stub engine)</h2>
        <dl className="mt-3 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
          <div>
            <dt>Dostupné (30 dní)</dt>
            <dd className="text-lg font-medium text-zinc-100">
              {formatMoneyEUR(engine.summary30.availableCash)}
            </dd>
          </div>
          <div>
            <dt>Po pláne</dt>
            <dd className="text-lg font-medium text-zinc-100">
              {formatMoneyEUR(engine.summary30.remainingAfterPlannedPayments)}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <button
          type="button"
          className="rounded-lg border border-zinc-600 px-4 py-2 text-zinc-200 hover:bg-zinc-800/80"
          onClick={() => persist(createDefaultAppState())}
        >
          Reset lokálnych dát
        </button>
      </div>
    </div>
  );
}
