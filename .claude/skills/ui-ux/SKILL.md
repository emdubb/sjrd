---
name: ui-ux
description: 'UI/UX and accessibility design rules for the SJRD monorepo — modal and card close-control placement, CTA button requirements, and ADA/WCAG guidelines for font size, tap-target size, and color contrast. These rules override any reference design, mockup, screenshot, or wireframe supplied for a task. Use any time coding a UI feature, screen, or component.'
---

# SJRD UI/UX & Accessibility Rules

This skill enforces UI/UX and accessibility standards for the Sacramento Junior Roller Derby monorepo as UI code is written. It applies to `apps/app` and `apps/web` any time a screen, page, dialog, card, or component is created or modified.

**Precedence rule:** if a reference image, wireframe, Figma link, or existing pattern conflicts with the rules below, the rules below win. Implement the reference's intent (layout, content, branding) but correct it to match these rules, and note to the user what was changed and why.

---

## Rule 1 — Modal / card dismissal

Any dialog, modal, sheet, drawer, or dismissible card **must** have its close control as an `X` icon in the **upper right corner** of the surface.

- `apps/app` (MUI): `IconButton` with the `Close` icon (`@mui/icons-material/Close`), positioned top-right via `position: absolute; top: 8px; right: 8px` (or the container's equivalent flex/grid placement).
- Do not rely solely on a "Cancel" text button, backdrop click, or swipe-to-dismiss as the _only_ close mechanism — those can supplement the X but never replace it.
- The close button needs an accessible name: `aria-label="Close"` (or more specific, e.g. `"Close event details"`).
- Exception: a full-page view (not a modal/card) doesn't need this — this rule is for dismissible overlays and cards only.

---

## Rule 2 — Calls to action are always buttons

Any primary or secondary call-to-action (submit, save, confirm, create, join, buy, view details, etc.) **must** be rendered as an actual button.

- `apps/app`: MUI `Button` (or `LoadingButton`/`IconButton` where an icon-only affordance is genuinely appropriate, e.g. a close/edit glyph — never for a labeled action like "Save").
- Never implement a CTA as a plain `<a>`/`Link`, styled `<Typography>`/`<Box>` with an `onClick`, or bare text with a hover color change. If it triggers an action, it is a `<button>`-rendered element.
- Navigational CTAs that go to a different route/page may use `Link`/`Button` with `component={Link}`, but must still be styled and behave as a button (clear affordance, focus ring, hover/active state).

---

## Rule 3 — ADA / WCAG 2.1 AA accessibility

### Font size

- Body text: minimum `16px` (`1rem`).
- Secondary/caption text: minimum `14px` — never go smaller for anything conveying information (not just decorative labels).
- Never use font sizes below `12px` anywhere, even for fine print.
- Line height: at least `1.5` for body text blocks.

### Active / tap target areas

- Minimum touch target: `44x44px` (WCAG 2.5.5 / Apple HIG / Material guidance), including padding — not just the visible icon or glyph.
- Icon buttons (close, edit, delete, menu, etc.) must hit this minimum even if the icon itself is smaller (e.g. a 24px icon inside a 44px `IconButton`).
- Maintain at least `8px` of spacing between adjacent interactive targets to prevent mis-taps.

### Color contrast

- Normal text (under 18pt / under 14pt bold): minimum contrast ratio **4.5:1** against its background.
- Large text (18pt+/24px+, or 14pt+/19px+ bold): minimum **3:1**.
- Non-text UI components (button borders, input outlines, icons conveying meaning, focus indicators): minimum **3:1** against adjacent colors.
- Never convey meaning (error, success, required field) through color alone — pair with an icon, label, or text.
- When using brand palettes (e.g. `sacramento-roller-derby-brand`), verify contrast before applying — the brand accent yellow (`#F2BF35`) on white or light backgrounds often fails AA for text and should be reserved for large text, borders, or backgrounds behind dark text.

### Additional baseline requirements

- All interactive elements must be keyboard-reachable and show a visible focus indicator (don't remove `outline` without providing a replacement focus style).
- Icon-only buttons must have an `aria-label` describing the action.
- Images conveying information need `alt` text; purely decorative images use `alt=""`.
- Form inputs must have an associated, visible label (MUI `TextField` with a `label` prop, not placeholder-only).
- Modals must trap focus while open and return focus to the trigger element on close.

---

## Summary checklist

Apply this checklist to every new or modified UI surface:

| Check                         | Requirement                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| Modal/card close              | `X` icon button, upper right, `aria-label` set                  |
| CTAs                          | Rendered as `Button`/`IconButton`, never text or styled `<div>` |
| Body text size                | ≥ 16px                                                          |
| Smallest permissible text     | ≥ 12px, and ≥ 14px if it conveys information                    |
| Tap targets                   | ≥ 44x44px including padding, ≥ 8px spacing between targets      |
| Text contrast                 | ≥ 4.5:1 normal, ≥ 3:1 large text                                |
| UI component contrast         | ≥ 3:1 against adjacent colors                                   |
| Color-only meaning            | Never — pair with icon/label/text                               |
| Keyboard + focus              | Reachable, visible focus indicator                              |
| Icon-only controls            | `aria-label` present                                            |
| Reference/wireframe conflicts | These rules win; flag the deviation to the user                 |
