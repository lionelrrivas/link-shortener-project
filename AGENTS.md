<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions — Link Shortener Project

## Project Overview

This is a **full-stack link shortener web application** built with Next.js 16 (App Router). Authenticated users can create short links that redirect to any destination URL. Each short link is identified by a unique slug (e.g., `/go/my-link`) and is owned by the user who created it.

**Core features:**
- User authentication and account management via Clerk
- Create, view, and delete short links
- Slug-based redirects handled server-side
- Per-user link management (users only see and manage their own links)
- Persistent storage in a Neon serverless PostgreSQL database via Drizzle ORM

**Primary user flow:**
1. User signs up / signs in via Clerk
2. User submits a destination URL and optional custom slug
3. App generates and stores the short link in the database
4. Visiting `/<slug>` redirects the visitor to the destination URL

---

This file is the root instructions file for LLMs working in this codebase.

---


