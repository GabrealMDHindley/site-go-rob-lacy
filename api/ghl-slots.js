// Vercel serverless function: GET /api/ghl-slots?start=<ms>&end=<ms>&tz=<IANA tz>
// Proxies GoHighLevel's free-slots endpoint so the GHL_API_KEY never
// reaches the browser. Requires GHL_API_KEY and GHL_CALENDAR_ID env vars
// (set in the Vercel project — the client's own GoHighLevel account).

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { start, end, tz } = req.query;
  if (!start || !end) {
    res.status(400).json({ error: 'Missing start/end query params' });
    return;
  }

  const apiKey = process.env.GHL_API_KEY;
  const calendarId = process.env.GHL_CALENDAR_ID;
  if (!apiKey || !calendarId) {
    res.status(503).json({ error: 'Calendar is not configured yet' });
    return;
  }

  const url = new URL(`https://services.leadconnectorhq.com/calendars/${calendarId}/free-slots`);
  url.searchParams.set('startDate', start);
  url.searchParams.set('endDate', end);
  if (tz) url.searchParams.set('timezone', tz);

  try {
    const ghlRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: 'v3',
        Accept: 'application/json'
      }
    });
    const data = await ghlRes.json();
    if (!ghlRes.ok) {
      res.status(ghlRes.status).json({ error: data.message || 'GoHighLevel request failed' });
      return;
    }

    const slots = {};
    for (const [date, value] of Object.entries(data)) {
      if (value && Array.isArray(value.slots)) slots[date] = value.slots;
    }
    res.status(200).json({ slots });
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error fetching availability' });
  }
};
