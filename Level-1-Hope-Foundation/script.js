/* ---------- Mobile navigation ---------- */
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Fade-in on scroll ---------- */
const fadeEls = document.querySelectorAll(".fade-in");
if ("IntersectionObserver" in window) {
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  fadeEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    fadeObserver.observe(el);
  });
} else {
  fadeEls.forEach((el) => el.classList.add("visible"));
}

/* ---------- Animated impact counters ---------- */
const counters = document.querySelectorAll(".count");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(el) {
  const target = Number(el.dataset.target);
  if (reduceMotion) {
    el.textContent = target.toLocaleString("en-GB");
    return;
  }
  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("en-GB");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => countObserver.observe(el));
} else {
  counters.forEach(animateCount);
}

/* ---------- Volunteer form validation ---------- */
const form = document.getElementById("volunteerForm");
const successMessage = document.getElementById("successMessage");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  interest: document.getElementById("interest"),
  password: document.getElementById("password"),
};

// Each validator returns an error message, or "" when the value is valid.
const validators = {
  name(value) {
    if (!value.trim()) return "Name is required.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email(value) {
    if (!value.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter a valid email address.";
    return "";
  },
  phone(value) {
    if (!value.trim()) return "Phone number is required.";
    if (!/^\+?[0-9\s()-]{7,15}$/.test(value)) return "Enter a valid phone number (7–15 digits).";
    return "";
  },
  interest(value) {
    if (!value) return "Please choose an area to help in.";
    return "";
  },
  password(value) {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Include at least one lowercase letter.";
    if (!/[0-9]/.test(value)) return "Include at least one number.";
    return "";
  },
};

function validateField(key) {
  const input = fields[key];
  const message = validators[key](input.value);
  document.getElementById(`${key}-error`).textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.classList.toggle("valid", !message);
  return !message;
}

function updateStrength(value) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const levels = [
    { text: "", color: "transparent", width: "0%" },
    { text: "Weak", color: "#dc2626", width: "25%" },
    { text: "Fair", color: "#f59e0b", width: "50%" },
    { text: "Good", color: "#3b82f6", width: "75%" },
    { text: "Strong", color: "#16a34a", width: "100%" },
  ];
  const level = value ? levels[score] || levels[1] : levels[0];
  strengthBar.style.width = level.width;
  strengthBar.style.background = level.color;
  strengthText.textContent = level.text ? `Strength: ${level.text}` : "";
}

Object.keys(fields).forEach((key) => {
  const input = fields[key];

  // Blur: validate when the user leaves the field
  input.addEventListener("blur", () => validateField(key));

  // Input/change: real-time feedback once the field has been touched
  input.addEventListener(key === "interest" ? "change" : "input", () => {
    if (key === "password") updateStrength(input.value);
    if (key === "interest" || input.classList.contains("invalid") || input.classList.contains("valid")) {
      validateField(key);
    }
  });

  // Focus: clear the red border so the user can type comfortably
  input.addEventListener("focus", () => input.classList.remove("invalid"));
});

// Show / hide password
const toggle = document.getElementById("toggle-password");
toggle.addEventListener("click", () => {
  const showing = fields.password.type === "text";
  fields.password.type = showing ? "password" : "text";
  toggle.textContent = showing ? "Show" : "Hide";
  toggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // no page reload
  const allValid = Object.keys(fields).map(validateField).every(Boolean);

  if (allValid) {
    const firstName = fields.name.value.trim().split(" ")[0];
    successMessage.textContent = `✅ Thank you, ${firstName}! We'll email you soon with your next steps.`;
    successMessage.hidden = false;
    form.reset();
    updateStrength("");
    Object.values(fields).forEach((i) => i.classList.remove("valid", "invalid"));
    setTimeout(() => {
      closeModal();
      successMessage.hidden = true;
    }, 3500);
  } else {
    successMessage.hidden = true;
    const firstInvalid = Object.values(fields).find((i) => i.classList.contains("invalid"));
    if (firstInvalid) firstInvalid.focus();
  }
});

/* ---------- Pop-up (modal) ---------- */
const modal = document.getElementById("volunteer-modal");
const modalCard = modal.querySelector(".modal-card");
let lastFocused = null;

function openModal(vacancy = null) {
  lastFocused = document.activeElement;
  const applyingFor = document.getElementById("applying-for");
  if (vacancy) {
    fields.interest.value = vacancy.interest;
    validateField("interest");
    applyingFor.textContent = `Applying for: ${vacancy.title} · ${vacancy.location}`;
    applyingFor.hidden = false;
  } else {
    applyingFor.hidden = true;
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => fields.name.focus(), 150);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll("[data-open-modal]").forEach((btn) =>
  btn.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    openModal();
  })
);

modal.querySelectorAll("[data-close-modal]").forEach((el) =>
  el.addEventListener("click", closeModal)
);

document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("open")) return;
  if (e.key === "Escape") closeModal();

  // Keep keyboard focus inside the pop-up
  if (e.key === "Tab") {
    const focusable = modalCard.querySelectorAll("button, input, select, a[href]");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ---------- Current vacancies ----------
   SAMPLE DATA: replace these with your real vacancies.
   category: "Charity" | "Tech" | "Other"
   interest: must match an option in the form's dropdown
   region:   must match an option in the Region filter ("Remote" for online roles) */
const vacancies = [
  { title: "Food Bank Assistant", category: "Charity", interest: "Food support", location: "Leicester", region: "East Midlands", mode: "In person", hours: "3 hrs/week", summary: "Sort donations and pack food parcels for local families." },
  { title: "Homework Club Tutor", category: "Charity", interest: "Education & tutoring", location: "Birmingham", region: "West Midlands", mode: "In person", hours: "2 hrs/week", summary: "Help primary school children with reading and maths after school." },
  { title: "Befriending Volunteer", category: "Charity", interest: "Befriending & companionship", location: "Glasgow", region: "Scotland", mode: "In person", hours: "1–2 hrs/week", summary: "Visit an older neighbour for a regular chat and a cup of tea." },
  { title: "Charity Shop Assistant", category: "Charity", interest: "Charity shop", location: "Cardiff", region: "Wales", mode: "In person", hours: "4 hrs/week", summary: "Serve customers, sort donated goods and keep the shop welcoming." },
  { title: "Community Garden Helper", category: "Charity", interest: "Community care", location: "Bristol", region: "South West", mode: "In person", hours: "Weekends", summary: "Grow food and tidy shared green spaces with local residents." },
  { title: "Youth Club Helper", category: "Charity", interest: "Youth work", location: "Manchester", region: "North West", mode: "In person", hours: "3 hrs/week", summary: "Support activities and a safe space for young people on weekday evenings." },
  { title: "Events & Fundraising Helper", category: "Charity", interest: "Fundraising & events", location: "Brighton", region: "South East", mode: "In person", hours: "Flexible", summary: "Help us run collections, quiz nights and sponsored walks." },
  { title: "Volunteer Web Developer", category: "Tech", interest: "Web development", location: "Anywhere in the UK", region: "Remote", mode: "Remote", hours: "4 hrs/week", summary: "Improve our website and build small tools for our volunteers." },
  { title: "Data & Impact Analyst", category: "Tech", interest: "Data & analytics", location: "Anywhere in the UK", region: "Remote", mode: "Remote", hours: "3 hrs/week", summary: "Turn our volunteer and donation data into clear impact reports." },
  { title: "IT Support Buddy", category: "Tech", interest: "IT support & training", location: "Leeds", region: "Yorkshire & Humber", mode: "Hybrid", hours: "2 hrs/week", summary: "Help older people get confident with phones, email and video calls." },
  { title: "Social Media & Design Volunteer", category: "Tech", interest: "Social media & design", location: "London", region: "London", mode: "Hybrid", hours: "3 hrs/week", summary: "Create posts and graphics that tell our stories online." },
  { title: "Delivery Driver", category: "Other", interest: "Driving & delivery", location: "Newcastle", region: "North East", mode: "In person", hours: "Flexible", summary: "Deliver food parcels and donations to people who can't travel." },
  { title: "Admin & Office Support", category: "Other", interest: "Admin & office support", location: "Belfast", region: "Northern Ireland", mode: "Hybrid", hours: "3 hrs/week", summary: "Keep volunteer records tidy and answer friendly enquiries." },
  { title: "Repair Café Fixer", category: "Other", interest: "Skilled trades & repairs", location: "Norwich", region: "East of England", mode: "In person", hours: "Monthly", summary: "Fix small household items so they can be reused instead of thrown away." },
];

const categoryLabels = { Charity: "Charity & community", Tech: "Tech & digital", Other: "Other" };
const vacancyList = document.getElementById("vacancy-list");
const vacancyEmpty = document.getElementById("vacancy-empty");
const resultsCount = document.getElementById("results-count");
const regionSelect = document.getElementById("region-select");
const chips = document.querySelectorAll(".chip");
let activeCategory = "all";

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function renderVacancies() {
  const region = regionSelect.value;
  const shown = vacancies.filter(
    (v) =>
      (activeCategory === "all" || v.category === activeCategory) &&
      (region === "all" || v.region === region)
  );

  vacancyList.replaceChildren();
  shown.forEach((v) => {
    const card = makeEl("article", "card vacancy");
    card.append(
      makeEl("span", `badge badge-${v.category}`, categoryLabels[v.category]),
      makeEl("h3", "", v.title)
    );
    const meta = makeEl("div", "meta");
    meta.append(
      makeEl("span", "", `📍 ${v.location}${v.region === "Remote" ? "" : ` (${v.region})`}`),
      makeEl("span", "", `🕒 ${v.hours} · ${v.mode}`)
    );
    const apply = makeEl("button", "btn btn-small", "Apply");
    apply.type = "button";
    apply.setAttribute("aria-label", `Apply for ${v.title} in ${v.location}`);
    apply.addEventListener("click", () => openModal(v));
    card.append(meta, makeEl("p", "summary", v.summary), apply);
    vacancyList.append(card);
  });

  vacancyEmpty.hidden = shown.length > 0;
  resultsCount.textContent = shown.length
    ? `Showing ${shown.length} vacanc${shown.length === 1 ? "y" : "ies"}`
    : "";
}

chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    activeCategory = chip.dataset.filter;
    chips.forEach((c) => {
      const on = c === chip;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", String(on));
    });
    renderVacancies();
  })
);
regionSelect.addEventListener("change", renderVacancies);
renderVacancies();