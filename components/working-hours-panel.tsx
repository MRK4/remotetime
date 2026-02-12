"use client"

import type { User } from "@/lib/users"
import { WorkingHoursView } from "@/components/working-hours-view"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
  if (!open) return null

  return (
    <div
      className="pointer-events-auto absolute bottom-4 left-[calc(1rem+20rem+1rem)] right-16 z-10 max-h-[70vh]"
    >
      <Card className="flex h-full w-full flex-col border border-border/60 bg-background/95 shadow-lg backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Horaires de travail</CardTitle>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="Fermer"
          >
            <XIcon className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <WorkingHoursView users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
