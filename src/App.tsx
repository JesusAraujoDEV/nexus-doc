import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import PatientLanding from "./pages/PatientLanding";
import BookingFlow from "./pages/BookingFlow";
import AdminDashboard from "./pages/admin/Dashboard";
import PatientsDirectory from "./pages/admin/PatientsDirectory";
import PatientProfile from "./pages/admin/PatientProfile";
import ScheduleConfig from "./pages/admin/ScheduleConfig";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Patient Routes */}
          <Route path="/" element={<Navigate to="/dra-rosana-arteaga" replace />} />
          <Route path="/:doctorSlug" element={<PatientLanding />} />
          <Route path="/booking" element={<BookingFlow />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="patients" element={<PatientsDirectory />} />
            <Route path="patients/:id" element={<PatientProfile />} />
            <Route path="schedule" element={<ScheduleConfig />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
