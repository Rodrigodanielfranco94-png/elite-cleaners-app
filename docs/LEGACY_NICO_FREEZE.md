# Legacy NICO freeze

The root-level NICO prototype files are now **legacy / frozen**.

They are kept temporarily because the existing Admin code is large and may contain dynamic references that are not reliably discoverable through repository indexing alone.

## Frozen files

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
- `nico-assets/`

## Policy

- Do not add new features to these files.
- New NICO development belongs in `elite-command`.
- Bug fixes should be made in Elite Command unless a production dependency specifically requires a legacy patch.
- Do not delete these files until Admin/Staff runtime testing confirms there are no remaining dependencies.

## Replacement

The replacement architecture is already in:

`Rodrigodanielfranco94-png/elite-command`

See that repository's `docs/LEGACY_TO_NEW_MAP.md`.
