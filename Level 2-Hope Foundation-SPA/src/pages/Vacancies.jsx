import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { vacancies } from "../data/vacancies.js";
import { rankByDistance } from "../utils/geo.js";
import PostcodeSearch from "../components/PostcodeSearch.jsx";
import VacancyCard from "../components/VacancyCard.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

const CATEGORIES = [
  ["all", "All"],
  ["Charity", "Charity & community"],
  ["Tech", "Tech & digital"],
  ["Other", "Other"],
];

const RADII = [
  ["any", "Any distance"],
  ["10", "Within 10 miles"],
  ["25", "Within 25 miles"],
  ["50", "Within 50 miles"],
  ["100", "Within 100 miles"],
];

export default function Vacancies() {
  usePageTitle("Vacancies");
  const { state } = useApp();
  const { location, saved } = state;

  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [radius, setRadius] = useState("any");
  const [savedOnly, setSavedOnly] = useState(false);

  const results = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    const filtered = vacancies.filter((v) => {
      if (category !== "all" && v.category !== category) return false;
      if (savedOnly && !saved.includes(v.id)) return false;
      if (!q) return true;
      return `${v.title} ${v.summary} ${v.location} ${v.region} ${v.interest}`.toLowerCase().includes(q);
    });
    let ranked = rankByDistance(filtered, location);
    // Remote roles (miles === null) are always kept; the rest must be in range.
    if (location && radius !== "any") {
      ranked = ranked.filter((r) => r.miles == null || r.miles <= Number(radius));
    }
    return ranked;
  }, [category, keyword, radius, savedOnly, saved, location]);

  return (
    <>
      <section className="page-hero" aria-labelledby="vac-title">
        <div className="container">
          <h1 id="vac-title">Current vacancies across the UK</h1>
          <p className="section-sub">Enter your postcode to see the closest roles first, or browse them all.</p>
          <PostcodeSearch />
        </div>
      </section>

      <section className="section" aria-label="Vacancy results">
        <div className="container">
          <div className="filters">
            <div className="chips" role="group" aria-label="Filter by type of role">
              {CATEGORIES.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`chip${category === value ? " active" : ""}`}
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                className={`chip${savedOnly ? " active" : ""}`}
                aria-pressed={savedOnly}
                onClick={() => setSavedOnly((s) => !s)}
              >
                Saved ({saved.length})
              </button>
            </div>
            <div className="filter-inputs">
              <div>
                <label htmlFor="keyword">Search roles</label>
                <input
                  id="keyword"
                  type="search"
                  placeholder="e.g. food, tutor, web"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="radius">Distance</label>
                <select
                  id="radius"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  disabled={!location}
                  title={location ? "" : "Enter a postcode to filter by distance"}
                >
                  {RADII.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <p className="results-count" role="status" aria-live="polite">
            {results.length
              ? `Showing ${results.length} vacanc${results.length === 1 ? "y" : "ies"}${location ? ", nearest first" : ""}`
              : ""}
          </p>

          {results.length > 0 ? (
            <div className="grid vacancies">
              {results.map(({ vacancy, miles }) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} miles={miles} />
              ))}
            </div>
          ) : (
            <p className="empty">
              No vacancies match those filters right now. Try a wider distance or another type of role.
            </p>
          )}
        </div>
      </section>
    </>
  );
}