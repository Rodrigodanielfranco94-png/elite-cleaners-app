# Elite Cleaners App

Repositorio operativo de **Elite Cleaners Company**.

## Producción

- **Elite Admin** → `admin.html` — master actual v9.0.29
- **Elite Staff** → `staff_v3.html` — master actual v9.6 FIXED
- **Firma** → `firmar.html`
- **Entrada existente** → `index.html`

Admin y Staff permanecen separados de Elite Command y comparten datos mediante Firebase / Firestore.

## Elite Command y NICO

Todo desarrollo nuevo de NICO vive en:

`Rodrigodanielfranco94-png/elite-command`

Los archivos `nico-*` que todavía existen en este repositorio se consideran **legacy congelado**. No deben recibir nuevas funciones.

No se eliminan todavía porque este repositorio contiene archivos HTML de producción muy grandes y primero se debe confirmar por prueba de runtime que Admin/Staff no dependan de referencias dinámicas legacy.

## Documentación

- `docs/MASTERS.md` — masters oficiales actuales.
- `docs/REPOSITORY_MAP.md` — separación entre repositorios.
- `docs/LEGACY_NICO_FREEZE.md` — política del NICO antiguo.
- `docs/REPOSITORY_CLEANUP_PLAN.md` — plan histórico de migración.

## Regla principal

**Admin y Staff se mantienen estables aquí. Elite Command y NICO se desarrollan en su propio repositorio.**
