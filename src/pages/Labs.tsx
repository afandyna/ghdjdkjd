import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { labs, calculateDistance } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Navigation, FlaskConical } from "lucide-react";

const Labs = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();

  const list = useMemo(() => {
    return labs
      .map((l) => ({
        ...l,
        distance: position ? calculateDistance(position.lat, position.lng, l.lat, l.lng) : 0,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [position]);

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FlaskConical className="w-6 h-6 text-primary" />
        {t("labs")}
      </h1>

      <div className="space-y-3">
        {list.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4 space-y-2">
              <div>
                <p className="font-semibold">{lang === "ar" ? l.name_ar : l.name}</p>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? l.address_ar : l.address}</p>
              </div>
              <p className="text-xs text-muted-foreground">{l.distance.toFixed(1)} {t("kmAway")}</p>
              <div className="flex flex-wrap gap-1">
                {(lang === "ar" ? l.available_tests_ar : l.available_tests).map((test) => (
                  <Badge key={test} variant="secondary" className="text-xs">
                    {test}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <a href={`tel:${l.phone}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full gap-1">
                    <Phone className="w-3 h-3" /> {t("call")}
                  </Button>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`}
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

export default Labs;
