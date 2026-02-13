import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation, type GeoStatus } from "@/hooks/useGeolocation";
import { useNearbyHospitals, type HybridHospital } from "@/hooks/useNearbyHospitals";
import { emergencyNumbers } from "@/data/sampleData";
import { egyptCities, type EgyptCity } from "@/data/egyptCities";
import {
  Phone,
  MapPin,
  Navigation,
  Ambulance,
  X,
  ShieldCheck,
  MapPinned,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

const MAX_PRIORITY_KM = 20;

const Emergency = () => {
  const { t, lang } = useLanguage();
  const { position, status, setManualPosition } = useGeolocation();
  const navigate = useNavigate();
  const { hospitals, loading } = useNearbyHospitals(position);

  const needsCitySelection = status === "denied" || status === "unavailable";

  // Split hospitals: prioritize within 20km, then show rest
  const { nearby, far } = useMemo(() => {
    const near: HybridHospital[] = [];
    const distant: HybridHospital[] = [];
    hospitals.forEach((h) => {
      if ((h.distance ?? 999) <= MAX_PRIORITY_KM) near.push(h);
      else distant.push(h);
    });
    return { nearby: near, far: distant };
  }, [hospitals]);

  const handleExitEmergency = () => {
    sessionStorage.removeItem("emergency_active");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-destructive text-destructive-foreground">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-destructive/95 backdrop-blur-sm border-b border-destructive-foreground/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-lg tracking-tight">{t("emergencyTitle")}</span>
        </div>
        <Button
          onClick={handleExitEmergency}
          variant="secondary"
          size="sm"
          className="bg-destructive-foreground/15 hover:bg-destructive-foreground/25 text-destructive-foreground border-0 gap-1.5 font-semibold"
        >
          <X className="w-4 h-4" />
          {t("exitEmergency")}
        </Button>
      </div>

      <div className="container px-4 py-5 space-y-5 max-w-lg mx-auto pb-24">
        {/* Hero */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive-foreground/15 flex items-center justify-center emergency-pulse">
            <Phone className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{t("emergencyTitle")}</h1>
          <p className="text-sm opacity-75">{t("emergencySubtitle")}</p>
          <p className="text-xs opacity-60 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" />
            {status === "granted" && t("gpsDetected")}
            {status === "manual" && t("locationManual")}
            {status === "pending" && t("detectingLocation")}
            {needsCitySelection && !position && t("gpsUnavailable")}
            {needsCitySelection && position && t("locationManual")}
          </p>
        </div>

        {/* City Selector — shown only when GPS denied/unavailable and no position yet */}
        {needsCitySelection && !position && (
          <CitySelector
            lang={lang}
            t={t}
            onSelect={(city) => setManualPosition({ lat: city.lat, lng: city.lng })}
          />
        )}

        {/* Emergency Numbers */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
            {t("emergencyNumbers")}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {emergencyNumbers.map((num) => (
              <a key={num.number} href={`tel:${num.number}`} className="block">
                <div className="rounded-xl bg-destructive-foreground/10 hover:bg-destructive-foreground/20 transition-colors p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive-foreground/15 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">{num.number}</p>
                    <p className="text-xs opacity-70">{lang === "ar" ? num.name_ar : num.name}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Hospital List — only show when we have a position */}
        {position && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
                <Ambulance className="w-4 h-4" />
                {t("nearestHospitals")}
              </h2>
              {loading && (
                <span className="text-xs opacity-60 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t("loadingNearby")}
                </span>
              )}
            </div>

            {/* Nearby hospitals (within 20km) */}
            <div className="space-y-2">
              {nearby.map((h) => (
                <HospitalCard key={h.id} hospital={h} lang={lang} t={t} />
              ))}
            </div>

            {/* Far hospitals (>20km) — shown only if nearby list is small */}
            {far.length > 0 && nearby.length < 3 && (
              <>
                <p className="text-xs opacity-50 text-center pt-2">{t("farHospitalsHidden")}</p>
                <div className="space-y-2 opacity-70">
                  {far.slice(0, 5).map((h) => (
                    <HospitalCard key={h.id} hospital={h} lang={lang} t={t} />
                  ))}
                </div>
              </>
            )}

            {!loading && nearby.length === 0 && far.length === 0 && (
              <p className="text-sm text-center opacity-60 py-4">{t("noResults")}</p>
            )}
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-destructive/95 backdrop-blur-sm border-t border-destructive-foreground/10 p-4">
        <a href="tel:123" className="block max-w-lg mx-auto">
          <Button
            size="lg"
            className="w-full bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90 font-bold text-base gap-2 h-13 rounded-xl"
          >
            <Phone className="w-5 h-5" />
            {t("callEmergency")} — 123
          </Button>
        </a>
      </div>
    </div>
  );
};

/* ---------- City Selector ---------- */
function CitySelector({
  lang,
  t,
  onSelect,
}: {
  lang: string;
  t: (key: any) => string;
  onSelect: (city: EgyptCity) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return egyptCities.slice(0, 12);
    const q = query.toLowerCase();
    return egyptCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.name_ar.includes(q) ||
        c.governorate.toLowerCase().includes(q) ||
        c.governorate_ar.includes(q)
    );
  }, [query]);

  return (
    <div className="rounded-xl bg-destructive-foreground/10 p-4 space-y-3">
      <div className="space-y-1">
        <h3 className="font-bold text-base">{t("selectCity")}</h3>
        <p className="text-xs opacity-70">{t("selectCityDesc")}</p>
      </div>
      <div className="relative">
        <Search className="absolute top-2.5 left-3 w-4 h-4 opacity-50" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchCity")}
          className="pl-9 bg-destructive-foreground/10 border-destructive-foreground/20 text-destructive-foreground placeholder:text-destructive-foreground/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {filtered.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelect(city)}
            className="text-left rounded-lg bg-destructive-foreground/10 hover:bg-destructive-foreground/25 transition-colors p-2.5 space-y-0.5"
          >
            <p className="font-semibold text-sm leading-tight">
              {lang === "ar" ? city.name_ar : city.name}
            </p>
            <p className="text-xs opacity-60">
              {lang === "ar" ? city.governorate_ar : city.governorate}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Hospital Card ---------- */
function HospitalCard({
  hospital: h,
  lang,
  t,
}: {
  hospital: HybridHospital;
  lang: string;
  t: (key: any) => string;
}) {
  const isVerified = h.source === "verified";

  return (
    <div className="rounded-xl bg-destructive-foreground/10 p-4 space-y-3 transition-colors hover:bg-destructive-foreground/15">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <p className="font-bold text-base leading-snug truncate">
            {lang === "ar" ? h.name_ar : h.name}
          </p>
          <p className="text-xs opacity-60 truncate">
            {lang === "ar" ? h.address_ar : h.address}
          </p>
        </div>
        <Badge
          className={
            isVerified
              ? "bg-accent/20 text-accent border-accent/30 shrink-0 gap-1"
              : "bg-destructive-foreground/10 text-destructive-foreground/80 border-destructive-foreground/20 shrink-0 gap-1"
          }
        >
          {isVerified ? <ShieldCheck className="w-3 h-3" /> : <MapPinned className="w-3 h-3" />}
          {isVerified ? t("verifiedHospital") : t("nearbyGoogleMaps")}
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs">
        <span className="font-semibold bg-destructive-foreground/10 px-2 py-0.5 rounded-full">
          {(h.distance ?? 0).toFixed(1)} {t("kmAway")}
        </span>
        {h.ambulance && (
          <span className="flex items-center gap-1 text-accent">
            <Ambulance className="w-3 h-3" /> {t("ambulance")}
          </span>
        )}
        {h.phone && <span className="opacity-60 truncate">{h.phone}</span>}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {h.phone ? (
          <a href={`tel:${h.phone}`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90 gap-1.5 font-semibold rounded-lg"
            >
              <Phone className="w-3.5 h-3.5" /> {t("callNow")}
            </Button>
          </a>
        ) : (
          <div className="flex-1">
            <Button size="sm" disabled className="w-full opacity-40 gap-1.5 rounded-lg">
              <Phone className="w-3.5 h-3.5" /> {t("noPhone")}
            </Button>
          </div>
        )}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            size="sm"
            variant="outline"
            className="w-full border-destructive-foreground/30 text-destructive-foreground hover:bg-destructive-foreground/15 gap-1.5 font-semibold rounded-lg"
          >
            <Navigation className="w-3.5 h-3.5" /> {t("directions")}
          </Button>
        </a>
      </div>
    </div>
  );
}

export default Emergency;
