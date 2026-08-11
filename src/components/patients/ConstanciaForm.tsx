import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createMedicalReport } from "@/lib/medical-reports-api";

interface Props {
  patientId: string;
  recordId: string;
  onSaved: () => void;
}

/** Sub-tab "Constancia": texto de constancia + qué se le realiza + reposo. */
export function ConstanciaForm({ patientId, recordId, onSaved }: Props) {
  const [constanciaText, setConstanciaText] = useState("");
  const [realizandoseText, setRealizandoseText] = useState("");
  const [indicatesRest, setIndicatesRest] = useState(false);

  const save = useMutation({
    mutationFn: () =>
      createMedicalReport({
        clinicalRecordId: recordId,
        patientId,
        type: "constancia",
        constanciaText: constanciaText || undefined,
        realizandoseText: realizandoseText || undefined,
        indicatesRest,
      }),
    onSuccess: () => {
      setConstanciaText(""); setRealizandoseText(""); setIndicatesRest(false);
      onSaved();
    },
  });

  return (
    <div className="space-y-3">
      <div>
        <Label>Constancia que se expide por presentar:</Label>
        <Textarea rows={3} value={constanciaText} onChange={(e) => setConstanciaText(e.target.value)} />
      </div>
      <div>
        <Label>Realizándosele:</Label>
        <Textarea rows={3} value={realizandoseText} onChange={(e) => setRealizandoseText(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={indicatesRest} onCheckedChange={(v) => setIndicatesRest(!!v)} />
        ¿Se indica Reposo?
      </label>
      <div className="flex justify-end">
        <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Guardando..." : "Guardar constancia"}
        </Button>
      </div>
    </div>
  );
}
