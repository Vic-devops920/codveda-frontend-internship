import { useState } from "react";

/**
 * Small form helper: validates a field when you leave it (blur), re-checks it
 * as you type once it has been touched, and can validate everything on submit.
 * `validators` maps field name -> function(value) returning an error string or "".
 */
export default function useForm(initialValues, validators) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const check = (name, value) => {
    const message = validators[name] ? validators[name](value) : "";
    setErrors((prev) => ({ ...prev, [name]: message }));
    return !message;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) check(name, value);
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    check(name, value);
  };

  const validateAll = () => {
    const next = {};
    let ok = true;
    Object.keys(validators).forEach((name) => {
      next[name] = validators[name](values[name]);
      if (next[name]) ok = false;
    });
    setErrors(next);
    setTouched(Object.fromEntries(Object.keys(validators).map((n) => [n, true])));
    return ok;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, handleChange, handleBlur, validateAll, reset };
}