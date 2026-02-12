"use client";

import { useRef, useState } from "react";
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
