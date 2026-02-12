"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import type { User } from "@/lib/users"
import { toast } from "sonner"
import { ArrowLeftIcon, Frown, Loader2, UsersIcon } from "lucide-react"

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

const COMMON_TIMEZONES = [
  "Europe/Paris",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Australia/Sydney",
]

const TIMEZONE_LOCATIONS: Record<string, [number, number]> = {
  "Europe/Paris": [2.3522, 48.8566],
  "Europe/London": [-0.1276, 51.5074],
  "America/New_York": [-73.9352, 40.7306],
  "America/Los_Angeles": [-118.2437, 34.0522],
  "Asia/Dubai": [55.2708, 25.2048],
  "Asia/Tokyo": [139.6917, 35.6895],
  "Australia/Sydney": [151.2093, -33.8688],
}

function UserLocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = React.useState("")

  React.useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-GB", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
          })
        )
      } catch {
        setTime("—")
      }
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [timezone])

  return <span className="font-mono">{time}</span>
}

type EditUsersDialogProps = {
  users: User[]
  onUserUpdate?: (user: User) => void
}

export function EditUsersDialog({ users, onUserUpdate }: EditUsersDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [editForm, setEditForm] = React.useState<Partial<User>>({})
  const [selectedTimezone, setSelectedTimezone] = React.useState("")
  const [selectedRole, setSelectedRole] = React.useState("")

  const [citySearch, setCitySearch] = React.useState("")
  const [locationSearchLoading, setLocationSearchLoading] =
    React.useState(false)
  const [locationSearchError, setLocationSearchError] = React.useState<
    string | null
  >(null)

  const openEditView = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      timezone: user.timezone,
      workingHours: { ...user.workingHours },
      location: [...user.location],
    })
    setCitySearch("")
    setLocationSearchError(null)
  }

  const searchCity = React.useCallback(async () => {
    const query = citySearch.trim()
    if (!query) return
    setLocationSearchLoading(true)
    setLocationSearchError(null)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const res = await fetch(
        `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`,
        {
          headers: { "User-Agent": "RemoteTime/1.0" },
          signal: controller.signal,
        }
      )
      clearTimeout(timeout)
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) {
        setLocationSearchError("No results found")
        return
      }
      const result = data[0]
      const lon = parseFloat(result.lon)
      const lat = parseFloat(result.lat)
      if (Number.isNaN(lon) || Number.isNaN(lat)) {
        setLocationSearchError("Invalid coordinates")
        return
      }
      setEditForm((f) => ({ ...f, location: [lon, lat] }))
      setLocationSearchError(null)
    } catch (err) {
      setLocationSearchError(
        err instanceof Error ? err.message : "Search failed"
      )
    } finally {
      setLocationSearchLoading(false)
    }
  }, [citySearch])

  const closeEditView = () => {
    setSelectedUser(null)
    setEditForm({})
    setCitySearch("")
    setLocationSearchError(null)
  }

  const handleSave = () => {
    if (!selectedUser || !onUserUpdate) return
    const newTimezone = editForm.timezone ?? selectedUser.timezone
    const location =
      editForm.location ??
      TIMEZONE_LOCATIONS[newTimezone] ??
      selectedUser.location
    const updated: User = {
      ...selectedUser,
      ...editForm,
      timezone: newTimezone,
      location,
      workingHours: editForm.workingHours ?? selectedUser.workingHours,
    }
    onUserUpdate(updated)
    toast.success(
      `${updated.firstName} ${updated.lastName} has been updated.`
    )
    closeEditView()
  }

  React.useEffect(() => {
    if (!open) closeEditView()
  }, [open])

  const allTimezones = React.useMemo(
    () => [
      ...new Set([
        ...COMMON_TIMEZONES,
        ...users.map((u) => u.timezone),
      ]),
    ].sort(),
    [users]
  )
  const timezones = React.useMemo(
    () => ["", ...new Set(users.map((u) => u.timezone))].sort(),
    [users]
  )
  const roles = React.useMemo(
    () => ["", ...new Set(users.map((u) => u.role))].sort(),
    [users]
  )
  const filteredUsers = React.useMemo(
    () =>
      users.filter(
        (u) =>
          (!selectedTimezone || u.timezone === selectedTimezone) &&
          (!selectedRole || u.role === selectedRole)
      ),
    [users, selectedTimezone, selectedRole]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Edit users"
            >
              <UsersIcon className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Edit users</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedUser ? "Edit user" : "Edit users"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {selectedUser ? (
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-fit -ml-2"
                onClick={closeEditView}
              >
                <ArrowLeftIcon className="size-4" />
                Back
              </Button>
              <div className="flex items-center gap-3 pb-2">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                  <img
                    src={selectedUser.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {editForm.firstName} {editForm.lastName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {(editForm.timezone ?? selectedUser.timezone).replace("_", " ")}
                  </p>
                </div>
              </div>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel>First name</FieldLabel>
                  <Input
                    value={editForm.firstName ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Last name</FieldLabel>
                  <Input
                    value={editForm.lastName ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Input
                    value={editForm.role ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, role: e.target.value }))
                    }
                    placeholder="e.g. Developer, Designer"
                  />
                </Field>
                <Field>
                  <FieldLabel>Timezone</FieldLabel>
                  <Select
                    value={editForm.timezone ?? ""}
                    onValueChange={(v) =>
                      setEditForm((f) => ({ ...f, timezone: v }))
                    }
                  >
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {allTimezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Working hours</FieldLabel>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={editForm.workingHours?.start ?? 0}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          workingHours: {
                            ...(f.workingHours ?? selectedUser.workingHours),
                            start: parseInt(e.target.value, 10) || 0,
                          },
                        }))
                      }
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={editForm.workingHours?.end ?? 0}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          workingHours: {
                            ...(f.workingHours ?? selectedUser.workingHours),
                            end: parseInt(e.target.value, 10) || 0,
                          },
                        }))
                      }
                    />
                    <span className="text-muted-foreground text-xs">(24h)</span>
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Location</FieldLabel>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        value={
                          editForm.location?.[0] ?? selectedUser.location[0]
                        }
                        onChange={(e) => {
                          const v = parseFloat(e.target.value)
                          setEditForm((f) => ({
                            ...f,
                            location: [
                              Number.isNaN(v)
                                ? (f.location ?? selectedUser.location)[0]
                                : v,
                              (f.location ?? selectedUser.location)[1],
                            ],
                          }))
                        }}
                      />
                      <Input
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        value={
                          editForm.location?.[1] ?? selectedUser.location[1]
                        }
                        onChange={(e) => {
                          const v = parseFloat(e.target.value)
                          setEditForm((f) => ({
                            ...f,
                            location: [
                              (f.location ?? selectedUser.location)[0],
                              Number.isNaN(v)
                                ? (f.location ?? selectedUser.location)[1]
                                : v,
                            ],
                          }))
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by city"
                        value={citySearch}
                        onChange={(e) => {
                          setCitySearch(e.target.value)
                          setLocationSearchError(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            searchCity()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={searchCity}
                        disabled={locationSearchLoading || !citySearch.trim()}
                      >
                        {locationSearchLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          "Search"
                        )}
                      </Button>
                    </div>
                    {locationSearchError && (
                      <p className="text-destructive text-xs">
                        {locationSearchError}
                      </p>
                    )}
                    <p className="text-muted-foreground text-[10px]">
                      <a
                        href="https://www.openstreetmap.org/copyright"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground"
                      >
                        © OpenStreetMap
                      </a>
                    </p>
                  </div>
                </Field>
              </FieldGroup>
              <Button
                className="w-full"
                onClick={handleSave}
                disabled={!onUserUpdate}
              >
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
            <Select
              value={selectedTimezone || "all"}
              onValueChange={(v) =>
                setSelectedTimezone(v === "all" ? "" : v)
              }
            >
              <SelectTrigger className="flex-1" size="sm">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {timezones
                  .filter((t) => t !== "")
                  .map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedRole || "all"}
              onValueChange={(v) => setSelectedRole(v === "all" ? "" : v)}
            >
              <SelectTrigger className="flex-1" size="sm">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {roles
                  .filter((r) => r !== "")
                  .sort()
                  .map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="max-h-[300px] overflow-auto space-y-2">
            {filteredUsers.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Frown />
                  </EmptyMedia>
                  <EmptyTitle>Sorry!</EmptyTitle>
                  <EmptyDescription>No users match the filters.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              filteredUsers.map((user) => (
                <Item
                  key={user.id}
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center gap-2 border border-border/60 bg-muted/40 px-2 py-1.5 transition-colors hover:bg-muted/60"
                  onClick={() => openEditView(user)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      openEditView(user)
                    }
                  }}
                >
                  <ItemMedia variant="image" className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted">
                    <img
                      src={user.avatarUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  </ItemMedia>
                  <ItemContent className="flex flex-1 min-w-0 flex-col gap-0.5">
                    <ItemTitle className="text-sm font-medium text-foreground leading-tight">
                      {user.firstName} {user.lastName}
                    </ItemTitle>
                    <Badge
                      variant="secondary"
                      className="w-fit px-1.5 py-0 text-[10px] font-medium font-mono"
                    >
                      {user.role}
                    </Badge>
                  </ItemContent>
                  <ItemActions className="flex shrink-0 flex-col items-end gap-0.5 text-muted-foreground text-xs">
                    <span>{user.timezone.replace("_", " ")}</span>
                    <UserLocalTime timezone={user.timezone} />
                  </ItemActions>
                </Item>
              ))
            )}
          </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
