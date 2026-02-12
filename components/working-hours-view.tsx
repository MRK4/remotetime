"use client"

import * as React from "react"
import type { User } from "@/lib/users"
import type { TimeSlot } from "@/lib/working-hours"
import { localToUtcHours } from "@/lib/working-hours"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

const HOURS = Array.from({ length: 24 }, (_, i) => i)

type WorkingHoursViewProps = {
  users: User[]
  invitedIds?: Set<string>
  onInvitedChange?: (userId: string, invited: boolean) => void
  /** Créneau optimal pour une réunion (affiché en surbrillance) */
  bestSlot?: TimeSlot | null
  /** Appelé quand l'utilisateur clique sur une colonne d'heure (0–23 UTC) */
  onHourClick?: (hour: number) => void
}

export function WorkingHoursView({
  users,
  invitedIds,
  onInvitedChange,
  bestSlot,
  onHourClick,
}: WorkingHoursViewProps) {
  const [localInvited, setLocalInvited] = React.useState<Set<string>>(
    () => invitedIds ?? new Set(users.map((u) => u.id))
  )
  const invited = invitedIds ?? localInvited
  const setInvited = onInvitedChange
    ? (id: string, value: boolean) => onInvitedChange(id, value)
    : (id: string, value: boolean) => {
        setLocalInvited((prev) => {
          const next = new Set(prev)
          if (value) next.add(id)
          else next.delete(id)
          return next
        })
      }

  const [utcPercent, setUtcPercent] = React.useState(() => {
    const now = new Date()
    const h = now.getUTCHours()
    const m = now.getUTCMinutes()
    const s = now.getUTCSeconds()
    return ((h + m / 60 + s / 3600) / 24) * 100
  })
  React.useEffect(() => {
    const t = setInterval(() => {
      const now = new Date()
      const h = now.getUTCHours()
      const m = now.getUTCMinutes()
      const s = now.getUTCSeconds()
      setUtcPercent(((h + m / 60 + s / 3600) / 24) * 100)
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <div className="relative min-w-[720px]">
          {bestSlot && (
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 pointer-events-none z-0 bg-primary/20 border border-primary/40"
              style={{
                left: `calc(7rem + (100% - 7rem) * ${bestSlot.start / 24})`,
                width: `calc((100% - 7rem) * ${(bestSlot.end - bestSlot.start) / 24})`,
              }}
            />
          )}
          <div
            aria-hidden="true"
            className="absolute top-0 h-full w-0.5 bg-primary pointer-events-none z-10"
            style={{
              left: `calc(7rem + (100% - 7rem) * ${utcPercent / 100})`,
            }}
          />
          {onHourClick &&
            HOURS.map((h) => (
              <button
                key={h}
                type="button"
                className="absolute top-0 bottom-0 z-[5] cursor-pointer transition-colors hover:bg-primary/5"
                style={{
                  left: `calc(7rem + (100% - 7rem) * ${h / 24})`,
                  width: `calc((100% - 7rem) / 24)`,
                }}
                onClick={() => onHourClick(h)}
                aria-label={`Créer une réunion à ${h}h UTC`}
              />
            ))}
          {/* En-tête des heures */}
          <div className="mb-1 flex text-[10px] text-muted-foreground">
            <div className="w-28 shrink-0" />
            <div className="flex flex-1">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="flex-1 text-center"
                  style={{ minWidth: 24 }}
                >
                  {h}h
                </div>
              ))}
            </div>
          </div>
          {/* Ligne par utilisateur */}
          {users.map((user) => {
            const startUtc = localToUtcHours(user.workingHours.start, user.timezone)
            const endUtc = localToUtcHours(user.workingHours.end, user.timezone)
            const duration =
              endUtc > startUtc ? endUtc - startUtc : 24 - startUtc + endUtc
            const leftPercent = (startUtc / 24) * 100
            const widthPercent = (duration / 24) * 100

            const isInvited = invited.has(user.id)
            return (
              <div
                key={user.id}
                className={cn(
                  "flex items-center gap-2 py-1.5 pl-2 pr-1 mx-1 transition-colors",
                  isInvited
                    ? "bg-primary/10 ring-1 ring-primary/20"
                    : "opacity-60"
                )}
              >
                <div className="flex w-28 shrink-0 items-center gap-2">
                  <Checkbox
                    checked={invited.has(user.id)}
                    onCheckedChange={(checked) =>
                      setInvited(user.id, checked === true)
                    }
                    aria-label={`Invite ${user.firstName} ${user.lastName}`}
                  />
                  <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium truncate">
                    {user.firstName} {user.lastName[0]}.
                  </span>
                </div>
                <div className="relative flex flex-1 h-6 bg-muted/30 overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-y-0 bg-primary/60",
                      "transition-all duration-200"
                    )}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
