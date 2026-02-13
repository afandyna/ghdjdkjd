import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, AlertTriangle, Star, Eye, Phone, Navigation, FlaskConical, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { doctors, hospitals, labs, calculateDistance } from "@/data/sampleData";

interface AIResult {
  specialty: string;
  severity: "high" | "medium" | "low";
  nextStep: string;
  confidence: number;
  suggestedTests?: string[];
}

const availabilityColors: Record<string, string> = {
  available: "bg-accent text-accent-foreground",
  busy: "bg-warning text-warning-foreground",
  offline: "bg-muted text-muted-foreground",
};

const AIRouter = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);

  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [duration, setDuration] = useState("");
  const [painLevel, setPainLevel] = useState([5]);
  const [chronicDiseases, setChronicDiseases] = useState("");
  const [emergencyFlags, setEmergencyFlags] = useState({
    chestPain: false,
    breathingDifficulty: false,
    severeBleeding: false,
    lossOfConsciousness: false,
  });

  // Matching doctors based on result
  const matchingDoctors = useMemo(() => {
    if (!result) return [];
    return doctors
      .filter((d) => d.specialty.toLowerCase().includes(result.specialty.toLowerCase()) || result.specialty.toLowerCase().includes(d.specialty.toLowerCase()))
      .map((d) => ({
        ...d,
        distance: position ? calculateDistance(position.lat, position.lng, d.lat, d.lng) : 0,
      }))
      .sort((a, b) => {
        const avOrder = { available: 0, busy: 1, offline: 2 };
        const diff = (avOrder[a.availability] || 0) - (avOrder[b.availability] || 0);
        if (diff !== 0) return diff;
        return a.distance - b.distance;
      })
      .slice(0, 3);
  }, [result, position]);

  const matchingHospitals = useMemo(() => {
    if (!result) return [];
    const isEmergency = result.severity === "high";
    return hospitals
      .filter((h) => h.status !== "unavailable" && (!isEmergency || h.ambulance))
      .map((h) => ({
        ...h,
        distance: position ? calculateDistance(position.lat, position.lng, h.lat, h.lng) : 0,
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [result, position]);

  const matchingLabs = useMemo(() => {
    if (!result?.suggestedTests?.length) return [];
    return labs
      .filter((l) => result.suggestedTests!.some((test) => l.available_tests.some((lt) => lt.toLowerCase().includes(test.toLowerCase()))))
      .map((l) => ({
        ...l,
        distance: position ? calculateDistance(position.lat, position.lng, l.lat, l.lng) : 0,
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [result, position]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("classify-symptoms", {
        body: {
          symptoms,
          age: parseInt(age) || 0,
          gender,
          duration,
          painLevel: painLevel[0],
          chronicDiseases,
          emergencyFlags,
          language: lang,
        },
      });

      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      console.error("AI error:", err);
      toast.error(err.message || "Failed to analyze symptoms");
    } finally {
      setLoading(false);
    }
  };

  const severityConfig = {
    high: { color: "bg-destructive text-destructive-foreground", label: t("highRisk") },
    medium: { color: "bg-warning text-warning-foreground", label: t("mediumRisk") },
    low: { color: "bg-accent text-accent-foreground", label: t("lowRisk") },
  };

  return (
    <div className="container px-4 py-6 space-y-6 max-w-lg mx-auto">
      <div className="text-center space-y-1">
        <Stethoscope className="w-10 h-10 mx-auto text-primary" />
        <h1 className="text-2xl font-bold">{t("aiTitle")}</h1>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-warning/10 border border-warning/30 px-3 py-2 text-sm">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <p>{t("disclaimer")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{t("symptoms")} *</Label>
          <Textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>{t("age")}</Label>
            <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={0} max={120} />
          </div>
          <div className="space-y-2">
            <Label>{t("gender")}</Label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="male">{t("male")}</option>
              <option value="female">{t("female")}</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("duration")}</Label>
          <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 2 days" />
        </div>

        <div className="space-y-2">
          <Label>{t("painLevel")}: {painLevel[0]}/10</Label>
          <Slider value={painLevel} onValueChange={setPainLevel} min={1} max={10} step={1} />
        </div>

        <div className="space-y-2">
          <Label>{t("chronicDiseases")}</Label>
          <Input value={chronicDiseases} onChange={(e) => setChronicDiseases(e.target.value)} />
        </div>

        <div className="space-y-3">
          <Label className="text-destructive font-semibold">{t("emergencySymptoms")}</Label>
          {(["chestPain", "breathingDifficulty", "severeBleeding", "lossOfConsciousness"] as const).map((flag) => (
            <div key={flag} className="flex items-center gap-2">
              <Checkbox
                checked={emergencyFlags[flag]}
                onCheckedChange={(checked) =>
                  setEmergencyFlags((prev) => ({ ...prev, [flag]: !!checked }))
                }
              />
              <Label className="font-normal">{t(flag)}</Label>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? t("analyzing") : t("analyze")}
        </Button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">{t("specialty")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{result.specialty}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("severity")}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityConfig[result.severity].color}`}>
                  {severityConfig[result.severity].label}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">{t("nextStep")}</p>
                <p className="text-sm text-muted-foreground">{result.nextStep}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("confidence")}</span>
                <span className="text-sm font-semibold">{result.confidence}%</span>
              </div>

              {/* Suggested Tests */}
              {result.suggestedTests && result.suggestedTests.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1"><FlaskConical className="w-4 h-4" /> {t("suggestedTests")}</p>
                  <div className="flex flex-wrap gap-1">
                    {result.suggestedTests.map((test) => (
                      <Badge key={test} variant="secondary">{test}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matching Doctors */}
          {matchingDoctors.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">{t("matchingDoctors")}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {matchingDoctors.map((d) => (
                  <div key={d.id} className="flex items-start justify-between border-b last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{lang === "ar" ? d.name_ar : d.name}</p>
                      <p className="text-xs text-muted-foreground">{lang === "ar" ? d.clinic_ar : d.clinic}</p>
                      <p className="text-xs text-muted-foreground">{d.distance.toFixed(1)} {t("kmAway")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`text-xs ${availabilityColors[d.availability]}`}>{t(d.availability as any)}</Badge>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-warning text-warning" /> {d.rating}
                        <span className="mx-0.5">•</span>
                        <Eye className="w-3 h-3" /> {d.visits.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                <Link to={`/doctors?specialty=${encodeURIComponent(result.specialty)}`}>
                  <Button variant="outline" className="w-full mt-2">{t("findSpecialist")}</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Matching Hospitals */}
          {matchingHospitals.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-1"><Building2 className="w-4 h-4" /> {t("matchingHospitals")}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {matchingHospitals.map((h) => (
                  <div key={h.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{lang === "ar" ? h.name_ar : h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.distance.toFixed(1)} {t("kmAway")}</p>
                    </div>
                    <div className="flex gap-1">
                      <a href={`tel:${h.phone}`}><Button size="sm" variant="outline"><Phone className="w-3 h-3" /></Button></a>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline"><Navigation className="w-3 h-3" /></Button>
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Matching Labs */}
          {matchingLabs.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-1"><FlaskConical className="w-4 h-4" /> {t("labs")}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {matchingLabs.map((l) => (
                  <div key={l.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{lang === "ar" ? l.name_ar : l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.distance.toFixed(1)} {t("kmAway")}</p>
                    </div>
                    <a href={`tel:${l.phone}`}><Button size="sm" variant="outline"><Phone className="w-3 h-3" /></Button></a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRouter;
