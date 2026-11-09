import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx"; // loaded up front so the first screen appears instantly

// The other pages are loaded on demand (code splitting), so the first load
// stays small and navigation feels fast.
const About = lazy(() => import("./pages/About.jsx"));
const Vacancies = lazy(() => import("./pages/Vacancies.jsx"));
const Volunteer = lazy(() => import("./pages/Volunteer.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="vacancies" element={<Vacancies />} />
        <Route path="volunteer" element={<Volunteer />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}