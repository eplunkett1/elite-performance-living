import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PILLAR_DATA } from "../data/pillars.js";
import { PILLAR_MODAL_DETAILS } from "../data/pillarModalDetails.js";

const BOOK_ICON = "\u{1F4D6}";
const WEB_ICON = "\u{1F310}";
const TOOL_ICON = "\u{1F3CB}\uFE0F";

function amazonSearchUrl(title, author) {
  const q = `${title} ${author}`.trim();
  return `https://www.amazon.com/s?k=${encodeURIComponent(q).replace(/%20/g, "+")}`;
}

/** Resource rows per pillar index (matches PILLAR_DATA). */
const PILLAR_RESOURCE_ROWS = [
  [
    { kind: "book", title: "Atomic Habits", author: "James Clear" },
    { kind: "book", title: "Principles: Life and Work", author: "Ray Dalio" },
    { kind: "book", title: "The One Thing", author: "Gary Keller" },
  ],
  [
    {
      kind: "toolCard",
      label: "Elite Performance AI Workout Architect",
      to: "/workout",
      description: "Answer a few questions and get a personalized weekly training plan.",
      icon: TOOL_ICON,
    },
    { kind: "book", title: "Spark", author: "John Ratey" },
  ],
  [
    { kind: "book", title: "The Code of the Extraordinary Mind", author: "Vishen Lakhiani" },
    { kind: "site", label: "BetterHelp", href: "https://www.betterhelp.com", displayUrl: "www.betterhelp.com" },
  ],
  [
    { kind: "book", title: "Life Force", author: "Tony Robbins" },
    {
      kind: "site",
      label: "Function Health",
      href: "https://www.functionhealth.com",
      displayUrl: "www.functionhealth.com",
      note: "biomarker testing",
    },
  ],
  [
    { kind: "book", title: "The Five Love Languages", author: "Gary Chapman" },
    {
      kind: "book",
      title: "The Blue Zones",
      author: "Dan Buettner",
      extra: "book + Netflix documentary",
    },
  ],
  [{ kind: "book", title: "Men are like Waffles, Women are like Spaghetti", author: "Bill and Pam Farrel" }],
  [
    { kind: "book", title: "10 Critical Laws of Relationships", author: "Rob Thompson" },
    { kind: "book", title: "The Go-Giver", author: "Bob Burg and John David Mann" },
  ],
  [
    {
      kind: "toolCard",
      label: "Stewardship Financial Assessment",
      to: "/stewardship",
      description: "Financial health score, debt strategy, and savings roadmap tailored to your numbers.",
      icon: "\u{1F4B0}",
    },
    { kind: "book", title: "Extreme Ownership", author: "Jocko Willink and Leif Babin" },
    { kind: "book", title: "Stewardship", author: "Peter Block" },
  ],
  [
    { kind: "book", title: "The Magic of Thinking Big", author: "David J. Schwartz" },
    { kind: "book", title: "The Choice", author: "Og Mandino" },
  ],
];

function FadeInSection({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}
    >
      {children}
    </div>
  );
}

function ResourceRow({ row, accent }) {
  if (row.kind === "book") {
    const href = amazonSearchUrl(row.title, row.author);
    return (
      <li className="res-item">
        <span className="res-item-icon" aria-hidden>
          {BOOK_ICON}
        </span>
        <span className="res-item-body">
          <a href={href} target="_blank" rel="noopener noreferrer" className="res-link res-book-link" style={{ color: accent }}>
            <cite>{row.title}</cite>
          </a>
          <span className="res-by"> by {row.author}</span>
          {row.extra ? <span className="res-extra"> ({row.extra})</span> : null}
        </span>
      </li>
    );
  }
  if (row.kind === "toolCard") {
    return (
      <li className="res-tool-card-item">
        <Link
          to={row.to}
          className="res-tool-card"
          style={{ borderColor: `${accent}44` }}
        >
          <span className="res-tool-card-icon" aria-hidden>
            {row.icon ?? TOOL_ICON}
          </span>
          <div className="res-tool-card-text">
            <div className="res-tool-card-title" style={{ color: accent }}>
              {row.label}
            </div>
            {row.description ? (
              <p className="res-tool-card-desc">{row.description}</p>
            ) : null}
          </div>
          <span className="res-tool-card-arrow" style={{ color: accent }} aria-hidden>
            →
          </span>
        </Link>
      </li>
    );
  }
  if (row.kind === "site") {
    return (
      <li className="res-item">
        <span className="res-item-icon" aria-hidden>
          {WEB_ICON}
        </span>
        <span className="res-item-body">
          <a href={row.href} target="_blank" rel="noopener noreferrer" className="res-link" style={{ color: accent }}>
            {row.label}
          </a>
          <span className="res-url-muted"> — {row.displayUrl}</span>
          {row.note ? <span className="res-extra"> ({row.note})</span> : null}
        </span>
      </li>
    );
  }
  return null;
}

export default function ResourcesPage() {
  const scrollToPillar = (i) => {
    document.getElementById(`pillar-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="res-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
        .res-root {
          min-height: 100vh;
          background: #07070d;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          padding-bottom: 48px;
        }
        .res-header-wrap {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 16px 12px 12px;
          max-width: 720px;
          margin: 0 auto;
          gap: 8px;
        }
        .res-back {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 107, 53, 0.85);
          text-decoration: none;
          justify-self: start;
          white-space: nowrap;
        }
        .res-back:hover { color: #ff8f65; }
        .res-header-spacer { min-width: 8px; }
        .res-logo-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 44px;
        }
        .res-logo {
          height: 36px;
          width: auto;
          object-fit: contain;
        }
        .res-hero {
          text-align: center;
          padding: 8px 20px 20px;
          max-width: 560px;
          margin: 0 auto;
        }
        .res-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 7vw, 40px);
          font-weight: 800;
          line-height: 1.15;
          margin: 0 0 12px;
          color: #fff;
        }
        .res-sub {
          margin: 0;
          font-size: 16px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.48);
          font-weight: 400;
        }
        .res-jump {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(7, 7, 13, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 10px 12px;
        }
        .res-jump-inner {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          max-width: 640px;
          margin: 0 auto;
          padding-bottom: 2px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .res-jump-inner::-webkit-scrollbar { display: none; }
        .res-jump-btn {
          flex: 0 0 auto;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s, border-color 0.15s, background 0.15s;
        }
        .res-jump-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: scale(1.05);
        }
        .res-main {
          max-width: 640px;
          margin: 0 auto;
          padding: 20px 16px 0;
        }
        .res-section {
          margin-bottom: 20px;
          padding: 20px 18px 18px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-left-width: 4px;
          scroll-margin-top: 72px;
        }
        .res-section-head {
          margin-bottom: 14px;
        }
        .res-section-icon-name {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .res-section-icon {
          font-size: 28px;
          line-height: 1;
        }
        .res-section-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
        .res-section-tag {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 500;
          padding-left: 38px;
        }
        .res-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .res-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.62);
        }
        .res-item + .res-item { margin-top: 12px; }
        .res-tool-card-item {
          list-style: none;
          margin: 0 0 14px 0;
        }
        .res-tool-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-decoration: none;
          color: inherit;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .res-tool-card:hover {
          background: rgba(255, 255, 255, 0.07);
          transform: translateY(-1px);
        }
        .res-tool-card-icon {
          font-size: 22px;
          line-height: 1;
          flex-shrink: 0;
        }
        .res-tool-card-text { min-width: 0; flex: 1; }
        .res-tool-card-title {
          font-weight: 700;
          font-size: 16px;
          line-height: 1.25;
        }
        .res-tool-card-desc {
          margin: 6px 0 0;
          font-size: 13px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.48);
          font-weight: 500;
        }
        .res-tool-card-arrow {
          flex-shrink: 0;
          font-size: 18px;
          font-weight: 700;
          opacity: 0.85;
        }
        .res-item-icon {
          flex-shrink: 0;
          width: 24px;
          text-align: center;
          font-size: 16px;
          line-height: 1.5;
        }
        .res-item-body { min-width: 0; }
        .res-link {
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(255, 255, 255, 0.2);
        }
        .res-link:hover { text-decoration-color: currentColor; }
        .res-book-link cite {
          font-style: italic;
          font-weight: 600;
        }
        .res-by, .res-url-muted {
          color: rgba(255, 255, 255, 0.45);
          font-weight: 400;
        }
        .res-extra {
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
        }
        .res-cta {
          margin-top: 32px;
          padding: 28px 22px;
          text-align: center;
          border-radius: 16px;
          background: linear-gradient(145deg, rgba(255, 107, 53, 0.12), rgba(255, 255, 255, 0.04));
          border: 1px solid rgba(255, 107, 53, 0.25);
        }
        .res-cta h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 5vw, 28px);
          font-weight: 700;
          margin: 0 0 16px;
          line-height: 1.25;
          color: #fff;
        }
        .res-cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #ff6b35, #ff8f65);
          color: #07070d;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 24px;
          border-radius: 10px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .res-cta-btn:hover { filter: brightness(1.06); }
        .res-cta-sub {
          margin: 14px 0 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.48);
        }
        .res-footer {
          text-align: center;
          padding: 48px 24px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          margin-top: 40px;
        }
        .res-footer-logo {
          height: 28px;
          opacity: 0.85;
        }
        .res-footer-site {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 12px;
          letter-spacing: 2px;
          font-weight: 500;
        }
        .res-footer-copy {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.15);
          margin-top: 8px;
        }
      `}</style>

      <header className="res-header-wrap">
        <Link to="/" className="res-back">
          ← Back to Home
        </Link>
        <div className="res-logo-wrap">
          <img src="/elite_performance_no_tagline_white.png" alt="Elite Performance" className="res-logo" />
        </div>
        <span className="res-header-spacer" aria-hidden />
      </header>

      <div className="res-hero">
        <h1 className="res-title">Power 9 Resources</h1>
        <p className="res-sub">Books, tools, and resources to strengthen every pillar of your life.</p>
      </div>

      <nav className="res-jump" aria-label="Jump to pillar">
        <div className="res-jump-inner">
          {PILLAR_DATA.map((p, i) => (
            <button
              key={p.name}
              type="button"
              className="res-jump-btn"
              style={{ borderColor: `${p.color}55` }}
              aria-label={`Jump to ${p.name}`}
              onClick={() => scrollToPillar(i)}
            >
              {p.icon}
            </button>
          ))}
        </div>
      </nav>

      <main className="res-main">
        {PILLAR_DATA.map((pillar, i) => {
          const spoke = PILLAR_MODAL_DETAILS[i]?.spoke ?? "";
          const rows = PILLAR_RESOURCE_ROWS[i] || [];
          return (
            <FadeInSection key={pillar.name}>
              <section
                id={`pillar-${i}`}
                className="res-section"
                style={{ borderLeftColor: pillar.color }}
              >
                <div className="res-section-head">
                  <div className="res-section-icon-name">
                    <span className="res-section-icon" aria-hidden>
                      {pillar.icon}
                    </span>
                    <h2 className="res-section-name" style={{ color: pillar.color }}>
                      {pillar.name}
                    </h2>
                  </div>
                  <p className="res-section-tag">{spoke}</p>
                </div>
                <ul className="res-list">
                  {rows.map((row, j) => (
                    <ResourceRow key={j} row={row} accent={pillar.color} />
                  ))}
                </ul>
              </section>
            </FadeInSection>
          );
        })}

        <FadeInSection>
          <section className="res-cta">
            <h2>Want to know which pillars to focus on first?</h2>
            <Link to="/assessment" className="res-cta-btn">
              Take the Power 9 Assessment →
            </Link>
            <p className="res-cta-sub">Discover your strengths and blind spots in 5 minutes.</p>
          </section>
        </FadeInSection>
      </main>

      <footer className="res-footer">
        <img src="/elite_performance_no_tagline_white.png" alt="" className="res-footer-logo" />
        <p className="res-footer-site">eliteperformanceliving.com</p>
        <p className="res-footer-copy">&copy; {new Date().getFullYear()} Elite Performance Living. All rights reserved.</p>
      </footer>
    </div>
  );
}
