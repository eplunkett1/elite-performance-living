import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PILLAR_MODAL_DETAILS } from "../data/pillarModalDetails.js";
import { PILLAR_DATA } from "../data/pillars.js";
import { submitEmailSignup } from "../lib/emailSignup.js";

const LOGO_BASE64 = "data:image/png;base64,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";


const PHIL_BALANCED_SCORES = [7, 8, 7, 8, 7, 8, 7, 8, 7];
const PHIL_LOPSIDED_SCORES = [9, 3, 8, 2, 7, 4, 9, 3, 6];

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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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

function PillarDetailModal({ openIndex, onClose, pillars }) {
  const detail = openIndex !== null ? PILLAR_MODAL_DETAILS[openIndex] : null;
  const pillar = openIndex !== null ? pillars[openIndex] : null;

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIndex, onClose]);

  if (openIndex === null || !detail || !pillar) return null;

  const accent = pillar.color;
  const sectionLabelStyle = { color: accent };

  return (
    <div className="pillar-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="pillar-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pillar-modal-title"
      >
        <div className="pillar-modal-header">
          <div className="pillar-modal-header-inner">
            <span className="pillar-modal-header-icon" style={{ filter: `drop-shadow(0 0 12px ${accent}55)` }}>
              {pillar.icon}
            </span>
            <div>
              <h2 id="pillar-modal-title" className="pillar-modal-title" style={{ color: accent }}>
                {pillar.name}
              </h2>
              <p className="pillar-modal-spoke">{detail.spoke}</p>
            </div>
          </div>
          <button type="button" className="pillar-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="pillar-modal-scroll">
          <div className="pillar-modal-section">
            <div className="pillar-modal-section-label" style={sectionLabelStyle}>
              Why it matters
            </div>
            <p className="pillar-modal-body">{detail.whyItMatters}</p>
          </div>
          <div className="pillar-modal-section">
            <div className="pillar-modal-section-label" style={sectionLabelStyle}>
              Quick tips
            </div>
            <ul className="pillar-modal-list">
              {detail.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="pillar-modal-section">
            <div className="pillar-modal-section-label" style={sectionLabelStyle}>
              Key stats
            </div>
            <ul className="pillar-modal-list pillar-modal-list--stats">
              {detail.stats.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>
          <div className="pillar-modal-section">
            <div className="pillar-modal-section-label" style={sectionLabelStyle}>
              Recommended resources
            </div>
            <ul className="pillar-modal-resources">
              {detail.resources.map((r, i) => {
                if (r.kind === "book") {
                  return (
                    <li key={i} className="pillar-modal-resource-line">
                      {r.icon ? <span className="pillar-modal-res-icon">{r.icon}</span> : null}{" "}
                      <cite className="pillar-modal-book-title">{r.title}</cite>
                      {r.author ? (
                        <>
                          {" "}
                          <span className="pillar-modal-resource-meta">by {r.author}</span>
                        </>
                      ) : null}
                      {r.note ? (
                        <>
                          {" "}
                          <span className="pillar-modal-resource-note">— {r.note}</span>
                        </>
                      ) : null}
                    </li>
                  );
                }
                if (r.kind === "link") {
                  const linkEl =
                    r.external === false ? (
                      <Link to={r.href} className="pillar-modal-link" style={{ color: accent }} onClick={onClose}>
                        {r.linkText}
                      </Link>
                    ) : (
                      <a
                        href={r.href}
                        className="pillar-modal-link"
                        style={{ color: accent }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {r.linkText}
                      </a>
                    );
                  return (
                    <li key={i} className="pillar-modal-resource-line">
                      {r.icon ? <span className="pillar-modal-res-icon">{r.icon}</span> : null}
                      {r.before}
                      {linkEl}
                      {r.after}
                    </li>
                  );
                }
                return (
                  <li key={i} className="pillar-modal-resource-line">
                    {r.icon ? <span className="pillar-modal-res-icon">{r.icon}</span> : null}
                    {r.text}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function pillarLabelShort(name) {
  const w = name.split(/[\s&]+/).filter(Boolean);
  return (w[0] || "").toUpperCase();
}

function PhilosophyComparisonWheel({ scores, variant, badgeLabel, wheelTitle, caption }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(260);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const sync = () => setCanvasSize(mq.matches ? 320 : 260);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvasSize;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(2, 2);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = size / 2 - Math.round(34 * (size / 260));
    const slice = (Math.PI * 2) / 9;

    const fillInner = variant === "balanced" ? "rgba(107,203,119,0.32)" : "rgba(255,107,53,0.28)";
    const fillOuter = variant === "balanced" ? "rgba(107,203,119,0.06)" : "rgba(255,80,60,0.08)";
    const strokeCol = variant === "balanced" ? "rgba(107,203,119,0.75)" : "rgba(255,143,101,0.85)";

    let phase = 0;
    const draw = () => {
      phase += 0.004;
      ctx.clearRect(0, 0, size, size);

      for (let r = 1; r <= 10; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (r / 10) * maxR, 0, Math.PI * 2);
        ctx.strokeStyle = r % 5 === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)";
        ctx.lineWidth = r % 5 === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      for (let i = 0; i < 9; i++) {
        const a = i * slice - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const a = i * slice - Math.PI / 2;
        const pulse = Math.sin(phase + i * 0.7) * 0.015 + 1;
        const rad = ((scores[i] || 0) / 10) * maxR * pulse;
        const x = cx + Math.cos(a) * rad;
        const y = cy + Math.sin(a) * rad;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      g.addColorStop(0, fillInner);
      g.addColorStop(1, fillOuter);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let i = 0; i < 9; i++) {
        const a = i * slice - Math.PI / 2;
        const pulse = Math.sin(phase + i * 0.7) * 0.015 + 1;
        const rad = ((scores[i] || 0) / 10) * maxR * pulse;
        const x = cx + Math.cos(a) * rad;
        const y = cy + Math.sin(a) * rad;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4, Math.round(5 * (size / 260))), 0, Math.PI * 2);
        ctx.fillStyle = PILLAR_DATA[i].color;
        ctx.shadowColor = PILLAR_DATA[i].color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        const labelR = maxR + Math.round(18 * (size / 260));
        const lx = cx + Math.cos(a) * labelR;
        const ly = cy + Math.sin(a) * labelR;
        ctx.font = `600 ${Math.max(7, Math.round(7 * (size / 260)))}px 'Outfit', sans-serif`;
        ctx.fillStyle = PILLAR_DATA[i].color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pillarLabelShort(PILLAR_DATA[i].name), lx, ly);
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [scores, variant, canvasSize]);

  return (
    <div style={{ textAlign: "center" }}>
      <h4
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 10,
        }}
      >
        {wheelTitle}
      </h4>
      <div
        style={{
          display: "inline-block",
          padding: "4px 14px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 8,
          ...(variant === "balanced"
            ? {
                background: "rgba(107,203,119,0.15)",
                color: "#6bcb77",
                border: "1px solid rgba(107,203,119,0.35)",
              }
            : {
                background: "rgba(255,107,53,0.12)",
                color: "#ff8f65",
                border: "1px solid rgba(255,107,53,0.35)",
              }),
        }}
      >
        {badgeLabel}
      </div>
      <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto" }} />
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.5)",
          marginTop: 16,
          maxWidth: 340,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {caption}
      </p>
    </div>
  );
}

function WheelVisualization() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [hovered, setHovered] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = 340;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(2, 2);

    const cx = size / 2,
      cy = size / 2,
      /* Leave room for full-width uppercase labels (e.g. STEWARDSHIP, MENTAL STRENGTH). */
      maxR = size / 2 - 76;
    const labelR = maxR + 22;
    const values = [8, 6, 9, 7, 5, 8, 6, 7, 9];

    let phase = 0;
    const draw = () => {
      phase += 0.005;
      ctx.clearRect(0, 0, size, size);

      // rings
      for (let r = 1; r <= 10; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (r / 10) * maxR, 0, Math.PI * 2);
        ctx.strokeStyle = r % 5 === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)";
        ctx.lineWidth = r % 5 === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      const sliceAngle = (Math.PI * 2) / 9;

      // spokes
      for (let i = 0; i < 9; i++) {
        const angle = i * sliceAngle - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // filled area
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const angle = i * sliceAngle - Math.PI / 2;
        const pulse = Math.sin(phase + i * 0.7) * 0.02 + 1;
        const r = (values[i] / 10) * maxR * pulse;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, "rgba(255,107,53,0.25)");
      grad.addColorStop(1, "rgba(255,107,53,0.05)");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,107,53,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // dots and labels
      for (let i = 0; i < 9; i++) {
        const angle = i * sliceAngle - Math.PI / 2;
        const pulse = Math.sin(phase + i * 0.7) * 0.02 + 1;
        const r = (values[i] / 10) * maxR * pulse;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, hovered === i ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = PILLAR_DATA[i].color;
        ctx.fill();
        if (hovered === i) {
          ctx.shadowColor = PILLAR_DATA[i].color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // label — ring outside polygon; inset chart so text stays inside canvas
        const labelBoost = PILLAR_DATA[i].name === "Mental Strength" ? 14 : 0;
        const effR = labelR + labelBoost;
        const lx = cx + Math.cos(angle) * effR;
        let ly = cy + Math.sin(angle) * effR;
        if (PILLAR_DATA[i].name === "Mental Strength") ly -= 5;
        ctx.font = "500 9px 'Outfit', sans-serif";
        ctx.fillStyle = hovered === i ? PILLAR_DATA[i].color : "rgba(255,255,255,0.5)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(PILLAR_DATA[i].name.toUpperCase(), lx, ly);
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [hovered]);

  return <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto" }} />;
}

function NavBar({ activeSection }) {
  const items = [
    { key: "hero", id: "hero", label: "Home", type: "scroll" },
    { key: "philosophy", id: "philosophy", label: "Philosophy", type: "scroll" },
    { key: "about", to: "/about", label: "About", type: "link" },
    { key: "power9", id: "power9", label: "Power 9", type: "scroll" },
    { key: "tools", id: "tools", label: "Tools", type: "scroll" },
    { key: "speaking", id: "speaking", label: "Speaking", type: "scroll" },
    { key: "connect", id: "connect", label: "Connect", type: "scroll" },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={s.nav}>
      <div style={s.navInner}>
        <img src="/elite_performance_no_tagline_white.png" alt="Elite Performance" style={s.navLogo} />
        <div style={s.navLinks}>
          {items.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.key}
                to={item.to}
                style={{
                  ...s.navLink,
                  color: "rgba(255,255,255,0.5)",
                  borderBottom: "2px solid transparent",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.key}
                onClick={() => scrollTo(item.id)}
                style={{
                  ...s.navLink,
                  color: activeSection === item.id ? "#ff6b35" : "rgba(255,255,255,0.5)",
                  borderBottom: activeSection === item.id ? "2px solid #ff6b35" : "2px solid transparent",
                }}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default function ElitePerformanceSite() {
  const [activeSection, setActiveSection] = useState("hero");
  const [email, setEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [pillarModalIndex, setPillarModalIndex] = useState(null);
  const [hoveredPillarCard, setHoveredPillarCard] = useState(null);
  const navigate = useNavigate();

  const closePillarModal = () => setPillarModalIndex(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    ["hero", "philosophy", "power9", "tools", "speaking", "connect"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash?.replace(/^#/, "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    const t = window.setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
    return () => window.clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!email.includes("@") || signupLoading) return;
    setSignupError(null);
    setSignupLoading(true);
    try {
      await submitEmailSignup({
        name: signupName,
        email,
        source: "homepage",
      });
      setSubmitted(true);
    } catch {
      setSignupError("Something went wrong. Please try again in a moment.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #07070d; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(255,107,53,0.15); } 50% { box-shadow: 0 0 40px rgba(255,107,53,0.3); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes gradShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .phil-manifesto {
          font-size: 16px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.58);
          text-align: center;
          max-width: 700px;
          margin: 0 auto 56px;
          padding: 8px 40px 0;
        }
        @media (max-width: 768px) {
          .phil-manifesto {
            padding: 8px 24px 0;
          }
        }
        .phil-manifesto p + p {
          margin-top: 1.25em;
        }
        .phil-wheel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
          max-width: 960px;
          margin: 0 auto 28px;
        }
        @media (max-width: 900px) {
          .phil-wheel-grid { grid-template-columns: 1fr; gap: 48px; }
        }
        .phil-bridge {
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.55);
          max-width: 720px;
          margin: 0 auto 56px;
          text-align: center;
        }
        @keyframes pillarModalBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pillarModalPanelIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pillar-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
          animation: pillarModalBackdropIn 0.35s ease forwards;
        }
        @media (min-width: 640px) {
          .pillar-modal-backdrop {
            align-items: center;
            padding: 24px;
          }
        }
        .pillar-modal-panel {
          width: 100%;
          max-height: 100%;
          background: #07070d;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          animation: pillarModalPanelIn 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .pillar-modal-panel {
            max-width: 640px;
            max-height: min(90vh, 900px);
            border-radius: 20px;
          }
        }
        @media (max-width: 639px) {
          .pillar-modal-panel {
            border-radius: 0;
            min-height: 100%;
            max-height: 100%;
          }
        }
        .pillar-modal-header {
          flex-shrink: 0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
        }
        @media (min-width: 640px) {
          .pillar-modal-header {
            padding: 22px 24px 18px;
          }
        }
        .pillar-modal-header-inner {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }
        .pillar-modal-header-icon {
          font-size: 40px;
          line-height: 1;
        }
        .pillar-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 800;
          margin: 0 0 4px;
          line-height: 1.15;
        }
        .pillar-modal-spoke {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
          font-weight: 500;
        }
        .pillar-modal-close {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.7);
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .pillar-modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .pillar-modal-scroll {
          overflow-y: auto;
          padding: 18px 20px 28px;
          -webkit-overflow-scrolling: touch;
        }
        @media (min-width: 640px) {
          .pillar-modal-scroll {
            padding: 20px 26px 32px;
          }
        }
        .pillar-modal-section {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 18px 18px 16px;
          margin-bottom: 14px;
        }
        .pillar-modal-section:last-child {
          margin-bottom: 0;
        }
        .pillar-modal-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .pillar-modal-body {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.58);
          margin: 0;
        }
        .pillar-modal-list {
          margin: 0;
          padding-left: 1.15em;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.55);
        }
        .pillar-modal-list li + li {
          margin-top: 8px;
        }
        .pillar-modal-list--stats li {
          list-style-type: disc;
        }
        .pillar-modal-resources {
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.55);
        }
        .pillar-modal-resource-line {
          margin-bottom: 12px;
        }
        .pillar-modal-resource-line:last-child {
          margin-bottom: 0;
        }
        .pillar-modal-res-icon {
          margin-right: 4px;
        }
        .pillar-modal-book-title {
          font-style: italic;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }
        .pillar-modal-resource-meta {
          color: rgba(255, 255, 255, 0.5);
        }
        .pillar-modal-resource-note {
          color: rgba(255, 255, 255, 0.45);
        }
        .pillar-modal-link {
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(255, 255, 255, 0.25);
        }
        .pillar-modal-link:hover {
          text-decoration-color: currentColor;
        }
        .pillar-card-clickable:focus-visible {
          outline: 2px solid rgba(255, 107, 53, 0.65);
          outline-offset: 3px;
        }
      `}</style>

      <NavBar activeSection={activeSection} />
      <PillarDetailModal openIndex={pillarModalIndex} onClose={closePillarModal} pillars={PILLAR_DATA} />

      {/* ===== HERO ===== */}
      <section id="hero" style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <div style={s.heroBadge}>ELITEPERFORMANCELIVING.COM</div>
          <h1 style={s.heroTitle}>
            <span style={{ display: "block", color: "rgba(255,255,255,0.9)" }}>Build a Life That</span>
            <span style={s.heroAccent}>Performs</span>
          </h1>
          <p style={s.heroSub}>
            Nine pillars. One framework. A complete system for assessing, optimizing,
            and elevating every dimension of your life.
          </p>
          <div style={s.heroCTAs}>
            <button onClick={() => document.getElementById("power9")?.scrollIntoView({ behavior: "smooth" })} style={s.ctaPrimary}>
              Discover the Power 9 →
            </button>
            <button onClick={() => navigate("/assessment")} style={s.ctaSecondary}>
              Take the Assessment
            </button>
          </div>
        </div>
        <div style={s.heroVisual}>
          <WheelVisualization />
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section id="philosophy" style={s.section}>
        <div style={{ ...s.sectionInner, maxWidth: 1100 }}>
          <FadeIn>
            <div style={s.tagline}>THE PHILOSOPHY</div>
            <h2 style={{ ...s.sectionTitle, marginBottom: 16 }}>Built for the Blow</h2>
            <p style={s.philSectionSubtitle}>
              Life doesn&apos;t care how strong one area is. When the storm hits, your weakest pillar breaks first.
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="phil-manifesto">
              <p>
                This framework wasn&apos;t built in a classroom. It was built in the arena — by entrepreneurs, leaders, coaches, and people who&apos;ve
                been knocked down and figured out how to get back up.
              </p>
              <p>
                We&apos;re not therapists. We&apos;re not here to over-complicate what&apos;s already hard. We&apos;re operators who&apos;ve spent decades
                building businesses, leading teams, raising families, and learning — sometimes the hard way — what it actually takes to perform at a
                high level without burning it all down.
              </p>
              <p>
                The Power 9 came from a simple observation: the people who handle adversity well aren&apos;t just strong in one area. They&apos;re
                balanced. And the ones who fall apart? They usually have a blind spot they never addressed.
              </p>
              <p>
                This isn&apos;t theory. It&apos;s a practical framework built by people who&apos;ve lived it — designed to help you figure out where you
                stand today so you can start building toward where you want to be.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="phil-wheel-grid">
              <PhilosophyComparisonWheel
                scores={PHIL_BALANCED_SCORES}
                variant="balanced"
                wheelTitle="Balanced Life"
                badgeLabel="Smooth ride"
                caption="When your 9 pillars are strong and balanced, your wheel is round. You roll through life's challenges with momentum."
              />
              <PhilosophyComparisonWheel
                scores={PHIL_LOPSIDED_SCORES}
                variant="lopsided"
                wheelTitle="Unbalanced Life"
                badgeLabel="Bumpy ride"
                caption="When some areas are strong and others neglected, your wheel is oblong. Every bump in the road hits harder."
              />
            </div>
            <p className="phil-bridge">
              Imagine your life as a wheel with 9 spokes — one for each pillar. When all spokes are strong and roughly equal, your wheel is round.
              You roll through life&apos;s inevitable challenges with ease. But when some areas are neglected, your wheel becomes lopsided. Every
              pothole, every setback, every storm hits harder than it should. The Power 9 assessment shows you the shape of your wheel — and gives
              you a plan to round it out.
            </p>
          </FadeIn>

          <FadeIn delay={0.16}>
            <div style={{ ...s.philGrid, marginTop: 8 }}>
              <div style={s.philCard}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚖️</div>
                <h3 style={s.philH3}>Balance = Momentum</h3>
                <p style={s.philP}>
                  Life doesn&apos;t require perfection in every area — it requires attention. When your 9 pillars are reasonably strong, you build
                  momentum that carries you through the hard seasons.
                </p>
              </div>
              <div style={s.philCard}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
                <h3 style={s.philH3}>Baseline First</h3>
                <p style={s.philP}>
                  You can&apos;t improve what you don&apos;t measure. The Power 9 assessment gives you an honest snapshot of where you stand today
                  — no judgment, just clarity.
                </p>
              </div>
              <div style={s.philCard}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔄</div>
                <h3 style={s.philH3}>Iterate &amp; Elevate</h3>
                <p style={s.philP}>
                  Small, targeted improvements in your weakest pillars create outsized results. Reassess regularly, adjust your plan, and watch the
                  wheel round out.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== POWER 9 ===== */}
      <section id="power9" style={{ ...s.section, background: "linear-gradient(180deg, #07070d 0%, #0d0d18 50%, #07070d 100%)" }}>
        <div style={s.sectionInner}>
          <div style={s.tagline}>THE FRAMEWORK</div>
          <h2 style={s.sectionTitle}>The Power 9</h2>
          <p style={{ ...s.heroSub, maxWidth: 600, margin: "0 auto 48px", textAlign: "center" }}>
            Nine essential pillars that define a high-performing life. Each one matters.
            Together, they create an unshakable foundation.
          </p>
          <div style={s.pillarGrid}>
            {PILLAR_DATA.map((p, i) => {
              const isHover = hoveredPillarCard === i;
              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name}: open details`}
                  aria-haspopup="dialog"
                  className="pillar-card-clickable"
                  style={{
                    ...s.pillarCard,
                    cursor: "pointer",
                    transform: isHover ? "scale(1.02)" : "scale(1)",
                    borderColor: isHover ? `${p.color}66` : "rgba(255,255,255,0.06)",
                    boxShadow: isHover ? `0 0 28px ${p.color}28, 0 0 0 1px ${p.color}44` : "none",
                  }}
                  onMouseEnter={() => setHoveredPillarCard(i)}
                  onMouseLeave={() => setHoveredPillarCard(null)}
                  onClick={() => setPillarModalIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPillarModalIndex(i);
                    }
                  }}
                >
                  <div style={{ ...s.pillarIcon, background: `${p.color}18`, border: `1px solid ${p.color}40` }}>
                    <span style={{ fontSize: 28 }}>{p.icon}</span>
                  </div>
                  <div style={s.pillarNum}>{String(i + 1).padStart(2, "0")}</div>
                  <h3 style={{ ...s.pillarName, color: p.color }}>{p.name}</h3>
                  <p style={s.pillarDesc}>{p.desc}</p>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              to="/resources"
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#ff8f65",
                textDecoration: "none",
                letterSpacing: 0.3,
              }}
            >
              View All Resources →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TOOLS ===== */}
      <section id="tools" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.tagline}>YOUR TOOLKIT</div>
          <h2 style={s.sectionTitle}>Tools to Transform</h2>
          <div style={s.toolGrid}>
            <div style={{ ...s.toolCard, animation: "glow 3s ease-in-out infinite" }}>
              <div style={s.toolBadge}>FLAGSHIP</div>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h3 style={s.toolTitle}>Power 9 Assessment</h3>
              <p style={s.toolDesc}>
                90 questions across all 9 pillars. Get your baseline scores,
                visualize your life wheel, and build a targeted action plan
                for the areas that need it most.
              </p>
              <button onClick={() => navigate("/assessment")} style={s.ctaPrimary}>Take the Assessment →</button>
            </div>
            <div style={s.toolCard}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏋️</div>
              <h3 style={s.toolTitle}>AI Workout Architect</h3>
              <p style={s.toolDesc}>
                Personalized workout programming powered by AI.
                Tell it your goals, equipment, and schedule —
                get a complete training plan built for you.
              </p>
              <button onClick={() => navigate("/workout")} style={s.ctaSecondary}>Build Your Plan →</button>
            </div>
            <div style={s.toolCard}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
              <h3 style={s.toolTitle}>Stewardship Financial Assessment</h3>
              <p style={s.toolDesc}>
                Get a personalized financial health score based on your income,
                expenses, debt, and goals — plus practical next steps for
                budgeting, debt payoff, and long-term savings.
              </p>
              <button onClick={() => navigate("/stewardship")} style={s.ctaSecondary}>Start Assessment →</button>
            </div>
            <div style={s.toolCard}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🕒</div>
              <h3 style={s.toolTitle}>Power Nine Time Audit</h3>
              <p style={s.toolDesc}>Get Amy's Stop/Start/Continue recommendations for your weekly schedule. Map your current time allocation and discover what to stop, start, or continue.</p>
              <button onClick={() => navigate("/time-audit")} style={s.ctaSecondary}>Launch Time Audit →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPEAKING ===== */}
      <section id="speaking" style={{ ...s.section, background: "linear-gradient(180deg, #07070d 0%, #0f0a14 50%, #07070d 100%)" }}>
        <div style={s.sectionInner}>
          <div style={s.tagline}>ON STAGE</div>
          <h2 style={s.sectionTitle}>Book a Speaking Engagement</h2>
          <p style={{ ...s.heroSub, maxWidth: 600, margin: "0 auto 40px", textAlign: "center" }}>
            Bring the Power 9 framework to your team, conference, or organization.
            Interactive sessions that leave your audience with a personal action plan.
          </p>
          <div style={s.speakingGrid}>
            <div style={s.speakCard}>
              <h4 style={s.speakLabel}>KEYNOTE</h4>
              <h3 style={s.speakTitle}>The Power 9: Build a Life That Performs</h3>
              <p style={s.speakDesc}>
                The signature talk. Audience members assess their own life balance in real-time and leave with a personalized roadmap.
              </p>
            </div>
            <div style={s.speakCard}>
              <h4 style={s.speakLabel}>WORKSHOP</h4>
              <h3 style={s.speakTitle}>Deep Dive: From Assessment to Action</h3>
              <p style={s.speakDesc}>
                A half-day interactive workshop where teams complete the full 90-question assessment and build 90-day improvement plans.
              </p>
            </div>
            <div style={s.speakCard}>
              <h4 style={s.speakLabel}>CORPORATE</h4>
              <h3 style={s.speakTitle}>High-Performance Culture</h3>
              <p style={s.speakDesc}>
                Tailored for organizations. Help your people thrive across all life dimensions — because balanced employees perform better.
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={() => document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" })} style={s.ctaPrimary}>
              Inquire About Booking →
            </button>
          </div>
        </div>
      </section>

      {/* ===== CONNECT ===== */}
      <section id="connect" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.tagline}>STAY CONNECTED</div>
          <h2 style={s.sectionTitle}>Join the Community</h2>
          <p style={{ ...s.heroSub, maxWidth: 520, margin: "0 auto 40px", textAlign: "center" }}>
            Get frameworks, tools, and insights delivered to your inbox.
            No spam — just signal.
          </p>
          <div style={s.formWrap}>
            {submitted ? (
              <div style={s.successMsg}>
                <span style={{ fontSize: 32 }}>🔥</span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginTop: 12 }}>You're In.</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8 }}>Welcome to the Elite Performance community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name (optional)"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  style={{ ...s.emailInput, width: "100%" }}
                />
                <div style={s.emailRow}>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={s.emailInput}
                  />
                  <button type="submit" disabled={signupLoading || !email.includes("@")} style={s.ctaPrimary}>
                    {signupLoading ? "Joining…" : "Join →"}
                  </button>
                </div>
                {signupError ? (
                  <p style={{ fontSize: 14, color: "#ff8f8f", textAlign: "center", margin: 0 }}>{signupError}</p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={s.footer}>
        <img src="/elite_performance_no_tagline_white.png" alt="Elite Performance" style={{ height: 36, opacity: 0.6 }} />
        <p style={{ margin: "16px 0 0" }}>
          <Link to="/resources" style={s.footerResourceLink}>
            Resources
          </Link>
        </p>
        <p style={s.footerText}>eliteperformanceliving.com</p>
        <p style={s.footerCopy}>&copy; {new Date().getFullYear()} Elite Performance Living. All rights reserved.</p>
      </footer>
    </div>
  );
}

const s = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    background: "#07070d",
    color: "#e8e8f0",
    minHeight: "100vh",
    overflowX: "hidden",
  },

  // NAV
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: "rgba(7,7,13,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: { height: 32 },
  navLinks: { display: "flex", gap: 8 },
  navLink: {
    background: "none",
    border: "none",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    padding: "6px 10px",
    transition: "all 0.3s",
    letterSpacing: 0.5,
  },

  // HERO
  hero: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "120px 24px 60px",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
    background: "radial-gradient(ellipse at 50% 30%, rgba(255,107,53,0.06) 0%, transparent 70%)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 30% 20%, rgba(255,107,53,0.04) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", zIndex: 2, maxWidth: 700, animation: "fadeUp 0.8s ease" },
  heroBadge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 4,
    color: "rgba(255,107,53,0.7)",
    border: "1px solid rgba(255,107,53,0.2)",
    padding: "6px 18px",
    borderRadius: 100,
    marginBottom: 32,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(40px, 7vw, 72px)",
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 24,
  },
  heroAccent: {
    display: "block",
    background: "linear-gradient(135deg, #ff6b35, #ff8f65, #ffd93d)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "gradShift 4s ease infinite",
  },
  heroSub: {
    fontSize: 17,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 36,
    fontWeight: 300,
  },
  heroCTAs: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  heroVisual: { marginTop: 48, position: "relative", zIndex: 2, animation: "fadeUp 1.2s ease" },

  ctaPrimary: {
    background: "linear-gradient(135deg, #ff6b35, #ff8f65)",
    border: "none",
    borderRadius: 8,
    padding: "14px 32px",
    color: "#07070d",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.5,
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  ctaSecondary: {
    background: "transparent",
    border: "1px solid rgba(255,107,53,0.4)",
    borderRadius: 8,
    padding: "14px 32px",
    color: "#ff8f65",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: 0.5,
  },

  // SECTIONS
  section: { padding: "100px 24px" },
  sectionInner: { maxWidth: 1000, margin: "0 auto" },
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
    fontSize: "clamp(28px, 5vw, 44px)",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 48,
    color: "#fff",
  },
  philSectionSubtitle: {
    fontSize: 17,
    lineHeight: 1.65,
    color: "rgba(255,255,255,0.52)",
    textAlign: "center",
    maxWidth: 560,
    margin: "0 auto 48px",
    fontWeight: 400,
  },

  // PHILOSOPHY
  philGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  philCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 32,
    textAlign: "center",
  },
  philH3: { fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#fff" },
  philP: { fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)" },

  // POWER 9
  pillarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  pillarCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: "28px 24px",
    position: "relative",
    transition: "border-color 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease",
  },
  pillarIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  pillarNum: {
    position: "absolute",
    top: 20,
    right: 20,
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,255,255,0.12)",
    letterSpacing: 2,
  },
  pillarName: { fontSize: 16, fontWeight: 700, marginBottom: 8 },
  pillarDesc: { fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.45)" },

  // TOOLS
  toolGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 },
  toolCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 36,
    textAlign: "center",
    position: "relative",
  },
  toolBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#ff6b35",
    background: "rgba(255,107,53,0.1)",
    border: "1px solid rgba(255,107,53,0.2)",
    padding: "4px 12px",
    borderRadius: 100,
  },
  toolTitle: { fontSize: 22, fontWeight: 700, marginBottom: 12, color: "#fff" },
  toolDesc: { fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", marginBottom: 24 },

  // SPEAKING
  speakingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  speakCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 28,
  },
  speakLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 3,
    color: "#ff6b35",
    marginBottom: 12,
  },
  speakTitle: { fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10, fontFamily: "'Playfair Display', serif" },
  speakDesc: { fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.45)" },

  // CONNECT
  formWrap: { maxWidth: 480, margin: "0 auto" },
  emailRow: { display: "flex", gap: 12 },
  emailInput: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "14px 18px",
    color: "#fff",
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
  },
  successMsg: { textAlign: "center", padding: 40 },

  // FOOTER
  footer: {
    textAlign: "center",
    padding: "60px 24px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  footerResourceLink: {
    fontSize: 14,
    fontWeight: 600,
    color: "#ff8f65",
    textDecoration: "none",
    letterSpacing: 0.5,
  },
  footerText: { fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12, letterSpacing: 2, fontWeight: 500 },
  footerCopy: { fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 8 },
};
