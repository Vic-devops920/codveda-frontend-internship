/** Label + input/select/textarea + live error message, wired up for accessibility. */
export default function Field({ label, name, error, as: Tag = "input", children, ...props }) {
  const id = `f-${name}`;
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <Tag
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-error`}
        className={error ? "invalid" : ""}
        {...props}
      >
        {children}
      </Tag>
      <small className="error" id={`${id}-error`} aria-live="polite">
        {error}
      </small>
    </div>
  );
}