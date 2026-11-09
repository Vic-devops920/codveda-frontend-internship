// Free public REST API for UK postcodes (no key needed): https://postcodes.io
const BASE = "https://api.postcodes.io/postcodes";

export class ApiError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // "not-found" | "network" | "server"
  }
}

async function getJson(url, signal) {
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err; // cancelled on purpose, not an error
    throw new ApiError("network", "Could not reach the postcode service.");
  }
  if (res.status === 404) throw new ApiError("not-found", "Postcode not found.");
  if (!res.ok) throw new ApiError("server", "The postcode service had a problem.");
  return res.json();
}

/** Suggestions while typing, e.g. "LE1" -> ["LE1 1AA", "LE1 1AB", ...] */
export async function autocompletePostcode(partial, signal) {
  const data = await getJson(`${BASE}/${encodeURIComponent(partial)}/autocomplete`, signal);
  return data.result ?? [];
}

/** Full details for one postcode, including its latitude and longitude. */
export async function lookupPostcode(postcode, signal) {
  const data = await getJson(`${BASE}/${encodeURIComponent(postcode)}`, signal);
  const r = data.result;
  if (!r || r.latitude == null || r.longitude == null) {
    throw new ApiError("not-found", "Postcode has no location.");
  }
  return {
    postcode: r.postcode,
    lat: r.latitude,
    lon: r.longitude,
    area: r.admin_district || r.region || r.country,
    country: r.country,
  };
}