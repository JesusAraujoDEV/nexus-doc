import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Award, ChevronRight, Stethoscope, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchDoctor } from "@/lib/doctor-api";

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const full = digits.startsWith("58") ? digits : `58${digits.replace(/^0/, "")}`;
  return `https://wa.me/${full}?text=${encodeURIComponent("Hola, quisiera agendar una consulta.")}`;
}

export default function PatientLanding() {
  const navigate = useNavigate();
  const { doctorSlug } = useParams();

  const { data: doctor, isLoading, isError } = useQuery({
    queryKey: ["doctor", doctorSlug],
    queryFn: () => fetchDoctor(doctorSlug as string),
    enabled: !!doctorSlug,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground"><Loader2 className="animate-spin" /></div>;
  }
  if (isError || !doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-muted-foreground">No se encontró el perfil del médico.</p>
        <button onClick={() => navigate("/admin")} className="text-sm text-primary font-semibold">Acceder como Doctora</button>
      </div>
    );
  }

  const name = `Dra. ${doctor.firstName} ${doctor.lastName}`;
  const initials = (doctor.firstName[0] || "") + (doctor.lastName[0] || "");
  const services = doctor.services || [];

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative px-5 pt-12 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium">{doctor.clinicName}</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-1">{name}</h1>
              <p className="text-white/80 text-sm md:text-base">Especialista en {doctor.specialty}</p>
              {doctor.experienceYears > 0 && (
                <p className="flex items-center gap-1.5 text-white/70 text-xs mt-3">
                  <Award size={13} />{doctor.experienceYears}+ años de experiencia
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <a href={waLink(doctor.phone)} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex">
                <Button>Agendar por WhatsApp</Button>
              </a>
              <div className="w-24 h-24 rounded-2xl bg-white/20 border-3 border-white/30 shadow-lg flex items-center justify-center text-3xl font-bold">
                {initials}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4 max-w-2xl mx-auto">
        <div className="medical-card p-4 flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{doctor.clinicName}</p>
            <a href={`tel:${doctor.phone.replace(/\D/g, "")}`} className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Phone size={11} />{doctor.phone}
            </a>
          </div>
        </div>

        {services.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 px-1">Servicios</h2>
            <div className="space-y-2">
              {services.map((s) => (
                <div key={s.id} className="medical-card p-3.5 flex items-center gap-3">
                  <Stethoscope size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  {s.durationMinutes && <span className="text-[11px] text-muted-foreground">⏱️ {s.durationMinutes} min</span>}
                  {s.price != null && <span className="ml-auto text-sm font-semibold text-foreground">${s.price}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/admin")}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground border border-dashed border-border rounded-xl hover:bg-muted transition-colors"
        >
          Acceder como Doctora
          <ChevronRight size={14} />
        </button>
      </div>

      <a href={waLink(doctor.phone)} target="_blank" rel="noopener noreferrer" className="cta-float md:hidden">
        <span className="flex items-center justify-center gap-2">
          <MessageCircle size={18} />
          Agendar por WhatsApp
        </span>
      </a>
    </div>
  );
}
