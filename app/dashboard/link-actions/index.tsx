'use client'

import { useState, useTransition } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateLinkAction, deleteLinkAction } from './actions'
import type { Link } from '@/db/schema'

interface LinkActionsProps {
  link: Link
}

// ── Edit Dialog ───────────────────────────────────────────────────────────────

function EditLinkDialog({ link }: LinkActionsProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setError(null)
  }

  function handleSubmit(e: Parameters<NonNullable<React.ComponentProps<'form'>['onSubmit']>>[0]) {
    e.preventDefault()
    setError(null)

    const data = new FormData(e.currentTarget)
    const destinationUrl = data.get('destinationUrl') as string
    const slug = (data.get('slug') as string).trim()

    startTransition(async () => {
      const result = await updateLinkAction({ id: link.id, destinationUrl, slug })
      if ('error' in result) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Edit link">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>Update the destination URL or slug for this link.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-destinationUrl">Destination URL</Label>
            <Input
              id="edit-destinationUrl"
              name="destinationUrl"
              type="url"
              defaultValue={link.url}
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-slug">Slug</Label>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">/go/</span>
              <Input
                id="edit-slug"
                name="slug"
                defaultValue={link.slug}
                required
                pattern="[a-zA-Z0-9-_]+"
                title="Only letters, numbers, hyphens, and underscores are allowed"
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Delete Alert Dialog ───────────────────────────────────────────────────────

function DeleteLinkDialog({ link }: LinkActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      await deleteLinkAction({ id: link.id })
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Delete link">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete link?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{' '}
            <span className="font-medium text-foreground">/go/{link.slug}</span>. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function LinkActions({ link }: LinkActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <EditLinkDialog link={link} />
      <DeleteLinkDialog link={link} />
    </div>
  )
}

