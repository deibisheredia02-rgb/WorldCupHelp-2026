# WorldCupHelp 2026 — Project Instructions

> PWA bilingüe (5 idiomas) mobile-first para aficionados y viajeros del Mundial de Fútbol 2026 en USA, Canadá y México.

## Stack

- **Frontend:** React 18 vanilla por CDN (sin JSX, sin build, sin TypeScript). Sintaxis: `h(tag, props, ...children)` = `React.createElement`.
- **CSS:** Tailwind CDN + Material Symbols + CSS global en `index.html`
- **Tipografía:** Syne (display 600/700/800) + DM Sans (body 400/500/700) + Bebas Neue (impact)
- **Backend:** Vercel serverless (`/api/chat.js`, `/api/places.js`) — JavaScript ESM
- **IA:** Gemini 2.5 Flash (modelo `gemini-2.5-flash`)
- **Lugares:** Google Places API (New) — endpoint `places:searchNearby`
- **Datos:** JSONs estáticos en `/public/data/`
- **PWA:** manifest + service worker stale-while-revalidate
- **Deploy:** `vercel deploy --prod`

## Identidad visual (paleta híbrida)

- **Brand gold:** `#F5C518` · **Gold dark:** `#C49A00`
- **Brand red:** `#C0392B` · **Red dark:** `#8B2A20`
- **BG dark:** `#0d0d0d` · **Card:** `#1a1a1a` · **Card2:** `#222222`
- **Text:** `#F0F0F0` (pri) · `#9A9A9A` (sec) · `#666` (mut)
- **Country chips:** US `#6BAAFF`, MX `#1ABE5C`, CA `#FF6B6B`

## Estructura

```
worldcuphelp-2026/
├── public/
│   ├── index.html              ← shell + Tailwind config + CSS global
│   ├── app.js                  ← monolito React (~1500 líneas, INTENCIONAL)
│   ├── manifest.json           ← PWA
│   ├── sw.js                   ← service worker (cache estático)
│   ├── data/
│   │   ├── cities.json         ← 16 sedes (estadios, transporte, lat/lng)
│   │   ├── topics.json         ← 9 agentes IA (5 idiomas)
│   │   └── emergency.json      ← números 911/988/065/SAPTEL + escenarios
│   └── img/                    ← favicon, fotos de sedes (TODO añadir)
├── api/
│   ├── chat.js                 ← proxy Gemini 2.5 Flash
│   └── places.js               ← proxy Google Places (hospitales/ATMs)
├── vercel.json                 ← rewrites + headers (NO routes)
├── .env.local                  ← GEMINI_API_KEY + GOOGLE_PLACES_API_KEY (NO commit)
├── .env.local.example          ← plantilla pública
├── .gitignore
├── CLAUDE.md                   ← este archivo
├── HANDOFF.md                  ← estado actual sesión a sesión
└── README.md
```

## Convenciones críticas

1. **NO JSX.** Todo con `h(tag, props, ...children)`. `const h = React.createElement`.
2. **i18n SIEMPRE 5 idiomas:** es / en / fr / pt / de. UI strings en `T` global de `app.js`. Contenido en `*.json` con shape `{ es, en, fr, pt, de }`.
3. **Mobile-first:** diseñar a 360–414px primero. Touch targets ≥44px. Tipografía con `clamp()`. Sin hover-only.
4. **Glass panels:** `.glass` y `.glass-strong` (definidos en `index.html`). NO inventar nuevos.
5. **Animaciones:** reutilizar `fadeIn`, `fadeInUp`, `kenBurns`, `pulseSlow`, `stagger`.
6. **Estilos:** layout/estructura → Tailwind; colores brand y rgbas finos → style inline.
7. **Backups antes de reescribir >50 líneas:** `cp public/app.js public/app.js.bak`.
8. **Commits:** imperativo, una línea de qué + bullets de cambios. NO firmar como Claude.

## Prioridades de orden

1. **Mobile real** (no solo devtools) antes de declarar "hecho".
2. **5 idiomas** para todo string de UI nuevo.
3. **NO migrar** de Gemini, NO TypeScript, NO Next.js, NO build steps.
4. **Glass panels** + Syne/DM Sans + paleta brand oro/rojo.

## No hacer (anti-patrones)

- ❌ Introducir TypeScript, Next.js, shadcn, build steps, npm packages
- ❌ Migrar de Gemini a Claude/GPT sin razón fuerte (10x precio)
- ❌ Usar `gemini-X-flash-exp` (se retira sin aviso → 404)
- ❌ `vercel.json` con `routes` + `headers` mezclados → rompe deploy. Usar `rewrites`.
- ❌ `responseMimeType: 'application/json'` con `inline_data` multimodal → 404 en Gemini
- ❌ Strings hardcoded sin los 5 idiomas
- ❌ Touch targets <44px
- ❌ Hover-only states (mobile-first)
- ❌ Borrar archivos legacy del root sin permiso
- ❌ Commits sin pedir permiso
- ❌ Pegar API keys en chat o en `.env.local.example`

## Workflow de sesión

1. Abrir Claude Code en la carpeta del proyecto
2. Primer mensaje: "Lee CLAUDE.md y HANDOFF.md y dime el estado"
3. Trabajar feature por feature, una a la vez
4. Backup antes de reescritura grande
5. Validar sintaxis: `node --check public/app.js`
6. Test local: `npx serve public` o `vercel dev`
7. Deploy: `vercel deploy --prod --yes`
8. Verificar en mobile real
9. Antes de cerrar sesión: actualizar `HANDOFF.md`

## Estado actual

Ver `HANDOFF.md`.
