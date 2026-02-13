import { useState, useEffect, useMemo } from "react";
import { hospitals as internalHospitals, calculateDistance, type Hospital } from "@/data/sampleData";
import { supabase } from "@/integrations/supabase/client";

export interface HybridHospital extends Hospital {
  source: "verified" | "google_maps";
  rating?: number;
}

export function useNearbyHospitals(position: { lat: number; lng: number } | null) {
  const [googleHospitals, setGoogleHospitals] = useState<HybridHospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Fetch Google Maps hospitals
  useEffect(() => {
    if (!position) return;

    const fetchGoogleHospitals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("nearby-hospitals", {
          body: { lat: position.lat, lng: position.lng, radius: 10000 },
        });

        if (error) {
          console.warn("Google Maps fetch failed:", error);
          setGoogleError("Could not fetch nearby hospitals");
          return;
        }

        if (data?.hospitals?.length) {
          setGoogleHospitals(
            data.hospitals.map((h: any) => ({ ...h, source: "google_maps" as const }))
          );
        }
      } catch (err) {
        console.warn("Google Maps fallback error:", err);
        setGoogleError("Could not fetch nearby hospitals");
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleHospitals();
  }, [position]);

  // Merge and deduplicate
  const mergedHospitals = useMemo(() => {
    const verified: HybridHospital[] = internalHospitals.map((h) => ({
      ...h,
      source: "verified" as const,
      distance: position ? calculateDistance(position.lat, position.lng, h.lat, h.lng) : 999,
    }));

    // Deduplicate: if a Google hospital name is too similar to a verified one, skip it
    const deduped = googleHospitals.filter((gh) => {
      return !verified.some((vh) => {
        const nameSimilar =
          vh.name.toLowerCase().includes(gh.name.toLowerCase()) ||
          gh.name.toLowerCase().includes(vh.name.toLowerCase());
        const distClose =
          position
            ? calculateDistance(vh.lat, vh.lng, gh.lat, gh.lng) < 0.3 // within 300m
            : false;
        return nameSimilar || distClose;
      });
    });

    const googleWithDist = deduped.map((h) => ({
      ...h,
      distance: position ? calculateDistance(position.lat, position.lng, h.lat, h.lng) : 999,
    }));

    // Merge: verified first, then google, then sort all by distance
    return [...verified, ...googleWithDist].sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }, [position, googleHospitals]);

  return { hospitals: mergedHospitals, loading, googleError };
}
