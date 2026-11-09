import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/vacancies", "Vacancies"],
  ["/contact", "Contact"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { state } = useApp();

  // Close the mobile menu after every navigation.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link to="/" className="logo">
          Hope<span>Foundation</span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`nav-links${open ? " open" : ""}`} id="nav-links">
          {links.map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} end={to === "/"}>
                {label}
                {label === "Vacancies" && state.saved.length > 0 && (
                  <span className="count-badge">
                    {state.saved.length}
                    <span className="visually-hidden"> saved roles</span>
                  </span>
                )}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/volunteer" className="btn btn-small">
              Volunteer
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}