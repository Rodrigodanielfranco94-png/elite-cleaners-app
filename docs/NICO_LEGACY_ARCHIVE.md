# Archivo histórico de NICO legacy

Este documento registra el código experimental de NICO retirado de `elite-cleaners-app` durante la migración a Elite Command.

## Punto de recuperación

El historial anterior a la limpieza permanece en Git. El snapshot más reciente inmediatamente anterior a retirar el legado es el commit:

`52b8499bbd5c90150bf11760b8eeb5559bd09932`

## Archivos retirados

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
- `nico-avatar.png.PNG`
- `nico-assets/README.md`
- `nico-assets/alegre.png`
- `nico-assets/bien.png`
- `nico-assets/camina.png`
- `nico-assets/canta.png`
- `nico-assets/celular.png`
- `nico-assets/piensa.png`
- `nico-assets/reposo.png`
- `nico-assets/rie.png`
- `nico-assets/saluda.png`
- `assets/Walking.fbx`
- `assets/3d/Meshy_AI_Thumbs_Up_Teen_0520063851_texture.glb`

## Reemplazos en Elite Command

- Chat / IA: `nico/nico-brain.js` + `nico/remote-client.js`
- Voz: `nico/voice-bridge.js`
- Memoria: `nico/memory-service.js`
- Jobs / acciones: `core/action-registry.js`
- Estimates: `modules/estimates/`
- Invoices: `modules/invoices/`
- Email: `modules/email/`
- Documentos / PDF imprimible: `modules/documents/`
- Live Activity: `modules/live-activity/`

## Assets visuales

Las imágenes y modelos 3D legacy se retiraron del repositorio operativo para evitar mantener dos fuentes visuales de NICO. Si alguna se necesita como referencia para el avatar definitivo, puede recuperarse desde el commit histórico indicado arriba.

## Seguridad

El login antiguo contenía una credencial de un proveedor de voz dentro del código cliente. Fue retirada de la versión actual. Debido a que estuvo almacenada en Git history, debe rotarse en el proveedor antes de volver a usar ese servicio.


## Acción de seguridad pendiente

La rotación/revocación de la antigua credencial de voz se sigue en GitHub Issue #5. Esta acción debe realizarse en el proveedor; no puede completarse eliminando archivos del repositorio.
