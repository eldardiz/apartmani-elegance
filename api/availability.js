// Apartmani Elegance — real-time availability
// Vercel serverless function. Fetches Booking.com + Airbnb iCal feeds per
// apartment, parses booked date ranges, returns a compact JSON the homepage
// calendar consumes. No npm dependencies (pure Node + global fetch).
//
// Response (cached 30 min at the CDN edge via Cache-Control below):
// {
//   "updated": "2026-06-08T10:00:00.000Z",
//   "apartments": {
//     "deluxe": { "name": "Deluxe Apartman", "booked_dates": ["2026-06-10", ...] },
//     ...
//   }
// }

// apartment_id -> { name, env var keys for the two iCal feeds }
const APARTMENTS = {
  deluxe: {
    name: "Deluxe Apartman",
    feeds: ["ICAL_DELUXE_BOOKING", "ICAL_DELUXE_AIRBNB"],
  },
  trosoban: {
    name: "Trosoban Apartman",
    feeds: ["ICAL_TROSOBAN_BOOKING", "ICAL_TROSOBAN_AIRBNB"],
  },
  dvosoban: {
    name: "Dvosoban Apartman",
    feeds: ["ICAL_DVOSOBAN_BOOKING", "ICAL_DVOSOBAN_AIRBNB"],
  },
  "dvosoban-dnevni": {
    name: "Dvosoban sa dnevnim boravkom",
    feeds: ["ICAL_DVOSOBAN_DNEVNI_BOOKING", "ICAL_DVOSOBAN_DNEVNI_AIRBNB"],
  },
};

// ---- iCal parsing -------------------------------------------------------

// Unfold RFC 5545 folded lines (continuation lines start with a space/tab).
function unfold(ics) {
  return ics.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
}

// "20260610" or "20260610T140000Z" -> Date (UTC midnight of that day)
function parseIcalDate(value) {
  const m = value.match(/(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

function toISODate(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Parse one iCal string into an array of "YYYY-MM-DD" booked nights.
// DTEND in iCal is EXCLUSIVE (the checkout day), so a 10->12 booking blocks
// the nights of the 10th and 11th but leaves the 12th free for the next guest.
function parseBookedDates(ics) {
  const dates = new Set();
  const text = unfold(ics);
  const events = text.split("BEGIN:VEVENT").slice(1);

  for (const ev of events) {
    const startMatch = ev.match(/DTSTART[^:]*:([0-9TZ]+)/);
    const endMatch = ev.match(/DTEND[^:]*:([0-9TZ]+)/);
    if (!startMatch) continue;

    const start = parseIcalDate(startMatch[1]);
    if (!start) continue;
    // No DTEND -> treat as a single blocked night.
    const end = endMatch ? parseIcalDate(endMatch[1]) : new Date(start.getTime() + 86400000);
    if (!end) continue;

    for (let d = new Date(start); d < end; d = new Date(d.getTime() + 86400000)) {
      dates.add(toISODate(d));
    }
  }
  return dates;
}

async function fetchFeed(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "ApartmaniElegance-Availability/1.0" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (_) {
    return null; // a dead/slow feed must not break the whole response
  } finally {
    clearTimeout(timer);
  }
}

async function bookedDatesForApartment(apt) {
  const all = new Set();
  for (const key of apt.feeds) {
    const url = process.env[key];
    if (!url) continue; // feed not configured yet — skip silently
    const ics = await fetchFeed(url);
    if (!ics) continue;
    for (const date of parseBookedDates(ics)) all.add(date);
  }
  return [...all].sort();
}

// ---- handler ------------------------------------------------------------

module.exports = async (req, res) => {
  // CORS — homepage calls this from the same origin, but keep it permissive
  // so it also works from preview deploys / staging hosts.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // 30-minute CDN cache; serve stale while revalidating in the background.
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");

  try {
    const ids = Object.keys(APARTMENTS);
    const results = await Promise.all(
      ids.map((id) => bookedDatesForApartment(APARTMENTS[id]))
    );

    const apartments = {};
    ids.forEach((id, i) => {
      apartments[id] = { name: APARTMENTS[id].name, booked_dates: results[i] };
    });

    res.status(200).json({ updated: new Date().toISOString(), apartments });
  } catch (err) {
    res.status(500).json({ error: "availability_unavailable" });
  }
};

// Exposed for local testing (does not affect the Vercel handler).
module.exports.parseBookedDates = parseBookedDates;
