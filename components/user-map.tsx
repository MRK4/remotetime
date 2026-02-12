"use client";

import { forwardRef } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  type MapRef,
} from "@/components/ui/map";
import type { User } from "@/lib/users";

type UserMapProps = {
  users: User[];
};

export const UserMap = forwardRef<MapRef, UserMapProps>(function UserMap(
  { users },
  ref
) {
  return (
    <Map
      ref={ref}
      projection={{ type: "globe" }}
      center={[0, 20]}
      zoom={1.5}
      pitch={0}
    >
      {users.map((user) => (
        <MapMarker
          key={user.id}
          longitude={user.location[0]}
          latitude={user.location[1]}
        >
          <MarkerContent>
            <div className="size-8 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform overflow-hidden bg-muted">
              <img
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="size-full object-cover"
              />
            </div>
            <MarkerLabel position="bottom">
              {user.firstName} {user.lastName[0]}.
            </MarkerLabel>
          </MarkerContent>
          <MarkerPopup className="p-0 w-62">
            <div className="relative h-24 overflow-hidden rounded-t-md bg-muted">
              <img
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="size-full object-cover"
              />
            </div>
            <div className="space-y-2 p-3">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {user.role}
                </span>
                <h3 className="font-semibold text-foreground leading-tight">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {user.timezone.replace("_", " ")}
              </div>
              <div className="text-sm text-muted-foreground">
                {user.workingHours.start}h – {user.workingHours.end}h
              </div>
            </div>
          </MarkerPopup>
        </MapMarker>
      ))}
      <MapControls
        position="bottom-right"
        showZoom
        showCompass
      />
    </Map>
  );
});

