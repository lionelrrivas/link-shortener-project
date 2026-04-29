'use server'

import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createLink } from '@/data/links'

const createLinkSchema = z.object({
  destinationUrl: z.string().url('Please enter a valid URL (including https://).'),
  slug: z.string().regex(/^[a-zA-Z0-9-_]+$/, 'Slug may only contain letters, numbers, hyphens, and underscores.').optional(),
})

export type CreateLinkInput = z.input<typeof createLinkSchema>

export type CreateLinkResult =
  | { success: true }
  | { error: string }

function generateSlug(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function createLinkAction(input: CreateLinkInput): Promise<CreateLinkResult> {
  const { userId } = await auth()
  if (!userId) {
    return { error: 'You must be signed in to create a link.' }
  }

  const parsed = createLinkSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }

  const { destinationUrl, slug: customSlug } = parsed.data
  const slug = customSlug || generateSlug()

  try {
    await createLink({ url: destinationUrl, slug, userId })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('unique') || message.includes('duplicate')) {
      return { error: 'That slug is already taken. Please choose a different one.' }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}


