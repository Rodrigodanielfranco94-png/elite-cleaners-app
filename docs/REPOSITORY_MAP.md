# Repository map

## elite-cleaners-app

Purpose: operational applications.

```text
elite-cleaners-app/
├── admin.html          # Elite Admin master
├── staff_v3.html       # Elite Staff master
├── firmar.html         # signature flow
├── index.html          # existing entry page
├── assets/             # production/shared assets
├── docs/               # repository documentation
└── nico-*              # frozen legacy prototype only
```

## elite-command

Purpose: NICO brain and command center.

```text
elite-command/
├── index.html
├── app.js
├── styles.css
├── core/
├── firebase/
├── modules/
├── nico/
├── ui/
├── tests/
└── docs/
```

## Shared boundary

The apps communicate through the shared Firebase / Firestore data model. Source code is not duplicated between the repositories.
