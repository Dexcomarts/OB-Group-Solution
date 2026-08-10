import Link from "next/link";

const divisions = [
  {
    eyebrow: "OB Apples Shop",
    title: "Apple products with fast buyer guidance.",
    body: "A discovery-first catalog for iPhones, MacBooks, iPads, accessories, trade inquiries, and direct WhatsApp support.",
    services: [
      "iPhone sourcing",
      "MacBook guidance",
      "Accessories",
      "Trade inquiries",
    ],
  },
  {
    eyebrow: "OB Net-Tech",
    title: "Network, CCTV, and connectivity services.",
    body: "Structured support for installations, networking supplies, CCTV projects, router setup, and business connectivity requests.",
    services: ["Networking", "CCTV", "Router setup", "Installations"],
  },
];

const signals = [
  ["Shop", "Apple"],
  ["Tech", "Network"],
  ["Flow", "WhatsApp"],
  ["Build", "3D-ready"],
];

export default function Home() {
  return (
    <>
      <header className="site-shell site-header" aria-label="Primary">
        <Link className="brand-mark" href="/">
          <span className="brand-icon" aria-hidden="true">
            OB
          </span>
          <span>OB Group Solution</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#divisions">Divisions</a>
          <a href="#contact">Contact</a>
          <a href="https://wa.me/" rel="noreferrer">
            WhatsApp
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="site-shell hero" aria-labelledby="home-title">
          <div>
            <p className="eyebrow">Apple products + network technology</p>
            <h1 id="home-title">OB Group Solution</h1>
            <p className="hero-copy">
              A product-led website for OB Apples Shop and OB Net-Tech, built
              for search visibility, fast browsing, and direct customer
              conversion through WhatsApp.
            </p>
            <div className="cta-row" aria-label="Primary actions">
              <a className="button button-primary" href="#divisions">
                Explore divisions
              </a>
              <a className="button button-secondary" href="#contact">
                Start inquiry
              </a>
            </div>
          </div>

          <aside className="signal-board" aria-label="Website focus areas">
            <div className="signal-top">
              <span>OBG / DIGITAL FLOOR</span>
              <span>SEO-FIRST</span>
            </div>
            <div className="signal-grid">
              {signals.map(([label, value]) => (
                <div className="signal-tile" key={label}>
                  <div className="signal-label">{label}</div>
                  <div className="signal-value">{value}</div>
                </div>
              ))}
            </div>
            <div className="signal-foot">
              <span>Static content first</span>
              <span>3D product stage next</span>
            </div>
          </aside>
        </section>

        <section
          className="site-shell section"
          id="divisions"
          aria-labelledby="divisions-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Two business lines</p>
            <h2 id="divisions-title">
              Built as clear routes for buyers and service customers.
            </h2>
          </div>
          <div className="division-grid">
            {divisions.map((division) => (
              <article className="division-card" key={division.eyebrow}>
                <p className="eyebrow">{division.eyebrow}</p>
                <h3>{division.title}</h3>
                <p>{division.body}</p>
                <div
                  className="service-list"
                  aria-label={`${division.eyebrow} focus areas`}
                >
                  {division.services.map((service) => (
                    <span key={service}>{service}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="site-shell section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Conversion path</p>
            <h2 id="contact-title">
              Every page will guide customers to inquiry, call, or map action.
            </h2>
          </div>
          <div className="cta-row">
            <a
              className="button button-primary"
              href="https://wa.me/"
              rel="noreferrer"
            >
              Open WhatsApp
            </a>
            <a className="button button-secondary" href="tel:+0000000000">
              Call OB Group
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-shell">
          Copyright OB Group Solution. All rights reserved.
        </div>
      </footer>
    </>
  );
}
