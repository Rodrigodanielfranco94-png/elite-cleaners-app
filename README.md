# Elite Cleaners App

Repositorio operativo de **Elite Cleaners Company**.

## Aplicaciones principales

- **Elite Admin** — `admin.html`
  - Elite Admin v9.0.29
  - Administración, clientes, servicios, pagos, contabilidad, inventario, informes y operaciones.

- **Elite Staff** — `staff_v3.html`
  - Elite Staff v9.6 FIXED
  - Flujo operativo de empleados, GPS, fotos, checklist, pausas e informes.

- **Firma** — `firmar.html`
  - Flujo auxiliar de firma.

- **Login** — `index.html`
  - Autenticación Firebase y enrutamiento a Admin o Staff.
  - Sin código experimental de NICO ni credenciales de servicios de voz.

## Elite Command / NICO

La nueva arquitectura de NICO y el centro de operaciones viven en el repositorio privado:

`Rodrigodanielfranco94-png/elite-command`

El código experimental histórico de NICO fue retirado de este repositorio después de comprobar que Admin, Staff y Firma no lo cargaban.

El historial permanece recuperable mediante Git. Consulta:

- `docs/NICO_LEGACY_ARCHIVE.md`
- `docs/REPOSITORY_CLEANUP_PLAN.md`

## Regla de arquitectura

Elite Admin y Elite Staff continúan siendo aplicaciones independientes.

Elite Command consume el mismo modelo de datos y agrega la capa de operaciones central, Live Activity y NICO sin obligar a fusionar las apps.
