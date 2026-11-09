import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle.js";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <section className="section">
      <div className="container center">
        <h1 className="section-title">Page not found</h1>
        <p className="section-sub">Sorry, we couldn't find that page.</p>
        <Link to="/" className="btn">Back to home</Link>
      </div>
    </section>
  );
}