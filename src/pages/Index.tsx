import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Phone, Building2, Pill, Search, MapPin, FlaskConical, Heart, X, Star, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { hospitals, doctors, pharmacies, donations, labs, calculateDistance } from "@/data/sampleData";

const quickActions = [
  { key: "aiRouter" as const, icon: Stethoscope, path: "/ai-router", color: "bg-primary" },
  { key: "emergency" as const, icon: Phone, path: "/emergency", color: "bg-destructive" },
  { key: "findHospital" as const, icon: Building2, path: "/hospitals", color: "bg-accent" },
  { key: "findPharmacy" as const, icon: Pill, path: "/pharmacies", color: "bg-accent" },
  { key: "labs" as const, icon: FlaskConical, path: "/labs", color: "bg-primary" },
  { key: "donations" as const, icon: Heart, path: "/donations", color: "bg-destructive" },
];

const Index = () => {
  const { t, lang } = useLanguage();
  const { position, error } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedHospitals = hospitals.filter(
      (h) => h.name.toLowerCase().includes(q) || h.name_ar.includes(q) || h.address.toLowerCase().includes(q) || h.address_ar.includes(q)
    ).map((h) => ({ ...h, distance: position ? calculateDistance(position.lat, position.lng, h.lat, h.lng) : 0 }));

    const matchedDoctors = doctors.filter(
      (d) => d.name.toLowerCase().includes(q) || d.name_ar.includes(q) || d.specialty.toLowerCase().includes(q) || d.specialty_ar.includes(q) || d.clinic.toLowerCase().includes(q)
    ).map((d) => ({ ...d, distance: position ? calculateDistance(position.lat, position.lng, d.lat, d.lng) : 0 }));

    const matchedPharmacies = pharmacies.filter(
      (p) => p.name.toLowerCase().includes(q) || p.name_ar.includes(q) || p.address.toLowerCase().includes(q) || p.address_ar.includes(q)
    ).map((p) => ({ ...p, distance: position ? calculateDistance(position.lat, position.lng, p.lat, p.lng) : 0 }));

    const matchedLabs = labs.filter(
      (l) => l.name.toLowerCase().includes(q) || l.name_ar.includes(q) || l.available_tests.some((t) => t.toLowerCase().includes(q))
    ).map((l) => ({ ...l, distance: position ? calculateDistance(position.lat, position.lng, l.lat, l.lng) : 0 }));

    const matchedDonations = donations.filter(
      (d) => d.donor_name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || d.location_ar.includes(q)
    );

    const total = matchedHospitals.length + matchedDoctors.length + matchedPharmacies.length + matchedLabs.length + matchedDonations.length;

    return { hospitals: matchedHospitals, doctors: matchedDoctors, pharmacies: matchedPharmacies, labs: matchedLabs, donations: matchedDonations, total };
  }, [searchQuery, position]);

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">{t("appName")}</h1>
        <p className="text-lg font-medium text-foreground">{t("tagline")}</p>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* GPS Banner */}
      <div className="flex items-center gap-2 rounded-lg bg-accent/20 px-3 py-2 text-sm">
        <MapPin className="w-4 h-4 text-accent" />
        <span>{position ? t("gpsDetected") : error || t("detectingLocation")}</span>
      </div>

      {/* Live Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute top-3 w-4 h-4 text-muted-foreground" style={{ left: "0.75rem" }} />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-3 text-muted-foreground hover:text-foreground"
              style={{ right: "0.75rem" }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            {t("searchResults")}: {searchResults.total}
          </p>

          {searchResults.hospitals.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold flex items-center gap-1"><Building2 className="w-4 h-4" /> {t("hospitals")}</h3>
              {searchResults.hospitals.map((h) => (
                <Link key={h.id} to="/hospitals">
                  <Card className="hover:shadow-sm"><CardContent className="p-3">
                    <p className="font-medium text-sm">{lang === "ar" ? h.name_ar : h.name}</p>
                    <p className="text-xs text-muted-foreground">{lang === "ar" ? h.address_ar : h.address} • {h.distance.toFixed(1)} {t("kmAway")}</p>
                  </CardContent></Card>
                </Link>
              ))}
            </div>
          )}

          {searchResults.doctors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold flex items-center gap-1"><Stethoscope className="w-4 h-4" /> {t("doctors")}</h3>
              {searchResults.doctors.map((d) => (
                <Link key={d.id} to={`/doctors?specialty=${d.specialty}`}>
                  <Card className="hover:shadow-sm"><CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{lang === "ar" ? d.name_ar : d.name}</p>
                        <p className="text-xs text-primary">{lang === "ar" ? d.specialty_ar : d.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-warning text-warning" /> {d.rating}
                        <span className="mx-1">•</span>
                        <Eye className="w-3 h-3" /> {d.visits.toLocaleString()}
                      </div>
                    </div>
                  </CardContent></Card>
                </Link>
              ))}
            </div>
          )}

          {searchResults.pharmacies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold flex items-center gap-1"><Pill className="w-4 h-4" /> {t("pharmacies")}</h3>
              {searchResults.pharmacies.map((p) => (
                <Link key={p.id} to="/pharmacies">
                  <Card className="hover:shadow-sm"><CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{lang === "ar" ? p.name_ar : p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.distance.toFixed(1)} {t("kmAway")}</p>
                      </div>
                      <Badge className={p.is_open ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}>
                        {p.is_open ? t("open") : t("closed")}
                      </Badge>
                    </div>
                  </CardContent></Card>
                </Link>
              ))}
            </div>
          )}

          {searchResults.labs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold flex items-center gap-1"><FlaskConical className="w-4 h-4" /> {t("labs")}</h3>
              {searchResults.labs.map((l) => (
                <Link key={l.id} to="/labs">
                  <Card className="hover:shadow-sm"><CardContent className="p-3">
                    <p className="font-medium text-sm">{lang === "ar" ? l.name_ar : l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.distance.toFixed(1)} {t("kmAway")}</p>
                  </CardContent></Card>
                </Link>
              ))}
            </div>
          )}

          {searchResults.total === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">{t("noResults")}</p>
          )}
        </div>
      )}

      {/* Quick Actions - only show when not searching */}
      {!searchResults && (
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.key} to={action.path}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center gap-2 p-4">
                    <div className={`flex items-center justify-center w-11 h-11 rounded-full ${action.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-center">{t(action.key)}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      {!searchResults && <p className="text-xs text-center text-muted-foreground px-4">{t("disclaimer")}</p>}
    </div>
  );
};

export default Index;
