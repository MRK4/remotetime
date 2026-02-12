"use client"

import * as React from "react"
import type { User } from "@/lib/users"
import { findOverlapSlots, getBestMeetingSlot } from "@/lib/working-hours"
import { WorkingHoursView } from "@/components/working-hours-view"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

type WorkingHoursPanelProps = {
  users: User[]
  open: boolean
  onClose: () => void
}

export function WorkingHoursPanel({
  users,
  open,
  onClose,
}: WorkingHoursPanelProps) {
  const [invitedIds, setInvitedIds] = React.useState<Set<string>>(() =>
    new Set(users.map((u) => u.id))
  )

  React.useEffect(() => {
    setInvitedIds((prev) => {
      const next = new Set(prev)
      next.forEach((id) => {
        if (!users.some((u) => u.id === id)) next.delete(id)
      })
      users.forEach((u) => {
        if (!prev.has(u.id)) next.add(u.id)
      })
      return next
    })
  }, [users])

  const allSelected =
    users.length > 0 && users.every((u) => invitedIds.has(u.id))
  const toggleAll = () => {
    if (allSelected) {
      setInvitedIds(new Set())
    } else {
      setInvitedIds(new Set(users.map((u) => u.id)))
    }
  }

  const invitedUsers = users.filter((u) => invitedIds.has(u.id))
  const overlapSlots = findOverlapSlots(invitedUsers)
  const bestSlot = getBestMeetingSlot(overlapSlots)

  if (!open) return null

  return (
    <div
      className="pointer-events-auto absolute bottom-4 left-[calc(1rem+20rem+1rem)] right-14 z-10 max-h-[70vh]"
    >
      <Card className="flex h-full w-full flex-col border border-border/60 bg-background/95 shadow-lg backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Working hours</CardTitle>
          <CardDescription>
            Times in UTC
          </CardDescription>
          {invitedUsers.length > 0 && (
            <Badge
              variant="outline"
              className="mt-1 w-fit bg-primary/20 border-primary/40 text-foreground"
            >
              {bestSlot ? (
                <>
                  Meilleur créneau : {bestSlot.start}h–{bestSlot.end}h UTC (
                  {bestSlot.end - bestSlot.start}h)
                </>
              ) : (
                "Aucun créneau commun pour les personnes sélectionnées."
              )}
            </Badge>
          )}
          <CardAction className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={toggleAll}
            >
              {allSelected ? "Deselect all" : "Select all"}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <WorkingHoursView
            users={users}
            invitedIds={invitedIds}
            bestSlot={bestSlot}
            onInvitedChange={(userId, invited) => {
              setInvitedIds((prev) => {
                const next = new Set(prev)
                if (invited) next.add(userId)
                else next.delete(userId)
                return next
              })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
