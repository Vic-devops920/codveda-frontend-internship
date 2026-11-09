import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import useForm from "../hooks/useForm.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { validators } from "../utils/validators.js";
import { INTEREST_GROUPS } from "../data/interests.js";
import Field from "../components/Field.jsx";

const rules = {
  name: validators.name,
  email: validators.email,
  phone: validators.phone,
  interest: validators.interest,
};

export default function Volunteer() {
  usePageTitle("Volunteer");
  const { state, dispatch } = useApp();
  const { applyingFor } = state;
  const [done, setDone] = useState(null);

  // Pressing "Apply" on a vacancy stores it in context, so the form opens
  // with that role already chosen.
  const form = useForm(
    { name: "", email: "", phone: "", interest: applyingFor?.interest ?? "" },
    rules
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.validateAll()) {
      const firstBad = Object.keys(rules).find((n) => rules[n](form.values[n]));
      document.getElementById(`f-${firstBad}`)?.focus();
      return;
    }
    const firstName = form.values.name.trim().split(" ")[0];
    const role = applyingFor?.title ?? null;
    dispatch({ type: "REGISTER", volunteer: { firstName, interest: form.values.interest, role } });
    setDone({ firstName, role });
    form.reset();
  };

  if (done) {
    return (
      <section className="section" aria-labelledby="thanks-title">
        <div className="container form-wrap center">
          <h1 id="thanks-title" className="section-title">Thank you, {done.firstName}! 🎉</h1>
          <p className="success" role="status">
            ✅ You're registered{done.role ? ` for ${done.role}` : ""}. We'll email you soon with your next steps.
          </p>
          <p>
            <Link to="/vacancies" className="btn">Browse more vacancies</Link>{" "}
            <Link to="/" className="btn btn-outline">Back to home</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" aria-labelledby="volunteer-title">
      <div className="container form-wrap">
        <h1 id="volunteer-title" className="section-title">Volunteer registration</h1>
        <p className="section-sub">Sign up and we'll be in touch to match you with a cause.</p>

        <form className="form-card" onSubmit={handleSubmit} noValidate>
          {applyingFor && (
            <p className="applying-for">
              Applying for: {applyingFor.title} · {applyingFor.location}{" "}
              <button type="button" className="link-button" onClick={() => dispatch({ type: "CLEAR_APPLY" })}>
                Clear
              </button>
            </p>
          )}

          <Field label="Full name" name="name" type="text" autoComplete="name" placeholder="Your full name"
            value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.name} />
          <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.email} />
          <Field label="Phone number" name="phone" type="tel" autoComplete="tel" placeholder="+44 7123 456789"
            value={form.values.phone} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.phone} />
          <Field as="select" label="What kind of volunteering interests you?" name="interest"
            value={form.values.interest} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.interest}>
            <option value="">Choose an area…</option>
            {INTEREST_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </optgroup>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </Field>

          <button type="submit" className="btn btn-block">Register</button>
        </form>
      </div>
    </section>
  );
}