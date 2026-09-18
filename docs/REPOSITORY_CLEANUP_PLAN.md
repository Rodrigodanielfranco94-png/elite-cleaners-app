# Plan de limpieza de elite-cleaners-app

## Objetivo

Dejar este repositorio enfocado en las aplicaciones operativas existentes:

- Elite Admin
- Elite Staff
- firma / páginas auxiliares

El código experimental de NICO será migrado a `elite-command` antes de eliminarse de aquí.

## No hacer todavía

- No borrar archivos de NICO en `main`.
- No mover Admin ni Staff.
- No dividir `admin.html` o `staff_v3.html` durante la migración de NICO.
- No cambiar rutas públicas hasta validar Elite Command.

## Archivos que eventualmente saldrán de este repositorio

- nico.html
- nico-admin.js
- nico-chat.js
- nico-config.js
- nico-email.js
- nico-estimates.js
- nico-jobs.js
- nico-memory.js
- nico-pdf.js
- nico-utils.js
- nico-voice.js
- nico-avatar.png.PNG
- nico-assets/
- assets/3d/ si se confirma que pertenece exclusivamente a NICO
- assets/Walking.fbx si se confirma que pertenece exclusivamente a NICO

## Archivos que permanecen

- admin.html
- staff_v3.html
- firmar.html
- index.html
- assets compartidos necesarios para Admin/Staff

## Proceso

1. Migrar capacidad por capacidad a Elite Command.
2. Probar contra Firebase real en modo lectura.
3. Probar comandos de escritura con permisos.
4. Verificar que Admin y Staff no dependan de los archivos de NICO.
5. Solo entonces crear PR de limpieza para eliminar legacy de este repositorio.
