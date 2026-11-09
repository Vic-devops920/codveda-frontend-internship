import { createContext, useContext, useEffect, useReducer } from "react";

/*
  Global state shared by every page (React Context + useReducer):
  - location:    the postcode the visitor searched for (from the API)
  - saved:       ids of vacancies they bookmarked
  - applyingFor: the vacancy they pressed "Apply" on
  - volunteer:   basic details after registering (never the full form)
*/

const STORAGE_KEY = "hope-foundation-state-v1";

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      location: saved?.location ?? null,
      saved: Array.isArray(saved?.saved) ? saved.saved : [],
      volunteer: saved?.volunteer ?? null,
    };
  } catch {
    return { location: null, saved: [], volunteer: null };
  }
}

function init() {
  return { ...load(), applyingFor: null };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, location: action.location };
    case "CLEAR_LOCATION":
      return { ...state, location: null };
    case "TOGGLE_SAVED": {
      const has = state.saved.includes(action.id);
      return {
        ...state,
        saved: has ? state.saved.filter((id) => id !== action.id) : [...state.saved, action.id],
      };
    }
    case "START_APPLY":
      return { ...state, applyingFor: action.vacancy };
    case "CLEAR_APPLY":
      return { ...state, applyingFor: null };
    case "REGISTER":
      return { ...state, volunteer: action.volunteer, applyingFor: null };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  // Keep location, saved roles and volunteer name between visits.
  useEffect(() => {
    try {
      const { location, saved, volunteer } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ location, saved, volunteer }));
    } catch {
      /* storage can be blocked (private mode); the app still works */
    }
  }, [state.location, state.saved, state.volunteer]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}