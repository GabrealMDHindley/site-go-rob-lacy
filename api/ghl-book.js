// Vercel serverless function: POST /api/ghl-book
// Body: { firstName, lastName, email, phone, startTime }
// Upserts the contact in GoHighLevel, then books the appointment on the
// configured calendar. Requires GHL_API_KEY, GHL_LOCATION_ID and
// GHL_CALENDAR_ID env vars (set in the Vercel project — the client's own
// GoHighLevel account).

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { firstName, lastName, email, phone, startTime } = req.body || {};
  if (!firstName || !lastName || !email || !phone || !startTime) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const apiKey = process.env.GHL_API_KEY;
  const calendarId = process.env.GHL_CALENDAR_ID;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !calendarId || !locationId) {
    res.status(503).json({ error: 'Calendar is not configured yet' });
    return;
  }

  const baseHeaders = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: { ...baseHeaders, Version: '2021-07-28' },
      body: JSON.stringify({ locationId, firstName, lastName, email, phone })
    });
    const contactData = await contactRes.json();
    if (!contactRes.ok) {
      res.status(contactRes.status).json({ error: contactData.message || 'Could not save contact in GoHighLevel' });
      return;
    }
    const contactId = contactData.contact && contactData.contact.id;
    if (!contactId) {
      res.status(502).json({ error: 'GoHighLevel did not return a contact id' });
      return;
    }

    const apptRes = await fetch('https://services.leadconnectorhq.com/calendars/events/appointments', {
      method: 'POST',
      headers: { ...baseHeaders, Version: 'v3' },
      body: JSON.stringify({
        calendarId,
        locationId,
        contactId,
        startTime: new Date(startTime).toISOString(),
        title: `Go Rob Lacy Consultation — ${firstName} ${lastName}`,
        appointmentStatus: 'confirmed'
      })
    });
    const apptData = await apptRes.json();
    if (!apptRes.ok) {
      res.status(apptRes.status).json({ error: apptData.message || 'That time is no longer available' });
      return;
    }

    res.status(200).json({ ok: true, appointmentId: apptData.id });
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error booking the call' });
  }
};
