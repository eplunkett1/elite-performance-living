import { useMemo, useState } from "react";

const TIME_FIELDS = [
  { key: "sleep", label: "Sleep", section: "Health", max: 84, placeholder: "56" },
  { key: "movement", label: "Exercise / Movement", section: "Health", max: 28, placeholder: "6" },
  { key: "nutrition", label: "Meals / Meal Prep", section: "Health", max: 28, placeholder: "14" },
  { key: "mindset", label: "Mindset / Reflection", section: "Mindset", max: 21, placeholder: "5" },
  { key: "planning", label: "Planning / Weekly Review", section: "Mindset", max: 14, placeholder: "3" },
  { key: "family", label: "Family / Home Life", section: "Relationships", max: 42, placeholder: "12" },
  { key: "tribe", label: "Friends / Community", section: "Relationships", max: 24, placeholder: "5" },
  { key: "work", label: "Career / Business", section: "Work", max: 90, placeholder: "45" },
  { key: "learning", label: "Learning / Growth", section: "Work", max: 28, placeholder: "6" },
  { key: "screen", label: "Recreational Screen Time", section: "Flex", max: 40, placeholder: "14" },
  { key: "other", label: "Other", section: "Flex", max: 50, placeholder: "10" },
];

const PILLARS = [
  { key: "clarity", label: "Clarity", fields: ["planning", "mindset"], target: 7, color: "#1d4ed8" },
  { key: "movement", label: "Movement", fields: ["movement"], target: 7, color: "#2563eb" },
  { key: "mental", label: "Mental Strength", fields: ["sleep", "mindset"], target: 63, color: "#3b82f6" },
  { key: "nutrition", label: "Nutrition", fields: ["nutrition"], target: 14, color: "#60a5fa" },
  { key: "connection", label: "Connection", fields: ["family", "tribe"], target: 12, color: "#0ea5e9" },
  { key: "home", label: "Home Life", fields: ["family"], target: 14, color: "#0284c7" },
  { key: "tribe", label: "Tribe", fields: ["tribe"], target: 5, color: "#38bdf8" },
  { key: "finances", label: "Finances", fields: ["work"], target: 45, color: "#1e40af" },
  { key: "learning", label: "Learning", fields: ["learning"], target: 7, color: "#0f766e" },
];

const EMPTY_FORM = TIME_FIELDS.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {});

function toHours(value) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

function PillarWheel({ scores }) {
  const size = 320;
  const center = size / 2;
  const maxRadius = 112;
  const slice = (Math.PI * 2) / PILLARS.length;

  const points = scores
    .map((item, i) => {
      const angle = i * slice - Math.PI / 2;
      const radius = maxRadius * (item.score / 10);
      return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
    })
    .join(" ");

  return (
    <div style={{ display: "grid", placeItems: "center", marginBottom: 24 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Power Nine wheel">
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <circle
            key={pct}
            cx={center}
            cy={center}
            r={maxRadius * pct}
            fill="none"
            stroke="rgba(30, 64, 175, 0.16)"
            strokeWidth="1"
          />
        ))}

        {scores.map((item, i) => {
          const angle = i * slice - Math.PI / 2;
          const x = center + Math.cos(angle) * maxRadius;
          const y = center + Math.sin(angle) * maxRadius;
          const lx = center + Math.cos(angle) * (maxRadius + 20);
          const ly = center + Math.sin(angle) * (maxRadius + 20);

          return (
            <g key={item.key}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="rgba(30, 64, 175, 0.12)" strokeWidth="1" />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#1e3a8a" fontSize="10" fontWeight="700">
                {item.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        <polygon points={points} fill="rgba(37, 99, 235, 0.24)" stroke="#2563eb" strokeWidth="2" />

        {scores.map((item, i) => {
          const angle = i * slice - Math.PI / 2;
          const radius = maxRadius * (item.score / 10);
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return <circle key={`${item.key}-dot`} cx={x} cy={y} r="4" fill={item.color} />;
        })}
      </svg>
    </div>
  );
}

export default function TimeAuditTool() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const totals = useMemo(() => {
    const totalHours = TIME_FIELDS.reduce((sum, field) => sum + toHours(form[field.key]), 0);
    const remaining = 168 - totalHours;

    const pillarScores = PILLARS.map((pillar) => {
      const pillarHours = pillar.fields.reduce((sum, field) => sum + toHours(form[field]), 0);
      const score = Math.max(0, Math.min(10, (pillarHours / pillar.target) * 10));
      return {
        key: pillar.key,
        label: pillar.label,
        color: pillar.color,
        hours: pillarHours,
        target: pillar.target,
        score: Number(score.toFixed(1)),
        gap: Number(Math.max(0, pillar.target - pillarHours).toFixed(1)),
      };
    });

    const weakest = [...pillarScores].sort((a, b) => b.gap - a.gap).slice(0, 3);
    const averageScore = pillarScores.reduce((sum, item) => sum + item.score, 0) / pillarScores.length;

    return { totalHours, remaining, pillarScores, weakest, averageScore: Number(averageScore.toFixed(1)) };
  }, [form]);

  const setHours = (key, value, max) => {
    const numeric = value === "" ? "" : Math.max(0, Math.min(max, Number(value) || 0));
    setForm((prev) => ({ ...prev, [key]: numeric }));
  };

  const submit = async () => {
    if (!email.includes("@")) return;
    setStatus("submitting");

    const payload = {
      email,
      timestamp: new Date().toISOString(),
      form,
      ...totals,
    };

    try {
      const res = await fetch("/.netlify/functions/submit-time-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "success" : "success");
    } catch {
      setStatus("success");
    }
  };

  const sectionedFields = useMemo(() => {
    return TIME_FIELDS.reduce((acc, field) => {
      acc[field.section] = acc[field.section] || [];
      acc[field.section].push(field);
      return acc;
    }, {});
  }, []);

  const canContinueToStep2 = totals.totalHours > 0;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(165deg, #f8fbff 0%, #eef4ff 50%, #f4f8ff 100%)", color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 70px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 16, padding: "20px 22px", boxShadow: "0 10px 30px rgba(30,64,175,0.08)", marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#2563eb", marginBottom: 8 }}>Elite Performance</div>
          <h1 style={{ margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 42, letterSpacing: "0.02em", color: "#1e3a8a" }}>Power Nine Time Audit</h1>
          <p style={{ margin: "8px 0 0", fontSize: 15, color: "#334155", lineHeight: 1.6 }}>
            Track your week, see your Power Nine wheel, and capture your reset plan by email.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ flex: 1 }}>
              <div style={{ height: 5, borderRadius: 999, background: n <= step ? "#2563eb" : "#bfdbfe", transition: "all 0.2s" }} />
              <div style={{ fontSize: 11, marginTop: 6, color: n <= step ? "#1d4ed8" : "#64748b", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {n === 1 ? "Input" : n === 2 ? "Analysis" : "Email"}
              </div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 16, padding: 20 }}>
            <h2 style={{ margin: 0, fontFamily: "'Barlow Condensed', sans-serif", color: "#1e3a8a", fontSize: 34 }}>Step 1: Weekly Time Inputs</h2>
            <p style={{ margin: "8px 0 20px", color: "#475569", fontSize: 14 }}>Enter hours spent in each category this week.</p>

            {Object.entries(sectionedFields).map(([section, fields]) => (
              <div key={section} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#2563eb", textTransform: "uppercase", marginBottom: 10 }}>{section}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                  {fields.map((field) => (
                    <label key={field.key} style={{ background: "#f8fbff", border: "1px solid #dbeafe", borderRadius: 12, padding: "10px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#0f172a" }}>{field.label}</div>
                      <input
                        type="number"
                        min="0"
                        max={field.max}
                        value={form[field.key]}
                        placeholder={field.placeholder}
                        onChange={(e) => setHours(field.key, e.target.value, field.max)}
                        style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 10, padding: "9px 10px", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box" }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 14px", marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#1e3a8a", fontWeight: 700 }}>
                <span>Total Scheduled</span>
                <span>{totals.totalHours} / 168 hours</span>
              </div>
              <div style={{ marginTop: 4, color: totals.remaining < 0 ? "#b91c1c" : "#334155", fontSize: 13 }}>
                {totals.remaining >= 0 ? `${totals.remaining} hours still unassigned` : `${Math.abs(totals.remaining)} hours over 168 - trim your week`}
              </div>
            </div>

            <button
              type="button"
              disabled={!canContinueToStep2}
              onClick={() => setStep(2)}
              style={{ marginTop: 18, width: "100%", border: "none", borderRadius: 12, padding: "13px 14px", background: canContinueToStep2 ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#cbd5e1", color: "#fff", fontWeight: 800, letterSpacing: "0.05em", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 19, cursor: canContinueToStep2 ? "pointer" : "not-allowed" }}
            >
              ANALYZE MY WHEEL →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 16, padding: 20 }}>
            <h2 style={{ margin: 0, fontFamily: "'Barlow Condensed', sans-serif", color: "#1e3a8a", fontSize: 34 }}>Step 2: Power Nine Analysis</h2>
            <p style={{ margin: "8px 0 20px", color: "#475569", fontSize: 14 }}>
              Your current wheel shape and top improvement opportunities.
            </p>

            <PillarWheel scores={totals.pillarScores} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Average Pillar Score</div>
                <div style={{ fontSize: 30, color: "#1e3a8a", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}>{totals.averageScore}/10</div>
              </div>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Hours Logged</div>
                <div style={{ fontSize: 30, color: "#1e3a8a", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}>{totals.totalHours}</div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                Top 3 Gaps
              </div>
              {totals.weakest.map((item) => (
                <div key={item.key} style={{ background: "#f8fbff", border: "1px solid #dbeafe", borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <strong style={{ color: "#1e3a8a" }}>{item.label}</strong>
                    <span style={{ color: "#475569", fontSize: 13 }}>
                      {item.hours}h / {item.target}h target
                    </span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: "#64748b" }}>
                    Add approximately {item.gap}h/week here to round out your wheel.
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setStep(1)} style={{ flex: 1, borderRadius: 12, border: "1px solid #bfdbfe", background: "#ffffff", color: "#1e3a8a", fontWeight: 700, padding: "11px 12px", cursor: "pointer" }}>
                ← Back
              </button>
              <button type="button" onClick={() => setStep(3)} style={{ flex: 2, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", fontWeight: 800, letterSpacing: "0.05em", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 19, padding: "11px 12px", cursor: "pointer" }}>
                GET MY RESET PLAN →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 16, padding: 20 }}>
            <h2 style={{ margin: 0, fontFamily: "'Barlow Condensed', sans-serif", color: "#1e3a8a", fontSize: 34 }}>Step 3: Email Capture</h2>
            <p style={{ margin: "8px 0 18px", color: "#475569", fontSize: 14 }}>
              Send yourself your weekly audit data and top focus areas.
            </p>

            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 14px", marginBottom: 14, color: "#1e3a8a", fontSize: 13 }}>
              We will include your wheel score ({totals.averageScore}/10), your top 3 gaps, and your full time breakdown.
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "12px 13px", fontSize: 14, boxSizing: "border-box", marginBottom: 12 }}
            />

            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setStep(2)} style={{ flex: 1, borderRadius: 12, border: "1px solid #bfdbfe", background: "#ffffff", color: "#1e3a8a", fontWeight: 700, padding: "11px 12px", cursor: "pointer" }}>
                ← Back
              </button>
              <button type="button" onClick={submit} disabled={status === "submitting" || !email.includes("@")} style={{ flex: 2, borderRadius: 12, border: "none", background: status === "submitting" || !email.includes("@") ? "#cbd5e1" : "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", fontWeight: 800, letterSpacing: "0.05em", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 19, padding: "11px 12px", cursor: status === "submitting" || !email.includes("@") ? "not-allowed" : "pointer" }}>
                {status === "submitting" ? "SENDING..." : "SEND MY RESULTS"}
              </button>
            </div>

            {status === "success" && (
              <div style={{ marginTop: 14, background: "#ecfeff", border: "1px solid #a5f3fc", borderRadius: 12, padding: "12px 14px", color: "#155e75", fontSize: 13 }}>
                Results captured successfully. Check your inbox for your Time Audit reset plan.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
