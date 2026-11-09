import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Spinner from "./Spinner.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  // After each navigation: scroll to the top and move keyboard focus to the
  // new page, so screen reader and keyboard users know the page changed.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        {/* The key restarts the fade-in animation on every route change */}
        <div key={pathname} className="page">
          <Suspense
            fallback={
              <div className="page-loading" role="status">
                <Spinner label="Loading page…" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}