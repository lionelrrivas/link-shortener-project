# UI Components — Agent Instructions

## Overview

All UI in this application is built exclusively with **[Shadcn UI](https://ui.shadcn.com/)**.  
**No other component library should ever be installed or used.**

Shadcn UI is already configured in this project via `components.json` (style: `radix-nova`, base color: `neutral`, CSS variables enabled, RSC-compatible).

---

## Rules

### 1. Always Use Shadcn UI Components

- **Every** interactive or structural UI element must use a Shadcn UI component.
- Do **not** write raw HTML elements for UI purposes. The following are explicitly forbidden as bare elements:

| ❌ Raw HTML | ✅ Use Shadcn Instead |
|---|---|
| `<button>` | `<Button>` from `@/components/ui/button` |
| `<input>` | `<Input>` from `@/components/ui/input` |
| `<dialog>` / `<div role="dialog">` | `<Dialog>` from `@/components/ui/dialog` |
| `<select>` | `<Select>` from `@/components/ui/select` |
| `<label>` | `<Label>` from `@/components/ui/label` |
| `<textarea>` | `<Textarea>` from `@/components/ui/textarea` |
| `<form>` fields (standalone) | Compose with Shadcn `<Form>`, `<FormField>`, etc. |

> **Exception:** Semantic layout/structural elements (`<main>`, `<section>`, `<header>`, `<nav>`, `<ul>`, `<li>`, `<p>`, `<h1>`–`<h6>`) that carry no interactive behavior may be used as plain HTML.

---

### 2. Use Existing Components in `components/ui/`

The following Shadcn UI components are already installed in this project:

| Component | File |
|---|---|
| `Button` | `components/ui/button.tsx` |

Always check `components/ui/` first before adding a new component.

---

### 3. Adding New Shadcn UI Components

When you need a component that is not yet in `components/ui/`, install it using the Shadcn CLI:

```bash
npx shadcn@latest add <component-name>
```

**Examples:**
```bash
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add form
```

- Do **not** manually create files in `components/ui/` to mimic Shadcn components.
- Do **not** copy-paste component source code from the Shadcn website — always use the CLI so the component integrates with the project's `components.json` configuration.

---

### 4. Importing Components

Always import Shadcn UI components from their path under `@/components/ui/`:

```tsx
// ✅ Correct
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// ❌ Never import directly from Radix or any other source
import { Root } from '@radix-ui/react-dialog';
```

---

### 5. Styling with Tailwind CSS

- Shadcn UI components are styled via **Tailwind CSS utility classes**.
- Customize component appearance by passing `className` props with Tailwind utilities — do **not** write custom CSS files or inline `style` objects for component-level styling.
- CSS variables for theming (colors, radius, etc.) are defined in `app/globals.css` and should be modified there if a global theme change is needed.

```tsx
// ✅ Correct — customize via className
<Button className="w-full mt-4">Submit</Button>

// ❌ Avoid — do not use inline styles for theming
<Button style={{ backgroundColor: 'blue' }}>Submit</Button>
```

---

### 6. Do Not Use Other Component Libraries

- **Never** install or use any of the following (non-exhaustive list):
  - Material UI (MUI)
  - Chakra UI
  - Ant Design
  - Headless UI
  - Radix UI primitives **directly** (Shadcn wraps Radix — always go through Shadcn)
  - Any other third-party component library

If a needed component does not exist in Shadcn UI, build it by **composing existing Shadcn components** and Tailwind utilities — do not reach for another library.

---

### 7. Project Configuration Reference

Shadcn UI is configured in `components.json` at the project root. Key settings:

| Setting | Value |
|---|---|
| Style | `radix-nova` |
| Base color | `neutral` |
| CSS variables | `true` |
| Global CSS file | `app/globals.css` |
| Component alias | `@/components/ui` |
| Utils alias | `@/lib/utils` |
| Icon library | `lucide` |
| RSC compatible | `true` |

Do **not** modify `components.json` manually unless intentionally changing project-wide Shadcn configuration.

---

## Summary Checklist

| Rule | Requirement |
|---|---|
| UI elements | Shadcn UI components only — no bare interactive HTML |
| Existing components | Check `components/ui/` before adding new ones |
| Adding components | `npx shadcn@latest add <component-name>` only |
| Imports | Always from `@/components/ui/<component-name>` |
| Styling | Tailwind utility classes via `className` |
| Other libraries | Never — Shadcn UI is the only component library |

