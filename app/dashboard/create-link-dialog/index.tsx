'use client'

import React, { useRef, useState, useTransition } from 'react'
import { PlusIcon } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createLinkAction } from './actions'

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setError(null)
  }

  function handleSubmit(e: Parameters<NonNullable<React.ComponentProps<'form'>['onSubmit']>>[0]) {
    e.preventDefault()
    setError(null)

    const data = new FormData(e.currentTarget)
    const destinationUrl = data.get('destinationUrl') as string
    const slug = (data.get('slug') as string).trim() || undefined

    startTransition(async () => {
      const result = await createLinkAction({ destinationUrl, slug })
      if ('error' in result) {
        setError(result.error)
      } else {
        setOpen(false)
        formRef.current?.reset()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new short link</DialogTitle>
          <DialogDescription>
            Enter a destination URL and an optional custom slug.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="destinationUrl">Destination URL</Label>
            <Input
              id="destinationUrl"
              name="destinationUrl"
              type="url"
              placeholder="https://example.com/very/long/url"
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">
              Custom slug{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">/go/</span>
              <Input
                id="slug"
                name="slug"
                placeholder="my-link"
                pattern="[a-zA-Z0-9-_]+"
                title="Only letters, numbers, hyphens, and underscores are allowed"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating…' : 'Create link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

