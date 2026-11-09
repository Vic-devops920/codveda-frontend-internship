const EARTH_RADIUS_MILES = 3958.8;
const toRad = (deg) => (deg * Math.PI) / 180;

/** Straight-line distance in miles between two {lat, lon} points (haversine). */
export function distanceMiles(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

/**
 * Pairs each vacancy with its distance from `location` (null for remote roles
 * or when no location is set). When a location is set, nearest comes first and
 * remote roles go to the end.
 */
export function rankByDistance(vacancies, location) {
  const ranked = vacancies.map((vacancy) => ({
    vacancy,
    miles: location && vacancy.coords ? distanceMiles(location, vacancy.coords) : null,
  }));
  if (location) {
    ranked.sort((x, y) => (x.miles ?? 1e9) - (y.miles ?? 1e9));
  }
  return ranked;
}