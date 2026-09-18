# Plan de limpieza de elite-cleaners-app

## Estado

**Migración de software v1 completada.**

Este repositorio queda enfocado en:

- Elite Admin
- Elite Staff
- Login
- Firma / páginas auxiliares

La arquitectura nueva de NICO vive en `elite-command`.

## Verificaciones realizadas

Antes de retirar el legado:

- se inspeccionó `admin.html`;
- se inspeccionó `staff_v3.html`;
- se inspeccionó `firmar.html`;
- no se encontraron referencias a los archivos `nico-*.js`, `nico.html`, `nico-assets/` ni `nico-avatar.png.PNG`;
- la capacidad de documentos Estimate/Invoice fue migrada a Elite Command;
- Elite Command v1 pasó sus pruebas automáticas y CI.

## Limpieza realizada

- retirada la integración inline antigua de NICO del login;
- retirada una credencial de voz que estaba embebida en el navegador;
- corregido el destino del login de empleados a `staff_v3.html`;
- alineada la configuración Firebase del login con Staff;
- retirados los archivos experimentales legacy de NICO.

## Archivos operativos preservados

- `admin.html`
- `staff_v3.html`
- `firmar.html`
- `index.html`
- `assets/`
- documentación

## Recuperación

Los archivos eliminados siguen disponibles en Git history. El punto anterior a la limpieza está documentado en `docs/NICO_LEGACY_ARCHIVE.md`.

## Importante

La credencial de voz que estuvo expuesta en código cliente debe considerarse comprometida y debe rotarse en el proveedor. Eliminarla del branch actual no la elimina del historial Git ni invalida la credencial original.
