import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { CATEGORY_LABELS } from "../data/vacancies.js";

function formatDistance(miles) {
  if (miles < 1) return "Under 1 mile away";
  return `${Math.round(miles)} mile${Math.round(miles) === 1 ? "" : "s"} away`;
}

export default function VacancyCard({ vacancy, miles }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const isSaved = state.saved.includes(vacancy.id);

  const apply = () => {
    dispatch({ type: "START_APPLY", vacancy });
    navigate("/volunteer");
  };

  return (
    <article className="card vacancy">
      <span className={`badge badge-${vacancy.category}`}>{CATEGORY_LABELS[vacancy.category]}</span>
      <h3>{vacancy.title}</h3>
      <div className="meta">
        <span>
          📍 {vacancy.location}
          {vacancy.region === "Remote" ? "" : ` (${vacancy.region})`}
        </span>
        {miles != null && <span className="distance">🧭 {formatDistance(miles)}</span>}
        <span>
          🕒 {vacancy.hours} · {vacancy.mode}
        </span>
      </div>
      <p className="summary">{vacancy.summary}</p>
      <div className="vacancy-actions">
        <button
          type="button"
          className="btn btn-small"
          onClick={apply}
          aria-label={`Apply for ${vacancy.title} in ${vacancy.location}`}
        >
          Apply
        </button>
        <button
          type="button"
          className="btn btn-small btn-outline"
          aria-pressed={isSaved}
          aria-label={`${isSaved ? "Unsave" : "Save"} ${vacancy.title}`}
          onClick={() => dispatch({ type: "TOGGLE_SAVED", id: vacancy.id })}
        >
          {isSaved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </article>
  );
}