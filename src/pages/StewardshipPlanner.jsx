import { useState } from "react";

// ─── Shared Styles ────────────────────────────────────────────────────────────
const labelStyle = {
  display: "block", fontSize: "11px", fontWeight: 700,
  letterSpacing: "0.09em", textTransform: "uppercase",
  color: "#f0c040", marginBottom: "8px",
};
const subStyle = { fontSize: "12px", color: "rgba(255,255,255,0.38)", marginTop: -6, marginBottom: 10 };
const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
  color: "#fff", padding: "12px 16px", fontSize: "15px",
  outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
};
const prefixWrap = { position: "relative", width: "100%" };
const prefixSign = {
  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
  color: "rgba(255,255,255,0.35)", fontSize: "15px", pointerEvents: "none",
  fontFamily: "'DM Sans', sans-serif",
};
const prefixInput = { ...inputStyle, paddingLeft: 26 };
const chipBase = {
  padding: "9px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600,
  cursor: "pointer", border: "1.5px solid rgba(255,255,255,0.15)",
  background: "transparent", color: "rgba(255,255,255,0.55)",
  transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
};
const chipActive = { ...chipBase, background: "#f0c040", color: "#1a1200", border: "1.5px solid #f0c040" };

function Chip({ label, active, onClick }) { return <button style={active ? chipActive : chipBase} onClick={onClick}>{label}</button>; }

function Field({ label, sub, children }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <label style={labelStyle}>{label}</label>
      {sub && <p style={subStyle}>{sub}</p>}
      {children}
    </div>
  );
}

function MoneyInput({ value, onChange, placeholder = "0" }) {
  return (
    <div style={prefixWrap}>
      <span style={prefixSign}>$</span>
      <input style={prefixInput} type="number" min="0" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function OptionCard({ label, sub, active, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "100%", background: active ? "rgba(240,192,64,0.1)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${active ? "#f0c040" : "rgba(255,255,255,0.08)"}`, borderRadius: "12px", padding: "13px 16px", color: "#fff", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 8, transition: "all 0.15s" }}>
      <div style={{ fontWeight: 700, fontSize: "14px", color: active ? "#f0c040" : "#fff" }}>{label}</div>
      {sub && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", marginTop: 3 }}>{sub}</div>}
    </button>
  );
}

function DebtRow({ debt, onUpdate, onRemove }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "12px", padding: "14px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: "13px", color: "#f0c040" }}>{debt.type}</span>
        <button onClick={onRemove} style={{ background: "none", border: "none", color: "rgba(255,100,100,0.6)", cursor: "pointer", fontSize: "16px", padding: 0 }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Balance</div>
          <MoneyInput value={debt.balance} onChange={v => onUpdate({ ...debt, balance: v })} placeholder="5,000" />
        </div>
        <div style={{ width: 90 }}>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>APR %</div>
          <input style={{ ...inputStyle, paddingLeft: 12 }} type="number" min="0" max="100" step="0.1" placeholder="18.9" value={debt.apr} onChange={e => onUpdate({ ...debt, apr: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(240,192,64,0.12)", borderRadius: "14px", marginBottom: "10px", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", color: "#fff", padding: "15px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px" }}>
        <span style={{ color: "#f0c040" }}>{title}</span>
        <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.3)", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
      </button>
      {open && <div style={{ padding: "0 18px 16px", color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{content}</div>}
    </div>
  );
}

function ScoreRing({ score }) {
  const color = score >= 75 ? "#4ade80" : score >= 50 ? "#f0c040" : score >= 30 ? "#fb923c" : "#f87171";
  const label = score >= 75 ? "Strong" : score >= 50 ? "Building" : score >= 30 ? "Needs Work" : "Critical";
  const r = 52, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 70 70)" style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x="70" y="65" textAnchor="middle" fill={color} fontSize="28" fontWeight="800" fontFamily="'Barlow Condensed', sans-serif">{score}</text>
        <text x="70" y="84" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontFamily="'DM Sans', sans-serif" fontWeight="600">/100</text>
      </svg>
      <div style={{ fontSize: "18px", fontWeight: 800, color, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em", marginTop: -4 }}>{label}</div>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Financial Health Score</div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "#f0c040" }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33`, borderRadius: "14px", padding: "16px 14px", flex: 1, minWidth: "130px" }}>
      <div style={{ fontSize: "22px", fontWeight: 800, color, fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.09em", marginTop: 2 }}>{sub}</div>}
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 5 }}>{label}</div>
    </div>
  );
}

// ─── Debt Types ───────────────────────────────────────────────────────────────
const DEBT_TYPES = ["Credit Card", "Student Loan", "Car Loan", "Medical", "Personal Loan", "Other"];

// ─── Empty Form ───────────────────────────────────────────────────────────────
const EMPTY = {
  // Income
  monthlyIncome: "",
  incomeType: "",
  // Fixed Expenses
  housing: "", carPayment: "", insurance: "", utilities: "", subscriptions: "", otherFixed: "",
  // Variable Expenses
  groceries: "", diningOut: "", entertainment: "", clothing: "", otherVariable: "",
  // Savings
  emergencyFund: "", emergencyMonths: "",
  retirementContrib: "", hasInvestments: "",
  // Debts
  debts: [],
  // Goals
  financialGoals: [],
  timeline: "",
  additionalContext: "",
};

const GOALS = ["Get Out of Debt", "Build Emergency Fund", "Buy a Home", "Save for Retirement", "Grow Investments", "Start a Business", "Financial Freedom", "Kids' Education"];

export default function StewardshipPlanner() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [addingDebt, setAddingDebt] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleGoal = (g) => {
    setForm(p => ({ ...p, financialGoals: p.financialGoals.includes(g) ? p.financialGoals.filter(x => x !== g) : [...p.financialGoals, g] }));
  };

  const addDebt = (type) => {
    setForm(p => ({ ...p, debts: [...p.debts, { type, balance: "", apr: "", id: Date.now() }] }));
    setAddingDebt(false);
  };

  const updateDebt = (id, updated) => setForm(p => ({ ...p, debts: p.debts.map(d => d.id === id ? updated : d) }));
  const removeDebt = (id) => setForm(p => ({ ...p, debts: p.debts.filter(d => d.id !== id) }));

  const totalFixed = () => ["housing", "carPayment", "insurance", "utilities", "subscriptions", "otherFixed"].reduce((s, k) => s + (parseFloat(form[k]) || 0), 0);
  const totalVariable = () => ["groceries", "diningOut", "entertainment", "clothing", "otherVariable"].reduce((s, k) => s + (parseFloat(form[k]) || 0), 0);
  const totalDebt = () => form.debts.reduce((s, d) => s + (parseFloat(d.balance) || 0), 0);

  const canAdvance = () => {
    if (step === 0) return form.monthlyIncome && form.incomeType;
    if (step === 1) return form.housing;
    if (step === 2) return true;
    if (step === 3) return form.financialGoals.length > 0 && form.timeline;
    return false;
  };

  const buildPrompt = () => {
    const income = parseFloat(form.monthlyIncome) || 0;
    const fixed = totalFixed();
    const variable = totalVariable();
    const totalExp = fixed + variable;
    const leftover = income - totalExp;
    const debtTotal = totalDebt();
    const dtiRatio = income > 0 ? ((fixed + variable) / income * 100).toFixed(1) : "N/A";
    const savingsRate = income > 0 ? ((parseFloat(form.retirementContrib) || 0) / income * 100).toFixed(1) : "0";

    const debtList = form.debts.length
      ? form.debts.map(d => `  - ${d.type}: $${d.balance} balance at ${d.apr}% APR`).join("\n")
      : "  None reported";

    return `You are a certified financial planner and stewardship coach specializing in helping people build lasting financial health. Analyze this person's financial state and provide an honest, encouraging, actionable assessment.

FINANCIAL SNAPSHOT:
- Monthly Take-Home Income: $${income.toLocaleString()} (${form.incomeType})
- Total Monthly Fixed Expenses: $${fixed.toLocaleString()}
  • Housing/Rent/Mortgage: $${form.housing || 0}
  • Car Payment: $${form.carPayment || 0}
  • Insurance: $${form.insurance || 0}
  • Utilities: $${form.utilities || 0}
  • Subscriptions: $${form.subscriptions || 0}
  • Other Fixed: $${form.otherFixed || 0}
- Total Monthly Variable Expenses: $${variable.toLocaleString()}
  • Groceries: $${form.groceries || 0}
  • Dining Out: $${form.diningOut || 0}
  • Entertainment: $${form.entertainment || 0}
  • Clothing: $${form.clothing || 0}
  • Other Variable: $${form.otherVariable || 0}
- Monthly Leftover After Expenses: $${leftover.toLocaleString()}
- Expense-to-Income Ratio: ${dtiRatio}%
- Emergency Fund: $${form.emergencyFund || 0} (${form.emergencyMonths || "unknown"} months of expenses)
- Monthly Retirement Contribution: $${form.retirementContrib || 0} (${savingsRate}% of income)
- Has Investments: ${form.hasInvestments || "No"}
- Total Debt: $${debtTotal.toLocaleString()}
- Debts:
${debtList}
- Financial Goals: ${form.financialGoals.join(", ")}
- Timeline: ${form.timeline}
- Additional Context: ${form.additionalContext || "None"}

Score this person's financial health 0-100 based on: debt load, savings rate, expense ratio, emergency fund coverage, and progress toward goals.

Respond ONLY with valid JSON, no markdown:
{
  "score": number (0-100),
  "summary": "2-3 honest but encouraging sentences about their overall financial picture",
  "monthlyLeftover": number,
  "expenseRatio": "${dtiRatio}",
  "savingsRate": "${savingsRate}",
  "totalDebt": ${debtTotal},
  "wins": ["something they are doing well 1", "win 2", "win 3"],
  "urgentActions": "2-3 sentences on the 1-2 most critical things to fix immediately",
  "debtStrategy": "3-4 sentences on the best debt payoff strategy for their specific debts (avalanche vs snowball with reasoning)",
  "budgetAdjustments": "3-4 sentences identifying specific spending areas to trim and where to redirect that money",
  "savingsRoadmap": "3-4 sentences on building emergency fund and savings toward their goals with specific monthly targets",
  "goalTimeline": "3-4 sentences on realistic timelines and milestones for each of their stated goals given their current numbers",
  "topTips": ["specific actionable tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]
}`;
  };

  const generate = async () => {
    setLoading(true);
    setStep(4);
    try {
      const res = await fetch("/.netlify/functions/anthropic-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(errBody || `Request failed (${res.status})`);
      }
      const data = await res.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "{}";
      const cleaned = text.replace(/```json|```/g, "").trim();
      try {
        setResult(JSON.parse(cleaned));
      } catch {
        setResult({ error: "Could not read the assessment. Please try again." });
      }
    } catch (e) {
      setResult({
        error: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
    }
    setLoading(false);
  };

  const reset = () => { setStep(0); setResult(null); setForm({ ...EMPTY }); };

  const STEPS = ["Income", "Expenses", "Savings & Debt", "Goals"];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0f0d00 0%, #1a1500 50%, #120f00 100%)", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(240,192,64,0.1)", padding: "18px 22px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #f0c040, #d4a017)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>💰</div>
        <div>
          <div style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "0.02em", fontFamily: "'Barlow Condensed', sans-serif" }}>ELITE PERFORMANCE</div>
          <div style={{ fontSize: "11px", color: "#f0c040", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Stewardship Assessment</div>
        </div>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div style={{ padding: "18px 22px 0" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: "3px", borderRadius: "2px", background: i <= step ? "#f0c040" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
                <div style={{ fontSize: "9px", color: i <= step ? "#f0c040" : "rgba(255,255,255,0.22)", marginTop: 5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: "540px", margin: "0 auto", padding: "26px 20px 80px" }}>

        {/* ── STEP 0: Income ─────────────────────────────────────── */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: "30px", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>Your Income</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", marginBottom: 26 }}>Everything starts with knowing what's coming in.</p>

            <Field label="Monthly Take-Home Pay" sub="After taxes — what actually hits your account">
              <MoneyInput value={form.monthlyIncome} onChange={v => set("monthlyIncome", v)} placeholder="5,000" />
            </Field>

            <Field label="Income Type">
              {[["Salaried / W-2", "Consistent paycheck each month"], ["Hourly", "Based on hours worked"], ["Self-Employed / 1099", "Variable month to month"], ["Multiple Streams", "Salary + side income or multiple sources"]].map(([v, s]) => (
                <OptionCard key={v} label={v} sub={s} active={form.incomeType === v} onClick={() => set("incomeType", v)} />
              ))}
            </Field>
          </div>
        )}

        {/* ── STEP 1: Expenses ───────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "30px", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>Your Expenses</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", marginBottom: 26 }}>Be as accurate as you can — this is your state of the union.</p>

            <div style={{ background: "rgba(240,192,64,0.06)", border: "1px solid rgba(240,192,64,0.15)", borderRadius: "12px", padding: "12px 16px", marginBottom: 24 }}>
              <div style={{ fontSize: "11px", color: "#f0c040", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Fixed Monthly (same every month)</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Rent, car payments, subscriptions — things you can predict</div>
            </div>

            <Field label="Housing (Rent or Mortgage)">
              <MoneyInput value={form.housing} onChange={v => set("housing", v)} placeholder="1,400" />
            </Field>
            <Field label="Car Payment">
              <MoneyInput value={form.carPayment} onChange={v => set("carPayment", v)} placeholder="0" />
            </Field>
            <Field label="Insurance (health, car, life, etc.)">
              <MoneyInput value={form.insurance} onChange={v => set("insurance", v)} placeholder="300" />
            </Field>
            <Field label="Utilities (electric, water, internet, phone)">
              <MoneyInput value={form.utilities} onChange={v => set("utilities", v)} placeholder="200" />
            </Field>
            <Field label="Subscriptions (streaming, gym, apps, etc.)">
              <MoneyInput value={form.subscriptions} onChange={v => set("subscriptions", v)} placeholder="80" />
            </Field>
            <Field label="Other Fixed Expenses">
              <MoneyInput value={form.otherFixed} onChange={v => set("otherFixed", v)} placeholder="0" />
            </Field>

            <div style={{ background: "rgba(240,192,64,0.06)", border: "1px solid rgba(240,192,64,0.15)", borderRadius: "12px", padding: "12px 16px", marginBottom: 24 }}>
              <div style={{ fontSize: "11px", color: "#f0c040", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Variable Monthly (fluctuates)</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Use your monthly average if it changes</div>
            </div>

            <Field label="Groceries">
              <MoneyInput value={form.groceries} onChange={v => set("groceries", v)} placeholder="400" />
            </Field>
            <Field label="Dining Out & Coffee">
              <MoneyInput value={form.diningOut} onChange={v => set("diningOut", v)} placeholder="200" />
            </Field>
            <Field label="Entertainment & Fun">
              <MoneyInput value={form.entertainment} onChange={v => set("entertainment", v)} placeholder="100" />
            </Field>
            <Field label="Clothing & Shopping">
              <MoneyInput value={form.clothing} onChange={v => set("clothing", v)} placeholder="100" />
            </Field>
            <Field label="Other Variable Expenses">
              <MoneyInput value={form.otherVariable} onChange={v => set("otherVariable", v)} placeholder="0" />
            </Field>

            {/* Running Total */}
            {form.monthlyIncome && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px 18px", marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Monthly Income</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#4ade80" }}>${parseFloat(form.monthlyIncome).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Total Expenses</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#f87171" }}>-${(totalFixed() + totalVariable()).toLocaleString()}</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700 }}>Monthly Leftover</span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: (parseFloat(form.monthlyIncome) - totalFixed() - totalVariable()) >= 0 ? "#4ade80" : "#f87171" }}>
                    ${(parseFloat(form.monthlyIncome) - totalFixed() - totalVariable()).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Savings & Debt ──────────────────────────────── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "30px", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>Savings & Debt</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", marginBottom: 26 }}>The full picture of where you stand today.</p>

            <Field label="Emergency Fund Balance">
              <MoneyInput value={form.emergencyFund} onChange={v => set("emergencyFund", v)} placeholder="2,000" />
            </Field>

            <Field label="How Many Months of Expenses Does That Cover?">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Less than 1", "1 month", "2 months", "3 months", "4–5 months", "6+ months"].map(m => (
                  <Chip key={m} label={m} active={form.emergencyMonths === m} onClick={() => set("emergencyMonths", m)} />
                ))}
              </div>
            </Field>

            <Field label="Monthly Retirement Contribution" sub="401k, IRA, Roth — combined total">
              <MoneyInput value={form.retirementContrib} onChange={v => set("retirementContrib", v)} placeholder="200" />
            </Field>

            <Field label="Do You Have Any Investments?" sub="Stocks, mutual funds, real estate, crypto, etc.">
              <div style={{ display: "flex", gap: 8 }}>
                {["Yes", "No", "Just Starting"].map(o => <Chip key={o} label={o} active={form.hasInvestments === o} onClick={() => set("hasInvestments", o)} />)}
              </div>
            </Field>

            {/* Debts */}
            <Field label="Current Debts" sub="Add each debt separately for the best payoff strategy">
              {form.debts.map(d => (
                <DebtRow key={d.id} debt={d} onUpdate={updated => updateDebt(d.id, updated)} onRemove={() => removeDebt(d.id)} />
              ))}

              {!addingDebt ? (
                <button onClick={() => setAddingDebt(true)} style={{ width: "100%", background: "rgba(240,192,64,0.06)", border: "1.5px dashed rgba(240,192,64,0.3)", borderRadius: "12px", padding: "14px", color: "#f0c040", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  + Add a Debt
                </button>
              ) : (
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px" }}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Select Debt Type</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {DEBT_TYPES.map(t => (
                      <button key={t} onClick={() => addDebt(t)} style={{ ...chipBase }}>{t}</button>
                    ))}
                  </div>
                  <button onClick={() => setAddingDebt(false)} style={{ marginTop: 10, background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                </div>
              )}
            </Field>
          </div>
        )}

        {/* ── STEP 3: Goals ──────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "30px", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>Your Goals</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", marginBottom: 26 }}>What does winning look like for you?</p>

            <Field label="Financial Goals" sub="Select all that apply">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {GOALS.map(g => (
                  <button key={g} onClick={() => toggleGoal(g)} style={{ padding: "9px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", background: form.financialGoals.includes(g) ? "#f0c040" : "transparent", color: form.financialGoals.includes(g) ? "#1a1200" : "rgba(255,255,255,0.55)", border: form.financialGoals.includes(g) ? "1.5px solid #f0c040" : "1.5px solid rgba(255,255,255,0.15)" }}>
                    {g}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Timeline to Reach Your Goals">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["6 Months", "1 Year", "2–3 Years", "5 Years", "10+ Years"].map(t => <Chip key={t} label={t} active={form.timeline === t} onClick={() => set("timeline", t)} />)}
              </div>
            </Field>

            <Field label="Anything Else We Should Know?" sub="Optional — upcoming big expenses, life changes, context">
              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: "vertical", lineHeight: 1.6 }}
                placeholder="e.g. Having a baby in 6 months, planning to buy a house, recently lost a job..."
                value={form.additionalContext}
                onChange={e => set("additionalContext", e.target.value)}
              />
            </Field>
          </div>
        )}

        {/* ── STEP 4: Results ────────────────────────────────────── */}
        {step === 4 && (
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "70px 0" }}>
                <div style={{ fontSize: "44px", marginBottom: 20, display: "inline-block", animation: "pulse 1.2s ease-in-out infinite" }}>💰</div>
                <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:0.6}}`}</style>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#f0c040", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>ANALYZING YOUR FINANCES...</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.32)", marginTop: 8 }}>Building your personalized assessment</div>
              </div>
            ) : result?.error ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#ff7070" }}>{result.error}</div>
            ) : result ? (
              <div>
                {/* Score */}
                <ScoreRing score={result.score || 0} />

                {/* Summary */}
                <div style={{ background: "rgba(240,192,64,0.06)", border: "1px solid rgba(240,192,64,0.15)", borderRadius: "14px", padding: "16px 18px", marginBottom: 20 }}>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.72)", lineHeight: 1.78, margin: 0 }}>{result.summary}</p>
                </div>

                {/* Stat Cards */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                  <StatCard label="Monthly Leftover" value={`$${(result.monthlyLeftover || 0).toLocaleString()}`} color="#4ade80" />
                  <StatCard label="Expense Ratio" value={`${result.expenseRatio}%`} sub="of income" color={parseFloat(result.expenseRatio) < 80 ? "#4ade80" : parseFloat(result.expenseRatio) < 95 ? "#f0c040" : "#f87171"} />
                  <StatCard label="Total Debt" value={`$${(result.totalDebt || 0).toLocaleString()}`} color={result.totalDebt > 0 ? "#fb923c" : "#4ade80"} />
                </div>

                {/* Wins */}
                {result.wins && (
                  <div style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "14px", padding: "16px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#4ade80", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 12 }}>✅ What You're Doing Right</div>
                    {result.wins.map((w, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                        <span style={{ color: "#4ade80", fontSize: "13px" }}>→</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Top Tips */}
                {result.topTips && (
                  <div style={{ background: "rgba(240,192,64,0.05)", border: "1px solid rgba(240,192,64,0.15)", borderRadius: "14px", padding: "16px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#f0c040", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 12 }}>⚡ Top 5 Action Items</div>
                    {result.topTips.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                        <span style={{ color: "#f0c040", fontWeight: 800, fontSize: "13px", minWidth: 18 }}>{i + 1}.</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: 1.65 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Section title="🚨  Urgent Actions" content={result.urgentActions} />
                <Section title="💳  Debt Payoff Strategy" content={result.debtStrategy} />
                <Section title="✂️  Budget Adjustments" content={result.budgetAdjustments} />
                <Section title="🏦  Savings Roadmap" content={result.savingsRoadmap} />
                <Section title="🎯  Goal Timeline & Milestones" content={result.goalTimeline} />

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 16px", marginTop: 18, marginBottom: 10 }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, margin: 0 }}>
                    This assessment is for educational purposes. For personalized financial advice, consult a certified financial planner.
                  </p>
                </div>

                <button onClick={reset} style={{ width: "100%", marginTop: 8, padding: "13px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  ← Start Over
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Nav */}
        {step < 4 && (
          <>
            <button
              onClick={() => step < 3 ? setStep(s => s + 1) : generate()}
              disabled={!canAdvance()}
              style={{ width: "100%", marginTop: 30, padding: "16px", borderRadius: "12px", background: canAdvance() ? "linear-gradient(135deg, #f0c040, #d4a017)" : "rgba(255,255,255,0.07)", border: "none", color: canAdvance() ? "#1a1200" : "rgba(255,255,255,0.2)", fontSize: "15px", fontWeight: 800, cursor: canAdvance() ? "pointer" : "not-allowed", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em", transition: "all 0.2s" }}
            >
              {step === 3 ? "⚡ GET MY FINANCIAL ASSESSMENT" : "CONTINUE →"}
            </button>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ width: "100%", marginTop: 8, padding: "11px", borderRadius: "12px", background: "transparent", border: "none", color: "rgba(255,255,255,0.28)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ← Back
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
