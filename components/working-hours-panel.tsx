"use client"

import * as React from "react"
import type { User } from "@/lib/users"
import { findOverlapSlots, getBestMeetingSlot } from "@/lib/working-hours"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { WorkingHoursView } from "@/components/working-hours-view"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreateMeetingDialog } from "@/components/create-meeting-dialog"
import { toast } from "sonner"
import { XIcon } from "lucide-react"

type WorkingHoursPanelProps = {
  users: User[]
  open: boolean
  onClose: () => void
  sidebarOpen?: boolean
}

export function WorkingHoursPanel({
  users,
  open,
  onClose,
  sidebarOpen = false,
}: WorkingHoursPanelProps) {
  const isMobile = useIsMobile()
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

  const [meetingDialogOpen, setMeetingDialogOpen] = React.useState(false)
  const [selectedHour, setSelectedHour] = React.useState<number | null>(null)

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

  const leftClass =
    isMobile || !sidebarOpen
      ? "left-4"
      : "left-[calc(1rem+20rem+1rem)]"

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-4 right-14 z-10 max-h-[70vh]",
        leftClass
      )}
    >
      <Card className="flex h-full w-full flex-col border border-border/60 bg-background/95 shadow-lg backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Working hours</CardTitle>
          {invitedUsers.length > 0 && (
            <CardDescription>
              <Badge
                variant="outline"
                className="w-fit bg-primary/20 border-primary/40 text-foreground"
              >
                {bestSlot ? (
                  <>
                    Best slot : {bestSlot.start}h–{bestSlot.end}h UTC (
                    {bestSlot.end - bestSlot.start}h)
                  </>
                ) : (
                  "No common time slot found."
                )}
              </Badge>
            </CardDescription>
          )}
          {!isMobile && (
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
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <WorkingHoursView
            users={users}
            invitedIds={invitedIds}
            bestSlot={bestSlot}
            onHourClick={(hour) => {
              setSelectedHour(hour)
              setMeetingDialogOpen(true)
            }}
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
        {isMobile && (
          <CardFooter className="flex shrink-0 justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={toggleAll}
            >
              {allSelected ? "Deselect all" : "Select all"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={onClose}
            >
              Close
            </Button>
          </CardFooter>
        )}
      </Card>
      <CreateMeetingDialog
        open={meetingDialogOpen}
        onOpenChange={setMeetingDialogOpen}
        hour={selectedHour ?? 0}
        invitedUsers={invitedUsers}
        onSubmit={({ title }) => {
          toast.success(`Meeting "${title}" created at ${selectedHour}h UTC`, {
            description: "This is a simulation, as the feature is not available yet.",
          })
        }}
      />
    </div>
  )
}
