import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsultationCategory } from "./ConsultationForm";

export type ConsultationTab = "principal" | "recipe" | "ultrasonido";
const TABS: { key: ConsultationTab; label: string }[] = [
  { key: "principal", label: "Principal" },
  { key: "recipe", label: "Récipe" },
  { key: "ultrasonido", label: "Ultrasonido" },
];

interface Props {
  title: string;
  onBack: () => void;
  category: ConsultationCategory;
  onCategoryChange: (c: ConsultationCategory) => void;
  tab: ConsultationTab;
  onTabChange: (t: ConsultationTab) => void;
}

export function ConsultationFormHeader({ title, onBack, category, onCategoryChange, tab, onTabChange }: Props) {
  return (
    <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10 space-y-3">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft size={16} />Volver a la paciente
      </button>
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
      <div className="flex gap-2">
        {(["gynecology", "obstetrics"] as ConsultationCategory[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategoryChange(c)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
              category === c ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-secondary",
            )}
          >
            {c === "gynecology" ? "Ginecología" : "Obstetricia"}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              tab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
