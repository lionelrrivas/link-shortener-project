'use server'

import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { updateLink, deleteLink } from '@/data/links'

type ActionResult = { success: true } | { error: string }

// ── Update ────────────────────────────────────────────────────────────────────

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  destinationUrl: z.string().url('Please enter a valid URL (including https://).'),
  slug: z
    .string()
    .min(1, 'Slug cannot be empty.')
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      'Slug may only contain letters, numbers, hyphens, and underscores.'
    ),
})

export type UpdateLinkInput = z.input<typeof updateLinkSchema>

export async function updateLinkAction(input: UpdateLinkInput): Promise<ActionResult> {
  const { userId } = await auth()
  if (!userId) return { error: 'You must be signed in.' }

  const parsed = updateLinkSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }

  const { id, destinationUrl, slug } = parsed.data

  try {
    const link = await updateLink(id, userId, { url: destinationUrl, slug })
    if (!link) return { error: 'Link not found or you do not have permission to edit it.' }
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

// ── Delete ────────────────────────────────────────────────────────────────────

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
})

export type DeleteLinkInput = z.input<typeof deleteLinkSchema>

export async function deleteLinkAction(input: DeleteLinkInput): Promise<ActionResult> {
  const { userId } = await auth()
  if (!userId) return { error: 'You must be signed in.' }

  const parsed = deleteLinkSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }

  try {
    const deleted = await deleteLink(parsed.data.id, userId)
    if (!deleted) return { error: 'Link not found or you do not have permission to delete it.' }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

