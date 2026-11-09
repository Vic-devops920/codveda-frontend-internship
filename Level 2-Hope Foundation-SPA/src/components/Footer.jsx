import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>&copy; 2026 Hope Foundation. All rights reserved.</p>
        <Link to="/contact">Contact us</Link>
      </div>
    </footer>
  );
}