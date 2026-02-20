import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, MapPin, Phone, Clock, Award, ChevronRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import doctorAvatar from "@/assets/doctor-avatar.jpg";

const doctorProfiles = {
  "dra-rosana-arteaga": {
    name: "Dra. Rosana Arteaga",
    specialty: "Medicina General",
    subtitle: "Especialista en Medicina General & Medicina Interna",
    clinicName: "MediCare Clinic",
    avatar: doctorAvatar,
    showStats: false,
    stats: [
      { value: "10+", label: "Años exp." },
      { value: "2,400+", label: "Pacientes" },
      { value: "98%", label: "Satisfacción" },
    ],
    specialties: [
      { icon: "🩺", name: "Medicina General", duration: "30 min", price: "$20" },
      { icon: "❤️", name: "Cardiología Preventiva", duration: "45 min", price: "$35" },
      { icon: "🧬", name: "Medicina Interna", duration: "40 min", price: "$30" },
    ],
    reviews: [
      { name: "María L.", rating: 5, text: "Excelente atención, muy profesional." },
      { name: "Carlos M.", rating: 5, text: "La mejor doctora, super recomendada." },
    ],
  },
} as const;

export default function PatientLanding() {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const { doctorSlug } = useParams();
  const profile = useMemo(() => {
    if (doctorSlug && doctorSlug in doctorProfiles) {
      return doctorProfiles[doctorSlug as keyof typeof doctorProfiles];
    }
    return doctorProfiles["dra-rosana-arteaga"];
  }, [doctorSlug]);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero Banner */}
      <div className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="relative px-5 pt-12 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium">{profile.clinicName}</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-1">
                {profile.name}
              </h1>
              <p className="text-white/80 text-sm md:text-base">{profile.subtitle}</p>

              <div className="flex items-center gap-1 mt-3">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={13} className="fill-accent text-accent" />
                ))}
                <span className="text-white/70 text-xs ml-1">4.9 (128 reseñas)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                className="hidden md:inline-flex"
                onClick={() => navigate("/booking")}
              >
                Agendar consulta
              </Button>

              <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-white/30 shadow-lg">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <span className="text-white text-[10px]">✓</span>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip (hide until real data exists) */}
        {profile.showStats && (
          <div className="flex border-t border-white/20 bg-white/10 backdrop-blur-sm">
            {profile.stats.map((stat, i) => (
              <div key={i} className="flex-1 py-3 text-center border-r border-white/20 last:border-0">
                <p className="text-base font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info cards */}
      <div className="px-4 mt-5 space-y-4">
        {/* Location & Contact */}
        <div className="medical-card p-4 flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Consultorio Principal</p>
            <p className="text-xs text-muted-foreground mt-0.5">Av. Libertador 1250, Caracas</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={11} />
                Lun–Vie 8am–5pm
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone size={11} />
                +58 412-5559999
              </span>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 px-1">Especialidades</h2>
          <div className="space-y-2">
            {profile.specialties.map((s, i) => (
              <div key={i} className="medical-card p-3.5 flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    ⏱️ {s.duration}{s.price ? ` • ${s.price}` : ""}
                  </span>
                </div>
                <Award size={14} className="ml-auto text-accent" />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 px-1">Reseñas recientes</h2>
          <div className="space-y-2">
            {profile.reviews.map((r, i) => (
              <div key={i} className="medical-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {r.name[0]}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{r.name}</span>
                  <div className="flex ml-auto">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} size={10} className="fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin link */}
        <button
          onClick={() => navigate("/admin")}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground border border-dashed border-border rounded-xl hover:bg-muted transition-colors"
        >
          Acceder como Doctora
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Floating CTA */}
      <button
        className="cta-float md:hidden"
        onClick={() => navigate("/booking")}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <span className="flex items-center justify-center gap-2">
          <Stethoscope size={18} />
          Agendar Consulta
          <ChevronRight size={16} className={`transition-transform duration-200 ${hovering ? "translate-x-1" : ""}`} />
        </span>
      </button>
    </div>
  );
}
