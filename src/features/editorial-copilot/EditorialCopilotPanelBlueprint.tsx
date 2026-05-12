"use client";

/**
 * Zjednodušený interaktívny blueprint pravého Copilot panelu.
 * Pixel-parita s EagleCMS je cieľom ďalšej extrakcie — tu sú layout, stavy a callbacks.
 */

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Globe,
  MousePointer2,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import type { ArticleAudit, Claim, SeoAuditKey } from "@/eagle_admin/geminiService";
import { cn } from "@/lib/utils";
import type {
  CopilotAuditTab,
  EditorialCopilotPanelCallbacks,
  EditorialCopilotPanelViewModel,
} from "./types";
import { findClaimById, isCopilotSeoKey } from "./types";

const SEO_LABEL: Record<SeoAuditKey, string> = {
  title: "Titulok",
  seoTitle: "SEO titulok",
  url: "Titulok pre URL",
  perex: "Perex",
};

function riskRing(risk: Claim["risk"]): string {
  if (risk === "high") return "border-l-rose-400 bg-rose-50/40";
  if (risk === "medium") return "border-l-amber-400 bg-amber-50/35";
  return "border-l-emerald-400 bg-emerald-50/35";
}

export interface EditorialCopilotPanelBlueprintProps {
  model: EditorialCopilotPanelViewModel;
  callbacks: EditorialCopilotPanelCallbacks;
}

export function EditorialCopilotPanelBlueprint({
  model,
  callbacks,
}: EditorialCopilotPanelBlueprintProps) {
  const {
    audit,
    isValidating,
    displayedScore,
    findingsProgress,
    activeAuditTab,
    selectedFindingId,
    sidebarBanner,
    assistantPriorities,
    claimAiProposal,
    claimAiProposalLoading,
    resolvedClaimDetail,
    seoAppliedKeys,
    ignoredSeoKeys,
    collaborationLocked,
    articleUndoDepth,
  } = model;

  const locked = collaborationLocked;

  const claimsForTab =
    activeAuditTab === "trust"
      ? audit?.claims ?? []
      : activeAuditTab === "linguistic"
        ? audit?.linguisticClaims ?? []
        : [];

  const selectedClaim =
    audit && selectedFindingId && !isCopilotSeoKey(selectedFindingId)
      ? findClaimById(audit, selectedFindingId)
      : undefined;

  const selectedSeoKey: SeoAuditKey | null =
    audit && selectedFindingId && isCopilotSeoKey(selectedFindingId)
      ? selectedFindingId
      : null;

  const showResolved =
    resolvedClaimDetail &&
    selectedFindingId === resolvedClaimDetail.claimId &&
    selectedClaim;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/90 px-4 pb-3 pt-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Pripravenosť článku
          </span>
          <span
            className={cn(
              "text-xs font-bold tabular-nums",
              displayedScore > 80
                ? "text-emerald-700"
                : displayedScore > 50
                  ? "text-amber-700"
                  : "text-red-700",
            )}
          >
            {displayedScore}%
          </span>
        </div>
        <div
          className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner ring-1 ring-slate-200/80"
          role="progressbar"
          aria-valuenow={displayedScore}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              displayedScore > 80
                ? "bg-emerald-500"
                : displayedScore > 50
                  ? "bg-amber-400"
                  : "bg-red-500",
            )}
            style={{ width: `${Math.min(100, displayedScore)}%` }}
          />
        </div>
        {findingsProgress ? (
          <p className="mt-2 text-[11px] text-slate-600">
            <span className="font-semibold tabular-nums text-slate-900">
              {findingsProgress.resolved}
            </span>
            <span className="tabular-nums text-slate-500">
              /{findingsProgress.total}
            </span>{" "}
            nálezov vyriešených
          </p>
        ) : null}
      </div>

      {assistantPriorities.length > 0 ? (
        <div className="border-b border-gray-100 bg-gradient-to-b from-purple-50/40 via-white to-white px-3 py-3">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.12em] text-gray-700">
            Odporúčané
          </p>
          <ul className="flex flex-col gap-2">
            {assistantPriorities.map((p, idx) => (
              <li key={p.rowKey}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => callbacks.onPriorityActivate(p.rowKey)}
                  className={cn(
                    "group w-full cursor-pointer rounded-lg border px-2.5 py-2 text-left text-[12px] font-bold shadow-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-purple-500",
                    locked && "cursor-not-allowed opacity-50",
                    p.done
                      ? "border-emerald-200/90 bg-emerald-50/85 ring-emerald-100"
                      : "border-gray-200/90 bg-white hover:border-purple-300 hover:bg-purple-50/90",
                  )}
                >
                  <div className="flex gap-2">
                    <span className="mt-0.5 shrink-0 tabular-nums text-[11px] font-bold text-gray-400">
                      {idx + 1}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span>{p.title}</span>
                        <ChevronRight
                          size={14}
                          className="mt-0.5 shrink-0 text-gray-400"
                          aria-hidden
                        />
                      </div>
                      <p className="mt-1 text-[11px] font-normal leading-snug text-gray-600">
                        {p.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex shrink-0 gap-1 border-b border-slate-300/90 bg-slate-200 px-2 pt-2">
        {(
          [
            ["trust", "Dôvera", ShieldAlert, audit?.claims.length ?? 0],
            [
              "linguistic",
              "Štýl",
              MousePointer2,
              audit?.linguisticClaims?.length ?? 0,
            ],
            [
              "seo",
              "SEO",
              Globe,
              audit
                ? Object.values(audit.seoAudit).filter(
                    (v) => v.status !== "pass",
                  ).length
                : 0,
            ],
          ] as const
        ).map(([id, label, Icon, count]) => (
          <button
            key={id}
            type="button"
            disabled={locked}
            onClick={() => callbacks.onAuditTabChange(id)}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-t-lg px-2 pb-3 pt-3 text-[9px] font-black uppercase tracking-widest outline-none transition-colors",
              activeAuditTab === id
                ? "z-[1] bg-white text-purple-700 shadow-md"
                : "text-slate-500 hover:bg-slate-300/45",
              locked && "cursor-not-allowed opacity-60",
            )}
          >
            <Icon size={20} className="shrink-0" />
            {label}
            {count > 0 ? (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[8px] font-black text-white">
                {count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="p-4">
        {sidebarBanner ? (
          <div className="mb-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-950">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={16} />
            <p>{sidebarBanner}</p>
          </div>
        ) : null}

        {!audit && !isValidating ? (
          <div className="space-y-4 py-16 text-center">
            <Sparkles className="mx-auto text-gray-300" size={32} />
            <p className="text-xs font-bold text-gray-400">
              Spustite audit pre analýzu
            </p>
            <button
              type="button"
              disabled={locked}
              onClick={() => callbacks.onValidate()}
              className={cn(
                "rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-purple-700",
                locked && "cursor-not-allowed bg-gray-300",
              )}
            >
              Validovať článok (mock)
            </button>
          </div>
        ) : null}

        {isValidating ? (
          <div className="flex flex-col items-center space-y-4 py-12">
            <RefreshCw className="animate-spin text-purple-600" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Analyzujem…
            </p>
          </div>
        ) : null}

        {audit && !isValidating ? (
          <>
            {selectedFindingId ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => callbacks.onClearFindingSelection()}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs font-bold text-gray-800 shadow-sm hover:border-purple-300 hover:bg-purple-50"
                  >
                    <ArrowLeft size={14} aria-hidden />
                    Späť
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      na zoznam
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={locked || articleUndoDepth <= 0}
                    onClick={() => callbacks.onUndoArticleSnapshot()}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-bold",
                      articleUndoDepth <= 0 || locked
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                        : "border-amber-200/90 bg-amber-50/80 text-amber-950 hover:bg-amber-50",
                    )}
                  >
                    <Undo2 size={14} aria-hidden />
                    Vrátiť úpravu článku ({articleUndoDepth})
                  </button>
                </div>

                {showResolved ? (
                  <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                    <div className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                          Vyriešené
                        </p>
                        <p className="text-sm font-semibold text-emerald-950">
                          {resolvedClaimDetail!.tab === "trust"
                            ? "Dôvera — úprava v článku"
                            : "Štýl — úprava v článku"}
                        </p>
                        <p className="mt-1 text-xs text-emerald-900/80">
                          {resolvedClaimDetail!.reason}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm">
                        <p className="mb-1 text-[10px] font-black uppercase text-gray-500">
                          Pred úpravou
                        </p>
                        {resolvedClaimDetail!.beforeText}
                      </div>
                      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-3 text-sm">
                        <p className="mb-1 text-[10px] font-black uppercase text-emerald-800">
                          Po úprave
                        </p>
                        {resolvedClaimDetail!.afterText}
                      </div>
                    </div>
                  </div>
                ) : null}

                {selectedClaim && !showResolved ? (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Citácia
                      </p>
                      <p className="text-sm font-semibold leading-relaxed text-slate-900">
                        „{selectedClaim.text}“
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Problém
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {selectedClaim.reason}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{selectedClaim.explanation}</p>
                    </div>
                    {claimAiProposal &&
                    claimAiProposal.claimId === selectedClaim.id ? (
                      <div className="space-y-2 rounded-2xl border border-purple-200/90 bg-purple-50/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-900">
                          AI návrh (náhrada textu)
                        </p>
                        <p className="text-sm leading-relaxed text-gray-900">
                          {claimAiProposal.proposedText}
                        </p>
                        <div className="flex flex-col gap-2 border-t border-purple-100 pt-3">
                          <button
                            type="button"
                            disabled={locked}
                            onClick={() =>
                              callbacks.onApplyClaimAiProposal(selectedClaim.id)
                            }
                            className="rounded-xl bg-purple-600 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:bg-gray-300"
                          >
                            Použiť návrh
                          </button>
                          <button
                            type="button"
                            disabled={locked}
                            onClick={() => callbacks.onIgnoreClaim(selectedClaim.id)}
                            className="flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                          >
                            <X size={13} /> Ignorovať
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          disabled={locked || claimAiProposalLoading}
                          onClick={() =>
                            callbacks.onRequestClaimAiProposal(selectedClaim.id)
                          }
                          className="rounded-xl bg-purple-600 py-3 text-xs font-bold text-white hover:bg-purple-700 disabled:bg-gray-300"
                        >
                          {claimAiProposalLoading ? (
                            <span className="inline-flex items-center gap-2">
                              <RefreshCw size={14} className="animate-spin" />
                              Pripravujem návrh…
                            </span>
                          ) : (
                            "Vyžiadať návrh od AI"
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={locked}
                          onClick={() => callbacks.onIgnoreClaim(selectedClaim.id)}
                          className="rounded-xl border py-2 text-xs font-bold text-gray-600"
                        >
                          Ignorovať nález
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}

                {selectedSeoKey && audit ? (
                  <SeoDetailBody
                    seoKey={selectedSeoKey}
                    audit={audit}
                    seoAppliedKeys={seoAppliedKeys}
                    ignoredSeoKeys={ignoredSeoKeys}
                    locked={locked}
                    callbacks={callbacks}
                  />
                ) : null}
              </div>
            ) : (
              <FindingListBody
                activeAuditTab={activeAuditTab}
                claims={claimsForTab}
                audit={audit}
                locked={locked}
                callbacks={callbacks}
              />
            )}
          </>
        ) : null}

        <div className="mt-6 border-t border-gray-100 pt-3">
          <button
            type="button"
            disabled={locked}
            onClick={() => callbacks.onOpenTagsLinksWizard()}
            className="w-full rounded-lg border border-violet-200 bg-violet-50 py-2 text-[11px] font-bold text-violet-900 hover:bg-violet-100 disabled:opacity-50"
          >
            Otvoriť sprievodcu tagov / odkazov (callback)
          </button>
        </div>
      </div>
    </div>
  );
}

function FindingListBody({
  activeAuditTab,
  claims,
  audit,
  locked,
  callbacks,
}: {
  activeAuditTab: CopilotAuditTab;
  claims: Claim[];
  audit: ArticleAudit;
  locked: boolean;
  callbacks: EditorialCopilotPanelCallbacks;
}) {
  if (activeAuditTab === "seo") {
    const entries = Object.entries(audit.seoAudit) as [
      SeoAuditKey,
      ArticleAudit["seoAudit"][SeoAuditKey],
    ][];
    return (
      <ul className="space-y-2">
        {entries.map(([key, field]) => (
          <li key={key}>
            <button
              type="button"
              disabled={locked || field.status === "pass"}
              onClick={() => callbacks.onSelectFinding(key)}
              className={cn(
                "w-full rounded-xl border border-gray-200 p-3 text-left text-sm font-semibold shadow-sm transition-all hover:border-gray-300",
                field.status === "fail" && "border-l-[3px] border-l-rose-400 bg-rose-50/40",
                field.status === "warning" &&
                  "border-l-[3px] border-l-amber-400 bg-amber-50/35",
                field.status === "pass" &&
                  "border-l-[3px] border-l-emerald-400 bg-emerald-50/35 opacity-70",
              )}
            >
              <span className="text-[10px] font-black uppercase text-gray-500">
                {SEO_LABEL[key]}
              </span>
              <p className="mt-1 leading-snug">{field.message}</p>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  if (claims.length === 0) {
    return (
      <p className="py-8 text-center text-xs text-gray-500">
        V tejto záložke nie sú otvorené nálezy.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {claims.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            disabled={locked}
            onClick={() => callbacks.onSelectFinding(c.id)}
            className={cn(
              "w-full rounded-xl border border-gray-200 p-3 text-left shadow-sm transition-all hover:border-gray-300",
              "border-l-[3px]",
              riskRing(c.risk),
            )}
          >
            <p className="text-[10px] font-black uppercase text-gray-500">{c.reason}</p>
            <p className="mt-1 text-[13px] font-semibold leading-snug text-gray-900">
              {c.text.slice(0, 120)}
              {c.text.length > 120 ? "…" : ""}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}

function SeoDetailBody({
  seoKey,
  audit,
  seoAppliedKeys,
  ignoredSeoKeys,
  locked,
  callbacks,
}: {
  seoKey: SeoAuditKey;
  audit: ArticleAudit;
  seoAppliedKeys: readonly SeoAuditKey[];
  ignoredSeoKeys: readonly SeoAuditKey[];
  locked: boolean;
  callbacks: EditorialCopilotPanelCallbacks;
}) {
  const item = audit.seoAudit[seoKey];
  const applied = seoAppliedKeys.includes(seoKey);
  const ignored = ignoredSeoKeys.includes(seoKey);
  const hasSuggestion = Boolean(item.suggestion?.trim());
  const canAct = hasSuggestion && !applied && !ignored;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Nález kontrol · {SEO_LABEL[seoKey]}
        </p>
        <p className="mt-2 text-sm font-semibold text-gray-900">{item.message}</p>
      </div>
      {hasSuggestion && !applied ? (
        <div className="rounded-2xl border border-purple-200/90 bg-purple-50/70 p-4">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            AI návrh (náhrada textu)
          </p>
          <p className="text-sm leading-relaxed text-gray-900">{item.suggestion}</p>
        </div>
      ) : null}
      {applied ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 text-xs text-emerald-900">
          <strong>Použité.</strong> Rekapituláciu diff host doplní podľa logu zmien (blueprint
          ukazuje len stav po aplikácii).
        </div>
      ) : null}
      {canAct ? (
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3">
          <button
            type="button"
            disabled={locked}
            onClick={() => callbacks.onApplySeoSuggestion(seoKey)}
            className="rounded-xl bg-purple-600 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:bg-gray-300"
          >
            Použiť návrh
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={() => callbacks.onIgnoreSeoSuggestion(seoKey)}
            className="rounded-xl border py-2 text-xs font-bold text-gray-600"
          >
            Ignorovať nález
          </button>
        </div>
      ) : null}
    </div>
  );
}
