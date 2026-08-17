# 2026-08-17 — Diagnóstico opcional, banner de embarazo, paginación con salto y CRUD de catálogos

## What changed
Cuatro iniciativas de frontend, construidas en paralelo por subagentes `crew:frontend-architect`:
- **Consulta**: diagnóstico ya no es obligatorio (se quitó por completo la lógica de salto-de-pestaña/borde rojo que existía solo para ese campo); botones "Imprimir" nuevos para Ecografía general y Lab. exámenes.
- **Perfil de paciente**: `PregnancyBanner` nuevo, visible de inmediato debajo del header (fuera de las pestañas) si la paciente tiene un embarazo activo — antes quedaba escondido detrás del tab "Embarazos".
- **Paginación de pacientes**: input numérico para saltar directo a una página (Enter/blur, clamp 1..total), en vez de solo prev/next.
- **Catálogos**: crear/editar/borrar para los 7 catálogos (antes solo lectura), edición vía PATCH, más el mismo salto directo de página que pacientes (componente separado, sin compartir archivo, para evitar choques entre agentes en paralelo).

## Why
Pedido directo del usuario tras usar el sistema: el diagnóstico obligatorio bloqueaba guardar consultas sin diagnóstico claro; faltaba imprimir 2 de los módulos de consulta; el estado de embarazo quedó escondido tras la reorganización en pestañas de la sesión anterior; con cientos de páginas en pacientes/catálogos, navegar solo con "siguiente" es impracticable; el catálogo necesitaba ser editable, no solo consultable.

## How
- `PregnancyBanner` reusa la misma queryKey (`["pregnancies", patientId]`) que `PregnancySection`, así que TanStack Query dedupea el fetch sin necesidad de levantar estado a props.
- El salto de página se implementó dos veces (pacientes y catálogos) en archivos separados por instrucción explícita, para que los dos agentes en paralelo no se pisaran editando el mismo componente — duplicación pequeña y deliberada, no una abstracción compartida prematura.
- El diálogo de crear/editar catálogo (`CatalogItemDialog.tsx`) reusa la estructura de `EditPatientQuickDialog`; borrar reusa `ConfirmDeleteDialog` sin modificarlo.

## Promoted knowledge
Ninguno nuevo — se extendieron patrones ya vigentes (dedupe de TanStack Query por queryKey, dialogs compartidos, patrón de PDF a nivel de consulta completa).

## Follow-ups
- [ ] La verificación de mobile (375px) en el input de salto de página se hizo por inspección de clases, no visualmente en el navegador (sin credenciales de prueba, misma limitación de rondas anteriores).
- [ ] Ningún formulario de catálogo se probó end-to-end contra la app real logueada.
