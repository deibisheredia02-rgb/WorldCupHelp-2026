/* ═══════════════════════════════════════════════════════════════════════════
   WorldCupHelp 2026 — Monolito React (sin JSX, factory h)
   ─────────────────────────────────────────────────────────────────────────
   Stack: React 18 (UMD CDN) + Tailwind CDN + Material Symbols
   i18n: es / en / fr / pt / de
   Convención: NUNCA importes con bundler. Todo es CDN. Mobile-first.
   ═══════════════════════════════════════════════════════════════════════════ */

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const h = React.createElement;

/* ─────────────────────────────────────────────────────────────────────────
   1. i18n — strings de UI en 5 idiomas
   ───────────────────────────────────────────────────────────────────────── */
const LANGS = [
  { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Español' },
  { code: 'en', label: 'EN', flag: '🇺🇸', name: 'English' },
  { code: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français' },
  { code: 'pt', label: 'PT', flag: '🇧🇷', name: 'Português' },
  { code: 'de', label: 'DE', flag: '🇩🇪', name: 'Deutsch' }
];

const T = {
  appName: { es: 'WorldCupHelp', en: 'WorldCupHelp', fr: 'WorldCupHelp', pt: 'WorldCupHelp', de: 'WorldCupHelp' },
  tagline: {
    es: 'Tu guía del Mundial 2026',
    en: 'Your 2026 World Cup guide',
    fr: 'Votre guide de la Coupe du Monde 2026',
    pt: 'Seu guia da Copa do Mundo 2026',
    de: 'Ihr Leitfaden für die WM 2026'
  },
  heroEyebrow: {
    es: 'Guía oficial · No oficial',
    en: 'Fan Guide · Unofficial',
    fr: 'Guide du Fan · Non officiel',
    pt: 'Guia do Fã · Não oficial',
    de: 'Fan-Leitfaden · Inoffiziell'
  },
  heroTitle: {
    es: 'MUNDIAL',
    en: 'WORLD CUP',
    fr: 'COUPE DU MONDE',
    pt: 'COPA DO MUNDO',
    de: 'WELTMEISTERSCHAFT'
  },
  heroSub: {
    es: '2026',
    en: '2026',
    fr: '2026',
    pt: '2026',
    de: '2026'
  },
  heroDesc: {
    es: 'Sedes, transporte, emergencias, derechos, dinero y clima. Bilingüe, mobile-first, listo para tu viaje a USA · Canadá · México.',
    en: 'Venues, transit, emergencies, rights, money and weather. Bilingual, mobile-first, ready for your trip to USA · Canada · Mexico.',
    fr: 'Stades, transports, urgences, droits, argent et météo. Multilingue, mobile-first, prêt pour votre voyage aux USA · Canada · Mexique.',
    pt: 'Sedes, transporte, emergências, direitos, dinheiro e clima. Multilíngue, mobile-first, pronto para sua viagem aos EUA · Canadá · México.',
    de: 'Stadien, Verkehr, Notfälle, Rechte, Geld und Wetter. Mehrsprachig, mobile-first, bereit für Ihre Reise in die USA · Kanada · Mexiko.'
  },
  ctaExplore: { es: 'Explorar sedes', en: 'Explore venues', fr: 'Explorer les stades', pt: 'Explorar sedes', de: 'Stadien erkunden' },
  ctaChat: { es: 'Pregunta a la IA', en: 'Ask the AI', fr: 'Demander à l\'IA', pt: 'Pergunte à IA', de: 'KI fragen' },
  navHome: { es: 'Inicio', en: 'Home', fr: 'Accueil', pt: 'Início', de: 'Start' },
  navVenues: { es: 'Sedes', en: 'Venues', fr: 'Stades', pt: 'Sedes', de: 'Stadien' },
  navTopics: { es: 'Temas', en: 'Topics', fr: 'Sujets', pt: 'Temas', de: 'Themen' },
  navChat: { es: 'IA', en: 'AI', fr: 'IA', pt: 'IA', de: 'KI' },
  navSOS: { es: 'SOS', en: 'SOS', fr: 'SOS', pt: 'SOS', de: 'SOS' },
  matches: { es: 'partidos', en: 'matches', fr: 'matchs', pt: 'jogos', de: 'Spiele' },
  capacity: { es: 'capacidad', en: 'capacity', fr: 'capacité', pt: 'capacidade', de: 'Kapazität' },
  airport: { es: 'Aeropuerto', en: 'Airport', fr: 'Aéroport', pt: 'Aeroporto', de: 'Flughafen' },
  toStadium: { es: 'Al estadio', en: 'To stadium', fr: 'Vers le stade', pt: 'Ao estádio', de: 'Zum Stadion' },
  metro: { es: 'Transporte urbano', en: 'Urban transit', fr: 'Transport urbain', pt: 'Transporte urbano', de: 'Stadtverkehr' },
  openMaps: { es: 'Abrir en Google Maps', en: 'Open in Google Maps', fr: 'Ouvrir dans Google Maps', pt: 'Abrir no Google Maps', de: 'In Google Maps öffnen' },
  nearbyHospitals: { es: 'Hospitales cerca', en: 'Hospitals nearby', fr: 'Hôpitaux à proximité', pt: 'Hospitais próximos', de: 'Krankenhäuser in der Nähe' },
  nearbyATMs: { es: 'ATMs cerca', en: 'ATMs nearby', fr: 'Distributeurs à proximité', pt: 'ATMs próximos', de: 'Geldautomaten in der Nähe' },
  nearbyRestaurants: { es: 'Restaurantes cerca', en: 'Restaurants nearby', fr: 'Restaurants à proximité', pt: 'Restaurantes próximos', de: 'Restaurants in der Nähe' },
  loading: { es: 'Cargando…', en: 'Loading…', fr: 'Chargement…', pt: 'Carregando…', de: 'Lädt…' },
  errorGeneric: { es: 'Algo salió mal. Intenta de nuevo.', en: 'Something went wrong. Try again.', fr: 'Une erreur est survenue. Réessayez.', pt: 'Algo deu errado. Tente novamente.', de: 'Etwas ist schiefgegangen. Versuchen Sie es erneut.' },
  retry: { es: 'Reintentar', en: 'Retry', fr: 'Réessayer', pt: 'Tentar de novo', de: 'Erneut versuchen' },
  homeTeamsLabel: { es: 'Equipos locales / Inquilinos', en: 'Home teams / Regular tenants', fr: 'Équipes résidentes', pt: 'Equipes locais', de: 'Heimteams' },
  historyLabel: { es: 'Historia del Estadio', en: 'Stadium history', fr: 'Histoire du stade', pt: 'História do estádio', de: 'Stadiongeschichte' },
  altitudeWarning: {
    es: '⚠️ Altitud >2000m: hidratación extra y evita alcohol las primeras 24h.',
    en: '⚠️ Altitude >2000m: extra hydration and avoid alcohol for the first 24h.',
    fr: '⚠️ Altitude >2000m : hydratation supplémentaire et évitez l\'alcool les premières 24h.',
    pt: '⚠️ Altitude >2000m: hidratação extra e evite álcool nas primeiras 24h.',
    de: '⚠️ Höhe >2000m: zusätzliche Hydratation und meiden Sie Alkohol in den ersten 24h.'
  },
  finalTag: { es: 'FINAL', en: 'FINAL', fr: 'FINALE', pt: 'FINAL', de: 'FINALE' },
  semifinalTag: { es: 'SEMIFINAL', en: 'SEMIFINAL', fr: 'DEMI-FINALE', pt: 'SEMIFINAL', de: 'HALBFINALE' },
  quartersTag: { es: 'CUARTOS', en: 'QUARTERS', fr: 'QUARTS', pt: 'QUARTAS', de: 'VIERTELFINALE' },
  historicTag: { es: 'HISTÓRICO', en: 'HISTORIC', fr: 'HISTORIQUE', pt: 'HISTÓRICO', de: 'HISTORISCH' },
  finalHostTag: { es: 'SEDE FINAL', en: 'FINAL HOST', fr: 'HÔTE FINALE', pt: 'SEDE FINAL', de: 'FINAL-AUSTRAGUNGSORT' },
  topicsTitle: { es: 'Agentes IA por tema', en: 'AI Agents by topic', fr: 'Agents IA par sujet', pt: 'Agentes IA por tema', de: 'KI-Agenten nach Thema' },
  topicsDesc: {
    es: 'Pregunta a un experto especializado en cualquier área del Mundial 2026.',
    en: 'Ask a specialized expert in any 2026 World Cup area.',
    fr: 'Posez une question à un expert spécialisé dans n\'importe quel domaine de la Coupe du Monde 2026.',
    pt: 'Pergunte a um especialista em qualquer área da Copa do Mundo 2026.',
    de: 'Fragen Sie einen Experten zu einem beliebigen Bereich der WM 2026.'
  },
  chatPlaceholder: {
    es: 'Pregunta lo que necesites…',
    en: 'Ask anything you need…',
    fr: 'Posez votre question…',
    pt: 'Pergunte o que precisar…',
    de: 'Fragen Sie alles, was Sie brauchen…'
  },
  send: { es: 'Enviar', en: 'Send', fr: 'Envoyer', pt: 'Enviar', de: 'Senden' },
  chatWelcome: {
    es: 'Hola 👋 Soy tu asistente para el Mundial 2026. Puedo ayudarte con sedes, transporte, emergencias, leyes, dinero y más. ¿En qué te ayudo?',
    en: 'Hi 👋 I\'m your 2026 World Cup assistant. I can help with venues, transit, emergencies, laws, money and more. How can I help?',
    fr: 'Salut 👋 Je suis votre assistant pour la Coupe du Monde 2026. Je peux vous aider avec les stades, les transports, les urgences, les lois, l\'argent et plus encore. Comment puis-je vous aider ?',
    pt: 'Olá 👋 Sou seu assistente para a Copa do Mundo 2026. Posso ajudar com sedes, transporte, emergências, leis, dinheiro e mais. Como posso ajudar?',
    de: 'Hallo 👋 Ich bin Ihr Assistent für die WM 2026. Ich kann Ihnen bei Stadien, Verkehr, Notfällen, Gesetzen, Geld und mehr helfen. Wie kann ich helfen?'
  },
  sosTitle: { es: 'Emergencias', en: 'Emergencies', fr: 'Urgences', pt: 'Emergências', de: 'Notfälle' },
  sosCallNow: { es: 'LLAMAR AHORA', en: 'CALL NOW', fr: 'APPELER MAINTENANT', pt: 'LIGAR AGORA', de: 'JETZT ANRUFEN' },
  sosScenarios: { es: '¿Qué hacer si…?', en: 'What to do if…?', fr: 'Que faire si…?', pt: 'O que fazer se…?', de: 'Was tun, wenn…?' },
  sosAll: { es: 'Todos', en: 'All', fr: 'Tous', pt: 'Todos', de: 'Alle' },
  sosHostFilter: { es: 'Filtrar por país', en: 'Filter by country', fr: 'Filtrer par pays', pt: 'Filtrar por país', de: 'Nach Land filtern' },
  sosYourConsulate: { es: 'Tu consulado', en: 'Your consulate', fr: 'Votre consulat', pt: 'Seu consulado', de: 'Ihr Konsulat' },
  sosSelectNat: { es: 'Selecciona tu nacionalidad…', en: 'Select your nationality…', fr: 'Sélectionnez votre nationalité…', pt: 'Selecione sua nacionalidade…', de: 'Nationalität wählen…' },
  sosOfficialSite: { es: 'Sitio oficial', en: 'Official website', fr: 'Site officiel', pt: 'Site oficial', de: 'Offizielle Website' },
  sosEmbassyNote: { es: 'Sedes donde hay representación consular:', en: 'Host cities with consular representation:', fr: 'Villes hôtes avec représentation consulaire :', pt: 'Cidades-sede com representação consular:', de: 'Gastgeberstädte mit Konsulatvertretung:' },
  countdown: { es: 'al pitazo inicial', en: 'to kickoff', fr: 'avant le coup d\'envoi', pt: 'até o apito inicial', de: 'bis zum Anpfiff' },
  days: { es: 'días', en: 'days', fr: 'jours', pt: 'dias', de: 'Tage' },
  hours: { es: 'horas', en: 'hours', fr: 'heures', pt: 'horas', de: 'Stunden' },
  minutes: { es: 'min', en: 'min', fr: 'min', pt: 'min', de: 'Min' },
  countries: { es: '3 países sede', en: '3 host countries', fr: '3 pays hôtes', pt: '3 países sede', de: '3 Gastgeberländer' },
  totalCities: { es: '16 ciudades · 16 estadios', en: '16 cities · 16 stadiums', fr: '16 villes · 16 stades', pt: '16 cidades · 16 estádios', de: '16 Städte · 16 Stadien' },
  locateMe: { es: 'Ubicarme', en: 'Locate me', fr: 'Me localiser', pt: 'Localizar-me', de: 'Mich orten' },
  locating: { es: 'Localizando…', en: 'Locating…', fr: 'Localisation…', pt: 'Localizando…', de: 'Ortung…' },
  locationDenied: { es: 'Permiso de ubicación denegado', en: 'Location permission denied', fr: 'Autorisation de localisation refusée', pt: 'Permissão de localização negada', de: 'Standortberechtigung verweigert' },
  locationError: { es: 'No se pudo obtener tu ubicación', en: 'Could not get your location', fr: 'Impossible d\'obtenir votre position', pt: 'Não foi possível obter sua localização', de: 'Standort konnte nicht ermittelt werden' },
  directionsFromMe: { es: 'Cómo llegar desde mi ubicación', en: 'Directions from my location', fr: 'Itinéraire depuis ma position', pt: 'Como chegar daqui', de: 'Route von meinem Standort' },
  directionsTransit: { es: 'En transporte público', en: 'By public transit', fr: 'En transports en commun', pt: 'Por transporte público', de: 'Mit öffentlichen Verkehrsmitteln' },
  distanceFromYou: { es: 'desde tu ubicación', en: 'from your location', fr: 'depuis votre position', pt: 'da sua localização', de: 'von Ihrem Standort' },
  km: { es: 'km', en: 'km', fr: 'km', pt: 'km', de: 'km' },
  seeDetails: {
    es: 'Ver detalles de',
    en: 'See details of',
    fr: 'Voir les détails de',
    pt: 'Ver detalhes de',
    de: 'Details anzeigen von'
  },
  attachDoc: {
    es: 'Adjuntar boleto o documento',
    en: 'Attach ticket or document',
    fr: 'Joindre un billet ou document',
    pt: 'Anexar bilhete ou documento',
    de: 'Ticket oder Dokument anhängen'
  },
  fileAttached: {
    es: 'Archivo adjunto',
    en: 'Attached file',
    fr: 'Fichier joint',
    pt: 'Arquivo anexado',
    de: 'Anhang'
  },
  fileTooLarge: {
    es: 'Archivo muy grande (máx. 3 MB)',
    en: 'File too large (max 3 MB)',
    fr: 'Fichier trop volumineux (max 3 Mo)',
    pt: 'Arquivo muito grande (máx. 3 MB)',
    de: 'Datei zu groß (max. 3 MB)'
  }
};

const t = (key, lang) => (T[key] && T[key][lang]) || (T[key] && T[key].en) || key;

/* ─────────────────────────────────────────────────────────────────────────
   2. Estado global ligero (lang + route)
   ───────────────────────────────────────────────────────────────────────── */
const KICKOFF_DATE = new Date('2026-06-11T20:00:00-04:00'); // Final del partido inaugural

function useLang() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('wch_lang');
    if (saved && LANGS.find(l => l.code === saved)) return saved;
    const nav = (navigator.language || 'en').slice(0, 2);
    return LANGS.find(l => l.code === nav)?.code || 'es';
  });
  useEffect(() => {
    localStorage.setItem('wch_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);
  return [lang, setLang];
}

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || 'home');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || 'home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const navigate = useCallback((to) => {
    window.location.hash = to;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return [route, navigate];
}

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    elapsed: diff === 0
  };
}

// Geolocation hook — pide permiso bajo demanda (privacy-first), persiste en sessionStorage
function useGeolocation() {
  const [state, setState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('wch_geo');
      if (saved) {
        const p = JSON.parse(saved);
        if (p && Number.isFinite(p.lat) && Number.isFinite(p.lng)) {
          return { lat: p.lat, lng: p.lng, loading: false, error: null, requested: true };
        }
      }
    } catch (e) {}
    return { lat: null, lng: null, loading: false, error: null, requested: false };
  });

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState(s => ({ ...s, error: 'unsupported', requested: true }));
      return;
    }
    setState(s => ({ ...s, loading: true, requested: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          loading: false, error: null, requested: true
        };
        try { sessionStorage.setItem('wch_geo', JSON.stringify({ lat: next.lat, lng: next.lng })); } catch (e) {}
        setState(next);
      },
      (err) => setState(s => ({
        ...s, loading: false, requested: true,
        error: err.code === 1 ? 'denied' : 'error'
      })),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }, []);

  const clear = useCallback(() => {
    try { sessionStorage.removeItem('wch_geo'); } catch (e) {}
    setState({ lat: null, lng: null, loading: false, error: null, requested: false });
  }, []);

  return { ...state, request, clear };
}

// Helpers de Google Maps URLs
const directionsUrl = (destLat, destLng, destName, userLat, userLng, mode = 'transit') => {
  if (Number.isFinite(userLat) && Number.isFinite(userLng)) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=${mode}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destName)}`;
};

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function useFetch(url, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [retry, setRetry] = useState(0);
  const refetch = useCallback(() => setRetry(r => r + 1), []);

  useEffect(() => {
    let alive = true;
    setState({ data: null, loading: true, error: null });
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { if (alive) setState({ data, loading: false, error: null }); })
      .catch(error => { if (alive) setState({ data: null, loading: false, error }); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, retry, ...deps]);

  return { ...state, refetch };
}

/* ─────────────────────────────────────────────────────────────────────────
   3. Helpers UI
   ───────────────────────────────────────────────────────────────────────── */
const Icon = (name, extra = '') =>
  h('span', { className: `ms-icon ${extra}` }, name);

const FlagChip = (country) => {
  const flags = { US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽' };
  return h('span', { className: 'flag-chip', 'data-country': country },
    flags[country] || '', country
  );
};

const tagLabel = (tag, lang) => {
  if (!tag) return null;
  const map = {
    'FINAL': t('finalTag', lang),
    'FINAL HOST': t('finalHostTag', lang),
    'SEMIFINAL': t('semifinalTag', lang),
    'CUARTOS': t('quartersTag', lang),
    'HISTÓRICO': t('historicTag', lang)
  };
  return map[tag] || tag;
};

const cityImage = (city) => {
  const fallbacks = {
    US: '/img/cities/usa_stadium.png',
    CA: '/img/cities/can_stadium.png',
    MX: '/img/cities/mex_stadium.png'
  };
  const imgUrl = city.cityImage || fallbacks[city.country] || '/img/cities/usa_stadium.png';
  return `linear-gradient(135deg, rgba(13, 13, 13, 0.45) 0%, rgba(13, 13, 13, 0.85) 100%), url("${imgUrl}") center/cover no-repeat`;
};

const stadiumImage = (city) => {
  const fallbacks = {
    US: '/img/cities/usa_stadium.png',
    CA: '/img/cities/can_stadium.png',
    MX: '/img/cities/mex_stadium.png'
  };
  const imgUrl = city.stadiumImage || fallbacks[city.country] || '/img/cities/usa_stadium.png';
  return `linear-gradient(135deg, rgba(13, 13, 13, 0.4) 0%, rgba(13, 13, 13, 0.85) 100%), url("${imgUrl}") center/cover no-repeat`;
};

/* ─────────────────────────────────────────────────────────────────────────
   4. Componentes: LangBar (top sticky)
   ───────────────────────────────────────────────────────────────────────── */
function LangBar({ lang, setLang, navigate }) {
  return h('header', {
    className: 'fixed top-0 left-0 right-0 z-50 glass-strong px-4 py-3 flex items-center justify-between',
    style: { paddingTop: 'calc(0.75rem + var(--safe-top))' }
  },
    h('button', {
      onClick: () => navigate('home'),
      className: 'flex items-center gap-2 active:opacity-70'
    },
      h('span', { className: 'impact text-2xl text-gold' }, 'WCH'),
      h('span', { className: 'hidden sm:inline text-text-sec text-sm font-body' }, '· 2026')
    ),
    h('div', { className: 'flex items-center gap-1 flex-wrap justify-end' },
      ...LANGS.map(l =>
        h('button', {
          key: l.code,
          onClick: () => setLang(l.code),
          className: `px-2.5 py-1 rounded-full text-[11px] font-body font-bold transition-all ${
            lang === l.code
              ? 'bg-gold text-black'
              : 'text-text-sec hover:text-text-pri border border-white/10'
          }`,
          'aria-pressed': lang === l.code,
          'aria-label': l.name
        }, l.label)
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   5. Hero (con grid overlay + balls + countdown)
   ───────────────────────────────────────────────────────────────────────── */
function Hero({ lang, navigate }) {
  const cd = useCountdown(KICKOFF_DATE);
  return h('section', {
    className: 'hero relative min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden px-6 pt-24 pb-12'
  },
    h('div', { className: 'hero-bg' }),
    h('div', { className: 'grid-overlay' }),
    h('div', { className: 'ball-deco', style: { width: '500px', height: '500px', top: '-180px', right: '-180px' } }),
    h('div', { className: 'ball-deco', style: { width: '350px', height: '350px', bottom: '-120px', left: '-100px', animationDelay: '3s' } }),

    h('div', { className: 'relative z-10 max-w-3xl mx-auto stagger' },
      // Flag strip
      h('div', { className: 'flex justify-center gap-3 mb-5' },
        h('span', { className: 'text-3xl', 'aria-hidden': true }, '🇺🇸'),
        h('span', { className: 'text-3xl', 'aria-hidden': true }, '🇨🇦'),
        h('span', { className: 'text-3xl', 'aria-hidden': true }, '🇲🇽')
      ),
      // Eyebrow
      h('div', { className: 'eyebrow mb-3' }, t('heroEyebrow', lang)),
      // Title
      h('h1', {
        className: 'impact title-grad',
        style: { fontSize: 'clamp(4rem, 14vw, 9rem)', lineHeight: '0.9', marginBottom: '0.4rem' }
      }, t('heroTitle', lang)),
      // Sub (year)
      h('div', {
        className: 'impact text-text-sec',
        style: { fontSize: 'clamp(1.4rem, 4vw, 3rem)', letterSpacing: '4px', marginBottom: '1.5rem' }
      }, t('heroSub', lang)),
      // Description
      h('p', {
        className: 'text-text-sec max-w-xl mx-auto mb-8 leading-relaxed',
        style: { fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)' }
      }, t('heroDesc', lang)),

      // Countdown card (only if not elapsed)
      !cd.elapsed && h('div', {
        className: 'glass rounded-2xl px-6 py-4 inline-flex flex-col items-center gap-1 mb-6'
      },
        h('div', { className: 'flex items-baseline gap-3' },
          h('span', { className: 'impact text-gold text-4xl' }, cd.days),
          h('span', { className: 'text-text-sec text-xs uppercase tracking-widest font-body' }, t('days', lang)),
          h('span', { className: 'impact text-gold text-3xl ml-2' }, cd.hours),
          h('span', { className: 'text-text-sec text-xs uppercase tracking-widest font-body' }, 'h'),
          h('span', { className: 'impact text-gold text-3xl' }, cd.minutes),
          h('span', { className: 'text-text-sec text-xs uppercase tracking-widest font-body' }, 'm')
        ),
        h('div', { className: 'text-text-mut text-xs font-body uppercase tracking-widest' }, t('countdown', lang))
      ),

      // CTAs
      h('div', { className: 'flex flex-wrap items-center justify-center gap-3' },
        h('button', {
          className: 'btn-gold flex items-center gap-2',
          onClick: () => navigate('venues')
        },
          Icon('stadium'),
          t('ctaExplore', lang)
        ),
        h('button', {
          className: 'btn-ghost flex items-center gap-2',
          onClick: () => navigate('chat')
        },
          Icon('forum'),
          t('ctaChat', lang)
        )
      ),

      // Stats
      h('div', { className: 'mt-10 flex flex-wrap justify-center gap-6 text-text-mut text-xs font-body uppercase tracking-widest' },
        h('div', null, t('countries', lang)),
        h('div', null, '·'),
        h('div', null, t('totalCities', lang))
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   6. Carrusel 3D de sedes (puerto del Prompt 2i a React vanilla)
   ───────────────────────────────────────────────────────────────────────── */
function Carousel3D({ cities, lang, navigate }) {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(cities.length / 2));
  const [isPaused, setIsPaused] = useState(false);
  const total = cities.length;

  const next = useCallback(() => setCurrentIndex(i => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrentIndex(i => (i - 1 + total) % total), [total]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [isPaused, next]);

  // Touch swipe
  const touchStart = useRef(null);
  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; setIsPaused(true); };
  const onTouchEnd = e => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    touchStart.current = null;
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Keyboard
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const current = cities[currentIndex];

  return h('section', { className: 'relative w-full px-4 py-10' },
    // Header
    h('div', { className: 'text-center mb-6' },
      h('div', { className: 'eyebrow mb-2' }, t('navVenues', lang)),
      h('h2', { className: 'display text-3xl sm:text-4xl text-text-pri' },
        t('totalCities', lang).split('·')[0].trim()
      )
    ),

    // 3D stage
    h('div', {
      className: 'relative w-full h-[420px] sm:h-[480px] flex items-center justify-center carousel-3d select-none',
      onTouchStart, onTouchEnd,
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false)
    },
      ...cities.map((city, index) => {
        const offset = index - currentIndex;
        let pos = ((offset + total) % total);
        if (pos > Math.floor(total / 2)) pos = pos - total;

        const isCenter = pos === 0;
        const isAdjacent = Math.abs(pos) === 1;
        const isFar = Math.abs(pos) === 2;

        const transform = `
          translateX(${pos * 55}%)
          scale(${isCenter ? 1 : isAdjacent ? 0.82 : isFar ? 0.66 : 0.5})
          rotateY(${pos * -12}deg)
        `;

        return h('div', {
          key: city.id,
          className: `carousel-3d-card absolute w-56 h-80 sm:w-64 sm:h-96 rounded-3xl overflow-hidden cursor-pointer glow-${city.country.toLowerCase()}`,
          style: {
            transform,
            zIndex: isCenter ? 30 : isAdjacent ? 20 : isFar ? 10 : 0,
            opacity: isCenter ? 1 : isAdjacent ? 0.55 : isFar ? 0.18 : 0,
            filter: isCenter ? 'blur(0px)' : isAdjacent ? 'blur(2px)' : 'blur(6px)',
            visibility: Math.abs(pos) > 2 ? 'hidden' : 'visible',
            background: cityImage(city),
            border: isCenter ? '2px solid rgba(245,197,24,0.40)' : '1px solid rgba(255,255,255,0.10)',
            boxShadow: isCenter ? '0 24px 60px rgba(0,0,0,0.6), 0 0 32px rgba(245,197,24,0.20)' : '0 8px 24px rgba(0,0,0,0.3)'
          },
          onClick: () => isCenter && navigate(`sede/${city.id}`)
        },
          // Card content
          h('div', { className: 'absolute inset-0 flex flex-col justify-between p-5' },
            // Top: tag + flag
            h('div', { className: 'flex items-start justify-between' },
              city.tag && h('span', { className: 'pill' }, tagLabel(city.tag, lang)),
              h('span', { className: 'text-2xl' }, { US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽' }[city.country])
            ),
            // Bottom: stadium info
            h('div', { className: 'space-y-1' },
              h('div', { className: 'text-text-mut text-[11px] font-body uppercase tracking-widest' }, city.city),
              h('div', { className: 'display text-2xl text-text-pri leading-tight' }, city.name),
              h('div', { className: 'text-gold text-sm font-body font-bold' }, city.stadium),
              h('div', { className: 'flex items-center gap-3 text-text-sec text-xs font-body pt-1' },
                h('span', { className: 'flex items-center gap-1' }, Icon('sports_soccer', 'text-sm'), city.matches, ' ', t('matches', lang)),
                h('span', { className: 'flex items-center gap-1' }, Icon('groups', 'text-sm'), (city.capacity / 1000).toFixed(0), 'k')
              )
            )
          )
        );
      }),

      // Nav buttons
      h('button', {
        className: 'absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full glass-strong flex items-center justify-center active:scale-95 transition-transform',
        onClick: prev,
        'aria-label': 'previous'
      }, Icon('chevron_left', 'text-2xl text-gold')),
      h('button', {
        className: 'absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full glass-strong flex items-center justify-center active:scale-95 transition-transform',
        onClick: next,
        'aria-label': 'next'
      }, Icon('chevron_right', 'text-2xl text-gold'))
    ),

    // Dots
    h('div', { className: 'flex justify-center gap-1.5 mt-4' },
      ...cities.map((_, i) =>
        h('button', {
          key: i,
          className: `dot ${i === currentIndex ? 'active' : ''}`,
          onClick: () => setCurrentIndex(i),
          'aria-label': `slide ${i + 1}`
        })
      )
    ),

    // Quick view of current
    h('div', { className: 'text-center mt-6' },
      h('button', {
        onClick: () => navigate(`sede/${current.id}`),
        className: 'inline-flex items-center gap-2 text-gold font-body font-bold text-sm active:opacity-70'
      },
        Icon('arrow_forward'),
        ' ', t('seeDetails', lang), ' ',
        current.name
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   7. Topics grid (9 agentes IA)
   ───────────────────────────────────────────────────────────────────────── */
function TopicsGrid({ topics, lang, navigate }) {
  return h('section', { className: 'px-4 py-10' },
    h('div', { className: 'text-center mb-8' },
      h('div', { className: 'eyebrow mb-2' }, t('navTopics', lang)),
      h('h2', { className: 'display text-3xl sm:text-4xl text-text-pri mb-3' }, t('topicsTitle', lang)),
      h('p', { className: 'text-text-sec text-sm max-w-md mx-auto' }, t('topicsDesc', lang))
    ),
    h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-4xl mx-auto stagger' },
      ...topics.map(topic =>
        h('button', {
          key: topic.id,
          onClick: () => navigate(`topic/${topic.id}`),
          className: 'glass rounded-2xl p-4 text-left active:scale-95 transition-transform group min-h-[140px] flex flex-col justify-between glow-gold',
          style: { borderColor: topic.color + '30' }
        },
          h('div', null,
            h('div', {
              className: 'inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2',
              style: { backgroundColor: topic.color + '20', color: topic.color }
            }, Icon(topic.icon, 'text-2xl')),
            h('div', { className: 'display text-base text-text-pri leading-tight mb-1' },
              topic.name[lang] || topic.name.en
            ),
            h('div', { className: 'text-text-mut text-xs font-body line-clamp-2' },
              topic.description[lang] || topic.description.en
            )
          ),
          h('div', { className: 'flex items-center gap-1 text-xs font-body font-bold mt-2', style: { color: topic.color } },
            Icon('forum', 'text-sm'), 'IA'
          )
        )
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   8. Vista detalle de sede
   ───────────────────────────────────────────────────────────────────────── */
function VenueDetail({ slug, lang, navigate }) {
  const { data, loading, error, refetch } = useFetch('/data/cities.json', []);
  const geo = useGeolocation();
  const city = data?.cities?.find(c => c.id === slug);

  if (loading) return h('div', { className: 'min-h-[60vh] flex items-center justify-center' }, h('div', { className: 'spinner' }));
  if (error || !city) return h('div', { className: 'min-h-[60vh] flex flex-col items-center justify-center px-6 text-center' },
    h('div', { className: 'text-6xl mb-4' }, '⚽'),
    h('p', { className: 'text-text-sec mb-4' }, error ? t('errorGeneric', lang) : 'Ciudad no encontrada / City not found.'),
    h('div', { className: 'flex gap-3' },
      error && h('button', { className: 'btn-gold', onClick: refetch }, t('retry', lang)),
      h('button', { className: 'btn-ghost', onClick: () => navigate('venues') }, '← ', t('navVenues', lang))
    )
  );

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city.mapsQuery)}`;
  const dirUrl = directionsUrl(city.lat, city.lng, city.mapsQuery, geo.lat, geo.lng);
  const distance = (geo.lat != null && geo.lng != null && city.lat != null)
    ? haversineKm(geo.lat, geo.lng, city.lat, city.lng)
    : null;

  return h('article', { className: 'pb-24 anim-fade-in' },
    // Hero image
    h('div', {
      className: 'relative w-full h-[44vh] min-h-[280px] overflow-hidden',
      style: { background: stadiumImage(city) }
    },
      h('div', { className: 'absolute inset-0 anim-ken-burns', style: { background: stadiumImage(city), opacity: 0.6 } }),
      h('div', { className: 'absolute inset-0', style: { background: 'linear-gradient(to top, var(--dark) 0%, transparent 60%)' } }),
      h('button', {
        className: 'absolute top-20 left-4 z-10 w-11 h-11 glass-strong rounded-full flex items-center justify-center active:scale-95',
        onClick: () => navigate('venues')
      }, Icon('arrow_back', 'text-gold')),
      h('div', { className: 'absolute bottom-6 left-4 right-4 z-10 stagger' },
        h('div', { className: 'flex items-center gap-2 mb-2' },
          FlagChip(city.country),
          city.tag && h('span', { className: 'pill' }, tagLabel(city.tag, lang))
        ),
        h('h1', { className: 'display text-4xl text-text-pri leading-tight' }, city.name),
        h('div', { className: 'text-gold font-body font-bold text-base mt-1' }, city.stadium),
        h('div', { className: 'text-text-sec text-sm font-body' }, city.city)
      )
    ),

    // Stats row
    h('div', { className: 'px-4 -mt-4 relative z-10' },
      h('div', { className: 'glass-strong rounded-2xl p-4 grid grid-cols-3 gap-2 text-center' },
        h('div', null,
          h('div', { className: 'impact text-2xl text-gold' }, city.matches),
          h('div', { className: 'text-text-mut text-xs uppercase tracking-widest font-body' }, t('matches', lang))
        ),
        h('div', null,
          h('div', { className: 'impact text-2xl text-gold' }, (city.capacity / 1000).toFixed(0), 'k'),
          h('div', { className: 'text-text-mut text-xs uppercase tracking-widest font-body' }, t('capacity', lang))
        ),
        h('div', null,
          h('div', { className: 'impact text-2xl text-gold' }, city.country),
          h('div', { className: 'text-text-mut text-xs uppercase tracking-widest font-body' }, '·')
        )
      )
    ),

    // Altitude warning
    city.altitudeWarning && h('div', { className: 'mx-4 mt-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-amber-200 text-sm font-body' },
      t('altitudeWarning', lang)
    ),

    // Football info block
    (city.homeTeams || city.history) && h('div', { className: 'mx-4 mt-6 p-5 glass rounded-3xl border border-gold/20 anim-fade-up relative overflow-hidden' },
      h('div', { className: 'absolute top-0 right-0 w-32 h-32 rounded-full bg-gold/5 blur-3xl pointer-events-none' }),
      h('h3', { className: 'display text-lg text-gold flex items-center gap-2 mb-4 border-b border-white/10 pb-2' },
        Icon('sports_soccer', 'text-xl'),
        lang === 'es' ? 'Alma del Estadio' : 'Stadium Soul'
      ),
      h('div', { className: 'space-y-4' },
        city.homeTeams && h('div', null,
          h('div', { className: 'text-text-mut text-xs uppercase tracking-widest font-body mb-1' }, t('homeTeamsLabel', lang)),
          h('div', { className: 'text-text-pri font-body font-bold text-sm flex items-center gap-2' },
            h('span', { className: 'w-1.5 h-1.5 rounded-full bg-gold' }),
            city.homeTeams
          )
        ),
        city.history && h('div', null,
          h('div', { className: 'text-text-mut text-xs uppercase tracking-widest font-body mb-1' }, t('historyLabel', lang)),
          h('p', { className: 'text-text-sec font-body text-sm leading-relaxed' }, city.history)
        )
      )
    ),

    // Transit blocks
    h('div', { className: 'px-4 mt-6 space-y-4' },
      h(InfoBlock, { icon: 'flight', title: t('airport', lang), content: city.airport, sub: city.transit }),
      h(InfoBlock, { icon: 'directions_subway', title: t('toStadium', lang), content: city.transitToStadium }),
      h(InfoBlock, { icon: 'directions_transit', title: t('metro', lang), content: city.metro }),

      // Open Maps CTAs (con o sin geolocation)
      h('div', { className: 'space-y-2' },
        // Si geo OK → directions desde mi ubicación + distancia
        geo.lat != null && geo.lng != null && h('div', null,
          h('a', {
            href: dirUrl,
            target: '_blank', rel: 'noopener noreferrer',
            className: 'btn-gold w-full flex items-center justify-center gap-2'
          }, Icon('near_me'), t('directionsFromMe', lang)),
          distance != null && h('div', { className: 'text-center text-text-sec text-xs font-body mt-1' },
            '📍 ', distance.toFixed(1), ' ', t('km', lang), ' ', t('distanceFromYou', lang)
          )
        ),

        // Si NO ha pedido geo → botón para activar
        !geo.requested && h('button', {
          onClick: geo.request,
          className: 'btn-ghost w-full flex items-center justify-center gap-2',
          style: { borderColor: 'rgba(245,197,24,0.50)' }
        }, Icon('my_location'), t('locateMe', lang), ' (', t('directionsTransit', lang), ')'),

        // Si geo loading
        geo.loading && h('div', {
          className: 'w-full flex items-center justify-center gap-2 py-3 text-text-sec font-body text-sm'
        }, h('div', { className: 'spinner' }), t('locating', lang)),

        // Si geo error → mensaje pequeño
        geo.requested && geo.error && !geo.loading && h('div', {
          className: 'text-center text-amber-400 text-xs font-body py-2'
        }, '⚠️ ', geo.error === 'denied' ? t('locationDenied', lang) : t('locationError', lang)),

        // SIEMPRE: botón de búsqueda en Maps (fallback que abre Google Maps con el estadio)
        h('a', {
          href: mapsUrl,
          target: '_blank', rel: 'noopener noreferrer',
          className: (geo.lat != null ? 'btn-ghost' : 'btn-gold') + ' w-full flex items-center justify-center gap-2'
        }, Icon('map'), t('openMaps', lang))
      ),

      // Nearby (Google Places via /api/places)
      h(NearbyBlock, { lat: city.lat, lng: city.lng, type: 'hospital', label: t('nearbyHospitals', lang), icon: 'local_hospital', color: '#FF6B6B', lang }),
      h(NearbyBlock, { lat: city.lat, lng: city.lng, type: 'atm', label: t('nearbyATMs', lang), icon: 'local_atm', color: '#1ABE5C', lang }),
      h(NearbyBlock, { lat: city.lat, lng: city.lng, type: 'restaurant', label: t('nearbyRestaurants', lang), icon: 'restaurant', color: '#FFB547', lang })
    )
  );
}

function InfoBlock({ icon, title, content, sub }) {
  return h('div', { className: 'glass rounded-2xl p-4 anim-fade-up' },
    h('div', { className: 'flex items-start gap-3' },
      h('div', { className: 'w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0' }, Icon(icon)),
      h('div', { className: 'flex-1 min-w-0' },
        h('div', { className: 'text-text-mut text-xs uppercase tracking-widest font-body mb-1' }, title),
        h('div', { className: 'text-text-pri font-body font-bold text-sm' }, content),
        sub && h('div', { className: 'text-text-sec text-xs font-body mt-1' }, sub)
      )
    )
  );
}

function NearbyBlock({ lat, lng, type, label, icon, color, lang }) {
  const [state, setState] = useState({ data: null, loading: false, error: null, opened: false });

  const load = async () => {
    setState(s => ({ ...s, loading: true, opened: true, error: null }));
    try {
      const r = await fetch(`/api/places?lat=${lat}&lng=${lng}&type=${type}&lang=${lang}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setState({ data, loading: false, error: null, opened: true });
    } catch (e) {
      setState({ data: null, loading: false, error: e.message, opened: true });
    }
  };

  return h('div', { className: 'glass rounded-2xl overflow-hidden anim-fade-up' },
    h('button', {
      className: 'w-full p-4 flex items-center gap-3 text-left active:bg-white/5',
      onClick: state.opened ? () => setState(s => ({ ...s, opened: false })) : load
    },
      h('div', {
        className: 'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
        style: { backgroundColor: color + '20', color }
      }, Icon(icon)),
      h('div', { className: 'flex-1' },
        h('div', { className: 'text-text-pri font-body font-bold text-sm' }, label)
      ),
      Icon(state.opened ? 'expand_less' : 'expand_more', 'text-text-sec')
    ),
    state.opened && h('div', { className: 'px-4 pb-4 border-t border-white/5' },
      state.loading && h('div', { className: 'flex items-center gap-2 py-4 text-text-sec text-sm' },
        h('div', { className: 'spinner' }), t('loading', lang)
      ),
      state.error && h('div', { className: 'py-4 text-red text-sm font-body' },
        '⚠️ ', t('errorGeneric', lang)
      ),
      state.data?.results?.length > 0 && h('ul', { className: 'space-y-2 pt-3' },
        ...state.data.results.slice(0, 5).map((p, i) =>
          h('li', { key: p.placeId || i, className: 'flex items-start gap-2 text-sm' },
            h('span', { className: 'text-gold font-bold text-xs mt-0.5' }, i + 1, '.'),
            h('div', { className: 'flex-1 min-w-0' },
              h('a', {
                href: p.mapsUrl, target: '_blank', rel: 'noopener noreferrer',
                className: 'text-text-pri font-body font-bold block truncate hover:text-gold'
              }, p.name),
              p.address && h('div', { className: 'text-text-mut text-xs font-body truncate' }, p.address),
              p.rating && h('div', { className: 'text-text-sec text-xs font-body' }, '⭐ ', p.rating, p.distanceMeters ? ` · ${(p.distanceMeters / 1000).toFixed(1)}km` : '')
            )
          )
        )
      ),
      state.data?.results?.length === 0 && h('div', { className: 'py-4 text-text-sec text-sm font-body' },
        'Sin resultados / No results.'
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   9. Vista de tema (chat con prompt especializado)
   ───────────────────────────────────────────────────────────────────────── */
function TopicView({ slug, lang, navigate }) {
  const { data, loading, error, refetch } = useFetch('/data/topics.json', []);
  const topic = data?.topics?.find(t => t.id === slug);
  if (loading) return h('div', { className: 'min-h-[60vh] flex items-center justify-center' }, h('div', { className: 'spinner' }));
  if (error) return h('div', { className: 'min-h-[60vh] flex flex-col items-center justify-center px-6 text-center' },
    h('div', { className: 'text-6xl mb-4' }, '⚽'),
    h('p', { className: 'text-text-sec mb-4' }, t('errorGeneric', lang)),
    h('button', { className: 'btn-gold', onClick: refetch }, t('retry', lang))
  );
  if (!topic) return h('div', { className: 'p-6 text-center' },
    h('p', { className: 'text-text-sec' }, t('errorGeneric', lang)),
    h('button', { className: 'btn-ghost mt-4', onClick: () => navigate('home') }, '← Home')
  );

  const sysPrompt = topic.agentPrompt[lang] || topic.agentPrompt.en || topic.agentPrompt.es;
  const welcome = `${topic.name[lang] || topic.name.en} · ${topic.description[lang] || topic.description.en}`;

  return h('section', { className: 'pb-24 pt-20 px-4' },
    h('button', {
      className: 'flex items-center gap-2 text-text-sec mb-4 active:opacity-70',
      onClick: () => navigate('home')
    }, Icon('arrow_back'), 'Home'),
    h('div', { className: 'flex items-center gap-3 mb-4' },
      h('div', {
        className: 'w-12 h-12 rounded-2xl flex items-center justify-center',
        style: { backgroundColor: topic.color + '20', color: topic.color }
      }, Icon(topic.icon, 'text-2xl')),
      h('div', null,
        h('h1', { className: 'display text-2xl text-text-pri' }, topic.name[lang] || topic.name.en),
        h('div', { className: 'text-text-sec text-sm font-body' }, topic.description[lang] || topic.description.en)
      )
    ),
    h(ChatBox, { systemPrompt: sysPrompt, welcome, lang, color: topic.color })
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  10. ChatBox (general y por tema) — proxy a /api/chat
   ───────────────────────────────────────────────────────────────────────── */
function ChatBox({ systemPrompt, welcome, lang, color = '#F5C518' }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: welcome || t('chatWelcome', lang) }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null); // { name, base64, mimeType }
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Reset input so same file can be re-selected after clearing
    e.target.value = '';
    if (f.size > 3 * 1024 * 1024) {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ ' + t('fileTooLarge', lang) }]);
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      const commaIdx = dataUrl.indexOf(',');
      const base64 = dataUrl.slice(commaIdx + 1);
      setFile({ name: f.name, base64, mimeType: f.type, dataUrl, isImage: f.type.startsWith('image/') });
    };
    reader.readAsDataURL(f);
  };

  const send = async () => {
    const text = input.trim();
    if ((!text && !file) || sending) return;
    
    // Add text tag to message if file is attached
    const content = text + (file ? `\n[${t('fileAttached', lang)}: ${file.name}]` : '');
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    const currentFile = file;
    setFile(null); // Clear selected file
    setSending(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          systemPrompt,
          lang,
          model: 'gemini-2.5-flash',
          documentBase64: currentFile?.base64,
          documentMimeType: currentFile?.mimeType
        })
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setMessages(m => [...m, { role: 'assistant', content: data.text || t('errorGeneric', lang) }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ ' + t('errorGeneric', lang) }]);
    } finally {
      setSending(false);
    }
  };

  return h('div', { className: 'glass rounded-2xl flex flex-col', style: { minHeight: '60vh', borderColor: color + '30' } },
    h('div', {
      ref: scrollRef,
      className: 'flex-1 overflow-y-auto p-4 space-y-3',
      style: { maxHeight: 'calc(100vh - 280px)' }
    },
      ...messages.map((m, i) =>
        h('div', {
          key: i,
          className: `flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`
        },
          h('div', {
            className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-body whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-gold text-black shadow-gold-glow'
                : 'bg-card2 text-text-pri border border-white/5'
            }`
          }, m.content)
        )
      ),
      sending && h('div', { className: 'flex justify-start' },
        h('div', { className: 'bg-card2 rounded-2xl px-4 py-2.5 text-sm font-body text-text-sec flex items-center gap-2' },
          h('div', { className: 'spinner', style: { width: 14, height: 14, borderWidth: 2 } }),
          t('loading', lang)
        )
      )
    ),
    file && h('div', { className: 'px-4 py-2 bg-gold/10 border-t border-b border-gold/25 flex items-center justify-between gap-2 text-xs font-body text-gold' },
      h('span', { className: 'truncate flex items-center gap-2 min-w-0' },
        file.isImage
          ? h('img', { src: file.dataUrl, alt: '', className: 'w-8 h-8 rounded object-cover flex-shrink-0', style: { border: '1px solid rgba(245,197,24,0.4)' } })
          : Icon('picture_as_pdf', 'text-base flex-shrink-0'),
        h('span', { className: 'truncate' }, file.name)
      ),
      h('button', { onClick: () => setFile(null), className: 'flex-shrink-0 text-red font-bold px-1 active:opacity-70' }, '✕')
    ),
    h('div', { className: 'p-3 border-t border-white/5 flex gap-2 items-center' },
      h('input', {
        type: 'file',
        ref: fileInputRef,
        onChange: handleFileChange,
        accept: 'image/*,application/pdf',
        className: 'hidden'
      }),
      h('button', {
        onClick: () => fileInputRef.current?.click(),
        disabled: sending,
        className: `w-12 h-12 rounded-full flex items-center justify-center active:scale-95 border transition-all ${
          file ? 'border-gold bg-gold/10 text-gold shadow-gold-glow' : 'border-white/10 text-text-sec'
        }`,
        title: t('attachDoc', lang)
      }, Icon('attach_file')),
      h('input', {
        type: 'text',
        value: input,
        onChange: e => setInput(e.target.value),
        onKeyDown: e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } },
        placeholder: t('chatPlaceholder', lang),
        disabled: sending,
        className: 'flex-1 bg-card2 text-text-pri rounded-full px-4 py-3 text-sm font-body border border-white/10 focus:border-gold focus:outline-none placeholder:text-text-mut'
      }),
      h('button', {
        onClick: send,
        disabled: sending || (!input.trim() && !file),
        className: 'w-12 h-12 rounded-full bg-gold text-black flex items-center justify-center active:scale-95 disabled:opacity-40 disabled:active:scale-100'
      }, Icon('send'))
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  11. Vista SOS (Emergencias)
   ───────────────────────────────────────────────────────────────────────── */
function SOSView({ lang, navigate }) {
  const { data, loading, error, refetch } = useFetch('/data/emergency.json', []);
  const [hostFilter, setHostFilter] = useState(null);
  const [natCode, setNatCode] = useState('');

  if (loading) return h('div', { className: 'min-h-[60vh] flex items-center justify-center' }, h('div', { className: 'spinner' }));
  if (error) return h('div', { className: 'min-h-[60vh] flex flex-col items-center justify-center px-6 text-center' },
    h('div', { className: 'text-6xl mb-4' }, '🆘'),
    h('p', { className: 'text-text-sec mb-4' }, t('errorGeneric', lang)),
    h('button', { className: 'btn-gold', onClick: refetch }, t('retry', lang))
  );

  const allCountries = data?.byCountry || {};
  const scenarios = data?.scenarios || [];
  const embassies = data?.embassies || [];

  const filteredCountries = Object.entries(allCountries).filter(([code]) => {
    if (!hostFilter) return true;
    return code === hostFilter;
  });

  const selectedEmbassy = embassies.find(e => e.code === natCode);

  const hostColors = { US: '#6BAAFF', CA: '#FF6B6B', MX: '#1ABE5C' };
  const hostFlags = { US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽' };
  const hostLabels = { US: 'USA', CA: 'Canada', MX: 'México' };

  return h('section', { className: 'pb-24 pt-20 px-4 anim-fade-in' },
    h('div', { className: 'text-center mb-6' },
      h('div', { className: 'eyebrow mb-2', style: { color: '#FF6B6B' } }, 'SOS'),
      h('h1', { className: 'display text-3xl text-text-pri' }, t('sosTitle', lang))
    ),

    // Llamar 911 prominente
    h('a', {
      href: 'tel:911',
      className: 'sos-pulse block w-full rounded-2xl p-5 mb-6 text-center active:scale-95 transition-transform',
      style: { background: 'linear-gradient(135deg, #FF6B6B 0%, #C0392B 100%)', boxShadow: '0 8px 32px rgba(192,57,43,0.40)' }
    },
      h('div', { className: 'impact text-white text-5xl' }, '911'),
      h('div', { className: 'text-white/90 text-sm font-body uppercase tracking-widest' }, t('sosCallNow', lang))
    ),

    // Filtros por país anfitrión
    h('div', { className: 'mb-4' },
      h('p', { className: 'text-text-sec text-xs uppercase tracking-widest mb-2 font-body' }, t('sosHostFilter', lang)),
      h('div', { className: 'flex gap-2 flex-wrap' },
        h('button', {
          className: `pill ${!hostFilter ? 'active' : ''}`,
          style: !hostFilter ? { background: 'rgba(245,197,24,0.2)', borderColor: '#F5C518', color: '#F5C518' } : {},
          onClick: () => setHostFilter(null)
        }, t('sosAll', lang)),
        ...['US', 'CA', 'MX'].map(code =>
          h('button', {
            key: code,
            className: 'pill',
            style: hostFilter === code
              ? { background: `${hostColors[code]}22`, borderColor: hostColors[code], color: hostColors[code] }
              : {},
            onClick: () => setHostFilter(hostFilter === code ? null : code)
          }, hostFlags[code], ' ', hostLabels[code])
        )
      )
    ),

    // Números por país (filtrados)
    h('div', { className: 'space-y-3 mb-8' },
      ...filteredCountries.map(([code, c]) =>
        h('div', { key: code, className: 'glass rounded-2xl p-4' },
          h('div', { className: 'flex items-center gap-2 mb-3' },
            h('span', { className: 'text-2xl' }, c.flag),
            h('span', { className: 'display text-lg text-text-pri' }, c.name)
          ),
          c.lines?.length > 0 && h('ul', { className: 'space-y-2' },
            ...c.lines.map(line =>
              h('li', { key: line.id, className: 'flex items-center justify-between gap-3' },
                h('div', { className: 'flex-1 min-w-0' },
                  h('div', { className: 'text-text-pri text-sm font-body' }, line.label[lang] || line.label.en),
                  line.h24 && h('span', { className: 'text-[10px] uppercase tracking-widest text-gold font-body' }, '24/7 · ', line.free ? 'Free' : '')
                ),
                h('a', {
                  href: `tel:${line.number.replace(/[^0-9+]/g, '')}`,
                  className: 'pill active:scale-95'
                }, line.number)
              )
            )
          )
        )
      )
    ),

    // Selector de nacionalidad y consulado
    embassies.length > 0 && h('div', { className: 'glass rounded-2xl p-4 mb-8' },
      h('h2', { className: 'display text-lg text-text-pri mb-3' }, t('sosYourConsulate', lang)),
      h('select', {
        value: natCode,
        onChange: e => setNatCode(e.target.value),
        className: 'w-full rounded-xl px-3 py-2 text-sm font-body text-text-pri',
        style: { background: '#222', border: '1px solid rgba(255,255,255,0.12)' }
      },
        h('option', { value: '' }, t('sosSelectNat', lang)),
        ...embassies.map(e =>
          h('option', { key: e.code, value: e.code },
            `${e.flag} ${e.name[lang] || e.name.en}`
          )
        )
      ),
      selectedEmbassy && h('div', { className: 'mt-4 space-y-3' },
        h('p', { className: 'text-text-sec text-xs font-body' }, t('sosEmbassyNote', lang)),
        ...Object.entries(selectedEmbassy.in || {}).map(([country, cities]) =>
          h('div', { key: country, className: 'flex gap-2' },
            h('span', { className: 'text-base flex-shrink-0' }, hostFlags[country] || '🌐'),
            h('span', { className: 'text-text-pri text-sm font-body' }, cities)
          )
        ),
        h('a', {
          href: selectedEmbassy.url,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'btn-gold flex items-center justify-center gap-2 mt-3 text-sm'
        },
          Icon('open_in_new', 'text-base'),
          t('sosOfficialSite', lang)
        )
      )
    ),

    // Escenarios "qué hacer si..."
    h('div', { className: 'mb-4' },
      h('h2', { className: 'display text-xl text-text-pri mb-3' }, t('sosScenarios', lang))
    ),
    h('div', { className: 'space-y-3' },
      ...scenarios.map(sc => h(ScenarioCard, { key: sc.id, scenario: sc, lang }))
    )
  );
}

function ScenarioCard({ scenario, lang }) {
  const [open, setOpen] = useState(false);
  const steps = scenario.steps[lang] || scenario.steps.en || scenario.steps.es;
  return h('div', { className: 'glass rounded-2xl overflow-hidden' },
    h('button', {
      className: 'w-full p-4 flex items-center gap-3 text-left active:bg-white/5',
      onClick: () => setOpen(o => !o)
    },
      h('div', { className: 'w-10 h-10 rounded-xl bg-red/20 text-red flex items-center justify-center flex-shrink-0' },
        Icon(scenario.icon)
      ),
      h('div', { className: 'flex-1 text-text-pri font-body font-bold text-sm' },
        scenario.title[lang] || scenario.title.en
      ),
      Icon(open ? 'expand_less' : 'expand_more', 'text-text-sec')
    ),
    open && h('ol', { className: 'px-4 pb-4 space-y-2 anim-slide-down' },
      ...steps.map((step, i) =>
        h('li', { key: i, className: 'flex gap-3 text-sm font-body text-text-pri' },
          h('span', { className: 'text-gold font-bold flex-shrink-0' }, i + 1, '.'),
          h('span', null, step)
        )
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  12. Bottom Nav
   ───────────────────────────────────────────────────────────────────────── */
function BottomNav({ route, navigate, lang }) {
  const isActive = key => route === key || route.startsWith(key + '/');
  const items = [
    { key: 'home', icon: 'home', label: t('navHome', lang) },
    { key: 'venues', icon: 'stadium', label: t('navVenues', lang) },
    { key: 'topics', icon: 'apps', label: t('navTopics', lang) },
    { key: 'chat', icon: 'forum', label: t('navChat', lang) },
    { key: 'sos', icon: 'emergency', label: t('navSOS', lang) }
  ];
  return h('nav', { className: 'bottom-nav flex items-stretch' },
    ...items.map(it =>
      h('button', {
        key: it.key,
        onClick: () => navigate(it.key),
        className: `bottom-nav-item ${isActive(it.key) ? 'active' : ''}`,
        'aria-current': isActive(it.key) ? 'page' : undefined
      },
        Icon(it.icon, isActive(it.key) ? 'filled' : ''),
        h('span', null, it.label)
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  13. Vista Venues (lista completa)
   ───────────────────────────────────────────────────────────────────────── */
function VenuesView({ lang, navigate }) {
  const { data, loading, error, refetch } = useFetch('/data/cities.json', []);
  const [filter, setFilter] = useState('ALL');

  if (loading) return h('div', { className: 'min-h-[60vh] flex items-center justify-center' }, h('div', { className: 'spinner' }));
  if (error) return h('div', { className: 'min-h-[60vh] flex flex-col items-center justify-center px-6 text-center' },
    h('div', { className: 'text-6xl mb-4' }, '⚽'),
    h('p', { className: 'text-text-sec mb-4' }, t('errorGeneric', lang)),
    h('button', { className: 'btn-gold', onClick: refetch }, t('retry', lang))
  );

  const cities = data.cities;
  const filtered = filter === 'ALL' ? cities : cities.filter(c => c.country === filter);

  return h('section', { className: 'pb-24 pt-20 px-4' },
    h('div', { className: 'text-center mb-6' },
      h('div', { className: 'eyebrow mb-2' }, t('navVenues', lang)),
      h('h1', { className: 'display text-3xl text-text-pri' }, t('totalCities', lang))
    ),
    // Filter pills
    h('div', { className: 'flex justify-center gap-2 mb-6 flex-wrap' },
      ...['ALL', 'US', 'CA', 'MX'].map(c =>
        h('button', {
          key: c,
          onClick: () => setFilter(c),
          className: `pill ${filter === c ? '!bg-gold !text-black !border-gold' : ''}`
        }, c === 'ALL' ? '🌎 Todas' : ({ US: '🇺🇸 USA', CA: '🇨🇦 Canada', MX: '🇲🇽 México' }[c]))
      )
    ),
    // Grid
    h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto stagger' },
      ...filtered.map(city =>
        h('button', {
          key: city.id,
          onClick: () => navigate(`sede/${city.id}`),
          className: `glass rounded-2xl p-4 text-left active:scale-[0.98] transition-transform glow-${city.country.toLowerCase()}`,
          style: { background: cityImage(city) }
        },
          h('div', { className: 'flex items-start justify-between mb-3' },
            FlagChip(city.country),
            city.tag && h('span', { className: 'pill' }, tagLabel(city.tag, lang))
          ),
          h('div', { className: 'display text-xl text-text-pri leading-tight' }, city.name),
          h('div', { className: 'text-gold font-body font-bold text-sm mt-1' }, city.stadium),
          h('div', { className: 'flex items-center gap-3 text-text-sec text-xs font-body mt-2' },
            h('span', { className: 'flex items-center gap-1' }, Icon('sports_soccer', 'text-sm'), city.matches, ' ', t('matches', lang)),
            h('span', { className: 'flex items-center gap-1' }, Icon('groups', 'text-sm'), (city.capacity / 1000).toFixed(0), 'k')
          )
        )
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  14. Vista Topics (lista de los 9 agentes)
   ───────────────────────────────────────────────────────────────────────── */
function TopicsView({ lang, navigate }) {
  const { data, loading, error, refetch } = useFetch('/data/topics.json', []);
  if (loading) return h('div', { className: 'min-h-[60vh] flex items-center justify-center' }, h('div', { className: 'spinner' }));
  if (error) return h('div', { className: 'min-h-[60vh] flex flex-col items-center justify-center px-6 text-center' },
    h('div', { className: 'text-6xl mb-4' }, '⚽'),
    h('p', { className: 'text-text-sec mb-4' }, t('errorGeneric', lang)),
    h('button', { className: 'btn-gold', onClick: refetch }, t('retry', lang))
  );
  return h('section', { className: 'pb-24 pt-20' },
    h(TopicsGrid, { topics: data.topics, lang, navigate })
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  15. Vista Home
   ───────────────────────────────────────────────────────────────────────── */
function HomeView({ lang, navigate }) {
  const { data: cdata, loading: cl, error: ce, refetch: cr } = useFetch('/data/cities.json', []);
  const { data: tdata, loading: tl, error: te, refetch: tr } = useFetch('/data/topics.json', []);

  const errorBlock = (refetch) => h('div', { className: 'flex flex-col items-center py-10 gap-3' },
    h('p', { className: 'text-text-sec text-sm' }, t('errorGeneric', lang)),
    h('button', { className: 'btn-gold text-sm', onClick: refetch }, t('retry', lang))
  );

  return h('div', null,
    h(Hero, { lang, navigate }),
    cl ? h('div', { className: 'flex justify-center py-10' }, h('div', { className: 'spinner' }))
      : ce ? errorBlock(cr)
      : h(Carousel3D, { cities: cdata.cities, lang, navigate }),
    tl ? h('div', { className: 'flex justify-center py-10' }, h('div', { className: 'spinner' }))
      : te ? errorBlock(tr)
      : h(TopicsGrid, { topics: tdata.topics, lang, navigate })
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  16. Vista Chat genérico
   ───────────────────────────────────────────────────────────────────────── */
function ChatView({ lang }) {
  const sysPrompt = lang === 'es'
    ? 'Eres el asistente IA de WorldCupHelp 2026, una guía bilingüe para aficionados del Mundial de Fútbol 2026 en USA, Canadá y México (junio-julio 2026). Responde corto, claro y útil. Si la pregunta es sobre transporte, leyes, emergencias, dinero, clima, sedes o servicios — usa los datos que conoces sobre las 16 sedes y los 3 países. Si no sabes algo, dilo y sugiere consultar fuente oficial (FIFA, embajada, etc).'
    : 'You are the AI assistant of WorldCupHelp 2026, a bilingual guide for 2026 FIFA World Cup fans in USA, Canada and Mexico (June-July 2026). Answer short, clear and useful. For transit, laws, emergencies, money, weather, venues or services questions — use what you know about the 16 host cities and 3 countries. If unsure, say so and suggest official source (FIFA, embassy, etc).';
  return h('section', { className: 'pb-24 pt-20 px-4' },
    h('div', { className: 'text-center mb-4' },
      h('div', { className: 'eyebrow mb-2' }, 'AI'),
      h('h1', { className: 'display text-3xl text-text-pri' }, t('navChat', lang) === 'IA' ? 'Pregunta a la IA' : 'Ask the AI')
    ),
    h(ChatBox, { systemPrompt: sysPrompt, lang })
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  17. App root + Router
   ───────────────────────────────────────────────────────────────────────── */
function App() {
  const [lang, setLang] = useLang();
  const [route, navigate] = useRoute();

  // Parse route: 'sede/:id', 'topic/:id', or simple
  const [base, sub] = route.split('/');

  let view;
  if (base === 'home' || base === '') view = h(HomeView, { lang, navigate });
  else if (base === 'venues') view = h(VenuesView, { lang, navigate });
  else if (base === 'sede' && sub) view = h(VenueDetail, { slug: sub, lang, navigate });
  else if (base === 'topics') view = h(TopicsView, { lang, navigate });
  else if (base === 'topic' && sub) view = h(TopicView, { slug: sub, lang, navigate });
  else if (base === 'chat') view = h(ChatView, { lang });
  else if (base === 'sos') view = h(SOSView, { lang, navigate });
  else view = h(HomeView, { lang, navigate });

  return h('div', { className: 'min-h-[100dvh]' },
    h(LangBar, { lang, setLang, navigate }),
    h('main', null, view),
    h(BottomNav, { route, navigate, lang })
  );
}

/* ─────────────────────────────────────────────────────────────────────────
  18. Mount
   ───────────────────────────────────────────────────────────────────────── */
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(h(App));
