import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { hospitals, calculateDistance } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Navigation, Ambulance, Building2 } from "lucide-react";

const statusColors = {
  available: "bg-accent text-accent-foreground",
  busy: "bg-warning text-warning-foreground",
  unavailable: "bg-destructive text-destructive-foreground",
};

const Hospitals = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [filter, setFilter] = useState<string>("all");

  const list = useMemo(() => {
    let data = hospitals.map((h) => ({
      ...h,
      distance: position ? calculateDistance(position.lat, position.lng, h.lat, h.lng) : 0,
    }));
    if (filter !== "all") data = data.filter((h) => h.status === filter);
    return data.sort((a, b) => a.distance - b.distance);
  }, [position, filter]);

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Building2 className="w-6 h-6 text-primary" />
        {t("hospitals")}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "available", "busy", "unavailable"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s === "all" ? t("all") : t(s as any)}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((h) => (
          <Card key={h.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{lang === "ar" ? h.name_ar : h.name}</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? h.address_ar : h.address}</p>
                </div>
                <Badge className={statusColors[h.status]}>{t(h.status as any)}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {h.ambulance && (
                  <span className="flex items-center gap-1 text-accent">
                    <Ambulance className="w-3 h-3" /> {t("ambulance")}
                  </span>
                )}
                <span>{h.distance.toFixed(1)} {t("kmAway")}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <a href={`tel:${h.phone}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full gap-1">
                    <Phone className="w-3 h-3" /> {t("call")}
                  </Button>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button size="sm" variant="outline" className="w-full gap-1">
                    <Navigation className="w-3 h-3" /> {t("directions")}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
