import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const STEPS = ["basics", "goals", "schedule", "generate"];

const GOAL_OPTIONS = [
  { id: "fat_loss", label: "Fat Loss", icon: "🔥", desc: "Burn fat, get lean" },
  { id: "muscle_gain", label: "Build Muscle", icon: "💪", desc: "Size & strength" },
  { id: "endurance", label: "Endurance", icon: "🏃", desc: "Cardio & stamina" },
  { id: "general", label: "General Fitness", icon: "⚡", desc: "Overall health" },
  { id: "strength", label: "Strength", icon: "🏋️", desc: "Max power output" },
  { id: "flexibility", label: "Mobility", icon: "🧘", desc: "Flexibility & recovery" },
];

const EQUIPMENT_OPTIONS = [
  { id: "full_gym", label: "Full Gym" },
  { id: "home_basic", label: "Home (Dumbbells/Bands)" },
  { id: "bodyweight", label: "Bodyweight Only" },
  { id: "home_gym", label: "Home Gym (Rack/Bench/Barbell)" },
];

const EXPERIENCE_OPTIONS = [
  { id: "beginner", label: "Beginner", desc: "< 6 months" },
  { id: "intermediate", label: "Intermediate", desc: "6mo – 2yrs" },
  { id: "advanced", label: "Advanced", desc: "2+ years" },
];

const DAYS_OPTIONS = [2, 3, 4, 5, 6];

const SESSION_OPTIONS = [
  { id: "30", label: "30 min" },
  { id: "45", label: "45 min" },
  { id: "60", label: "60 min" },
  { id: "75", label: "75 min" },
  { id: "90", label: "90 min" },
];

export default function WorkoutGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    age: "",
    weight: "",
    heightFeet: "",
    heightInches: "",
    sex: "",
    goals: [],
    experience: "",
    equipment: "",
    daysPerWeek: 4,
    sessionLength: "60",
    timeline: "",
    injuries: "",
  });
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamDone, setStreamDone] = useState(false);
  const planRef = useRef(null);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleGoal = (id) =>
    setForm((f) => ({
      ...f,
      goals: f.goals.includes(id)
        ? f.goals.filter((g) => g !== id)
        : f.goals.length < 2
          ? [...f.goals, id]
          : f.goals,
    }));

  const canProceed = () => {
    if (step === 0) return form.age && form.weight && form.sex;
    if (step === 1) return form.goals.length > 0 && form.experience && form.equipment;
    if (step === 2) return form.daysPerWeek && form.sessionLength;
    return true;
  };

  useEffect(() => {
    if (planRef.current) {
      planRef.current.scrollTop = planRef.current.scrollHeight;
    }
  }, [plan]);

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    setPlan("");
    setStreamDone(false);
    setStep(3);

    const goalLabels = form.goals.map((g) => GOAL_OPTIONS.find((o) => o.id === g)?.label).join(" & ");
    const expLabel = EXPERIENCE_OPTIONS.find((o) => o.id === form.experience)?.label;
    const equipLabel = EQUIPMENT_OPTIONS.find((o) => o.id === form.equipment)?.label;

    const prompt = `You are an elite personal trainer and exercise scientist. Create a detailed, personalized weekly workout plan.

CLIENT PROFILE:
- Age: ${form.age}
- Sex: ${form.sex}
- Weight: ${form.weight} lbs
- Height: ${form.heightFeet}'${form.heightInches}"
- Experience Level: ${expLabel}
- Equipment Access: ${equipLabel}
- Primary Goals: ${goalLabels}
- Days Per Week: ${form.daysPerWeek}
- Session Length: ${form.sessionLength} minutes
${form.timeline ? `- Timeline/Target Date: ${form.timeline}` : ""}
${form.injuries ? `- Injuries/Limitations: ${form.injuries}` : ""}

Create a complete weekly workout plan. For each day include:
1. The workout focus/name
2. A brief warmup
3. The main workout with specific exercises, sets, reps, and rest periods
4. A cooldown

After the weekly plan, include:
- Progressive overload strategy for the next 4-8 weeks
- Key nutrition tips aligned with their goals (brief, actionable)
- Recovery recommendations

Format with clear headers using markdown. Make it motivating but professional. Be specific with exercise names - no vague descriptions. Include tempo recommendations where relevant for their experience level.`;

    try {
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          stream: true,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan. Please try again.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                setPlan((prev) => prev + parsed.delta.text);
              }
            } catch {}
          }
        }
      }

      setStreamDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements = [];
    let listBuffer = [];
    let listType = null;

    const flushList = () => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} style={styles.mdList}>
            {listBuffer.map((item, i) => (
              <li key={i} style={styles.mdListItem}>
                {formatInline(item)}
              </li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    const formatInline = (t) => {
      const parts = [];
      let remaining = t;
      let key = 0;
      while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        if (boldMatch) {
          const idx = remaining.indexOf(boldMatch[0]);
          if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
          parts.push(
            <strong key={key++} style={{ color: "var(--accent)" }}>
              {boldMatch[1]}
            </strong>
          );
          remaining = remaining.slice(idx + boldMatch[0].length);
        } else {
          parts.push(<span key={key++}>{remaining}</span>);
          break;
        }
      }
      return parts;
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={i} style={styles.mdH3}>
            {formatInline(trimmed.slice(4))}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={i} style={styles.mdH2}>
            {formatInline(trimmed.slice(3))}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={i} style={styles.mdH1}>
            {formatInline(trimmed.slice(2))}
          </h1>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        listBuffer.push(trimmed.slice(2));
      } else if (/^\d+\.\s/.test(trimmed)) {
        listBuffer.push(trimmed.replace(/^\d+\.\s/, ""));
      } else if (trimmed === "---" || trimmed === "***") {
        flushList();
        elements.push(<hr key={i} style={styles.mdHr} />);
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={i} style={styles.mdP}>
            {formatInline(trimmed)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  const progressWidth = `${((step + 1) / 4) * 100}%`;

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a0f;
          --surface: #12121a;
          --surface2: #1a1a26;
          --border: #2a2a3a;
          --text: #e8e8f0;
          --text2: #8888a0;
          --accent: #ff6b35;
          --accent2: #ff8f65;
          --accent-glow: rgba(255, 107, 53, 0.15);
          --success: #22c55e;
          --radius: 12px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .mobile-sticky-back { position: static; }
        @media (max-width: 768px) {
          .mobile-sticky-back {
            position: sticky;
            top: 8px;
            z-index: 20;
          }
          .workout-form-grid {
            grid-template-columns: 1fr !important;
          }
          .workout-goal-grid {
            grid-template-columns: 1fr !important;
          }
          .workout-height-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .workout-height-row input {
            width: 100% !important;
            min-width: 0 !important;
            flex: none !important;
          }
          .workout-toggle-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .workout-toggle-row > button {
            width: 100% !important;
            flex: none !important;
            min-width: 0 !important;
          }
          .workout-card {
            padding: 20px 16px !important;
          }
          .workout-step-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .workout-nav-row {
            flex-direction: column-reverse !important;
            align-items: stretch !important;
          }
          .workout-nav-spacer {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="mobile-sticky-back"
        style={{
          marginBottom: 12,
          padding: "8px 6px",
          borderRadius: 10,
          background: "rgba(10,10,15,0.72)",
          backdropFilter: "blur(8px)",
          width: "fit-content",
        }}
      >
        <Link
          to="/"
          style={{
            color: "rgba(255,143,101,0.95)",
            textDecoration: "none",
            fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            letterSpacing: 0.2,
          }}
        >
          ← Back to Home
        </Link>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <img
            src={`data:image/png;base64,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`}
            alt="Elite Performance"
            style={styles.logoImg}
          />
          <div style={styles.logoSub}>AI WORKOUT ARCHITECT</div>
        </div>
        {step < 3 && (
          <div style={styles.progressWrap}>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressBar, width: progressWidth }} />
            </div>
            <div style={styles.stepLabels}>
              {["Profile", "Goals", "Schedule", "Plan"].map((label, i) => (
                <span key={i} style={{ ...styles.stepLabel, color: i <= step ? "var(--accent)" : "var(--text2)" }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step 0: Basics */}
      {step === 0 && (
        <div className="workout-card" style={styles.card}>
          <h2 style={styles.cardTitle}>Tell us about yourself</h2>
          <p style={styles.cardDesc}>Basic info to personalize your plan.</p>
          <div className="workout-form-grid" style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="32"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Weight (lbs)</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => update("weight", e.target.value)}
                placeholder="185"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Height</label>
              <div className="workout-height-row" style={{ display: "flex", gap: 8, minWidth: 0 }}>
                <input
                  type="number"
                  value={form.heightFeet}
                  onChange={(e) => update("heightFeet", e.target.value)}
                  placeholder="5"
                  style={{ ...styles.input, flex: 1 }}
                />
                <span style={{ color: "var(--text2)", alignSelf: "center", fontFamily: "Outfit" }}>ft</span>
                <input
                  type="number"
                  value={form.heightInches}
                  onChange={(e) => update("heightInches", e.target.value)}
                  placeholder="10"
                  style={{ ...styles.input, flex: 1 }}
                />
                <span style={{ color: "var(--text2)", alignSelf: "center", fontFamily: "Outfit" }}>in</span>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Sex</label>
              <div style={styles.toggleRow}>
                {["Male", "Female"].map((s) => (
                  <button
                    key={s}
                    onClick={() => update("sex", s)}
                    style={form.sex === s ? styles.toggleActive : styles.toggle}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Injuries or limitations (optional)</label>
            <input
              type="text"
              value={form.injuries}
              onChange={(e) => update("injuries", e.target.value)}
              placeholder="e.g., bad left knee, lower back issues"
              style={styles.input}
            />
          </div>
        </div>
      )}

      {/* Step 1: Goals */}
      {step === 1 && (
        <div className="workout-card" style={styles.card}>
          <h2 style={styles.cardTitle}>What's your mission?</h2>
          <p style={styles.cardDesc}>Select up to 2 primary goals.</p>
          <div className="workout-goal-grid" style={styles.goalGrid}>
            {GOAL_OPTIONS.map((g) => {
              const active = form.goals.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  style={active ? styles.goalCardActive : styles.goalCard}
                >
                  <span style={{ fontSize: 28 }}>{g.icon}</span>
                  <span style={styles.goalLabel}>{g.label}</span>
                  <span style={styles.goalDesc}>{g.desc}</span>
                </button>
              );
            })}
          </div>

          <div style={{ ...styles.field, marginTop: 24 }}>
            <label style={styles.label}>Experience Level</label>
            <div className="workout-toggle-row" style={styles.toggleRow}>
              {EXPERIENCE_OPTIONS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => update("experience", e.id)}
                  style={form.experience === e.id ? styles.toggleActive : styles.toggle}
                >
                  <div>{e.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.6 }}>{e.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...styles.field, marginTop: 16 }}>
            <label style={styles.label}>Equipment Access</label>
            <div className="workout-toggle-row" style={styles.toggleRow}>
              {EQUIPMENT_OPTIONS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => update("equipment", e.id)}
                  style={form.equipment === e.id ? styles.toggleActive : styles.toggle}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Schedule */}
      {step === 2 && (
        <div className="workout-card" style={styles.card}>
          <h2 style={styles.cardTitle}>Build your schedule</h2>
          <p style={styles.cardDesc}>How much time can you commit?</p>

          <div style={{ ...styles.field, marginBottom: 24 }}>
            <label style={styles.label}>Days per week</label>
            <div className="workout-toggle-row" style={styles.toggleRow}>
              {DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => update("daysPerWeek", d)}
                  style={form.daysPerWeek === d ? styles.toggleActive : styles.toggle}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...styles.field, marginBottom: 24 }}>
            <label style={styles.label}>Session length</label>
            <div className="workout-toggle-row" style={styles.toggleRow}>
              {SESSION_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => update("sessionLength", s.id)}
                  style={form.sessionLength === s.id ? styles.toggleActive : styles.toggle}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Target date or timeline (optional)</label>
            <input
              type="text"
              value={form.timeline}
              onChange={(e) => update("timeline", e.target.value)}
              placeholder="e.g., Beach trip in 12 weeks, marathon Oct 15"
              style={styles.input}
            />
          </div>
        </div>
      )}

      {/* Step 3: Plan Output */}
      {step === 3 && (
        <div className="workout-card" style={styles.card}>
          <div className="workout-step-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, minWidth: 0 }}>
            <h2 style={styles.cardTitle}>
              {loading ? "Building your plan..." : streamDone ? "Your Custom Plan" : "Generating..."}
            </h2>
            {streamDone && (
              <button
                onClick={() => {
                  setStep(0);
                  setPlan("");
                  setStreamDone(false);
                }}
                style={styles.resetBtn}
              >
                Start Over
              </button>
            )}
          </div>

          {loading && !plan && (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingBar} />
              <p style={{ color: "var(--text2)", fontFamily: "Outfit", fontSize: 14 }}>
                Analyzing your profile and designing your program...
              </p>
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <p>{error}</p>
              <button onClick={generatePlan} style={styles.retryBtn}>
                Try Again
              </button>
            </div>
          )}

          {plan && (
            <div ref={planRef} style={styles.planOutput}>
              {renderMarkdown(plan)}
              {loading && <span style={styles.cursor}>▊</span>}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="workout-nav-row" style={styles.navRow}>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} style={styles.backBtn}>
              ← Back
            </button>
          )}
          <div className="workout-nav-spacer" style={{ flex: 1 }} />
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              style={canProceed() ? styles.nextBtn : styles.nextBtnDisabled}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={generatePlan}
              disabled={!canProceed()}
              style={canProceed() ? styles.generateBtn : styles.nextBtnDisabled}
            >
              ⚡ Generate My Plan
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    background: "var(--bg)",
    color: "var(--text)",
    minHeight: "100vh",
    padding: "24px 16px",
    maxWidth: 640,
    margin: "0 auto",
    overflowX: "hidden",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: 32,
  },
  logoRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  logoImg: {
    height: 50,
    width: "auto",
  },
  logoSub: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 4,
    color: "var(--accent)",
    textAlign: "center",
  },
  progressWrap: {
    marginTop: 8,
  },
  progressTrack: {
    height: 3,
    background: "var(--surface2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, var(--accent), var(--accent2))",
    borderRadius: 4,
    transition: "width 0.4s ease",
  },
  stepLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: "uppercase",
    transition: "color 0.3s",
  },

  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: 28,
    animation: "fadeUp 0.4s ease",
    overflow: "hidden",
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
    color: "var(--text)",
  },
  cardDesc: {
    fontSize: 14,
    color: "var(--text2)",
    marginBottom: 24,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 16,
    minWidth: 0,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "var(--text2)",
  },
  input: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "var(--text)",
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
  },
  toggleRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    minWidth: 0,
  },
  toggle: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "10px 16px",
    color: "var(--text2)",
    fontSize: 13,
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s",
    flex: "1 1 auto",
    minWidth: 80,
    textAlign: "center",
  },
  toggleActive: {
    background: "var(--accent-glow)",
    border: "1px solid var(--accent)",
    borderRadius: 8,
    padding: "10px 16px",
    color: "var(--accent)",
    fontSize: 13,
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
    fontWeight: 600,
    flex: "1 1 auto",
    minWidth: 80,
    textAlign: "center",
  },

  goalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    minWidth: 0,
  },
  goalCard: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "16px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Outfit', sans-serif",
    color: "var(--text)",
  },
  goalCardActive: {
    background: "var(--accent-glow)",
    border: "1px solid var(--accent)",
    borderRadius: 10,
    padding: "16px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    color: "var(--accent)",
    boxShadow: "0 0 20px rgba(255, 107, 53, 0.1)",
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: 600,
  },
  goalDesc: {
    fontSize: 10,
    opacity: 0.6,
  },

  navRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "12px 24px",
    color: "var(--text2)",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
    fontWeight: 500,
  },
  nextBtn: {
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    border: "none",
    borderRadius: 8,
    padding: "12px 32px",
    color: "#0a0a0f",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  nextBtnDisabled: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "12px 32px",
    color: "var(--text2)",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    cursor: "not-allowed",
    fontWeight: 500,
    opacity: 0.5,
  },
  generateBtn: {
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    border: "none",
    borderRadius: 8,
    padding: "14px 36px",
    color: "#0a0a0f",
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: 1,
    boxShadow: "0 0 30px rgba(255, 107, 53, 0.25)",
  },

  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: 40,
  },
  loadingBar: {
    width: 200,
    height: 3,
    borderRadius: 4,
    background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    padding: 20,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 12,
    background: "var(--accent)",
    border: "none",
    borderRadius: 6,
    padding: "8px 20px",
    color: "#0a0a0f",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
  },
  resetBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "6px 14px",
    color: "var(--text2)",
    fontSize: 12,
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
  },

  planOutput: {
    maxHeight: 500,
    overflowY: "auto",
    padding: "8px 0",
    lineHeight: 1.7,
  },
  cursor: {
    color: "var(--accent)",
    animation: "pulse 0.8s infinite",
    fontSize: 16,
  },

  mdH1: {
    fontSize: 22,
    fontWeight: 800,
    color: "var(--accent)",
    margin: "24px 0 12px",
    letterSpacing: 0.5,
  },
  mdH2: {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--accent2)",
    margin: "20px 0 10px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: 6,
  },
  mdH3: {
    fontSize: 15,
    fontWeight: 600,
    color: "var(--text)",
    margin: "16px 0 8px",
  },
  mdP: {
    fontSize: 14,
    color: "var(--text)",
    marginBottom: 8,
    lineHeight: 1.7,
  },
  mdList: {
    listStyle: "none",
    paddingLeft: 0,
    marginBottom: 12,
  },
  mdListItem: {
    fontSize: 14,
    color: "var(--text)",
    padding: "3px 0 3px 16px",
    position: "relative",
    lineHeight: 1.6,
    borderLeft: "2px solid var(--border)",
    marginBottom: 2,
  },
  mdHr: {
    border: "none",
    borderTop: "1px solid var(--border)",
    margin: "20px 0",
  },
};
