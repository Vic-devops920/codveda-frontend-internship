export default function Spinner({ label }) {
  return (
    <span className="spinner-wrap">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}