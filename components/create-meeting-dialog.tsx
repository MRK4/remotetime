"use client"

import * as React from "react"
import type { User } from "@/lib/users"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type CreateMeetingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  hour: number
  invitedUsers: User[]
  onSubmit?: (data: { title: string; description: string }) => void
}

export function CreateMeetingDialog({
  open,
  onOpenChange,
  hour,
  invitedUsers,
  onSubmit,
}: CreateMeetingDialogProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setTitle("")
      setDescription("")
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit?.({ title: title.trim(), description: description.trim() })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create meeting</DialogTitle>
        </DialogHeader>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Meeting title"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Description <span className="text-xs text-muted-foreground">(optional)</span></FieldLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
              />
            </Field>
            <Field>
              <FieldLabel>Time</FieldLabel>
              <Input
                value={`${hour}h UTC`}
                disabled
                readOnly
                className="bg-muted/50"
              />
            </Field>
            <Accordion type="single" collapsible defaultValue="participants">
              <AccordionItem value="participants">
                <AccordionTrigger>
                  Participants ({invitedUsers.length})
                </AccordionTrigger>
                <AccordionContent>
                  {invitedUsers.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {invitedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 rounded-md border border-border/60 bg-background px-2 py-1.5"
                        >
                          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
                            <img
                              src={user.avatarUrl}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">
                      None selected
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
