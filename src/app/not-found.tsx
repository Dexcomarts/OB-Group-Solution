import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell section">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="hero-copy">The page you requested does not exist yet.</p>
      <Link className="button button-primary" href="/">
        Return home
      </Link>
    </main>
  );
}
