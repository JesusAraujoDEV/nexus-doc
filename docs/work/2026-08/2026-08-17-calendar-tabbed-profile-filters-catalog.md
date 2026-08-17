# 2026-08-17 — Calendario, perfil de paciente en pestañas, filtros ampliados y catálogo de médicos referidos

## What changed
Cuatro iniciativas de frontend, construidas en paralelo por subagentes `crew:frontend-architect` con requisito explícito de responsividad móvil (375px) en las cuatro:
- **Filtros de pacientes**: modo "Embarazadas (historial)" además de "Embarazadas ahora" (el default sigue mostrando a todas), filtro nuevo "Con exámenes pendientes", botón "Limpiar filtros".
- **Calendario**: nueva ruta `/admin/calendar` en el sidebar, vistas mes/semana/año de las consultas del doctor, navegación prev/next/hoy, click en día → lista de consultas → perfil del paciente.
- **Perfil de paciente**: reorganizado de una sola página larga a pestañas (Info / Antecedentes / Embarazos / Consultas / Lab. exámenes), fetch perezoso por pestaña.
- **Catálogo**: pestaña "Médicos referidos" agregada — el backend ya exponía `GET /referring-doctors` pero el frontend no la mostraba (era el único de 7 catálogos del backend que faltaba).

## Why
Pedido directo del usuario (dueña de la consulta gineco-obstétrica) tras revisar el sistema en producción: quería un calendario más intuitivo en vez de solo listas, un perfil de paciente navegable por pestañas en vez de scroll largo, el catálogo puesto al día con los datos nuevos importados del sistema legado (médicos referidos), y una revisión de los filtros de embarazo por una posible confusión (resultó no ser un bug activo, sino una funcionalidad que el usuario recordaba pero nunca se había construido).

## How
- Calendario: nuevo módulo `src/components/calendar/` (Toolbar, MonthView, WeekView, YearView, DayList) + `CalendarPage.tsx`; en mobile la vista de semana se apila en tarjetas de ancho completo en vez de 7 columnas angostas, y mes usa celdas compactas con iniciales de día. El ícono de "Horarios" en el sidebar cambió a reloj para liberar el ícono de calendario.
- Perfil de paciente: la barra de tabs reusa el patrón `overflow-x-auto` ya usado y corregido en `ConsultationFormHeader.tsx` (no el `Tabs` de shadcn/Radix, que no tenía ese fix de scroll horizontal) — mismo mecanismo que ya evitó ese bug en la consulta.
- Filtros: el modo "historial" usa `EXISTS` (nunca `INNER JOIN`) igual que el filtro activo existente, para no duplicar pacientes con varios embarazos.
- Catálogo: se siguió el patrón genérico ya existente en `CatalogRow.tsx` (switch por `catalogKey`, sin componente especial por tipo) — sin agregar creación/edición porque ningún catálogo la tenía (no era una regresión de este cambio).
- Verificación: `npm run build`/`lint` limpios en los cuatro. Ningún agente pudo loguearse en la app real (sin credenciales de prueba); la verificación móvil se hizo por inspección estática de CSS/DOM replicado, salvo el calendario, que sí logró screenshots reales del layout sirviendo el endpoint con un JWT firmado localmente.

## Promoted knowledge
Ninguno nuevo — se reusaron patrones ya vigentes en el proyecto (barra de tabs scrollable, EXISTS sobre relaciones, catálogo genérico por switch).

## Follow-ups
- [ ] Verificación visual real logueada en la app (con credenciales de un usuario de prueba, no reusar las de la Dra. Arteaga) sigue pendiente — todo lo anterior se verificó por build/lint + inspección estática o screenshots contra endpoints, no navegando la app autenticada.
- [ ] Tab "Documentos" (informes/constancias) en el perfil de paciente quedó fuera — no hay endpoint por paciente en el backend todavía.
- [ ] Filtro "referido por médico" evaluado y descartado por ahora (requeriría picker async + catálogo nuevo).
- [ ] El calendario no muestra hora de consulta (`clinical_records` solo tiene fecha) — mostrarla requeriría enlazar por `appointment_id`, no todos los registros lo tienen.
