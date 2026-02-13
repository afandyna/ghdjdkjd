export interface Hospital {
  id: string;
  name: string;
  name_ar: string;
  phone: string;
  address: string;
  address_ar: string;
  lat: number;
  lng: number;
  ambulance: boolean;
  status: "available" | "busy" | "unavailable";
  distance?: number;
}

export interface Doctor {
  id: string;
  name: string;
  name_ar: string;
  specialty: string;
  specialty_ar: string;
  clinic: string;
  clinic_ar: string;
  phone: string;
  lat: number;
  lng: number;
  rating: number;
  visits: number;
  availability: "available" | "busy" | "offline";
  available_days: string[];
  available_slots: string[];
  distance?: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
  phone: string;
  lat: number;
  lng: number;
  is_open: boolean;
  distance?: number;
}

export interface Donation {
  id: string;
  donor_name: string;
  type: "ambulance" | "blood" | "supplies";
  location: string;
  location_ar: string;
  phone: string;
  lat: number;
  lng: number;
  distance?: number;
}

export interface Lab {
  id: string;
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
  phone: string;
  lat: number;
  lng: number;
  available_tests: string[];
  available_tests_ar: string[];
  distance?: number;
}

export interface Booking {
  id: string;
  doctor_id: string;
  patient_name: string;
  booking_date: string;
  booking_time: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export const hospitals: Hospital[] = [
  { id: "h1", name: "Al-Noor General Hospital", name_ar: "مستشفى النور العام", phone: "+20-2-123-4567", address: "Tahrir Square, Cairo", address_ar: "ميدان التحرير، القاهرة", lat: 30.0444, lng: 31.2357, ambulance: true, status: "available" },
  { id: "h2", name: "Royal Care Medical Center", name_ar: "مركز الرعاية الملكي", phone: "+20-2-234-5678", address: "Nasr City, Cairo", address_ar: "مدينة نصر، القاهرة", lat: 30.0511, lng: 31.3656, ambulance: true, status: "available" },
  { id: "h3", name: "Al-Shifa Hospital", name_ar: "مستشفى الشفاء", phone: "+20-2-345-6789", address: "Heliopolis, Cairo", address_ar: "مصر الجديدة، القاهرة", lat: 30.0866, lng: 31.3417, ambulance: false, status: "busy" },
  { id: "h4", name: "Ain Shams University Hospital", name_ar: "مستشفى عين شمس الجامعي", phone: "+20-2-456-7890", address: "Ain Shams, Cairo", address_ar: "عين شمس، القاهرة", lat: 30.0761, lng: 31.2828, ambulance: true, status: "available" },
  { id: "h5", name: "Kasr Al-Ainy Hospital", name_ar: "مستشفى قصر العيني", phone: "+20-2-567-8901", address: "Kasr Al-Ainy, Cairo", address_ar: "قصر العيني، القاهرة", lat: 30.0322, lng: 31.2285, ambulance: true, status: "busy" },
  { id: "h6", name: "Dar Al-Fouad Hospital", name_ar: "مستشفى دار الفؤاد", phone: "+20-2-678-9012", address: "6th October, Giza", address_ar: "السادس من أكتوبر، الجيزة", lat: 30.0131, lng: 31.0087, ambulance: true, status: "available" },
  { id: "h7", name: "Cleopatra Hospital", name_ar: "مستشفى كليوباترا", phone: "+20-2-789-0123", address: "Salah Salem, Cairo", address_ar: "صلاح سالم، القاهرة", lat: 30.0686, lng: 31.2700, ambulance: true, status: "available" },
  { id: "h8", name: "Al-Salam International Hospital", name_ar: "مستشفى السلام الدولي", phone: "+20-2-890-1234", address: "Maadi, Cairo", address_ar: "المعادي، القاهرة", lat: 29.9597, lng: 31.2569, ambulance: false, status: "available" },
  { id: "h9", name: "Nasser Institute Hospital", name_ar: "معهد ناصر", phone: "+20-2-901-2345", address: "Shubra, Cairo", address_ar: "شبرا، القاهرة", lat: 30.0812, lng: 31.2456, ambulance: true, status: "busy" },
  { id: "h10", name: "Al-Galaa Military Hospital", name_ar: "مستشفى الجلاء العسكري", phone: "+20-2-012-3456", address: "Heliopolis, Cairo", address_ar: "مصر الجديدة، القاهرة", lat: 30.0911, lng: 31.3300, ambulance: true, status: "available" },
];

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Ahmed Al-Farsi", name_ar: "د. أحمد الفارسي", specialty: "Cardiology", specialty_ar: "أمراض القلب", clinic: "Heart Care Clinic", clinic_ar: "عيادة رعاية القلب", phone: "+20-10-111-1111", lat: 30.0444, lng: 31.2357, rating: 4.8, visits: 1245, availability: "available", available_days: ["Sun", "Mon", "Tue", "Wed", "Thu"], available_slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { id: "d2", name: "Dr. Sara Hassan", name_ar: "د. سارة حسن", specialty: "Ophthalmology", specialty_ar: "طب العيون", clinic: "Vision Plus", clinic_ar: "فيجن بلس", phone: "+20-10-222-2222", lat: 30.0511, lng: 31.3656, rating: 4.9, visits: 980, availability: "available", available_days: ["Sun", "Mon", "Wed", "Thu"], available_slots: ["10:00", "11:00", "12:00", "15:00", "16:00"] },
  { id: "d3", name: "Dr. Omar Khalid", name_ar: "د. عمر خالد", specialty: "Orthopedics", specialty_ar: "جراحة العظام", clinic: "Bone & Joint Center", clinic_ar: "مركز العظام والمفاصل", phone: "+20-10-333-3333", lat: 30.0866, lng: 31.3417, rating: 4.7, visits: 756, availability: "busy", available_days: ["Sun", "Tue", "Thu"], available_slots: ["09:00", "10:00", "14:00", "15:00"] },
  { id: "d4", name: "Dr. Fatima Al-Rashid", name_ar: "د. فاطمة الراشد", specialty: "Dermatology", specialty_ar: "الأمراض الجلدية", clinic: "Skin Care Clinic", clinic_ar: "عيادة العناية بالبشرة", phone: "+20-10-444-4444", lat: 30.0761, lng: 31.2828, rating: 4.6, visits: 432, availability: "available", available_days: ["Mon", "Wed", "Thu"], available_slots: ["10:00", "11:00", "15:00", "16:00", "17:00"] },
  { id: "d5", name: "Dr. Youssef Nabil", name_ar: "د. يوسف نبيل", specialty: "Internal Medicine", specialty_ar: "الطب الباطني", clinic: "General Medicine Center", clinic_ar: "مركز الطب العام", phone: "+20-10-555-5555", lat: 30.0322, lng: 31.2285, rating: 4.5, visits: 1890, availability: "available", available_days: ["Sun", "Mon", "Tue", "Wed", "Thu"], available_slots: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"] },
  { id: "d6", name: "Dr. Layla Ibrahim", name_ar: "د. ليلى إبراهيم", specialty: "Pediatrics", specialty_ar: "طب الأطفال", clinic: "Kids Health Clinic", clinic_ar: "عيادة صحة الأطفال", phone: "+20-10-666-6666", lat: 30.0131, lng: 31.0087, rating: 4.9, visits: 2100, availability: "offline", available_days: ["Sun", "Mon", "Tue"], available_slots: ["09:00", "10:00", "11:00", "14:00"] },
  { id: "d7", name: "Dr. Khaled Mansour", name_ar: "د. خالد منصور", specialty: "Neurology", specialty_ar: "طب الأعصاب", clinic: "Neuro Care", clinic_ar: "رعاية الأعصاب", phone: "+20-10-777-7777", lat: 30.0686, lng: 31.2700, rating: 4.4, visits: 623, availability: "available", available_days: ["Sun", "Tue", "Thu"], available_slots: ["10:00", "11:00", "12:00", "15:00"] },
  { id: "d8", name: "Dr. Nour Al-Din", name_ar: "د. نور الدين", specialty: "ENT", specialty_ar: "أنف وأذن وحنجرة", clinic: "ENT Specialists", clinic_ar: "أخصائيو الأنف والأذن", phone: "+20-10-888-8888", lat: 29.9597, lng: 31.2569, rating: 4.7, visits: 890, availability: "available", available_days: ["Mon", "Wed", "Thu"], available_slots: ["09:00", "10:00", "14:00", "15:00", "16:00"] },
  { id: "d9", name: "Dr. Hana Saeed", name_ar: "د. هناء سعيد", specialty: "Pulmonology", specialty_ar: "أمراض الرئة", clinic: "Lung Care Center", clinic_ar: "مركز رعاية الرئة", phone: "+20-10-999-9999", lat: 30.0812, lng: 31.2456, rating: 4.6, visits: 510, availability: "busy", available_days: ["Sun", "Tue", "Wed"], available_slots: ["10:00", "11:00", "14:00"] },
  { id: "d10", name: "Dr. Rami Tawfik", name_ar: "د. رامي توفيق", specialty: "Emergency Medicine", specialty_ar: "طب الطوارئ", clinic: "ER Specialists", clinic_ar: "أخصائيو الطوارئ", phone: "+20-10-101-0101", lat: 30.0911, lng: 31.3300, rating: 4.8, visits: 3200, availability: "available", available_days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], available_slots: ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"] },
  { id: "d11", name: "Dr. Mona Faisal", name_ar: "د. منى فيصل", specialty: "Gynecology", specialty_ar: "أمراض النساء", clinic: "Women's Health", clinic_ar: "صحة المرأة", phone: "+20-10-111-0000", lat: 30.0500, lng: 31.2400, rating: 4.5, visits: 1567, availability: "available", available_days: ["Sun", "Mon", "Wed"], available_slots: ["09:00", "10:00", "11:00", "15:00", "16:00"] },
  { id: "d12", name: "Dr. Tariq Hamad", name_ar: "د. طارق حمد", specialty: "Urology", specialty_ar: "جراحة المسالك البولية", clinic: "Urology Center", clinic_ar: "مركز المسالك البولية", phone: "+20-10-222-0000", lat: 30.0600, lng: 31.2500, rating: 4.3, visits: 340, availability: "offline", available_days: ["Tue", "Thu"], available_slots: ["10:00", "11:00", "14:00", "15:00"] },
  { id: "d13", name: "Dr. Aisha Mahmoud", name_ar: "د. عائشة محمود", specialty: "Psychiatry", specialty_ar: "الطب النفسي", clinic: "Mind Wellness", clinic_ar: "العافية النفسية", phone: "+20-10-333-0000", lat: 30.0450, lng: 31.2600, rating: 4.7, visits: 789, availability: "available", available_days: ["Sun", "Mon", "Tue", "Wed"], available_slots: ["10:00", "11:00", "14:00", "15:00", "16:00"] },
  { id: "d14", name: "Dr. Faris Al-Otaibi", name_ar: "د. فارس العتيبي", specialty: "General Surgery", specialty_ar: "الجراحة العامة", clinic: "Surgical Center", clinic_ar: "المركز الجراحي", phone: "+20-10-444-0000", lat: 30.0350, lng: 31.2300, rating: 4.6, visits: 1100, availability: "busy", available_days: ["Sun", "Tue", "Thu"], available_slots: ["08:00", "09:00", "14:00"] },
  { id: "d15", name: "Dr. Noura Saleh", name_ar: "د. نورة صالح", specialty: "Endocrinology", specialty_ar: "الغدد الصماء", clinic: "Hormone Care", clinic_ar: "رعاية الهرمونات", phone: "+20-10-555-0000", lat: 30.0700, lng: 31.2800, rating: 4.8, visits: 670, availability: "available", available_days: ["Mon", "Wed", "Thu"], available_slots: ["09:00", "10:00", "11:00", "15:00", "16:00"] },
];

export const pharmacies: Pharmacy[] = [
  { id: "p1", name: "El-Ezaby Pharmacy", name_ar: "صيدلية العزبي", address: "Tahrir Square, Cairo", address_ar: "ميدان التحرير، القاهرة", phone: "+20-2-111-0001", lat: 30.0444, lng: 31.2357, is_open: true },
  { id: "p2", name: "Seif Pharmacy", name_ar: "صيدلية سيف", address: "Nasr City, Cairo", address_ar: "مدينة نصر، القاهرة", phone: "+20-2-222-0002", lat: 30.0511, lng: 31.3656, is_open: true },
  { id: "p3", name: "Roshdy Pharmacy", name_ar: "صيدلية رشدي", address: "Heliopolis, Cairo", address_ar: "مصر الجديدة، القاهرة", phone: "+20-2-333-0003", lat: 30.0866, lng: 31.3417, is_open: false },
  { id: "p4", name: "Al-Amal Pharmacy", name_ar: "صيدلية الأمل", address: "Maadi, Cairo", address_ar: "المعادي، القاهرة", phone: "+20-2-444-0004", lat: 29.9597, lng: 31.2569, is_open: true },
  { id: "p5", name: "Misr Pharmacy", name_ar: "صيدلية مصر", address: "Dokki, Giza", address_ar: "الدقي، الجيزة", phone: "+20-2-555-0005", lat: 30.0382, lng: 31.2119, is_open: true },
  { id: "p6", name: "Al-Hayat Pharmacy", name_ar: "صيدلية الحياة", address: "Mohandessin, Giza", address_ar: "المهندسين، الجيزة", phone: "+20-2-666-0006", lat: 30.0561, lng: 31.2001, is_open: false },
  { id: "p7", name: "Care Pharmacy", name_ar: "صيدلية كير", address: "Shubra, Cairo", address_ar: "شبرا، القاهرة", phone: "+20-2-777-0007", lat: 30.0812, lng: 31.2456, is_open: true },
  { id: "p8", name: "United Pharmacy", name_ar: "الصيدلية المتحدة", address: "6th October, Giza", address_ar: "السادس من أكتوبر، الجيزة", phone: "+20-2-888-0008", lat: 30.0131, lng: 31.0087, is_open: true },
];

export const donations: Donation[] = [
  { id: "dn1", donor_name: "Egyptian Red Crescent", type: "ambulance", location: "Downtown Cairo", location_ar: "وسط القاهرة", phone: "+20-2-900-0001", lat: 30.0444, lng: 31.2357 },
  { id: "dn2", donor_name: "National Blood Bank", type: "blood", location: "Ain Shams, Cairo", location_ar: "عين شمس، القاهرة", phone: "+20-2-900-0002", lat: 30.0761, lng: 31.2828 },
  { id: "dn3", donor_name: "Medical Supply Co.", type: "supplies", location: "Nasr City, Cairo", location_ar: "مدينة نصر، القاهرة", phone: "+20-2-900-0003", lat: 30.0511, lng: 31.3656 },
  { id: "dn4", donor_name: "Ahmad Charity Fund", type: "blood", location: "Heliopolis, Cairo", location_ar: "مصر الجديدة، القاهرة", phone: "+20-10-900-0004", lat: 30.0866, lng: 31.3417 },
  { id: "dn5", donor_name: "Emergency Aid Foundation", type: "ambulance", location: "Maadi, Cairo", location_ar: "المعادي، القاهرة", phone: "+20-2-900-0005", lat: 29.9597, lng: 31.2569 },
];

export const labs: Lab[] = [
  { id: "l1", name: "Al-Borg Laboratories", name_ar: "معامل البرج", address: "Nasr City, Cairo", address_ar: "مدينة نصر، القاهرة", phone: "+20-2-100-0001", lat: 30.0511, lng: 31.3656, available_tests: ["CBC", "Blood Sugar", "Liver Function", "Kidney Function", "Thyroid", "Urine Analysis", "X-Ray"], available_tests_ar: ["صورة دم كاملة", "سكر الدم", "وظائف الكبد", "وظائف الكلى", "الغدة الدرقية", "تحليل بول", "أشعة سينية"] },
  { id: "l2", name: "El-Mokhtabar Laboratories", name_ar: "معامل المختبر", address: "Heliopolis, Cairo", address_ar: "مصر الجديدة، القاهرة", phone: "+20-2-100-0002", lat: 30.0866, lng: 31.3417, available_tests: ["CBC", "Blood Sugar", "MRI", "CT Scan", "Urine Analysis", "Lipid Profile"], available_tests_ar: ["صورة دم كاملة", "سكر الدم", "رنين مغناطيسي", "أشعة مقطعية", "تحليل بول", "دهون الدم"] },
  { id: "l3", name: "Cairo Scan Radiology", name_ar: "كايرو سكان للأشعة", address: "Dokki, Giza", address_ar: "الدقي، الجيزة", phone: "+20-2-100-0003", lat: 30.0382, lng: 31.2119, available_tests: ["X-Ray", "MRI", "CT Scan", "Ultrasound", "Mammogram", "Bone Density"], available_tests_ar: ["أشعة سينية", "رنين مغناطيسي", "أشعة مقطعية", "سونار", "ماموجرام", "كثافة العظام"] },
  { id: "l4", name: "Alfa Lab", name_ar: "معامل ألفا", address: "Maadi, Cairo", address_ar: "المعادي، القاهرة", phone: "+20-2-100-0004", lat: 29.9597, lng: 31.2569, available_tests: ["CBC", "Blood Sugar", "Liver Function", "Kidney Function", "Vitamin D", "Iron", "Urine Analysis"], available_tests_ar: ["صورة دم كاملة", "سكر الدم", "وظائف الكبد", "وظائف الكلى", "فيتامين د", "حديد", "تحليل بول"] },
  { id: "l5", name: "Nile Radiology Center", name_ar: "مركز النيل للأشعة", address: "Downtown Cairo", address_ar: "وسط القاهرة", phone: "+20-2-100-0005", lat: 30.0444, lng: 31.2357, available_tests: ["X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG", "Echo"], available_tests_ar: ["أشعة سينية", "رنين مغناطيسي", "أشعة مقطعية", "سونار", "رسم قلب", "إيكو"] },
];

export const emergencyNumbers = [
  { name: "Ambulance", name_ar: "الإسعاف", number: "123" },
  { name: "Police", name_ar: "الشرطة", number: "122" },
  { name: "Fire", name_ar: "الإطفاء", number: "180" },
  { name: "Traffic Accidents", name_ar: "حوادث المرور", number: "128" },
];

// In-memory bookings store
export const bookings: Booking[] = [];

export function addBooking(booking: Omit<Booking, "id" | "created_at">): Booking {
  const newBooking: Booking = {
    ...booking,
    id: `b${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  bookings.push(newBooking);
  return newBooking;
}

export function cancelBooking(id: string): boolean {
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx >= 0) {
    bookings[idx].status = "cancelled";
    return true;
  }
  return false;
}

export function isSlotBooked(doctorId: string, date: string, time: string): boolean {
  return bookings.some(
    (b) => b.doctor_id === doctorId && b.booking_date === date && b.booking_time === time && b.status !== "cancelled"
  );
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
