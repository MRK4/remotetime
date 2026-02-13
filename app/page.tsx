"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserMap } from "@/components/user-map";
import { AppSidebar } from "@/components/app-sidebar";
import { WorkingHoursPanel } from "@/components/working-hours-panel";
import type { MapRef } from "@/components/ui/map";
import { useIsMobile } from "@/hooks/use-mobile";
import { USERS } from "@/lib/users";
import type { User } from "@/lib/users";
import { PanelLeftIcon } from "lucide-react";

export default function Page() {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<User[]>(USERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetingPanelOpen, setMeetingPanelOpen] = useState(false);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const timer = setTimeout(
      () =>
        toast("Thanks for using RemoteTime!", {
          description:
            "All data is static and for demonstration purposes. Check the repository for more information.",
          action: {
            label: "GitHub",
            onClick: () => {
              window.open("https://github.com/MRK4/remotetime", "_blank");
            },
          },
          duration: 8000,
        }),
      100
    );
    return () => clearTimeout(timer);
  }, []);

  const handleHighlightUser = (user: User) => {
    mapRef.current?.flyTo({
      center: user.location,
      zoom: 8,
      duration: 1000,
    });
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  return (
    <main className="relative w-screen h-screen bg-background overflow-hidden">
      <div className="absolute inset-0">
        <UserMap ref={mapRef} users={users} />
      </div>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="pointer-events-auto absolute left-4 top-4 z-20 bg-background/95 shadow-lg backdrop-blur"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <PanelLeftIcon className="size-4" />
        </Button>
      )}
      <AppSidebar
        open={isMobile ? sidebarOpen : true}
        onOpenChange={setSidebarOpen}
        users={users}
        meetingPanelOpen={meetingPanelOpen}
        onMeetingPanelToggle={() => setMeetingPanelOpen((o) => !o)}
        onHighlightUser={handleHighlightUser}
        onUserUpdate={handleUserUpdate}
      />
      <WorkingHoursPanel
        users={users}
        open={meetingPanelOpen}
        onClose={() => setMeetingPanelOpen(false)}
        sidebarOpen={isMobile ? sidebarOpen : true}
      />
    </main>
  );
}
