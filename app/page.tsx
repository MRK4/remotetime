"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserMap } from "@/components/user-map";
import { AppSidebar } from "@/components/app-sidebar";
import { WorkingHoursPanel } from "@/components/working-hours-panel";
import type { MapRef } from "@/components/ui/map";
import { USERS } from "@/lib/users";
import type { User } from "@/lib/users";

export default function Page() {
  const [users, setUsers] = useState<User[]>(USERS);
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
      <AppSidebar
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
      />
    </main>
  );
}
