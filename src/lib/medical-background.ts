/**
 * Mapeo entre el JSONB `medical_background` de la paciente y el formulario
 * plano de antecedentes. El JSONB puede traer claves que el form no conoce
 * (ocupación, hábitos, notas del legacy…): al guardar se parte del objeto
 * existente y solo se tocan las claves que el form administra.
 */

export interface AntecedentePersonal {
  /** Código CIE-9 si viene del catálogo; null si es texto propio de la doctora. */
  cie9: string | null;
  titulo: string;
}

export interface AntecedentesForm {
  lugarNacimiento: string;
  procedencia: string;
  menarquia: string;
  irs: string;
  parejasSexuales: string;
  gestas: string;
  partos: string;
  cesareas: string;
  abortos: string;
  ectopicos: string;
  embarazoEctopico: string;
  fum: string;
  fechaUltimaCitologia: string;
  cirugiasPrevias: string;
  alergias: string;
  antecedentesPatologicos: string;
  antecedentesPersonales: AntecedentePersonal[];
}

type Bag = Record<string, unknown>;

const GINECO_NUM = ["menarquia", "irs", "parejasSexuales", "gestas", "partos", "cesareas", "abortos", "ectopicos"] as const;
const GINECO_TXT = ["embarazoEctopico", "fum", "fechaUltimaCitologia"] as const;
const TOP_TXT = ["lugarNacimiento", "procedencia", "cirugiasPrevias", "alergias", "antecedentesPatologicos"] as const;

export const ANTECEDENTES_VACIO: AntecedentesForm = {
  lugarNacimiento: "", procedencia: "", menarquia: "", irs: "", parejasSexuales: "",
  gestas: "", partos: "", cesareas: "", abortos: "", ectopicos: "", embarazoEctopico: "",
  fum: "", fechaUltimaCitologia: "", cirugiasPrevias: "", alergias: "", antecedentesPatologicos: "",
  antecedentesPersonales: [],
};

function isBag(v: unknown): v is Bag {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));

function parseAntecedentesPersonales(v: unknown): AntecedentePersonal[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((a): a is Bag => isBag(a) && typeof a.titulo === "string")
    .map((a) => ({ cie9: typeof a.cie9 === "string" && a.cie9 ? a.cie9 : null, titulo: String(a.titulo) }));
}

/** Inversa de buildMedicalBackground: precarga el formulario a partir de lo que ya tenga la paciente. */
export function parseMedicalBackground(bg: Bag | null | undefined): AntecedentesForm {
  const src = isBag(bg) ? bg : {};
  const g = isBag(src.antecedentesGinecoObs) ? src.antecedentesGinecoObs : {};
  const form: AntecedentesForm = { ...ANTECEDENTES_VACIO };
  for (const k of TOP_TXT) form[k] = str(src[k]);
  for (const k of [...GINECO_NUM, ...GINECO_TXT]) form[k] = str(g[k]);
  form.antecedentesPersonales = parseAntecedentesPersonales(src.antecedentesPersonales);
  return form;
}

/** Escribe la clave si hay valor; la borra si quedó vacía (así "limpiar" un campo se persiste). */
function assign(target: Bag, key: string, value: string, numeric: boolean) {
  if (!value.trim()) {
    delete target[key];
    return;
  }
  target[key] = numeric ? Number(value) : value;
}

function cleanAntecedentesPersonales(list: AntecedentePersonal[]): AntecedentePersonal[] {
  return list
    .filter((a) => a.titulo.trim())
    .map((a) => ({ cie9: a.cie9?.trim() || null, titulo: a.titulo.trim() }));
}

/**
 * Arma el medical_background JSONB a partir del formulario. Si se pasa `existing`,
 * conserva sus claves desconocidas (spread) y solo reemplaza/borra las del form.
 */
export function buildMedicalBackground(a: AntecedentesForm, existing?: Bag | null): Bag {
  const bg: Bag = isBag(existing) ? { ...existing } : {};
  const gineco: Bag = isBag(bg.antecedentesGinecoObs) ? { ...bg.antecedentesGinecoObs } : {};
  for (const k of GINECO_NUM) assign(gineco, k, a[k], true);
  for (const k of GINECO_TXT) assign(gineco, k, a[k], false);
  for (const k of TOP_TXT) assign(bg, k, a[k], false);

  const personales = cleanAntecedentesPersonales(a.antecedentesPersonales);
  if (personales.length) bg.antecedentesPersonales = personales;
  else delete bg.antecedentesPersonales;

  if (Object.keys(gineco).length) bg.antecedentesGinecoObs = gineco;
  else delete bg.antecedentesGinecoObs;
  return bg;
}
