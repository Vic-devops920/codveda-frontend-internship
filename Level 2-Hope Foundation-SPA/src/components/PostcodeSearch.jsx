import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { autocompletePostcode, lookupPostcode } from "../api/postcodes.js";
import Spinner from "./Spinner.jsx";

const messages = {
  empty: "Enter a UK postcode, for example LE1 1AA.",
  "not-found": (code) => `We couldn't find "${code}". Check the postcode and try again.`,
  server: "The postcode service had a problem. Please try again in a moment.",
  network: "We couldn't reach the postcode service. Check your connection and try again.",
};

export default function PostcodeSearch() {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState(state.location?.postcode ?? "");
  const [suggestions, setSuggestions] = useState([]);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState(false);
  const [looking, setLooking] = useState(false);
  const [error, setError] = useState("");

  const typed = useRef(false); // true only when the visitor typed (not when we set the text)
  const lookupController = useRef(null);

  // Debounce: wait until the visitor pauses typing before calling the API.
  const debounced = useDebounce(input.trim(), 400);

  // Fetch suggestions for the debounced text.
  useEffect(() => {
    if (!typed.current || debounced.length < 2) {
      setSuggestions([]);
      setSuggesting(false);
      setSuggestError(false);
      return;
    }
    const controller = new AbortController();
    setSuggesting(true);
    setSuggestError(false);
    autocompletePostcode(debounced, controller.signal)
      .then((list) => {
        setSuggestions(list);
        setSuggesting(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // a newer search replaced this one
        setSuggestions([]);
        setSuggesting(false);
        setSuggestError(true);
      });
    return () => controller.abort();
  }, [debounced]);

  async function search(code) {
    const value = code.trim();
    if (!value) {
      setError(messages.empty);
      return;
    }
    lookupController.current?.abort();
    const controller = new AbortController();
    lookupController.current = controller;

    typed.current = false;
    setLooking(true);
    setError("");
    setSuggestions([]);
    try {
      const location = await lookupPostcode(value, controller.signal);
      dispatch({ type: "SET_LOCATION", location });
      setInput(location.postcode);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.kind === "not-found" ? messages["not-found"](value) : messages[err.kind] || messages.network);
    } finally {
      if (lookupController.current === controller) setLooking(false);
    }
  }

  const handleChange = (event) => {
    typed.current = true;
    setInput(event.target.value);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    search(input);
  };

  const clear = () => {
    typed.current = false;
    dispatch({ type: "CLEAR_LOCATION" });
    setInput("");
    setError("");
    setSuggestions([]);
  };

  return (
    <div className="postcode-search">
      <form onSubmit={handleSubmit} role="search" aria-label="Find volunteering near you">
        <label htmlFor="postcode-input">Find roles near you</label>
        <div className="search-row">
          <input
            id="postcode-input"
            type="text"
            autoComplete="off"
            placeholder="Enter your postcode, e.g. LE1 1AA"
            value={input}
            onChange={handleChange}
            aria-describedby="postcode-status"
          />
          <button type="submit" className="btn" disabled={looking}>
            {looking ? "Searching…" : "Find near me"}
          </button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions" aria-label="Postcode suggestions">
          {suggestions.map((code) => (
            <li key={code}>
              <button
                type="button"
                onClick={() => {
                  setInput(code);
                  search(code);
                }}
              >
                {code}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div id="postcode-status" className="status-line" role="status" aria-live="polite">
        {suggesting && <Spinner label="Looking up postcodes…" />}
        {looking && <Spinner label="Finding your area…" />}
        {suggestError && !suggesting && !looking && "Couldn't load suggestions, but you can still press Find near me."}
      </div>

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {state.location && (
        <p className="location-chip">
          📍 Showing roles near {state.location.postcode} ({state.location.area})
          <button type="button" onClick={clear} aria-label="Clear location">
            ×
          </button>
        </p>
      )}
    </div>
  );
}