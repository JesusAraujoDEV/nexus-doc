# 2026-08-05 — Frontend conectado a la API real (auth, pacientes, stats, perfil)

## What changed
El panel admin pasó de prototipo con datos mock a app conectada al backend real: cliente API con JWT (`src/lib/api.ts`) + auto-logout en 401, página de login y guard `RequireAuth` sobre `/admin`, directorio de pacientes con búsqueda+paginación en vivo, dashboard con KPIs y gráficos (recharts) desde `/stats/summary`, y perfil de paciente con demografía, antecedentes (`medicalBackground` JSONB) y sus consultas asociadas. Todo mobile + desktop. Desplegado a producción (Dokploy, `VITE_API_URL` configurado).

## Why
El backend ya tenía 2.748 pacientes y 6.577 consultas reales; el frontend seguía mostrando ~8 pacientes de demostración. El usuario (doctora) necesita buscar pacientes, ver su historial y estadísticas desde teléfono y web.

## How
Clientes de API en `src/lib/{api,patients-api,stats-api}.ts` sobre TanStack Query. Componentes de feature extraídos a `src/components/{patients,dashboard}/` para respetar los límites de tamaño de archivo del estándar (page ≤200, component ≤150). Rutas de admin protegidas en `App.tsx`. Logout en Sidebar/BottomNav.

## Promoted knowledge
None (patrones de fetching viven en los hooks/clientes; sin guía dedicada aún).

## Follow-ups
- [ ] Rutas `/admin/schedule` (Horarios) sigue con contenido placeholder — conectar a datos reales o quitar del nav.
- [ ] Subida/gestión de archivos de paciente (`patient_files`) no está implementada en la UI.
- [ ] Bundle > 500 kB en un solo chunk — considerar code-splitting si el arranque en móvil se siente lento.
