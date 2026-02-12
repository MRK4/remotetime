"use client";

import { Map, MapControls } from "@/components/ui/map";

type UserMapProps = {
  // Réservé pour les futurs filtres / données utilisateurs
};

export function UserMap(_props: UserMapProps) {
  return (
    <Map
      projection={{ type: "globe" }}
      center={[0, 20]}
      zoom={1.5}
      pitch={0}
    >
      <MapControls
        position="bottom-right"
        showZoom
        showCompass
      />
    </Map>
  );
}

