import { useEffect, useState } from "react";
import { matchesCoarsePointer, subscribeCoarsePointer } from "@/lib/coarse-pointer";

/** True en pantallas táctiles donde no existe arrastre con mouse. */
export function useCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(matchesCoarsePointer);

  useEffect(() => subscribeCoarsePointer(setIsCoarse), []);

  return isCoarse;
}
