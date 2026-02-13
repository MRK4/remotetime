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
  Sheet,
  SheetClose,
  SheetContent,
} from "@/components/ui/sheet"
import { EditUsersDialog } from "@/components/edit-users-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { useIsMobile } from "@/hooks/use-mobile"
import type { User } from "@/lib/users"
import {
  CalendarIcon,
  EyeIcon,
  MoonIcon,
  SunIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"

type AppSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: User[]
  meetingPanelOpen: boolean
  onMeetingPanelToggle: () => void
  onHighlightUser?: (user: User) => void
  onUserUpdate?: (user: User) => void
}

export function AppSidebar({
  open,
  onOpenChange,
  users,
  meetingPanelOpen,
  onMeetingPanelToggle,
  onHighlightUser,
  onUserUpdate,
}: AppSidebarProps) {
  const isMobile = useIsMobile()
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

  const [utcTime, setUtcTime] = React.useState(() =>
    new Date().toISOString().slice(11, 19)
  )
  React.useEffect(() => {
    const t = setInterval(
      () => setUtcTime(new Date().toISOString().slice(11, 19)),
      1000
    )
    return () => clearInterval(t)
  }, [])

  const sidebarContent = (
    <>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isMobile && (
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0"
                aria-label="Close sidebar"
              >
                <XIcon className="size-4" />
              </Button>
            </SheetClose>
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <CardTitle className="text-sm">RemoteTime</CardTitle>
            <span className="text-xs text-muted-foreground font-mono">
              UTC {utcTime}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={cycleTheme}
                aria-label="Toggle theme"
              >
                <ThemeIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
          <EditUsersDialog users={users} onUserUpdate={onUserUpdate} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex-1 overflow-auto space-y-2 text-xs text-muted-foreground">
          {users.map((user) => (
            <Item
              key={user.id}
              className="group flex items-center gap-2 border border-border/60 bg-muted/40 px-2 py-1.5"
            >
              <ItemMedia variant={"image"} className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted">
                <img
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-full w-full object-cover"
                />
              </ItemMedia>
              <div className="flex flex-1 min-w-0 flex-col gap-0.5">
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
              {onHighlightUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => onHighlightUser(user)}
                      aria-label={`Focus on ${user.firstName} ${user.lastName} on map`}
                    >
                      <EyeIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Focus on map</TooltipContent>
                </Tooltip>
              )}
            </Item>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-0 pt-3">
        <Button
          className="w-full"
          size="sm"
          variant={meetingPanelOpen ? "secondary" : "default"}
          onClick={() => {
            onMeetingPanelToggle()
            if (isMobile) onOpenChange(false)
          }}
        >
          <CalendarIcon className="size-4" />
          Schedule a meeting
        </Button>
      </CardFooter>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="flex w-80 max-w-[85vw] flex-col p-0" showCloseButton={false}>
          <Card className="flex h-full w-full flex-col border-0 bg-transparent shadow-none">
            {sidebarContent}
          </Card>
        </SheetContent>
      </Sheet>
    )
  }

  if (!open) return null

  return (
    <div className="pointer-events-auto absolute left-4 top-4 bottom-4 z-10 flex w-80 max-w-full">
      <Card className="flex h-full w-full flex-col border border-border/60 bg-background/95 shadow-lg backdrop-blur">
        {sidebarContent}
      </Card>
    </div>
  )
}
