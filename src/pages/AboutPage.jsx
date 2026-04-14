import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function FadeIn({ children, style = {}, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div style={a.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #07070d; }
        .about-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 400px) 1fr;
          gap: 48px;
          align-items: center;
          max-width: 1040px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .about-hero-grid {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
          }
          .about-hero-text { text-align: center !important; }
        }
        .about-photo {
          width: 100%;
          max-width: 400px;
          height: auto;
          display: block;
          border-radius: 16px;
          box-shadow:
            0 0 0 1px rgba(255, 107, 53, 0.4),
            0 0 32px rgba(255, 107, 53, 0.22);
        }
        .about-hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }
        @media (max-width: 900px) {
          .about-hero-ctas { justify-content: center; }
        }
        .about-prose {
          font-size: 17px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.58);
        }
        .about-prose p + p { margin-top: 1.25em; }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 960px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .about-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .about-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1040px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .about-cards { grid-template-columns: 1fr; }
        }
        .about-final-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          margin-top: 36px;
        }
      `}</style>

      <div style={a.pagePad}>
        <div
          style={{
            marginBottom: 28,
            padding: "8px 6px",
            borderRadius: 10,
            background: "rgba(10,10,15,0.72)",
            backdropFilter: "blur(8px)",
            width: "fit-content",
          }}
        >
          <Link to="/" style={a.backLink}>
            ← Back to Home
          </Link>
        </div>

        {/* Hero */}
        <FadeIn>
          <section style={{ marginBottom: 100 }}>
            <div className="about-hero-grid">
              <img className="about-photo" src="/Eric_Plunkett.jpg" alt="Eric Plunkett" />
              <div style={{ textAlign: "left" }} className="about-hero-text">
                <h1 style={a.heroName}>Eric Plunkett</h1>
                <p style={a.heroTitle}>Entrepreneur · Investor · Performance Coach</p>
                <p style={a.heroSub}>Co-Founder, Elite Performance Group</p>
                <div className="about-hero-ctas">
                  <Link to="/#speaking" style={a.ctaPrimary}>
                    Book Eric to Speak →
                  </Link>
                  <Link to="/coaching" style={a.ctaSecondary}>
                    Work With Eric →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Story */}
        <FadeIn delay={0.06}>
          <section style={{ marginBottom: 100 }}>
            <div style={a.tagline}>THE STORY</div>
            <h2 style={a.sectionTitle}>Built in the Arena, Not the Classroom</h2>
            <div className="about-prose" style={{ maxWidth: 720, margin: "0 auto" }}>
              <p>
                Eric Plunkett is an entrepreneur, investor, and performance coach with over two decades of experience building businesses, leading
                teams, and navigating the realities of high-performance leadership.
              </p>
              <p>
                Throughout his career, Eric has owned and operated multiple businesses across the fitness, service, and healthcare industries,
                including Axis Therapy Centers, a family-owned organization providing therapy services for children with autism. He has successfully
                exited several ventures and now focuses on a select group of businesses while actively investing in and advising growing companies
                across the country.
              </p>
              <p>
                Eric&apos;s approach to coaching is rooted in real-world experience — not theory. He understands the pressure of leading organizations,
                managing teams, building wealth, and staying grounded as a husband and father.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Approach */}
        <FadeIn delay={0.08}>
          <section style={{ marginBottom: 100 }}>
            <div style={a.tagline}>THE APPROACH</div>
            <h2 style={a.sectionTitle}>Direct. Authentic. No Shortcuts.</h2>
            <div className="about-cards">
              <div style={a.card}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>🎯</div>
                <h3 style={a.cardTitle}>Clarity Through the Power 9</h3>
                <p style={a.cardText}>
                  Eric&apos;s work centers around the Power 9 — nine essential pillars that define a high-performing life. Every coaching engagement
                  starts with an honest assessment of where you stand today.
                </p>
              </div>
              <div style={a.card}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>⚡</div>
                <h3 style={a.cardTitle}>Built on Ownership</h3>
                <p style={a.cardText}>
                  No excuses, no sugarcoating. Eric challenges clients to take extreme ownership of their situation — because growth starts the moment you
                  stop running from yourself.
                </p>
              </div>
              <div style={a.card}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>🔄</div>
                <h3 style={a.cardTitle}>Execute with Consistency</h3>
                <p style={a.cardText}>
                  Strategy without execution is a hobby. Eric helps clients build structure, create accountability, and show up consistently — in
                  business, at home, and in life.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Track record */}
        <FadeIn delay={0.1}>
          <section style={{ marginBottom: 100 }}>
            <div style={a.tagline}>THE TRACK RECORD</div>
            <h2 style={a.sectionTitle}>Two Decades of Building</h2>
            <div className="about-stats">
              <div style={a.statCell}>
                <div style={a.statNum}>20+</div>
                <div style={a.statLabel}>Years in Business</div>
              </div>
              <div style={a.statCell}>
                <div style={a.statNum}>Multiple</div>
                <div style={a.statLabel}>Successful Exits</div>
              </div>
              <div style={a.statCell}>
                <div style={{ ...a.statNum, fontSize: "clamp(20px, 3vw, 28px)" }}>Fitness, Healthcare, Service</div>
                <div style={a.statLabel}>Industries Led</div>
              </div>
              <div style={a.statCell}>
                <div style={{ ...a.statNum, fontSize: "clamp(22px, 3.2vw, 32px)" }}>Investor &amp; Advisor</div>
                <div style={a.statLabel}>Active Portfolio</div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Who */}
        <FadeIn delay={0.12}>
          <section style={{ marginBottom: 80 }}>
            <div style={a.tagline}>WHO THIS IS FOR</div>
            <h2 style={a.sectionTitle}>Not for Everyone. Built for the Driven.</h2>
            <div className="about-prose" style={{ maxWidth: 720, margin: "0 auto 0", textAlign: "center" }}>
              <p>
                Eric works with executives, entrepreneurs, and driven individuals who want to perform at a higher level — without sacrificing what
                matters most at home. His clients aren&apos;t looking for a cheerleader. They want someone who&apos;s been in the arena, understands the
                pressure, and will tell them the truth.
              </p>
              <p>If you&apos;re ready to take ownership, build a plan, and execute — Eric&apos;s in your corner.</p>
            </div>
            <div className="about-final-ctas">
              <Link to="/#connect" style={a.ctaPrimary}>
                Inquire About Coaching →
              </Link>
              <Link to="/#speaking" style={a.ctaSecondary}>
                Book Eric to Speak →
              </Link>
            </div>
          </section>
        </FadeIn>
      </div>

      <footer style={a.footer}>
        <img src="/elite_performance_no_tagline_white.png" alt="Elite Performance" style={{ height: 36, opacity: 0.6 }} />
        <p style={a.footerText}>eliteperformanceliving.com</p>
        <p style={a.footerCopy}>&copy; {new Date().getFullYear()} Elite Performance Living. All rights reserved.</p>
      </footer>
    </div>
  );
}

const a = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    background: "#07070d",
    color: "#e8e8f0",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  pagePad: {
    padding: "48px 24px 80px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  backLink: {
    color: "rgba(255,143,101,0.95)",
    textDecoration: "none",
    fontWeight: 600,
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  heroName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(36px, 6vw, 52px)",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.1,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#ff6b35",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  heroSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    fontWeight: 400,
  },
  ctaPrimary: {
    display: "inline-block",
    background: "linear-gradient(135deg, #ff6b35, #ff8f65)",
    border: "none",
    borderRadius: 8,
    padding: "14px 28px",
    color: "#07070d",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    textDecoration: "none",
    letterSpacing: 0.3,
    cursor: "pointer",
    textAlign: "center",
  },
  ctaSecondary: {
    display: "inline-block",
    background: "transparent",
    border: "1px solid rgba(255,107,53,0.45)",
    borderRadius: 8,
    padding: "14px 28px",
    color: "#ff8f65",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    textDecoration: "none",
    letterSpacing: 0.3,
    cursor: "pointer",
    textAlign: "center",
  },
  tagline: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 5,
    color: "rgba(255,107,53,0.6)",
    textAlign: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(26px, 4.5vw, 38px)",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 40,
    color: "#fff",
  },
  card: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: "28px 24px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.5)",
  },
  statCell: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: "24px 16px",
    textAlign: "center",
  },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 800,
    color: "#ff6b35",
    marginBottom: 8,
    lineHeight: 1.15,
  },
  statLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 1.45,
    fontWeight: 500,
  },
  footer: {
    textAlign: "center",
    padding: "60px 24px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    marginTop: 12,
    letterSpacing: 2,
    fontWeight: 500,
  },
  footerCopy: {
    fontSize: 11,
    color: "rgba(255,255,255,0.15)",
    marginTop: 8,
  },
};
