import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="font-mono text-[12px] text-spark">ERROR · HRESP = 2'b01</p>
      <h1 className="mt-4 text-6xl font-extrabold tracking-tightest">404 — no slave selected.</h1>
      <p className="mt-4 max-w-md text-mute">That address doesn&apos;t decode to any page.</p>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </section>
  );
}
