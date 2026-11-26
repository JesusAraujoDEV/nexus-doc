# 2026-11-26 — Agenda de próximas citas, fecha al imprimir y adjuntos desde la tarjeta

## What changed
El Dashboard muestra "Hoy te toca ver a…" (hoy y mañana); el calendario tiene modo "Próximas citas" (por defecto) además de "Consultas realizadas"; el perfil destaca la próxima consulta o la inasistencia. Todo botón de imprimir abre un modal para elegir la fecha del documento. La tarjeta de consulta tiene "Adjuntar foto" y la galería de esa consulta.

## Why
Pedidos de la doctora: ver qué pacientes le tocan cada día, imprimir con otra fecha, y adjuntar fotos sin entrar a editar la consulta.

## How
- Agenda: `src/lib/` (lógica pura de agrupación por día y "en N días", con tests) sobre `GET /clinical-records/upcoming`.
- Impresión: componente único `PrintDateDialog`; las URLs de PDF llevan `?fecha=`.
- Adjuntos: hook `useConsultationAttachments` extraído y compartido; la lista solo se pide con la tarjeta desplegada. La tarjeta ya no oculta el desplegable cuando la consulta no tiene texto, para poder adjuntarle fotos.
- Implementado con Antigravity CLI en ramas separadas; revisado y fusionado a mano (conflicto en `ConsultationCard.tsx`, resuelto conservando ambos cambios).

## Promoted knowledge
None.

## Follow-ups
- [ ] Los adjuntos responden 503 hasta configurar Google Drive en el backend.
