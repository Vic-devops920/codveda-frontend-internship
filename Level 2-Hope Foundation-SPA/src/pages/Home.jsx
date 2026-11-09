import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { vacancies } from "../data/vacancies.js";
import { rankByDistance } from "../utils/geo.js";
import VacancyCard from "../components/VacancyCard.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

export default function Home() {
  usePageTitle("");
  const { state } = useApp();
  const { location, volunteer } = state;

  // Shared state in action: if the visitor searched a postcode on the
  // Vacancies page, the nearest roles show up here too.
  const nearest = location ? rankByDistance(vacancies, location).slice(0, 3) : [];

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="eyebrow">Volunteer-led charity</p>
            <h1 id="hero-title">
              Changing lives, one community at a <span className="accent">time</span>.
            </h1>
            <p className="lead">
              Together we can provide education, food support and hope for families in need across our
              communities. Find a role near you in seconds.
            </p>
            <div className="hero-actions">
              <Link to="/vacancies" className="btn">
                Find roles near me
              </Link>
              <Link to="/volunteer" className="btn btn-outline">
                Become a volunteer
              </Link>
            </div>
          </div>
          <figure className="hero-visual" aria-label="A snapshot of our impact">
            <div className="impact-card">
              <div className="impact-item"><strong>5,000+</strong><span>meals served</span></div>
              <div className="impact-item"><strong>1,200+</strong><span>volunteers</span></div>
              <div className="impact-item"><strong>75+</strong><span>communities reached</span></div>
            </div>
          </figure>
        </div>
      </section>

      {volunteer && (
        <div className="container">
          <p className="banner" role="status">
            👋 Welcome back, {volunteer.firstName}! Thank you for registering
            {volunteer.role ? ` for ${volunteer.role}` : ""}. We'll be in touch soon.
          </p>
        </div>
      )}

      <section className="section" aria-labelledby="mission-title">
        <div className="container">
          <h2 id="mission-title" className="section-title">What we do</h2>
          <p className="section-sub">
            Everything we do starts with neighbours helping neighbours, and every hour you give goes straight to
            the people who need it.
          </p>
          <div className="grid cards">
            <article className="card">
              <div className="icon" aria-hidden="true">📚</div>
              <h3>Education</h3>
              <p>Supporting children through quality learning opportunities, from homework clubs to reading help.</p>
            </article>
            <article className="card">
              <div className="icon" aria-hidden="true">🍲</div>
              <h3>Food support</h3>
              <p>Providing nutritious meals and food parcels to vulnerable families.</p>
            </article>
            <article className="card">
              <div className="icon" aria-hidden="true">🤝</div>
              <h3>Community care</h3>
              <p>Empowering people through outreach, befriending and neighbourhood clean-ups.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="near-title">
        <div className="container">
          <h2 id="near-title" className="section-title">
            {location ? `Closest to ${location.postcode}` : "Roles near you"}
          </h2>
          {location ? (
            <>
              <p className="section-sub">The three nearest vacancies to {location.area}.</p>
              <div className="grid vacancies">
                {nearest.map(({ vacancy, miles }) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} miles={miles} />
                ))}
              </div>
              <p className="center">
                <Link to="/vacancies" className="btn btn-outline">See all vacancies</Link>
              </p>
            </>
          ) : (
            <>
              <p className="section-sub">Enter your postcode and we'll show the volunteering roles closest to you.</p>
              <p className="center">
                <Link to="/vacancies" className="btn">Search by postcode</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}