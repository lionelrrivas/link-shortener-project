---
description: Standards and conventions for implementing data mutations via server actions in this Next.js App Router project.
---

# Server Actions

## Overview

All data mutations in this application must be performed via **Next.js Server Actions**. Direct database access from client components or API routes is not permitted for mutations.

## Rules

### 1. File Naming & Colocation
- Server action files **MUST** be named `actions.ts`.
- Each `actions.ts` file **MUST** be colocated in the same directory as the client component that calls it.

  ```
  app/dashboard/
    page.tsx          ← server component (page)
    LinkForm/
      index.tsx       ← client component calling the action
      actions.ts      ← server actions used by LinkForm
  ```

### 2. Called from Client Components Only
- Server actions **MUST** be called from **client components** (files with `"use client"` at the top).
- Do not invoke server actions directly from server components.

### 3. TypeScript Types — No `FormData`
- All data passed into server actions **MUST** have explicit TypeScript types.
- **Do NOT** use the `FormData` TypeScript type as a parameter type.
- Define a dedicated input type or interface for each action's arguments.

  ```ts
  // ✅ Correct
  type CreateLinkInput = {
    destinationUrl: string;
    slug?: string;
  };

  export async function createLink(input: CreateLinkInput) { ... }

  // ❌ Incorrect
  export async function createLink(formData: FormData) { ... }
  ```

### 4. Input Validation with Zod
- **ALL** data received by a server action **MUST** be validated using [Zod](https://zod.dev) before any further processing.
- Define a Zod schema that matches the action's input type.

  ```ts
  import { z } from "zod";

  const createLinkSchema = z.object({
    destinationUrl: z.string().url(),
    slug: z.string().min(1).optional(),
  });

  export async function createLink(input: CreateLinkInput) {
    const parsed = createLinkSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Invalid input");
    }
    // ...
  }
  ```

### 5. Authentication Check First
- Every server action **MUST** verify that a user is authenticated **before** performing any database operations.
- Use Clerk's server-side helpers (e.g., `auth()`) to retrieve the current user. If no user is found, return an error object (see Rule 7).

### 6. Database Access via `/data` Helper Functions
- Server actions **MUST NOT** use Drizzle queries directly.
- All database operations must be delegated to **helper functions** located in the `/data` directory. These functions encapsulate Drizzle queries.

  ```ts
  // ✅ Correct — delegate to /data helper
  import { createLinkRecord } from "@/data/links";

  export async function createLink(input: CreateLinkInput) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const parsed = createLinkSchema.parse(input);
    await createLinkRecord({ ...parsed, userId });
    return { success: true };
  }

  // ❌ Incorrect — direct Drizzle usage in action
  import { db } from "@/db";
  import { links } from "@/db/schema";

  export async function createLink(input: CreateLinkInput) {
    await db.insert(links).values({ ... }); // not allowed here
  }
  ```

### 7. Return Objects Instead of Throwing Errors
- Server actions **MUST NOT** throw errors.
- Instead, return a plain object with either a `success` property or an `error` property describing what went wrong.
- This keeps error handling predictable for client components consuming the action.

  ```ts
  // ✅ Correct
  export async function createLink(input: CreateLinkInput) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const parsed = createLinkSchema.safeParse(input);
    if (!parsed.success) return { error: "Invalid input" };

    try {
      await createLinkRecord({ ...parsed.data, userId });
      return { success: true };
    } catch {
      return { error: "Failed to create link" };
    }
  }

  // ❌ Incorrect
  export async function createLink(input: CreateLinkInput) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized"); // do not throw
  }
  ```

## Summary Checklist

| Rule | Requirement |
|------|-------------|
| File name | `actions.ts` |
| Location | Colocated with the calling client component |
| Caller | Client components only (`"use client"`) |
| Input types | Explicit TypeScript types — no `FormData` |
| Validation | Zod schema validation on every action |
| Auth check | Must verify logged-in user before DB operations |
| DB access | Via `/data` helper functions only — no direct Drizzle queries |
| Error handling | Return `{ error: string }` or `{ success: true }` — never throw |

