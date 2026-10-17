import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { RequireAuth } from "./components/layout/RequireAuth";
import { RouteFallback } from "./components/layout/RouteFallback";

// Cada página en su propio chunk: el teléfono solo baja lo que abre.
const PatientLanding = lazy(() => import("./pages/PatientLanding"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const PatientsDirectory = lazy(() => import("./pages/admin/PatientsDirectory"));
const PatientProfile = lazy(() => import("./pages/admin/PatientProfile"));
const NewConsultationPage = lazy(() => import("./pages/admin/NewConsultationPage"));
const EditConsultationPage = lazy(() => import("./pages/admin/EditConsultationPage"));
const ScheduleConfig = lazy(() => import("./pages/admin/ScheduleConfig"));
const CalendarPage = lazy(() => import("./pages/admin/CalendarPage"));
const Catalogs = lazy(() => import("./pages/admin/Catalogs"));
const Trash = lazy(() => import("./pages/admin/Trash"));
const ChangePassword = lazy(() => import("./pages/admin/ChangePassword"));
const Login = lazy(() => import("./pages/admin/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

/**
 * Datos de una sola doctora: 60 s frescos evita re-pedir lo mismo al ir y
 * volver entre pantallas. Sin refetch al recuperar el foco (en el teléfono
 * se dispara cada vez que vuelve de la cámara o de WhatsApp); las mutaciones
 * invalidan lo que cambian.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public Patient Routes */}
            <Route path="/" element={<Navigate to="/rosana-arteaga" replace />} />
            <Route path="/:doctorSlug" element={<PatientLanding />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="patients" element={<PatientsDirectory />} />
              <Route path="patients/:id" element={<PatientProfile />} />
              <Route path="patients/:id/consultations/new" element={<NewConsultationPage />} />
              <Route path="patients/:id/consultations/:recordId/edit" element={<EditConsultationPage />} />
              <Route path="catalogs" element={<Catalogs />} />
              <Route path="trash" element={<Trash />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="schedule" element={<ScheduleConfig />} />
              <Route path="calendar" element={<CalendarPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
