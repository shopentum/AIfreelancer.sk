#!/usr/bin/env bash
# Vercel ignoreCommand: exit 0 = skip build, exit 1 = run build.
# Skip when the commit only touches apps/kanban (separate Vercel project).

CHANGED=$(git diff --name-only HEAD^ HEAD 2>/dev/null || true)

# Empty commit / redeploy trigger — always build.
if [ -z "$CHANGED" ]; then
  exit 1
fi

# Any change outside kanban → build main Next.js site.
if echo "$CHANGED" | grep -qv '^apps/kanban/'; then
  exit 1
fi

exit 0
