import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReferredByType } from "@/lib/patients-api";
import { REFERIDO_LABEL } from "@/lib/referred-by";
import { fetchReferringDoctors, createReferringDoctor } from "@/lib/referring-doctors-api";
import { CatalogComboBox } from "./CatalogComboBox";

export interface ReferralValue {
  type: ReferredByType | "";
  detail: string;
  doctorId: string | null;
}

interface Props {
  value: ReferralValue;
  onChange: (v: ReferralValue) => void;
  /** La paciente ya tenía detalle (p.ej. migrado del legacy sin tipo): mostrarlo aunque no haya tipo. */
  hasStoredDetail: boolean;
}

/** "Referido por": tipo + médico del catálogo o texto libre. */
export function PatientReferralFields({ value, onChange, hasStoredDetail }: Props) {
  const showDetail = value.type !== "otro_doctor" && (value.type !== "" || hasStoredDetail);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <Label>Referido por</Label>
        <Select value={value.type} onValueChange={(v) => onChange({ ...value, type: v as ReferredByType })}>
          <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
          <SelectContent>
            {(Object.keys(REFERIDO_LABEL) as ReferredByType[]).map((k) => (
              <SelectItem key={k} value={k}>{REFERIDO_LABEL[k]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {value.type === "otro_doctor" && (
        <div>
          <Label>Médico</Label>
          <CatalogComboBox
            value={value.detail}
            onTextChange={(v) => onChange({ ...value, detail: v, doctorId: null })}
            onSelect={(o) => onChange({ ...value, detail: o.name, doctorId: o.id })}
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
      )}
      {showDetail && (
        <div>
          <Label htmlFor="ep-ref-detail">Detalle</Label>
          <Input id="ep-ref-detail" value={value.detail} onChange={(e) => onChange({ ...value, detail: e.target.value })} />
        </div>
      )}
    </div>
  );
}
