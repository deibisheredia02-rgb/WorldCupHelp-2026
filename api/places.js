/* ═══════════════════════════════════════════════════════════════════════════
   /api/places — Proxy a Google Places API (New) — Nearby Search
   ─────────────────────────────────────────────────────────────────────────
   Usado por NearbyBlock en app.js para hospitales/ATMs/restaurantes
   cerca de cada estadio sede.

   Query params:
     - lat, lng (required, floats)
     - type: hospital | atm | restaurant | pharmacy (required, enum)
     - lang: es | en | fr | pt | de (optional, default 'en')
     - radius: meters (optional, default 5000, max 50000)

   Returns: { results: [{ name, address, mapsUrl, rating?, distanceMeters? }] }

   Free tier: 1000 req/día. Cache: 1h por (lat,lng,type) en CDN.
   ═══════════════════════════════════════════════════════════════════════════ */

const ALLOWED_TYPES = {
  hospital:    'hospital',
  atm:         'atm',
  restaurant:  'restaurant',
  pharmacy:    'pharmacy'
};

const ALLOWED_LANGS = new Set(['es', 'en', 'fr', 'pt', 'de']);

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Places service not configured' });
  }

  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const type = String(req.query.type || '').toLowerCase();
    const lang = ALLOWED_LANGS.has(req.query.lang) ? req.query.lang : 'en';
    const radius = Math.min(50000, Math.max(500, parseInt(req.query.radius || '5000', 10)));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'Invalid lat/lng' });
    }
    if (!ALLOWED_TYPES[type]) {
      return res.status(400).json({ error: `Invalid type. Allowed: ${Object.keys(ALLOWED_TYPES).join(', ')}` });
    }

    // Places API (New) — searchNearby endpoint
    const upstream = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': [
          'places.displayName',
          'places.formattedAddress',
          'places.location',
          'places.rating',
          'places.userRatingCount',
          'places.id',
          'places.googleMapsUri',
          'places.businessStatus'
        ].join(',')
      },
      body: JSON.stringify({
        includedTypes: [ALLOWED_TYPES[type]],
        maxResultCount: 10,
        languageCode: lang,
        rankPreference: 'DISTANCE',
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius
          }
        }
      })
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      console.error('[places] upstream', upstream.status, errText.slice(0, 500));
      return res.status(502).json({
        error: 'Places service error',
        upstreamStatus: upstream.status
      });
    }

    const data = await upstream.json();
    const places = (data.places || [])
      .filter(p => p.businessStatus !== 'CLOSED_PERMANENTLY')
      .map(p => ({
        placeId: p.id,
        name: p.displayName?.text || '—',
        address: p.formattedAddress || '',
        rating: p.rating || null,
        userRatingCount: p.userRatingCount || null,
        mapsUrl: p.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${p.id}`,
        distanceMeters: p.location?.latitude ? haversine(lat, lng, p.location.latitude, p.location.longitude) : null
      }))
      .sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));

    // Cache 1h browser, 6h CDN
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({
      results: places,
      query: { lat, lng, type, radius, lang }
    });

  } catch (err) {
    console.error('[places] internal', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
