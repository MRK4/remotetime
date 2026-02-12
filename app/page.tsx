"use client";

import { useState } from "react";
import { UserMap } from "@/components/user-map";
import { AppSidebar } from "@/components/app-sidebar";
import { WorkingHoursPanel } from "@/components/working-hours-panel";
import { USERS } from "@/lib/users";

export default function Page() {
  const [meetingPanelOpen, setMeetingPanelOpen] = useState(false);

  return (
    <main className="relative w-screen h-screen bg-background overflow-hidden">
      <div className="absolute inset-0">
        <UserMap />
      </div>
      <AppSidebar
        users={USERS}
        meetingPanelOpen={meetingPanelOpen}
        onMeetingPanelToggle={() => setMeetingPanelOpen((o) => !o)}
      />
      <WorkingHoursPanel
        users={USERS}
        open={meetingPanelOpen}
        onClose={() => setMeetingPanelOpen(false)}
      />
    </main>
  );
}
