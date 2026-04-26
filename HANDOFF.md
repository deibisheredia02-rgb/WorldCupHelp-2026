# HANDOFF — WorldCupHelp 2026

> Estado del proyecto. Actualizar al cerrar cada sesión grande.

## 📅 Sesión actual: 2026-04-26

### ✅ Hecho en esta sesión (MVP inicial)

**Estructura base**
- `vercel.json` con rewrites + headers (cache larga para data y assets)
- `.gitignore` (incluye `.env*`, `*.bak`, `node_modules`, `.vercel`)
- `.env.local.example` (plantilla pública) + `.env.local` (vacío, gitignored)

**Frontend**
- `public/index.html` — shell con Tailwind CDN, Syne+DM Sans+Bebas Neue, paleta híbrida (oro/rojo del HTML + tipografía del blueprint), CSS global con glass panels, grid overlay, ball-deco, animaciones (fadeIn, fadeInUp, kenBurns, pulseBall, stagger)
- `public/app.js` — monolito React 18 vanilla (~1500 líneas) con:
  - i18n 5 idiomas (es/en/fr/pt/de) con objeto `T` global
  - `useLang`, `useRoute` (hash-based), `useCountdown`, `useFetch` hooks
  - **LangBar** sticky con selector de 5 idiomas
  - **Hero** con countdown al 11-jun-2026, grid overlay, ball-deco, CTAs
  - **Carrusel 3D** de 16 sedes (puerto del Prompt 2i): perspective 1200px, scale 1/0.82/0.66, rotateY ±12°, blur en laterales, auto-advance 4.5s pausable, swipe touch, keyboard arrows
  - **TopicsGrid** (9 agentes IA con icon+color)
  - **VenuesView** con filtros US/CA/MX/ALL
  - **VenueDetail** con stats, transit blocks, NearbyBlock (Places API)
  - **TopicView** con chat especializado por agente
  - **ChatBox** general (proxy a /api/chat)
  - **SOSView** con 911 prominente, números por país, escenarios "qué hacer si..."
  - **BottomNav** mobile (5 items: Home, Venues, Topics, Chat, SOS)
  - Router por hash: `#home`, `#venues`, `#sede/{id}`, `#topics`, `#topic/{id}`, `#chat`, `#sos`

**Datos**
- `public/data/cities.json` — 16 sedes con todos los datos del .md (estadio, partidos, capacidad, country, lat/lng, airport, transit, metro, mapsQuery, altitudeWarning para CDMX/GDL)
- `public/data/topics.json` — 9 agentes (venues, transport, services, laws, emergencies, weather, money, tips, scams) con `name`, `description` y `agentPrompt` en 5 idiomas
- `public/data/emergency.json` — números primarios (911) por país, líneas especiales (988/065/SAPTEL/PROFECO), 6 escenarios (medical, robbery, detained, lost, discrimination, mental)

**Backend**
- `api/chat.js` — proxy a Gemini 2.5 Flash con: validación de modelos permitidos, límites (30 msgs, 20k chars), inyección de fecha actual al system prompt, soporte multimodal (inline_data), safety settings, manejo de finishReason=SAFETY
- `api/places.js` — proxy a Google Places API (New) → `places:searchNearby` con: validación de tipos (hospital/atm/restaurant/pharmacy), validación lat/lng, cálculo haversine de distancia, sort por proximidad, cache 1h browser + 6h CDN

**PWA**
- `public/manifest.json` — installable con shortcuts (Sedes, SOS, Chat IA)
- `public/sw.js` — service worker stale-while-revalidate (no cachea /api/*)
- `public/img/favicon.svg` — favicon SVG inline (balón con paleta gold→red)

**Docs**
- `CLAUDE.md` — system prompt para futuras sesiones (stack, paleta, anti-patrones)
- `HANDOFF.md` — este archivo

---

### 🔄 Pendiente / Siguiente sesión

**Crítico antes del primer deploy**
- [ ] Usuario: añadir `GEMINI_API_KEY` y `GOOGLE_PLACES_API_KEY` a `.env.local` (sin espacios después del `=`)
- [ ] Usuario: añadir las MISMAS variables al Dashboard de Vercel
- [ ] Test local con `vercel dev` antes del deploy a producción
- [ ] Deploy: `vercel link` + `vercel deploy --prod --yes`

**Imágenes (placeholder actual: gradient por país)**
- [ ] Conseguir 16 imágenes de estadios sede (Unsplash, Wikimedia o foto oficial)
- [ ] Optimizar a WebP, max 1200px
- [ ] Subir a `/public/img/cities/` con nombres del campo `image` en `cities.json`
- [ ] Generar `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch.png`

**Mejoras post-MVP**
- [ ] Análisis de documentos multimodal (PDF de boleto, reserva de hotel, visa) — ya soportado en `api/chat.js`, falta UI en `app.js`
- [ ] Verificador anti-scam de tickets (escanear QR + validar formato FIFA)
- [ ] Mapa de calor de partidos por día/ciudad (necesita data del calendario oficial)
- [ ] Filtros en SOS por ciudad/embajada por nacionalidad
- [ ] Modo claro (light theme) — el blueprint lo menciona como opcional
- [ ] Cuenta regresiva por partido específico (no solo apertura del Mundial)
- [ ] Push notifications para alertas (cancelaciones, cambios de horario)

**Conocidos / Tech debt**
- En `Carousel3D` el botón "Ver detalles de [city]" tiene strings hardcoded solo en es/en. Añadir los otros 3 idiomas a `T`.
- `useFetch` no maneja error → muestra spinner infinito. Añadir UI de error con botón retry.
- Service worker no precachea las imágenes de sedes (cuando existan).
- `cities.json` no tiene calendar de partidos por día — pendiente cuando FIFA publique fixtures definitivos (~mayo 2026).

---

### 🔑 Secretos y servicios

| Servicio | Variable | Dashboard | Cuota |
|---|---|---|---|
| Google Gemini | `GEMINI_API_KEY` | https://aistudio.google.com/apikey | Free tier generoso |
| Google Places API (New) | `GOOGLE_PLACES_API_KEY` | https://console.cloud.google.com/apis/credentials | 1000 req/día gratis |
| Vercel | (auto via CLI login) | https://vercel.com/davis-heredias-projects | Free hobby |
| GitHub | (auto via CLI login) | https://github.com/deibisheredia02-rgb/WorldCupHelp-2026 | — |

### 🌐 URLs

- **Repo:** https://github.com/deibisheredia02-rgb/WorldCupHelp-2026
- **Dashboard Vercel:** https://vercel.com/davis-heredias-projects
- **Producción:** TBD (después del primer deploy)

---

*Última actualización: 2026-04-26 — Setup MVP inicial completo, listo para deploy y test.*
