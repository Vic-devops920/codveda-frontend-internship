export const validators = {
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
  message(value) {
    if (!value.trim()) return "Please write a message.";
    if (value.trim().length < 10) return "Message must be at least 10 characters.";
    return "";
  },
};