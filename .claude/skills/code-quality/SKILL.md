---
name: code-quality
description: 'Code quality enforcement for the SJRD monorepo. Runs the linter, reviews code against project standards (MUI preference, naming conventions, file/function length, component and utility structure), and flags opportunities for refactoring. Use before merging any feature.'
---

# SJRD Code Quality Review

This skill enforces code quality standards for the Sacramento Junior Roller Derby monorepo. When invoked:

1. Run the linter and formatter checks.
2. Perform a semantic review against the rules below.
3. Report findings with file:line references.
4. For MUI deviations, explicitly ask the user to confirm before proceeding.

---

## Step 1 — Run automated checks

```bash
pnpm lint
pnpm format:check
pnpm typecheck
```

Report any failures. Fix auto-fixable issues with `pnpm lint:fix` and `pnpm format`. Do not proceed past Step 1 if errors (not warnings) remain.

---

## Step 2 — MUI Component Preference (`apps/app`)

The `apps/app` workspace uses `@mui/material`. **Native HTML elements must not be used when MUI has an equivalent.**

| Native element  | Required MUI replacement                                  |
| --------------- | --------------------------------------------------------- |
| `<div>`         | `<Box>`                                                   |
| `<p>`           | `<Typography>`                                            |
| `<span>`        | `<Typography component="span">`                           |
| `<h1>`–`<h6>`   | `<Typography variant="h1">` … `<Typography variant="h6">` |
| `<button>`      | `<Button>` or `<IconButton>`                              |
| `<input>`       | `<TextField>` or `<Input>`                                |
| `<a>`           | `<Link>` from `@mui/material`                             |
| `<ul>` / `<ol>` | `<List>`                                                  |
| `<li>`          | `<ListItem>` or `<ListItemText>`                          |

**If a design requirement cannot be met with MUI, stop and ask:**

> "This component uses `<native-element>` because [reason]. MUI's equivalent is `<MuiComponent>`. Do you want to confirm this deviation from MUI, or should I find a MUI-compatible approach?"

Do not implement the deviation without explicit user confirmation.

---

## Step 3 — Naming Conventions

Enforce across both `apps/web` and `apps/app`:

| Target                              | Convention                      | Example                               |
| ----------------------------------- | ------------------------------- | ------------------------------------- |
| TypeScript types and interfaces     | PascalCase                      | `UserProfile`, `CalendarEvent`        |
| React component functions           | PascalCase                      | `EventCard`, `ScheduleView`           |
| Hooks                               | camelCase starting with `use`   | `useCalendarData`                     |
| Regular functions and variables     | camelCase                       | `formatDate`, `eventList`             |
| Module-level constants              | UPPER_CASE                      | `MAX_EVENTS_PER_DAY`                  |
| Parameters                          | camelCase, `_` prefix if unused | `_event`                              |
| Files containing a single component | PascalCase filename             | `EventCard.tsx`                       |
| Files containing utilities or hooks | camelCase filename              | `formatDate.ts`, `useCalendarData.ts` |

Flag any violations and suggest corrected names.

---

## Step 4 — File and Function Length

- **File length:** warn at 300 lines. If a file exceeds this, identify what can be extracted (sub-components, hooks, utilities).
- **Function/component length:** warn at 80 lines. Long render functions usually signal that sub-components or hooks should be extracted.

When flagging a long file or function, suggest the specific extraction:

- Logic → custom hook in the same directory or `src/lib/`
- Repeated JSX block → named sub-component in `src/components/`
- Pure computation → utility function in `src/lib/`

---

## Step 5 — Component and Utility Structure

### Components directory

Any React component that is:

- styled (uses `sx` prop, `emotion/styled`, or wraps a MUI component with visual changes), AND
- used in more than one place, OR
- extracted from a file for readability

must live in the appropriate `src/components/` directory:

- `apps/app/src/components/` for app-specific components
- `apps/web/src/components/` for web-specific components
- `packages/` for components shared across both apps (rare)

**Do not** define reusable styled components inline in a page or screen file.

### Utilities / lib directory

Any pure function, data transformer, or helper that:

- is used in more than one file, OR
- contains non-trivial logic worth isolating and testing

must live in:

- `apps/app/src/lib/` or `apps/web/src/lib/` for app-specific utilities
- `packages/` for cross-app utilities

**Refactor immediately** when you notice:

- Copy-pasted logic across two files
- A helper function defined at the top of a page/screen file
- Inline data formatting or transformation inside a component

---

## Step 6 — Reusability Scan

After reviewing the changed files, scan for:

1. **Duplicated logic** — same or similar code blocks in two or more files. Extract to a shared utility.
2. **Inline styled components** — `styled()` or `sx`-heavy components defined inside a page file. Extract to `src/components/`.
3. **Fat pages/screens** — a single page file handling data fetching, business logic, and rendering. Extract data logic into a hook, rendering into sub-components.
4. **Direct MUI re-exports with only cosmetic changes** — wrap in a named component in `src/components/` instead of applying the same `sx` override in multiple places.

For each finding, show the current code and the recommended refactored structure.

---

## Summary format

End every review with a concise table:

| Category            | Status                     | Action required             |
| ------------------- | -------------------------- | --------------------------- |
| Lint                | ✅ / ❌                    | —                           |
| Format              | ✅ / ❌                    | —                           |
| Typecheck           | ✅ / ❌                    | —                           |
| MUI usage           | ✅ / ⚠️ needs confirmation | List deviations             |
| Naming              | ✅ / ❌                    | List violations             |
| File length         | ✅ / ⚠️                    | List files over limit       |
| Function length     | ✅ / ⚠️                    | List functions over limit   |
| Component structure | ✅ / ❌                    | List misplaced components   |
| Utility structure   | ✅ / ❌                    | List misplaced utilities    |
| Reusability         | ✅ / ⚠️                    | List refactor opportunities |
