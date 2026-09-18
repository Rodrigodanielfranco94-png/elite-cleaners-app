# Elite Cleaners App

Repositorio operativo de **Elite Cleaners Company**.

## Aplicaciones principales

- **Elite Admin** — `admin.html`
  - Título actual: Elite Admin v9.0.29
  - Administración, clientes, servicios, pagos, contabilidad, inventario, informes y operaciones.

- **Elite Staff** — `staff_v3.html`
  - Versión actual: Elite Staff v9.6 FIXED
  - Flujo operativo de empleados, GPS, fotos, checklist, pausas e informes.

- **Firma** — `firmar.html`
  - Flujo auxiliar de firma.

## NICO legacy

Este repositorio todavía contiene el prototipo histórico de NICO:

- `nico.html`
- `nico-admin.js`
- `nico-chat.js`
- `nico-config.js`
- `nico-email.js`
- `nico-estimates.js`
- `nico-jobs.js`
- `nico-memory.js`
- `nico-pdf.js`
- `nico-utils.js`
- `nico-voice.js`
- `nico-assets/`

Ese código se mantiene temporalmente por compatibilidad y referencia.

La nueva arquitectura de NICO vive en el repositorio privado:

`Rodrigodanielfranco94-png/elite-command`

## Regla de migración

Admin y Staff continúan funcionando desde este repositorio mientras Elite Command se construye de forma independiente.

No se eliminará ningún archivo legacy de NICO hasta que:

1. su reemplazo exista en Elite Command;
2. haya sido probado con Firebase;
3. Admin y Staff no dependan de él;
4. el cambio haya pasado por revisión.

Consulta `docs/REPOSITORY_CLEANUP_PLAN.md` para el plan completo.
