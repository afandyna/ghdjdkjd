import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { pharmacies, calculateDistance } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Navigation, Pill } from "lucide-react";

const Pharmacies = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();

  const list = useMemo(() => {
    return pharmacies
      .map((p) => ({
        ...p,
        distance: position ? calculateDistance(position.lat, position.lng, p.lat, p.lng) : 0,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [position]);

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Pill className="w-6 h-6 text-primary" />
        {t("pharmacies")}
      </h1>

      <div className="space-y-3">
        {list.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{lang === "ar" ? p.name_ar : p.name}</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? p.address_ar : p.address}</p>
                </div>
                <Badge className={p.is_open ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}>
                  {p.is_open ? t("open") : t("closed")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{p.distance.toFixed(1)} {t("kmAway")}</p>
              <div className="flex gap-2 pt-1">
                <a href={`tel:${p.phone}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full gap-1">
                    <Phone className="w-3 h-3" /> {t("call")}
                  </Button>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
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

export default Pharmacies;
