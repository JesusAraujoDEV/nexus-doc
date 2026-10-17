import { useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATTACHMENT_ACCEPT } from "@/lib/attachment-rules";

interface Props {
  onFiles: (files: File[]) => void;
}

/** "Tomar foto" (abre la cámara trasera en el teléfono) y "Subir archivo" (varios a la vez). */
export function AttachmentPickButtons({ onFiles }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // Se limpia para que volver a elegir el mismo archivo dispare onChange.
    e.target.value = "";
    if (files.length) onFiles(files);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <Button type="button" className="h-12 text-base" onClick={() => cameraRef.current?.click()}>
        <Camera />Tomar foto
      </Button>
      <Button type="button" variant="outline" className="h-12 text-base" onClick={() => fileRef.current?.click()}>
        <Upload />Subir archivo
      </Button>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
      <input ref={fileRef} type="file" accept={ATTACHMENT_ACCEPT} multiple className="hidden" onChange={handleChange} />
    </div>
  );
}
