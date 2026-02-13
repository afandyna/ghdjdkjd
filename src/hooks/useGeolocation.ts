import { useState, useEffect, useCallback } from "react";

interface GeoPosition {
  lat: number;
  lng: number;
}

export type GeoStatus = "pending" | "granted" | "denied" | "unavailable" | "manual";

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [status, setStatus] = useState<GeoStatus>("pending");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
      },
      (err) => {
        setStatus("denied");
        setError(err.message);
        // Do NOT fall back to Cairo — let the UI prompt for manual city selection
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const setManualPosition = useCallback((pos: GeoPosition) => {
    setPosition(pos);
    setStatus("manual");
    setError(null);
  }, []);

  return { position, status, error, setManualPosition };
}
