import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { doctors, calculateDistance, addBooking, isSlotBooked } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Star, UserRound, Eye } from "lucide-react";
import { toast } from "sonner";

const availabilityColors: Record<string, string> = {
  available: "bg-accent text-accent-foreground",
  busy: "bg-warning text-warning-foreground",
  offline: "bg-muted text-muted-foreground",
};

const Doctors = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [searchParams] = useSearchParams();
  const specialtyFilter = searchParams.get("specialty") || "";

  const specialties = useMemo(() => [...new Set(doctors.map((d) => d.specialty))], []);
  const [filter, setFilter] = useState(specialtyFilter);
  const [bookingDoctor, setBookingDoctor] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [patientName, setPatientName] = useState("");

  const list = useMemo(() => {
    let data = doctors.map((d) => ({
      ...d,
      distance: position ? calculateDistance(position.lat, position.lng, d.lat, d.lng) : 0,
    }));
    if (filter) data = data.filter((d) => d.specialty.toLowerCase().includes(filter.toLowerCase()));
    return data.sort((a, b) => {
      // Sort: available first, then by distance
      const avOrder = { available: 0, busy: 1, offline: 2 };
      const diff = (avOrder[a.availability] || 0) - (avOrder[b.availability] || 0);
      if (diff !== 0) return diff;
      return a.distance - b.distance;
    });
  }, [position, filter]);

  const handleBook = (doctorId: string) => {
    if (!patientName.trim() || !bookingDate || !bookingTime) {
      toast.error("Please fill all fields");
      return;
    }
    if (isSlotBooked(doctorId, bookingDate, bookingTime)) {
      toast.error(t("slotTaken"));
      return;
    }
    addBooking({ doctor_id: doctorId, patient_name: patientName, booking_date: bookingDate, booking_time: bookingTime, status: "confirmed" });
    toast.success(t("bookingConfirmed"));
    setBookingDoctor(null);
    setPatientName("");
    setBookingDate("");
    setBookingTime("");
  };

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UserRound className="w-6 h-6 text-primary" />
        {t("doctors")}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button variant={!filter ? "default" : "outline"} size="sm" onClick={() => setFilter("")}>
          {t("all")}
        </Button>
        {specialties.map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
            className="whitespace-nowrap"
          >
            {s}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{lang === "ar" ? d.name_ar : d.name}</p>
                  <p className="text-xs text-primary font-medium">
                    {lang === "ar" ? d.specialty_ar : d.specialty}
                  </p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? d.clinic_ar : d.clinic}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{d.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>{d.visits.toLocaleString()} {t("visits")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{d.distance.toFixed(1)} {t("kmAway")}</p>
                <Badge className={availabilityColors[d.availability]}>
                  {t(d.availability as any)}
                </Badge>
              </div>
              <div className="flex gap-2 pt-1">
                <a href={`tel:${d.phone}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full gap-1">
                    <Phone className="w-3 h-3" /> {t("call")}
                  </Button>
                </a>
                <Dialog open={bookingDoctor === d.id} onOpenChange={(open) => setBookingDoctor(open ? d.id : null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1 gap-1" disabled={d.availability === "offline"}>
                      {t("book")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>{t("bookAppointment")} - {lang === "ar" ? d.name_ar : d.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">{t("availableDays")}: {d.available_days.join(", ")}</p>
                      </div>
                      <div className="space-y-1">
                        <Label>{t("patientName")}</Label>
                        <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label>{t("selectDate")}</Label>
                        <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label>{t("selectTime")}</Label>
                        <div className="flex flex-wrap gap-1">
                          {d.available_slots.map((slot) => {
                            const taken = bookingDate && isSlotBooked(d.id, bookingDate, slot);
                            return (
                              <Button
                                key={slot}
                                size="sm"
                                variant={bookingTime === slot ? "default" : "outline"}
                                onClick={() => !taken && setBookingTime(slot)}
                                disabled={!!taken}
                                className="text-xs"
                              >
                                {slot}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => handleBook(d.id)}>
                        {t("confirmBooking")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
