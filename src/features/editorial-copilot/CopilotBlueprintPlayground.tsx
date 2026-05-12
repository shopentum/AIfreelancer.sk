"use client";

import { useMemo, useState } from "react";
import {
  EDITORIAL_COPILOT_FIXTURE_IDS,
  getEditorialCopilotFixture,
} from "./fixtures";
import { EditorialCopilotPanelBlueprint } from "./EditorialCopilotPanelBlueprint";
import type {
  EditorialCopilotFixtureId,
  EditorialCopilotPanelCallbacks,
} from "./types";

function logCallbacks(prefix: string): EditorialCopilotPanelCallbacks {
  return {
    onValidate: () => console.info(`[CopilotBlueprint] ${prefix}.onValidate`),
    onSelectFinding: (id: string) =>
      console.info(`[CopilotBlueprint] ${prefix}.onSelectFinding`, id),
    onClearFindingSelection: () =>
      console.info(`[CopilotBlueprint] ${prefix}.onClearFindingSelection`),
    onAuditTabChange: (tab) =>
      console.info(`[CopilotBlueprint] ${prefix}.onAuditTabChange`, tab),
    onRequestClaimAiProposal: (claimId: string) =>
      console.info(`[CopilotBlueprint] ${prefix}.onRequestClaimAiProposal`, claimId),
    onApplyClaimAiProposal: (claimId: string) =>
      console.info(`[CopilotBlueprint] ${prefix}.onApplyClaimAiProposal`, claimId),
    onIgnoreClaim: (claimId: string) =>
      console.info(`[CopilotBlueprint] ${prefix}.onIgnoreClaim`, claimId),
    onApplySeoSuggestion: (key) =>
      console.info(`[CopilotBlueprint] ${prefix}.onApplySeoSuggestion`, key),
    onIgnoreSeoSuggestion: (key) =>
      console.info(`[CopilotBlueprint] ${prefix}.onIgnoreSeoSuggestion`, key),
    onPriorityActivate: (rowKey: string) =>
      console.info(`[CopilotBlueprint] ${prefix}.onPriorityActivate`, rowKey),
    onOpenTagsLinksWizard: () =>
      console.info(`[CopilotBlueprint] ${prefix}.onOpenTagsLinksWizard`),
    onUndoArticleSnapshot: () =>
      console.info(`[CopilotBlueprint] ${prefix}.onUndoArticleSnapshot`),
  };
}

export function CopilotBlueprintPlayground() {
  const [fixtureId, setFixtureId] =
    useState<EditorialCopilotFixtureId>("trust_list");

  const model = useMemo(() => getEditorialCopilotFixture(fixtureId), [fixtureId]);
  const callbacks = useMemo(() => logCallbacks(fixtureId), [fixtureId]);

  return (
    <div className="mx-auto max-w-md space-y-4 lg:max-w-lg">
      <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">
        Mock scenár (fixture)
        <select
          value={fixtureId}
          onChange={(e) =>
            setFixtureId(e.target.value as EditorialCopilotFixtureId)
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-normal text-gray-900 shadow-sm"
        >
          {EDITORIAL_COPILOT_FIXTURE_IDS.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>
      {model.fixtureLabel ? (
        <p className="text-[11px] leading-snug text-gray-500">{model.fixtureLabel}</p>
      ) : null}
      <EditorialCopilotPanelBlueprint model={model} callbacks={callbacks} />
      <p className="text-[10px] leading-relaxed text-gray-400">
        DevTools konzola: všetky akcie panelu logujú <code className="rounded bg-gray-100 px-1">[CopilotBlueprint]</code>.
      </p>
    </div>
  );
}
