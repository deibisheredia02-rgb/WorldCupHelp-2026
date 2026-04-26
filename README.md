# ⚽ WorldCupHelp 2026

> **PWA bilingüe (5 idiomas) mobile-first para aficionados del Mundial de Fútbol 2026** en Estados Unidos 🇺🇸 · Canadá 🇨🇦 · México 🇲🇽

[![FIFA World Cup 26](https://img.shields.io/badge/FIFA-World%20Cup%2026-F5C518?style=flat-square)](https://www.fifa.com/worldcup)
[![Languages](https://img.shields.io/badge/lang-es%20·%20en%20·%20fr%20·%20pt%20·%20de-C0392B?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/stack-React%20CDN%20+%20Vercel%20+%20Gemini-0d0d0d?style=flat-square)](#)

Sedes, transporte, emergencias, derechos, dinero, clima, leyes y consejos — todo en una app mobile-first lista para tu viaje.

---

## ✨ Features

- **16 sedes** con info completa: estadio, partidos, capacidad, transporte al estadio, aeropuertos, metro local
- **9 agentes IA especializados** (transporte, emergencias, leyes, dinero, scams, etc.) con system prompts curados y respuestas en tu idioma
- **SOS card** con 911 prominente, números por país (988, 065, SAPTEL, PROFECO) y escenarios "¿qué hacer si te roban / detienen / pierdes?"
- **Hospitales, ATMs y restaurantes cerca** de cada estadio (Google Places API)
- **5 idiomas** completos: 🇪🇸 ES · 🇺🇸 EN · 🇫🇷 FR · 🇧🇷 PT · 🇩🇪 DE
- **Carrusel 3D** de las sedes con perspective + auto-advance + swipe
- **Cuenta regresiva** al pitazo inicial (11-jun-2026)
- **PWA installable** — funciona offline para datos estáticos
- **Mobile-first**, sin login, privacy-first

## 🛠 Stack

| Capa | Tecnología | Por qué |
|---|---|---|
| UI | React 18 vanilla por CDN (sin JSX, sin build) | Iteración instantánea, refresh y listo |
| Estilos | Tailwind CDN + CSS global | Mobile-first sin npm |
| Tipografía | Syne + DM Sans + Bebas Neue | Display impacto + body legible |
| Iconos | Material Symbols Rounded | Icono semántico, ligero |
| API | Vercel serverless functions | `/api/chat`, `/api/places` |
| IA | Google Gemini 2.5 Flash | Multimodal, ~10x más barato que GPT-4 |
| Lugares | Google Places API (New) | 1000 req/día free tier |
| Datos | JSONs estáticos | Sin DB, edición directa |
| Deploy | Vercel | Edge network global, free hobby |

## 🚀 Quick start

```bash
# 1. Clonar
git clone https://github.com/deibisheredia02-rgb/WorldCupHelp-2026.git
cd WorldCupHelp-2026

# 2. Variables de entorno
cp .env.local.example .env.local
# Edita .env.local y pega tus keys (NUNCA pegar keys en .example)

# 3. Test local con Vercel CLI (recomendado, soporta /api)
npm i -g vercel
vercel link             # vincula al proyecto en tu dashboard
vercel dev              # corre en localhost:3000 con APIs funcionando

# Alternativa sin APIs (solo frontend estático)
npx serve public        # corre en localhost:3000

# 4. Deploy
vercel deploy --prod --yes
```

## 🔑 Variables de entorno

Necesitas dos API keys (ambas con free tier):

| Variable | Dónde obtenerla | Free tier |
|---|---|---|
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey | Generoso |
| `GOOGLE_PLACES_API_KEY` | https://console.cloud.google.com/apis/credentials | 1000 req/día |

Configura ambas en:
1. **Local:** archivo `.env.local` (gitignored)
2. **Producción:** Dashboard de Vercel → Project → Settings → Environment Variables

⚠️ **Restringe la GOOGLE_PLACES_API_KEY** por dominio (Application Restriction → HTTP referrers) para evitar abuso si se filtra.

## 🗂 Estructura

```
worldcuphelp-2026/
├── public/
│   ├── index.html              ← shell + Tailwind + CSS global
│   ├── app.js                  ← monolito React (~1500 líneas)
│   ├── manifest.json           ← PWA manifest
│   ├── sw.js                   ← service worker (offline)
│   ├── data/                   ← JSONs editables
│   │   ├── cities.json         ← 16 sedes
│   │   ├── topics.json         ← 9 agentes IA
│   │   └── emergency.json      ← SOS por país + escenarios
│   └── img/                    ← favicon, fotos sedes
├── api/
│   ├── chat.js                 ← proxy Gemini 2.5 Flash
│   └── places.js               ← proxy Google Places (New)
├── vercel.json                 ← rewrites + headers de cache
├── .env.local.example          ← plantilla pública
├── CLAUDE.md                   ← system prompt para Claude Code
├── HANDOFF.md                  ← estado por sesión
└── README.md                   ← este archivo
```

## 🎨 Identidad visual

Híbrida: paleta del prototipo HTML (oro/rojo Mundial) + tipografía del blueprint (Syne/DM Sans/Bebas Neue).

| Token | Hex | Uso |
|---|---|---|
| Gold | `#F5C518` | Brand primario |
| Gold dark | `#C49A00` | Gradientes |
| Red | `#C0392B` | Acento, urgencia |
| Dark | `#0d0d0d` | Background |
| Card | `#1a1a1a` | Surface elevation 1 |
| Card2 | `#222222` | Surface elevation 2 |

## 🌐 i18n

Todos los strings de UI están en el objeto `T` dentro de `app.js`. Para añadir un string:

```js
saludo: {
  es: 'Hola',
  en: 'Hi',
  fr: 'Salut',
  pt: 'Olá',
  de: 'Hallo'
}
```

Y se usa: `t('saludo', lang)`.

Para contenido (sedes, agentes, escenarios), las traducciones viven en los `*.json` con shape `{ es, en, fr, pt, de }`.

## 🤝 Contribuir

Este proyecto es una guía **no oficial** mantenida por aficionados. Aportes bienvenidos, sobre todo:
- Traducciones revisadas por hablantes nativos
- Fotos de estadios sede (CC0 / atribución libre)
- Datos verificados de transporte/embajadas

## ⚖️ Disclaimer

WorldCupHelp 2026 es una guía **no oficial** de uso libre. La información tiene carácter orientativo. Para asesoría legal consulta a un abogado. Para info oficial visita [fifa.com](https://www.fifa.com).

## 📄 Licencia

MIT — usa, modifica y distribuye libremente.

---

*Hecho con ❤️ para los que viajamos siguiendo el balón. Disfruta el Mundial más grande de la historia.* ⚽
