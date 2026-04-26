/* ═══════════════════════════════════════════════════════════════════════════
   /api/chat — Proxy a Gemini 2.5 Flash
   ─────────────────────────────────────────────────────────────────────────
   - La GEMINI_API_KEY NUNCA llega al navegador
   - Soporta multimodal (inline_data) si llega documentBase64
   - Inyecta la fecha actual al system prompt
   - Devuelve { text } o { error }
   ═══════════════════════════════════════════════════════════════════════════ */

const ALLOWED_MODELS = new Set([
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
]);

const MAX_INPUT_CHARS = 20000;
const MAX_MESSAGES = 30;

function dateContext(lang) {
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  if (lang === 'es') return `\n\nFECHA ACTUAL: ${iso}. Calcula días/cuenta regresiva relativos a HOY. El Mundial 2026 inicia el 11 de junio de 2026 y termina el 19 de julio de 2026.`;
  return `\n\nCURRENT DATE: ${iso}. Calculate days/countdowns relative to TODAY. The 2026 World Cup runs from June 11 to July 19, 2026.`;
}

export default async function handler(req, res) {
  // CORS / método
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API key check (no leak en mensaje)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured. Missing GEMINI_API_KEY.' });
  }

  try {
    const {
      messages = [],
      systemPrompt = '',
      model = 'gemini-2.5-flash',
      lang = 'es',
      documentBase64,
      documentMimeType
    } = req.body || {};

    // Validaciones
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Missing messages[]' });
    }
    if (messages.length > MAX_MESSAGES) {
      return res.status(400).json({ error: `Too many messages (max ${MAX_MESSAGES})` });
    }
    if (!ALLOWED_MODELS.has(model)) {
      return res.status(400).json({ error: 'Model not allowed' });
    }

    const totalChars = messages.reduce((acc, m) => acc + (m.content || '').length, 0)
      + (systemPrompt || '').length;
    if (totalChars > MAX_INPUT_CHARS) {
      return res.status(413).json({ error: `Input too long (max ${MAX_INPUT_CHARS} chars)` });
    }

    // Build contents
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }]
    }));

    // Multimodal (PDF/imagen)
    if (documentBase64 && documentMimeType) {
      const last = contents[contents.length - 1];
      last.parts.push({
        inline_data: { mime_type: documentMimeType, data: documentBase64 }
      });
    }

    // Build full system prompt with date injection
    const fullSystem = (systemPrompt || '').trim() + dateContext(lang);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: fullSystem }] },
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048,
          candidateCount: 1
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      })
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      console.error('[gemini] upstream error', upstream.status, errText.slice(0, 500));
      return res.status(502).json({
        error: 'AI service error',
        upstreamStatus: upstream.status
      });
    }

    const data = await upstream.json();

    // Extract text response
    const candidate = data.candidates?.[0];
    if (!candidate) {
      return res.status(502).json({ error: 'No candidate returned by AI' });
    }
    const finishReason = candidate.finishReason;
    const text = candidate.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || '';

    if (!text && finishReason === 'SAFETY') {
      return res.status(200).json({
        text: lang === 'es'
          ? '⚠️ La respuesta fue bloqueada por filtros de seguridad. Reformula tu pregunta.'
          : '⚠️ Response blocked by safety filters. Please rephrase your question.',
        blocked: true
      });
    }

    return res.status(200).json({
      text: text || (lang === 'es' ? 'Sin respuesta.' : 'No response.'),
      finishReason,
      model
    });

  } catch (err) {
    console.error('[chat] internal error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
