"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { User } from "@/lib/users"
import {
  CalendarIcon,
  MoonIcon,
  SunIcon,
  UsersIcon,
} from "lucide-react"

type AppSidebarProps = {
  users: User[]
  meetingPanelOpen: boolean
  onMeetingPanelToggle: () => void
}

export function AppSidebar({
  users,
  meetingPanelOpen,
  onMeetingPanelToggle,
}: AppSidebarProps) {
  const [editUsersOpen, setEditUsersOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    setTheme(
      theme === "light" ? "dark" : "light"
    )
  }

  const ThemeIcon =
    theme === "dark"
      ? MoonIcon
      : SunIcon

  return (
    <div className="pointer-events-auto absolute left-4 top-4 bottom-4 z-10 flex w-80 max-w-full">
      <Card className="flex h-full w-full flex-col border border-border/60 bg-background/95 shadow-lg backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">RemoteTime</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={cycleTheme}
              aria-label="Changer le thème"
            >
              <ThemeIcon className="size-4" />
            </Button>
            <Dialog open={editUsersOpen} onOpenChange={setEditUsersOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Modifier les utilisateurs"
                >
                  <UsersIcon className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Modifier les utilisateurs</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground text-xs">
                  Cette fonctionnalité sera disponible prochainement.
                  Vous pourrez ajouter, modifier ou supprimer des
                  collaborateurs.
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden">
          <div className="flex-1 overflow-auto space-y-2 text-xs text-muted-foreground">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/40 px-2 py-1.5"
              >
                <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted">
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground leading-tight">
                    {user.firstName} {user.lastName}
                  </span>
                  <Badge
                    variant="secondary"
                    className="w-fit px-1.5 py-0 text-[10px] font-medium font-mono"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-0 pt-3">
          <Button
            className="w-full"
            size="sm"
            variant={meetingPanelOpen ? "secondary" : "default"}
            onClick={onMeetingPanelToggle}
          >
            <CalendarIcon className="size-4" />
            Planifier une réunion
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
