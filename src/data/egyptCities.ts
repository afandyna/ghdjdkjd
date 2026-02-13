export interface EgyptCity {
  id: string;
  name: string;
  name_ar: string;
  lat: number;
  lng: number;
  governorate: string;
  governorate_ar: string;
}

export const egyptCities: EgyptCity[] = [
  { id: "cairo", name: "Cairo", name_ar: "القاهرة", lat: 30.0444, lng: 31.2357, governorate: "Cairo", governorate_ar: "القاهرة" },
  { id: "giza", name: "Giza", name_ar: "الجيزة", lat: 30.0131, lng: 31.2089, governorate: "Giza", governorate_ar: "الجيزة" },
  { id: "alexandria", name: "Alexandria", name_ar: "الإسكندرية", lat: 31.2001, lng: 29.9187, governorate: "Alexandria", governorate_ar: "الإسكندرية" },
  { id: "mansoura", name: "Mansoura", name_ar: "المنصورة", lat: 31.0409, lng: 31.3785, governorate: "Dakahlia", governorate_ar: "الدقهلية" },
  { id: "tanta", name: "Tanta", name_ar: "طنطا", lat: 30.7865, lng: 31.0004, governorate: "Gharbia", governorate_ar: "الغربية" },
  { id: "asyut", name: "Asyut", name_ar: "أسيوط", lat: 27.1783, lng: 31.1859, governorate: "Asyut", governorate_ar: "أسيوط" },
  { id: "ismailia", name: "Ismailia", name_ar: "الإسماعيلية", lat: 30.5965, lng: 32.2715, governorate: "Ismailia", governorate_ar: "الإسماعيلية" },
  { id: "port-said", name: "Port Said", name_ar: "بورسعيد", lat: 31.2653, lng: 32.3019, governorate: "Port Said", governorate_ar: "بورسعيد" },
  { id: "suez", name: "Suez", name_ar: "السويس", lat: 29.9668, lng: 32.5498, governorate: "Suez", governorate_ar: "السويس" },
  { id: "luxor", name: "Luxor", name_ar: "الأقصر", lat: 25.6872, lng: 32.6396, governorate: "Luxor", governorate_ar: "الأقصر" },
  { id: "aswan", name: "Aswan", name_ar: "أسوان", lat: 24.0889, lng: 32.8998, governorate: "Aswan", governorate_ar: "أسوان" },
  { id: "zagazig", name: "Zagazig", name_ar: "الزقازيق", lat: 30.5877, lng: 31.5020, governorate: "Sharqia", governorate_ar: "الشرقية" },
  { id: "damanhour", name: "Damanhour", name_ar: "دمنهور", lat: 31.0344, lng: 30.4688, governorate: "Beheira", governorate_ar: "البحيرة" },
  { id: "beni-suef", name: "Beni Suef", name_ar: "بني سويف", lat: 29.0661, lng: 31.0994, governorate: "Beni Suef", governorate_ar: "بني سويف" },
  { id: "fayoum", name: "Fayoum", name_ar: "الفيوم", lat: 29.3084, lng: 30.8428, governorate: "Fayoum", governorate_ar: "الفيوم" },
  { id: "minya", name: "Minya", name_ar: "المنيا", lat: 28.1099, lng: 30.7503, governorate: "Minya", governorate_ar: "المنيا" },
  { id: "sohag", name: "Sohag", name_ar: "سوهاج", lat: 26.5591, lng: 31.6948, governorate: "Sohag", governorate_ar: "سوهاج" },
  { id: "qena", name: "Qena", name_ar: "قنا", lat: 26.1551, lng: 32.7160, governorate: "Qena", governorate_ar: "قنا" },
  { id: "talkha", name: "Talkha", name_ar: "طلخا", lat: 31.0525, lng: 31.3785, governorate: "Dakahlia", governorate_ar: "الدقهلية" },
  { id: "aga", name: "Aga", name_ar: "أجا", lat: 30.9943, lng: 31.2851, governorate: "Dakahlia", governorate_ar: "الدقهلية" },
  { id: "mit-ghamr", name: "Mit Ghamr", name_ar: "ميت غمر", lat: 30.7166, lng: 31.2595, governorate: "Dakahlia", governorate_ar: "الدقهلية" },
  { id: "shibin-el-kom", name: "Shibin El Kom", name_ar: "شبين الكوم", lat: 30.5574, lng: 31.0097, governorate: "Menoufia", governorate_ar: "المنوفية" },
  { id: "kafr-el-sheikh", name: "Kafr El Sheikh", name_ar: "كفر الشيخ", lat: 31.1107, lng: 30.9388, governorate: "Kafr El Sheikh", governorate_ar: "كفر الشيخ" },
  { id: "hurghada", name: "Hurghada", name_ar: "الغردقة", lat: 27.2579, lng: 33.8116, governorate: "Red Sea", governorate_ar: "البحر الأحمر" },
  { id: "sharm-el-sheikh", name: "Sharm El Sheikh", name_ar: "شرم الشيخ", lat: 27.9158, lng: 34.3300, governorate: "South Sinai", governorate_ar: "جنوب سيناء" },
  { id: "october", name: "6th of October", name_ar: "السادس من أكتوبر", lat: 29.9285, lng: 30.9188, governorate: "Giza", governorate_ar: "الجيزة" },
  { id: "new-cairo", name: "New Cairo", name_ar: "القاهرة الجديدة", lat: 30.0300, lng: 31.4700, governorate: "Cairo", governorate_ar: "القاهرة" },
  { id: "obour", name: "El Obour", name_ar: "العبور", lat: 30.2300, lng: 31.4800, governorate: "Qalyubia", governorate_ar: "القليوبية" },
];