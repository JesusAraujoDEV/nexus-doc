import { CatalogField, NumberField, FieldProps } from "./ultrasound-field-inputs";

/** Estática fetal: cómo está posicionado el feto y estado de sus órganos, tal como lo mira la doctora en la pantalla. */
export function UltrasoundEstaticaFetalFields(p: FieldProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <CatalogField label="Presentación" field="PRESENT" {...p} />
      <CatalogField label="Riñones" field="RIÑONES" {...p} />
      <CatalogField label="Situación" field="SITUAC" {...p} />
      <CatalogField label="Vejiga" field="VEJIGA" {...p} />
      <CatalogField label="Posición" field="POSIC" {...p} />
      <CatalogField label="Miembro Superior" field="MIEM-SUP" {...p} />
      <CatalogField label="Ventrículo Cerebral" field="VENT-CER" {...p} />
      <CatalogField label="Miembro Inferior" field="MIEM-INF" {...p} />
      <CatalogField label="Cerebelo" field="CEREBELO" {...p} />
      <CatalogField label="Placenta grado (Grannum)" field="PLAC-GR" {...p} />
      <CatalogField label="Plexos Coroideos" field="PLEX-COR" {...p} />
      <NumberField label="Espesor placentario (mm)" field="PLAC-ESP" {...p} />
      <CatalogField label="Columna" field="COLUMNA" {...p} />
      <CatalogField label="Localización placenta" field="LOCALIZACION" {...p} />
      <CatalogField label="Corazón" field="CORAZON" {...p} />
      <CatalogField label="Cordón Umbilical" field="CORD-UMB" {...p} />
      <CatalogField label="Estómago" field="ESTOMAGO" {...p} />
      <CatalogField label="Intestino Grado (Zilianti)" field="INT-GR" {...p} />
    </div>
  );
}
