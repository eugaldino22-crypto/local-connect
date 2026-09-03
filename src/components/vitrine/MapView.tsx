import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Crosshair } from "lucide-react";

import "mapbox-gl/dist/mapbox-gl.css";

import type { Merchant } from "@/types";
import type { UserLocation } from "@/store/app-store";

type MapViewProps = {
  merchants: Merchant[];
  activeId: string | null;
  onSelect: (id: string) => void;
  cityLabel: string;
  cityLocation: { latitude: number; longitude: number } | null;
  userLocation: UserLocation | null;
};

const MAPBOX_TOKEN = import.meta.env['VITE_MAPBOX_ACCESS_TOKEN'];

export function MapView({
  merchants,
  activeId,
  onSelect,
  cityLabel,
  cityLocation,
  userLocation,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const hasCenteredOnUserRef = useRef(false);
  const merchantMarkersRef = useRef<
    Map<string, mapboxgl.Marker>
  >(new Map());

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initialCenter: [number, number] | null = userLocation
      ? [userLocation.longitude, userLocation.latitude]
      : cityLocation
        ? [cityLocation.longitude, cityLocation.latitude]
        : null;

    if (!initialCenter) {
      return;
    }

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: userLocation ? 14 : 13,
    });

    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      }),
      "top-right",
    );

    mapRef.current = map;

    return () => {
      userMarkerRef.current?.remove();

      merchantMarkersRef.current.forEach((marker) => marker.remove());
      merchantMarkersRef.current.clear();

      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !userLocation) {
      return;
    }

    const element = document.createElement("div");
    element.className =
      "size-5 rounded-full border-[3px] border-background bg-primary shadow-glow";

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    userMarkerRef.current = new mapboxgl.Marker({
      element,
    })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map);

    if (!hasCenteredOnUserRef.current) {
      hasCenteredOnUserRef.current = true;

      map.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 15,
        duration: 900,
        essential: true,
      });
    }
  }, [userLocation]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    merchantMarkersRef.current.forEach((marker) => marker.remove());
    merchantMarkersRef.current.clear();

    merchants.forEach((merchant) => {
      if (
        merchant.latitude == null ||
        merchant.longitude == null
      ) {
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute(
        "aria-label",
        `Ver ${merchant.name} no mapa`,
      );
      button.className =
        "grid size-10 place-items-center rounded-full border-2 border-background bg-surface text-base shadow-soft transition-transform";

      if (merchant.id === activeId) {
        button.className =
          "grid size-11 place-items-center rounded-full border-2 border-background bg-primary text-base text-primary-foreground shadow-glow";
      }

      button.textContent = merchant.logoEmoji;

      button.addEventListener("click", () => {
        onSelect(merchant.id);
      });

      const marker = new mapboxgl.Marker({
        element: button,
        anchor: "center",
      })
        .setLngLat([merchant.longitude, merchant.latitude])
        .addTo(map);

      merchantMarkersRef.current.set(merchant.id, marker);
    });
  }, [merchants, activeId, onSelect]);

  const centerOnUser = () => {
    const map = mapRef.current;

    if (!map || !userLocation) {
      return;
    }

    map.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 15,
      duration: 900,
      essential: true,
    });
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="grid h-full place-items-center bg-secondary px-8 text-center">
        <div>
          <p className="text-sm font-bold">
            Mapa indisponível
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure o token público do Mapbox em VITE_MAPBOX_ACCESS_TOKEN.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-secondary"
      aria-label={`Mapa de estabelecimentos em ${cityLabel}`}
    >
      <button
        type="button"
        onClick={centerOnUser}
        disabled={!userLocation}
        aria-label="Centralizar no meu local"
        className="press absolute bottom-4 right-4 z-10 grid size-11 place-items-center rounded-2xl bg-surface shadow-card disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Crosshair className="size-5" />
      </button>
    </div>
  );
}
