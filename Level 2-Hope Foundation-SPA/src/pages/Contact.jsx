import { useState } from "react";
import useForm from "../hooks/useForm.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { validators } from "../utils/validators.js";
import Field from "../components/Field.jsx";

const rules = { name: validators.name, email: validators.email, message: validators.message };

export default function Contact() {
  usePageTitle("Contact");
  const form = useForm({ name: "", email: "", message: "" }, rules);
  const [sentTo, setSentTo] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.validateAll()) {
      const firstBad = Object.keys(rules).find((n) => rules[n](form.values[n]));
      document.getElementById(`f-${firstBad}`)?.focus();
      return;
    }
    setSentTo(form.values.name.trim().split(" ")[0]);
    form.reset();
  };

  return (
    <>
      <section className="page-hero" aria-labelledby="contact-title">
        <div className="container">
          <h1 id="contact-title">Contact us</h1>
          <p className="section-sub">Questions about volunteering? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <address className="contact-list">
            <p><span aria-hidden="true">✉️</span> <a href="mailto:info@hopefoundation.org">info@hopefoundation.org</a></p>
            <p><span aria-hidden="true">📞</span> <a href="tel:+447123456789">+44 7123 456 789</a></p>
            <p><span aria-hidden="true">📍</span> Leicester, United Kingdom</p>
          </address>

          <form className="form-card" onSubmit={handleSubmit} noValidate>
            <Field label="Your name" name="name" type="text" autoComplete="name"
              value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.name} />
            <Field label="Email address" name="email" type="email" autoComplete="email"
              value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.email} />
            <Field as="textarea" rows="5" label="Message" name="message"
              value={form.values.message} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.message} />
            <button type="submit" className="btn btn-block">Send message</button>
            {sentTo && (
              <p className="success" role="status">
                ✅ Thank you, {sentTo}! Your message has been received.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}