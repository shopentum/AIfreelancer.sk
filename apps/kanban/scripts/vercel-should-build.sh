#!/usr/bin/env bash
# Vercel ignoreCommand (Root Directory = apps/kanban): exit 0 = skip, 1 = build.
# Runs with cwd = apps/kanban — use paths relative to this app, not apps/kanban/ prefix.

if ! git rev-parse HEAD^ >/dev/null 2>&1; then
  exit 1
fi

# Changes inside this Vercel project root (Vercel KB: git diff -- . from Root Directory)
if ! git diff HEAD^ HEAD --quiet -- . 2>/dev/null; then
  exit 1
fi

# Fallback when invoked from monorepo root (local / misconfigured root)
if [ -d "apps/kanban" ] && ! git diff HEAD^ HEAD --quiet -- apps/kanban/ 2>/dev/null; then
  exit 1
fi

exit 0
