import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle.js";

export default function About() {
  usePageTitle("About");

  return (
    <>
      <section className="page-hero" aria-labelledby="about-title">
        <div className="container">
          <h1 id="about-title">About Hope Foundation</h1>
          <p className="section-sub">
            We're a volunteer-led charity connecting kind people with the causes that need them most.
          </p>
        </div>
      </section>

      <section className="section impact" aria-labelledby="impact-title">
        <div className="container">
          <h2 id="impact-title" className="section-title">Our impact</h2>
          <div className="grid stats">
            <div className="stat"><h3>5,000+</h3><p>Meals served</p></div>
            <div className="stat"><h3>1,200+</h3><p>Volunteers</p></div>
            <div className="stat"><h3>75+</h3><p>Communities reached</p></div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" className="section-title">How to get involved</h2>
          <ol className="steps">
            <li><span className="step-num">1</span><h3>Find a role</h3><p>Search by postcode to see what's near you.</p></li>
            <li><span className="step-num">2</span><h3>Register</h3><p>Tell us about yourself in two minutes.</p></li>
            <li><span className="step-num">3</span><h3>Make a difference</h3><p>Turn up, help out and meet great people.</p></li>
          </ol>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="stories-title">
        <div className="container">
          <h2 id="stories-title" className="section-title">Volunteer stories</h2>
          <div className="grid testimonials">
            <blockquote className="card">
              <p>“I give two hours on Saturdays and it's the best part of my week.”</p>
              <footer>Amara, food support volunteer</footer>
            </blockquote>
            <blockquote className="card">
              <p>“Everyone was so welcoming. I never felt like a stranger.”</p>
              <footer>Daniel, community care volunteer</footer>
            </blockquote>
          </div>
          <p className="center">
            <Link to="/vacancies" className="btn">Find your role</Link>
          </p>
        </div>
      </section>
    </>
  );
}