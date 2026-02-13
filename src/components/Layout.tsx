import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Plus, Home, Stethoscope, Building2, UserRound, Pill, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, lang, setLang, dir } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/", label: t("home"), icon: Home },
    { path: "/hospitals", label: t("hospitals"), icon: Building2 },
    { path: "/doctors", label: t("doctors"), icon: UserRound },
    { path: "/pharmacies", label: t("pharmacies"), icon: Pill },
    { path: "/donations", label: t("donations"), icon: Heart },
  ];

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-primary">{t("appName")}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/ai-router">
              <Button variant="ghost" size="sm" className="gap-1">
                <Stethoscope className="w-4 h-4" />
                <span className="hidden sm:inline">{t("aiRouter")}</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="font-medium"
            >
              {lang === "en" ? "عربي" : "EN"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Floating Emergency Button */}
      <Link
        to="/emergency"
        className="fixed bottom-20 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-destructive text-destructive-foreground shadow-lg emergency-pulse"
        style={{ [dir === "rtl" ? "left" : "right"]: "1rem" }}
      >
        <Phone className="w-7 h-7" />
      </Link>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-2 py-1 text-xs transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="pb-20 border-t bg-muted/50">
        <div className="container px-4 py-6 text-center text-xs text-muted-foreground space-y-1">
          <p>{t("footerDisclaimer")}</p>
          <p>{t("supportContact")}</p>
          <p>{t("privacyNotice")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
