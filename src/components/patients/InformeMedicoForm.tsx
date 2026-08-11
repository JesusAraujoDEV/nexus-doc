import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CatalogComboBox } from "./CatalogComboBox";
import { createMedicalReport } from "@/lib/medical-reports-api";
import { fetchReferringDoctors, createReferringDoctor } from "@/lib/referring-doctors-api";
import { fetchCatalog } from "@/lib/catalogs-api";

interface Props {
  patientId: string;
  recordId: string;
  onSaved: () => void;
}

/** Sub-tab "Informe Médico": título + referencia (médico/centro) + contenido libre. */
export function InformeMedicoForm({ patientId, recordId, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [centerName, setCenterName] = useState("");
  const [centerId, setCenterId] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: () =>
      createMedicalReport({
        clinicalRecordId: recordId,
        patientId,
        type: "informe",
        title: title || undefined,
        referringDoctorId: doctorId || undefined,
        medicalCenterId: centerId || undefined,
        content: content || undefined,
      }),
    onSuccess: () => {
      setTitle(""); setContent(""); setDoctorName(""); setDoctorId(null); setCenterName(""); setCenterId(null);
      onSaved();
    },
  });

  return (
    <div className="space-y-3">
      <div><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div>
        <Label>Referencia a:</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Médico/Esp.</Label>
            <CatalogComboBox
              value={doctorName}
              onTextChange={(v) => { setDoctorName(v); setDoctorId(null); }}
              onSelect={(o) => { setDoctorName(o.name); setDoctorId(o.id); }}
              queryKey="referring-doctors"
              fetchOptions={async (search) => {
                const res = await fetchReferringDoctors({ search, limit: 20 });
                return res.items.map((d) => ({ id: d.id, name: d.name, subtitle: d.specialty }));
              }}
              onCreate={async (name) => {
                const created = await createReferringDoctor({ name });
                return { id: created.id, name: created.name, subtitle: created.specialty };
              }}
              placeholder="Buscar médico..."
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">C. de Salud</Label>
            <CatalogComboBox
              value={centerName}
              onTextChange={(v) => { setCenterName(v); setCenterId(null); }}
              onSelect={(o) => { setCenterName(o.name); setCenterId(o.id); }}
              queryKey="medical-centers"
              fetchOptions={async (search) => {
                const res = await fetchCatalog("medical-centers", { search, limit: 20 });
                return res.items.map((c) => ({ id: c.id, name: c.name || "", subtitle: c.address }));
              }}
              placeholder="Buscar centro de salud..."
            />
          </div>
        </div>
      </div>
      <div><Label>Contenido</Label><Textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} /></div>
      <div className="flex justify-end">
        <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Guardando..." : "Guardar informe"}
        </Button>
      </div>
    </div>
  );
}
