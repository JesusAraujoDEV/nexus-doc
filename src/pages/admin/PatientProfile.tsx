import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, MessageCircle, Phone, FileText,
  Image, Calendar, Upload, ChevronDown, ChevronUp, Plus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const patientsData: Record<string, {
  name: string; cedula: string; phone: string; age: number; blood: string; initials: string;
  history: { date: string; service: string; notes: string; symptoms: string; diagnosis: string }[];
  files: { name: string; type: "pdf" | "image"; size: string; date: string }[];
  upcoming: { date: string; time: string; service: string }[];
}> = {
  "1": {
    name: "María López", cedula: "V-12.345.678", phone: "+58 412-1234567",
    age: 34, blood: "O+", initials: "ML",
    history: [
      {
        date: "15 Ene 2025", service: "Consulta General",
        symptoms: "Dolor de cabeza, fatiga, mareos leves",
        diagnosis: "Tensión arterial elevada (140/90 mmHg). Posible hipertensión estadio 1.",
        notes: "Se receta Losartán 50mg, 1 vez al día. Control en 30 días. Recomendar dieta baja en sodio y ejercicio aeróbico moderado."
      },
      {
        date: "01 Dic 2024", service: "Revisión Periódica",
        symptoms: "Sin síntomas agudos. Chequeo de rutina.",
        diagnosis: "Paciente en buen estado general. Colesterol LDL levemente elevado (130 mg/dL).",
        notes: "Se solicita perfil lipídico completo. Recomendar dieta mediterránea. Control en 3 meses."
      },
      {
        date: "15 Oct 2024", service: "Control Cardiológico",
        symptoms: "Palpitaciones ocasionales, sin dolor precordial",
        diagnosis: "EKG normal. Holter 24h sin arritmias significativas.",
        notes: "Descartada patología cardíaca. Palpitaciones de origen ansioso. Manejo con técnicas de relajación."
      },
    ],
    files: [
      { name: "Perfil Lipídico Dic-2024.pdf", type: "pdf", size: "245 KB", date: "05 Dic 2024" },
      { name: "EKG Oct-2024.pdf", type: "pdf", size: "1.2 MB", date: "16 Oct 2024" },
      { name: "Foto lesión piel.jpg", type: "image", size: "3.4 MB", date: "01 Dic 2024" },
    ],
    upcoming: [
      { date: "15 Feb 2025", time: "09:00 AM", service: "Control Hipertensión" }
    ]
  },
  "2": {
    name: "Carlos Méndez", cedula: "V-11.222.333", phone: "+58 424-9876543",
    age: 45, blood: "A+", initials: "CM",
    history: [
      {
        date: "10 Ene 2025", service: "Revisión Periódica",
        symptoms: "Cansancio, aumento de peso reciente (+5kg en 3 meses)",
        diagnosis: "Hipotiroidismo subclínico. TSH elevada (6.2 mUI/L).",
        notes: "Se inicia Levotiroxina 25mcg en ayunas. Control de TSH en 6 semanas."
      }
    ],
    files: [
      { name: "Perfil Tiroideo Ene-2025.pdf", type: "pdf", size: "180 KB", date: "10 Ene 2025" },
    ],
    upcoming: [
      { date: "20 Feb 2025", time: "10:00 AM", service: "Control Tiroideo" }
    ]
  }
};

const defaultPatient = {
  name: "Paciente", cedula: "N/A", phone: "N/A",
  age: 0, blood: "N/A", initials: "P",
  history: [], files: [], upcoming: []
};

function HistoryNode({ entry, idx }: { entry: typeof patientsData["1"]["history"][0]; idx: number }) {
  const [expanded, setExpanded] = useState(idx === 0);
  return (
    <div className="timeline-node pb-5">
      <div className="timeline-dot">{idx + 1}</div>
      <div className="medical-card overflow-hidden">
        <button
          className="w-full flex items-center gap-3 p-4 text-left"
          onClick={() => setExpanded(e => !e)}
        >
          <div className="flex-1">
            <p className="text-xs font-semibold text-primary">{entry.date}</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{entry.service}</p>
          </div>
          {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </button>
        {expanded && (
          <div className="px-4 pb-4 border-t border-border space-y-3 animate-fade-in">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Síntomas</p>
              <p className="text-xs text-foreground bg-muted/60 rounded-lg p-2.5">{entry.symptoms}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Diagnóstico</p>
              <p className="text-xs text-foreground bg-primary-light rounded-lg p-2.5 text-primary font-medium">{entry.diagnosis}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Notas y Tratamiento</p>
              <p className="text-xs text-foreground bg-muted/60 rounded-lg p-2.5">{entry.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FileCard({ file }: { file: typeof patientsData["1"]["files"][0] }) {
  const isPdf = file.type === "pdf";
  return (
    <div className="medical-card p-3 flex items-center gap-3">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        isPdf ? "bg-destructive/10 text-destructive" : "bg-primary-light text-primary"
      )}>
        {isPdf ? <FileText size={20} /> : <Image size={20} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{file.size} · {file.date}</p>
      </div>
      <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded",
        isPdf ? "bg-destructive/10 text-destructive" : "bg-primary-light text-primary"
      )}>
        {file.type}
      </span>
    </div>
  );
}

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = (id && patientsData[id]) ? patientsData[id] : defaultPatient;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-6 pb-8">
        <button
          onClick={() => navigate("/admin/patients")}
          className="flex items-center gap-2 text-white/80 text-sm mb-4 -ml-1"
        >
          <ChevronLeft size={18} />
          Pacientes
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary border-2 border-white/30 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {patient.initials}
          </div>
          <div>
            <h1 className="text-xl font-bold">{patient.name}</h1>
            <p className="text-white/70 text-sm mt-0.5">{patient.cedula}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{patient.age} años</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Sangre {patient.blood}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <a
            href={`https://wa.me/${patient.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold"
          >
            <MessageCircle size={14} />WhatsApp
          </a>
          <a
            href={`tel:${patient.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold"
          >
            <Phone size={14} />Llamar
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="-mt-4 flex-1 px-4">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-card border border-border rounded-2xl p-1 mb-5 shadow-card">
            <TabsTrigger value="history" className="rounded-xl text-xs font-semibold data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-primary">
              Historial
            </TabsTrigger>
            <TabsTrigger value="files" className="rounded-xl text-xs font-semibold data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-primary">
              Archivos
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-xl text-xs font-semibold data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-primary">
              Próximas
            </TabsTrigger>
          </TabsList>

          {/* History */}
          <TabsContent value="history">
            {patient.history.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-10">Sin historial registrado</p>
            ) : (
              <div className="space-y-0">
                {patient.history.map((entry, i) => (
                  <HistoryNode key={i} entry={entry} idx={i} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Files */}
          <TabsContent value="files">
            <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center mb-4 bg-muted/30">
              <Upload size={28} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground mb-1">Subir Archivo</p>
              <p className="text-xs text-muted-foreground mb-3">PDF, JPG, PNG hasta 20MB</p>
              <div className="flex gap-2 justify-center">
                <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold flex items-center gap-1.5">
                  <Upload size={12} />
                  <span className="hidden md:inline">Seleccionar archivo</span>
                  <span className="md:hidden">Galería / Cámara</span>
                </button>
              </div>
            </div>
            {patient.files.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-6">Sin archivos adjuntos</p>
            ) : (
              <div className="space-y-2">
                {patient.files.map((f, i) => (
                  <FileCard key={i} file={f} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Upcoming */}
          <TabsContent value="upcoming">
            <div className="space-y-3">
              {patient.upcoming.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-10">Sin citas próximas</p>
              ) : (
                patient.upcoming.map((appt, i) => (
                  <div key={i} className="medical-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shrink-0">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{appt.service}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{appt.date} · {appt.time}</p>
                    </div>
                  </div>
                ))
              )}
              <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Plus size={16} />
                Agendar nueva cita
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
