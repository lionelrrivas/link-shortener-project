# Authentication — Agent Instructions

## Overview

All authentication in this application is handled exclusively by **[Clerk](https://clerk.com/)**.  
**No other authentication methods, libraries, or custom implementations should ever be used.**

---

## Rules

### 1. Clerk Is the Only Auth Provider
- Do **not** introduce any other auth library (e.g., NextAuth, Auth.js, custom JWT, session cookies, etc.).
- All user identity, session management, sign-in, and sign-up flows must go through Clerk.
- Use Clerk's official Next.js SDK (`@clerk/nextjs`) for all auth-related code.

---

### 2. Protected Routes

- The `/dashboard` route is **protected** and requires the user to be authenticated.
- Use Clerk middleware (`clerkMiddleware` from `@clerk/nextjs/server`) in **`proxy.ts`** to enforce this.
- Unauthenticated users attempting to access `/dashboard` must be **redirected to the homepage (`/`)** — they must **never** reach the dashboard content.
- Use `NextResponse.redirect` to perform the redirect. Do **not** use `auth.protect()` — it redirects to a Clerk-hosted sign-in page, which violates the modal-only rule.

> ⚠️ **Deprecation notice:** `middleware.ts` is deprecated in this project. All Clerk middleware must live in **`proxy.ts`**.

**Correct `proxy.ts` pattern:**
```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

### 3. Redirect Authenticated Users Away From `/`

- If a user is **already signed in** and navigates to the home page (`/`), they must be **redirected to `/dashboard`**.
- This check should be performed server-side (e.g., in the `/` page component using `auth()` from `@clerk/nextjs/server`, or inside `clerkMiddleware`).

**Example pattern (inside the `/` page component):**
```ts
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');
  // ... render landing page
}
```

---

### 4. Sign In and Sign Up Must Always Use Modals

- Clerk sign-in and sign-up flows must **always** be triggered as a **modal overlay**.
- **Never** redirect users to a Clerk-hosted page or a dedicated full-page `/sign-in` / `/sign-up` route.
- Use Clerk's `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` components for all trigger points.
- The `<SignIn>` and `<SignUp>` components should **not** be rendered as standalone pages.

**Correct usage:**
```tsx
import { SignInButton, SignUpButton } from '@clerk/nextjs';

<SignInButton mode="modal">
  <Button>Sign In</Button>
</SignInButton>

<SignUpButton mode="modal">
  <Button>Sign Up</Button>
</SignUpButton>
```

**❌ Never do this:**
```tsx
// Do NOT create /app/sign-in/page.tsx or /app/sign-up/page.tsx
// Do NOT use mode="redirect" or omit the mode prop
// Do NOT use auth.protect() — it redirects to a Clerk-hosted sign-in page
<SignInButton>...</SignInButton>
```

---

## Summary Checklist

| Rule | Requirement |
|---|---|
| Auth provider | Clerk only — no exceptions |
| Middleware file | `proxy.ts` only — `middleware.ts` is deprecated |
| `/dashboard` access | Protected; redirect unauthenticated users to `/` |
| `/` access when logged in | Redirect to `/dashboard` |
| Sign in / Sign up UI | Modal only (`mode="modal"`) — never full-page |
| `auth.protect()` | ❌ Never use — redirects to Clerk-hosted page |

