#!/usr/bin/env bash
# Vercel ignoreCommand (Root Directory = apps/kanban): exit 0 = skip, 1 = build.
# Build only when this commit touches apps/kanban.

CHANGED=$(git diff --name-only HEAD^ HEAD 2>/dev/null || true)

if [ -z "$CHANGED" ]; then
  exit 1
fi

if echo "$CHANGED" | grep -q '^apps/kanban/'; then
  exit 1
fi

exit 0
