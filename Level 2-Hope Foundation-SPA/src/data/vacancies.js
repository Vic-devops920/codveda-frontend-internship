/*
  SAMPLE DATA: replace these with your real vacancies.
  category: "Charity" | "Tech" | "Other"
  interest: must match an option in data/interests.js
  coords:   {lat, lon} of the town, or null for remote roles
*/
export const CATEGORY_LABELS = {
  Charity: "Charity & community",
  Tech: "Tech & digital",
  Other: "Other",
};

export const vacancies = [
  { id: "v1", title: "Food Bank Assistant", category: "Charity", interest: "Food support", location: "Leicester", region: "East Midlands", coords: { lat: 52.6369, lon: -1.1398 }, mode: "In person", hours: "3 hrs/week", summary: "Sort donations and pack food parcels for local families." },
  { id: "v2", title: "Homework Club Tutor", category: "Charity", interest: "Education & tutoring", location: "Birmingham", region: "West Midlands", coords: { lat: 52.4862, lon: -1.8904 }, mode: "In person", hours: "2 hrs/week", summary: "Help primary school children with reading and maths after school." },
  { id: "v3", title: "Befriending Volunteer", category: "Charity", interest: "Befriending & companionship", location: "Glasgow", region: "Scotland", coords: { lat: 55.8642, lon: -4.2518 }, mode: "In person", hours: "1–2 hrs/week", summary: "Visit an older neighbour for a regular chat and a cup of tea." },
  { id: "v4", title: "Charity Shop Assistant", category: "Charity", interest: "Charity shop", location: "Cardiff", region: "Wales", coords: { lat: 51.4816, lon: -3.1791 }, mode: "In person", hours: "4 hrs/week", summary: "Serve customers, sort donated goods and keep the shop welcoming." },
  { id: "v5", title: "Community Garden Helper", category: "Charity", interest: "Community care", location: "Bristol", region: "South West", coords: { lat: 51.4545, lon: -2.5879 }, mode: "In person", hours: "Weekends", summary: "Grow food and tidy shared green spaces with local residents." },
  { id: "v6", title: "Youth Club Helper", category: "Charity", interest: "Youth work", location: "Manchester", region: "North West", coords: { lat: 53.4808, lon: -2.2426 }, mode: "In person", hours: "3 hrs/week", summary: "Support activities and a safe space for young people on weekday evenings." },
  { id: "v7", title: "Events & Fundraising Helper", category: "Charity", interest: "Fundraising & events", location: "Brighton", region: "South East", coords: { lat: 50.8225, lon: -0.1372 }, mode: "In person", hours: "Flexible", summary: "Help us run collections, quiz nights and sponsored walks." },
  { id: "v8", title: "Volunteer Web Developer", category: "Tech", interest: "Web development", location: "Anywhere in the UK", region: "Remote", coords: null, mode: "Remote", hours: "4 hrs/week", summary: "Improve our website and build small tools for our volunteers." },
  { id: "v9", title: "Data & Impact Analyst", category: "Tech", interest: "Data & analytics", location: "Anywhere in the UK", region: "Remote", coords: null, mode: "Remote", hours: "3 hrs/week", summary: "Turn our volunteer and donation data into clear impact reports." },
  { id: "v10", title: "IT Support Buddy", category: "Tech", interest: "IT support & training", location: "Leeds", region: "Yorkshire & Humber", coords: { lat: 53.8008, lon: -1.5491 }, mode: "Hybrid", hours: "2 hrs/week", summary: "Help older people get confident with phones, email and video calls." },
  { id: "v11", title: "Social Media & Design Volunteer", category: "Tech", interest: "Social media & design", location: "London", region: "London", coords: { lat: 51.5074, lon: -0.1278 }, mode: "Hybrid", hours: "3 hrs/week", summary: "Create posts and graphics that tell our stories online." },
  { id: "v12", title: "Delivery Driver", category: "Other", interest: "Driving & delivery", location: "Newcastle", region: "North East", coords: { lat: 54.9783, lon: -1.6178 }, mode: "In person", hours: "Flexible", summary: "Deliver food parcels and donations to people who can't travel." },
  { id: "v13", title: "Admin & Office Support", category: "Other", interest: "Admin & office support", location: "Belfast", region: "Northern Ireland", coords: { lat: 54.5973, lon: -5.9301 }, mode: "Hybrid", hours: "3 hrs/week", summary: "Keep volunteer records tidy and answer friendly enquiries." },
  { id: "v14", title: "Repair Café Fixer", category: "Other", interest: "Skilled trades & repairs", location: "Norwich", region: "East of England", coords: { lat: 52.6309, lon: 1.2974 }, mode: "In person", hours: "Monthly", summary: "Fix small household items so they can be reused instead of thrown away." },
];