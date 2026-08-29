---
name: pre-merge-checks
description: 'Automated pre-merge/pre-commit checks for the SJRD monorepo. Runs the linter, formatter, and typechecker. Use before committing, merging, or opening a PR.'
---

# SJRD Pre-Merge Checks

This skill runs the automated gate that must pass before code is committed or merged in the Sacramento Junior Roller Derby monorepo. It does not perform semantic/style review — see the `code-quality` skill for that, which applies while code is being written.

## Step 1 — Run automated checks

```bash
pnpm lint
pnpm format:check
pnpm typecheck
```

## Step 2 — Fix what's fixable

Fix auto-fixable issues with:

```bash
pnpm lint:fix
pnpm format
```

Re-run `pnpm lint` / `pnpm format:check` / `pnpm typecheck` after fixing to confirm they're clean.

## Step 3 — Report

Do not commit or merge past this point if errors (not warnings) remain. Report any remaining errors with file:line references and stop.

## Summary format

End with a concise table:

| Check     | Status  | Action required |
| --------- | ------- | --------------- |
| Lint      | ✅ / ❌ | —               |
| Format    | ✅ / ❌ | —               |
| Typecheck | ✅ / ❌ | —               |
