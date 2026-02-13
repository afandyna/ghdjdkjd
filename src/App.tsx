import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import AIRouter from "./pages/AIRouter";
import Emergency from "./pages/Emergency";
import Hospitals from "./pages/Hospitals";
import Doctors from "./pages/Doctors";
import Pharmacies from "./pages/Pharmacies";
import Donations from "./pages/Donations";
import Labs from "./pages/Labs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/emergency" element={<Emergency />} />
            <Route element={<LayoutWrapper />}>
              <Route path="/" element={<Index />} />
              <Route path="/ai-router" element={<AIRouter />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/pharmacies" element={<Pharmacies />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/labs" element={<Labs />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
