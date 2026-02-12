"use client"

import * as React from "react"
import type { User } from "@/lib/users"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

/** Décalage horaire approximatif en heures (UTC+) pour le fuseau donné */
function getTimezoneOffsetHours(tz: string): number {
  const date = new Date()
  const utc = new Date(
    date.toLocaleString("en-US", { timeZone: "UTC" })
  ).getTime()
  const tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: tz })
  ).getTime()
  return (tzDate - utc) / (1000 * 60 * 60)
}

/** Convertit heure locale (0-24) en position UTC (0-24) pour l'affichage */
function localToUtcHours(
  localHour: number,
  tz: string
): number {
  const offset = getTimezoneOffsetHours(tz)
  return (localHour - offset + 24) % 24
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

type WorkingHoursViewProps = {
  users: User[]
  invitedIds?: Set<string>
  onInvitedChange?: (userId: string, invited: boolean) => void
}

export function WorkingHoursView({
  users,
  invitedIds,
  onInvitedChange,
}: WorkingHoursViewProps) {
  const refTz = "Europe/Paris"
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

  const allSelected = users.length > 0 && users.every((u) => invited.has(u.id))
  const toggleAll = () => {
    if (allSelected) {
      users.forEach((u) => setInvited(u.id, false))
    } else {
      users.forEach((u) => setInvited(u.id, true))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs">
          Horaires convertis en {refTz.replace("_", " ")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={toggleAll}
        >
          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* En-tête des heures */}
          <div className="mb-1 flex text-[10px] text-muted-foreground">
            <div className="w-28 shrink-0" />
            <div className="flex flex-1">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="flex-1 text-center"
                  style={{ minWidth: 16 }}
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
                  "flex items-center gap-2 rounded-md py-1.5 pl-2 pr-1 -mx-1 transition-colors",
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
                    aria-label={`Inviter ${user.firstName} ${user.lastName}`}
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
                <div className="relative flex flex-1 h-6 bg-muted/30 rounded overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-y-0 rounded bg-primary/60",
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
