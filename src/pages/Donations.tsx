import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { donations, calculateDistance } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Heart, Ambulance, Droplets, Package } from "lucide-react";

const typeIcons = { ambulance: Ambulance, blood: Droplets, supplies: Package };
const typeLabels = { ambulance: "ambulanceTransport", blood: "bloodDonation", supplies: "medicalSupplies" } as const;

const Donations = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [filter, setFilter] = useState<string>("all");

  const list = useMemo(() => {
    let data = donations.map((d) => ({
      ...d,
      distance: position ? calculateDistance(position.lat, position.lng, d.lat, d.lng) : 0,
    }));
    if (filter !== "all") data = data.filter((d) => d.type === filter);
    return data.sort((a, b) => a.distance - b.distance);
  }, [position, filter]);

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Heart className="w-6 h-6 text-primary" />
        {t("donations")}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "ambulance", "blood", "supplies"].map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>
            {s === "all" ? t("all") : t(typeLabels[s as keyof typeof typeLabels])}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((d) => {
          const Icon = typeIcons[d.type];
          return (
            <Card key={d.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{d.donor_name}</p>
                    <p className="text-xs text-muted-foreground">{lang === "ar" ? d.location_ar : d.location}</p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Icon className="w-3 h-3" />
                    {t(typeLabels[d.type])}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{d.distance.toFixed(1)} {t("kmAway")}</p>
                <a href={`tel:${d.phone}`}>
                  <Button size="sm" variant="outline" className="w-full gap-1">
                    <Phone className="w-3 h-3" /> {t("contact")}
                  </Button>
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Donations;
