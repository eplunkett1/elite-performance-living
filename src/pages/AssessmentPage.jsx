import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { Link } from "react-router-dom";
import { submitEmailSignup } from "../lib/emailSignup.js";

const LOGO_BASE64 = "data:image/png;base64,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";

const PILLARS = [
  {
    key: "clarity", name: "Clarity & Plan", icon: "🎯", color: "#ff6b35",
    short: [
      "I have clear, written goals for the next 1-3 years",
      "I regularly review and adjust my plans based on progress",
      "My daily actions align with my long-term vision",
    ],
    full: [
      "I have clear, written goals for the next 1-3 years",
      "I regularly review and adjust my plans based on progress",
      "My daily actions align with my long-term vision",
      "I can articulate my personal mission or purpose clearly",
      "I break big goals into actionable weekly and monthly milestones",
      "I have a system for prioritizing tasks and decisions",
      "I set boundaries that protect my time for high-priority work",
      "I reflect on lessons learned after completing major goals",
      "I have a clear vision for where I want to be in 5-10 years",
      "I feel confident in the direction my life is heading",
    ],
  },
  {
    key: "movement", name: "Movement", icon: "🏋️", color: "#ff8f65",
    short: [
      "I engage in intentional physical activity 4+ times per week",
      "I feel energized and strong in my body most days",
      "I incorporate movement throughout my day (walking, stretching, etc.)",
    ],
    full: [
      "I engage in intentional physical activity 4+ times per week",
      "I feel energized and strong in my body most days",
      "I incorporate movement throughout my day (walking, stretching, etc.)",
      "I follow a structured exercise program or routine",
      "I prioritize recovery including sleep, stretching, and rest days",
      "I track my fitness progress and adjust accordingly",
      "I challenge myself physically on a regular basis",
      "I warm up and cool down properly around workouts",
      "I maintain a balance of cardio, strength, and flexibility training",
      "My physical fitness positively impacts my energy and confidence",
    ],
  },
  {
    key: "mental", name: "Mental Strength", icon: "🧠", color: "#4ecdc4",
    short: [
      "I have healthy strategies to manage stress and difficult emotions",
      "I practice mindfulness, meditation, or other mental wellness activities",
      "I maintain a positive outlook and resilient mindset",
    ],
    full: [
      "I have healthy strategies to manage stress and difficult emotions",
      "I practice mindfulness, meditation, or other mental wellness activities",
      "I maintain a positive outlook and resilient mindset",
      "I can identify and process my emotions without being overwhelmed",
      "I seek professional help when I need support",
      "I set healthy emotional boundaries with others",
      "I take regular breaks to recharge and prevent burnout",
      "I practice gratitude or positive reflection consistently",
      "I manage negative self-talk and replace it with constructive thinking",
      "I feel emotionally balanced and stable most of the time",
    ],
  },
  {
    key: "nutrition", name: "Nutrition", icon: "🥗", color: "#45b7d1",
    short: [
      "I eat balanced, nutritious meals most days",
      "I stay well-hydrated throughout the day",
      "I limit processed foods and eat plenty of fruits and vegetables",
    ],
    full: [
      "I eat balanced, nutritious meals most days",
      "I stay well-hydrated throughout the day",
      "I limit processed foods and eat plenty of fruits and vegetables",
      "I plan and prepare meals in advance rather than relying on convenience food",
      "I eat mindfully and avoid frequent overeating or undereating",
      "I understand basic nutrition and how food fuels my body",
      "I limit sugar, alcohol, and other substances that affect my health",
      "I maintain a consistent eating schedule that supports my energy",
      "I listen to my body's hunger and fullness cues",
      "My nutrition habits support my fitness and long-term health goals",
    ],
  },
  {
    key: "connection", name: "Daily Connection", icon: "🤝", color: "#96ceb4",
    short: [
      "I have meaningful conversations or interactions most days",
      "I feel heard, understood, and valued in my relationships",
      "I intentionally create time in my routine to reach out and have deeper conversations with others",
    ],
    full: [
      "I have meaningful conversations or interactions most days",
      "I feel heard, understood, and valued in my relationships",
      "I intentionally create time in my routine to reach out and have deeper conversations with others",
      "I am fully present during conversations rather than distracted",
      "I regularly check in on people I care about",
      "I express appreciation and gratitude to others openly",
      "I initiate plans and gatherings rather than waiting to be invited",
      "I invest in deepening existing relationships, not just maintaining them",
      "I make time for face-to-face connection rather than relying solely on digital communication",
      "I feel a sense of belonging and closeness in my daily interactions",
    ],
  },
  {
    key: "home", name: "Home Life", icon: "🏡", color: "#dda0dd",
    short: [
      "My home feels like a safe, peaceful sanctuary where I can truly be myself",
      "I feel emotionally safe and supported in my home environment and relationships",
      "My living space and home dynamics contribute to my overall well-being and peace of mind",
    ],
    full: [
      "My home feels like a safe, peaceful sanctuary where I can truly be myself",
      "I feel emotionally safe and supported in my home environment and relationships",
      "My living space and home dynamics contribute to my overall well-being and peace of mind",
      "I maintain my living space in a way that reduces stress and promotes calm",
      "I communicate openly and respectfully with those I live with",
      "I feel comfortable expressing my needs in my home environment",
      "I have personal space or time at home to recharge",
      "Conflicts in my home life are resolved constructively",
      "My home routines support healthy habits like sleep and relaxation",
      "I feel a sense of pride and comfort in my living situation",
    ],
  },
  {
    key: "tribe", name: "Tribe", icon: "👥", color: "#ffd93d",
    short: [
      "I have a strong support network I can rely on during challenges",
      "I'm surrounded by people who inspire and encourage my growth",
      "I actively contribute to my community and relationships",
    ],
    full: [
      "I have a strong support network I can rely on during challenges",
      "I'm surrounded by people who inspire and encourage my growth",
      "I actively contribute to my community and relationships",
      "I have at least 2-3 people I can be completely vulnerable with",
      "I regularly evaluate whether my inner circle is lifting me up or holding me back",
      "I invest time and energy into friendships that are mutually beneficial",
      "I seek out mentors, coaches, or advisors for guidance",
      "I am part of a community or group that shares my values",
      "I distance myself from toxic or draining relationships",
      "I celebrate the wins of those closest to me as if they were my own",
    ],
  },
  {
    key: "stewardship", name: "Stewardship", icon: "⚖️", color: "#6bcb77",
    short: [
      "I manage my finances responsibly — budgeting, saving, and planning for the future",
      "I am intentional about how I invest my time and energy into what matters most",
      "I'm confident that my current career or business trajectory will help me achieve my long-term goals",
    ],
    full: [
      "I manage my finances responsibly — budgeting, saving, and planning for the future",
      "I am intentional about how I invest my time and energy into what matters most",
      "I'm confident that my current career or business trajectory will help me achieve my long-term goals",
      "I have an emergency fund and am actively saving for the future",
      "I regularly evaluate how I spend my time and eliminate waste",
      "I treat my career, resources, and opportunities as things to steward well, not take for granted",
      "I make financial decisions aligned with my values and long-term vision",
      "I invest in my own growth and development as a priority",
      "I am generous with my time, talent, and resources in ways that are sustainable",
      "I feel a sense of responsibility to leave things better than I found them",
    ],
  },
  {
    key: "learning", name: "Learning", icon: "📚", color: "#ee6c4d",
    short: [
      "I actively seek new knowledge and skills regularly",
      "I read, listen to podcasts, or take courses to expand my knowledge",
      "I apply what I learn and challenge myself to grow",
    ],
    full: [
      "I actively seek new knowledge and skills regularly",
      "I read, listen to podcasts, or take courses to expand my knowledge",
      "I apply what I learn and challenge myself to grow",
      "I step outside my comfort zone to learn unfamiliar things",
      "I seek feedback from others to identify areas for improvement",
      "I dedicate time each week specifically for personal development",
      "I learn from my failures and treat them as growth opportunities",
      "I share what I learn with others to reinforce my understanding",
      "I stay curious and open-minded about new ideas and perspectives",
      "I can point to specific skills or knowledge I've gained in the last 90 days",
    ],
  },
];

/** One A4 page: snapshot top-aligned (no vertical centering), dark flush to top; small side/bottom inset only. */
function addCanvasToPdfSinglePageTop(pdf, canvas, { topMm = 0, insetMm = 8 } = {}) {
  const imgData = canvas.toDataURL("image/png");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const innerW = pageW - 2 * insetMm;
  const innerH = pageH - topMm - insetMm;
  const aspect = canvas.height / canvas.width;
  let renderW = innerW;
  let renderH = renderW * aspect;
  if (renderH > innerH) {
    renderH = innerH;
    renderW = renderH / aspect;
  }
  const x = (pageW - renderW) / 2;
  pdf.addImage(imgData, "PNG", x, topMm, renderW, renderH);
}

const WheelCanvas = forwardRef(function WheelCanvas({ scores, size = 320 }, forwardedRef) {
  const ref = useRef(null);
  const anim = useRef(null);

  const setCanvasRef = useCallback(
    (node) => {
      ref.current = node;
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else forwardedRef.current = node;
    },
    [forwardedRef]
  );

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = size * 2; c.height = size * 2;
    c.style.width = `${size}px`; c.style.height = `${size}px`;
    ctx.scale(2, 2);
    const cx = size / 2, cy = size / 2, maxR = size / 2 - 36;
    let phase = 0;

    const draw = () => {
      phase += 0.004;
      ctx.clearRect(0, 0, size, size);
      const slice = (Math.PI * 2) / 9;

      for (let r = 1; r <= 10; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (r / 10) * maxR, 0, Math.PI * 2);
        ctx.strokeStyle = r % 5 === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)";
        ctx.lineWidth = r % 5 === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      for (let i = 0; i < 9; i++) {
        const a = i * slice - Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
        ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 0.5; ctx.stroke();
      }

      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const a = i * slice - Math.PI / 2;
        const p = Math.sin(phase + i * 0.7) * 0.015 + 1;
        const r = ((scores[i] || 0) / 10) * maxR * p;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      g.addColorStop(0, "rgba(255,107,53,0.3)"); g.addColorStop(1, "rgba(255,107,53,0.05)");
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = "rgba(255,107,53,0.7)"; ctx.lineWidth = 2; ctx.stroke();

      for (let i = 0; i < 9; i++) {
        const a = i * slice - Math.PI / 2;
        const p = Math.sin(phase + i * 0.7) * 0.015 + 1;
        const r = ((scores[i] || 0) / 10) * maxR * p;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = PILLARS[i].color; ctx.fill();
        ctx.shadowColor = PILLARS[i].color; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;

        const lx = cx + Math.cos(a) * (maxR + 22), ly = cy + Math.sin(a) * (maxR + 22);
        ctx.font = "600 8px 'Outfit', sans-serif";
        ctx.fillStyle = PILLARS[i].color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(PILLARS[i].name.toUpperCase(), lx, ly);
      }
      anim.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [scores, size]);

  return <canvas ref={setCanvasRef} style={{ display: "block", margin: "0 auto" }} />;
});

export default function Power9Assessment() {
  const [phase, setPhase] = useState("gate"); // gate | choose | assess | results
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [mode, setMode] = useState(null); // "short" | "full"
  const [pillarIdx, setPillarIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showTransition, setShowTransition] = useState(false);
  const [emailResultsNotice, setEmailResultsNotice] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [gateLoading, setGateLoading] = useState(false);
  const [gateError, setGateError] = useState(null);
  const wheelCanvasRef = useRef(null);
  const pdfCaptureRef = useRef(null);
  const pdfWheelImgRef = useRef(null);

  const pillar = PILLARS[pillarIdx];
  const questions = pillar ? (mode === "short" ? pillar.short : pillar.full) : [];
  const totalQ = mode === "short" ? 27 : 90;
  const completedQ = Object.keys(answers).length;

  const handleGate = async () => {
    if (!email.includes("@") || !firstName.trim() || gateLoading) return;
    setGateError(null);
    setGateLoading(true);
    try {
      await submitEmailSignup({
        name: firstName.trim(),
        email: email.trim(),
        source: "assessment",
      });
      setPhase("choose");
    } catch {
      setGateError("We couldn’t save your details. Please check your connection and try again.");
    } finally {
      setGateLoading(false);
    }
  };

  const handleAnswer = (val) => {
    const key = `${pillarIdx}-${qIdx}`;
    setAnswers((a) => ({ ...a, [key]: val }));

    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1);
    } else if (pillarIdx < 8) {
      setShowTransition(true);
      setTimeout(() => {
        setPillarIdx(pillarIdx + 1);
        setQIdx(0);
        setShowTransition(false);
      }, 600);
    } else {
      setPhase("results");
    }
  };

  const goBack = () => {
    if (qIdx > 0) {
      setQIdx(qIdx - 1);
    } else if (pillarIdx > 0) {
      const prevQs = mode === "short" ? PILLARS[pillarIdx - 1].short : PILLARS[pillarIdx - 1].full;
      setPillarIdx(pillarIdx - 1);
      setQIdx(prevQs.length - 1);
    }
  };

  const pillarScores = PILLARS.map((p, pi) => {
    const qs = mode === "short" ? p.short : p.full;
    let sum = 0, count = 0;
    qs.forEach((_, qi) => {
      const v = answers[`${pi}-${qi}`];
      if (v) { sum += v; count++; }
    });
    return count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
  });

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = totalQ * 10;
  const overallPct = Math.round((totalScore / maxScore) * 100);

  const sortedPillars = PILLARS.map((p, i) => ({ ...p, score: pillarScores[i], idx: i })).sort((a, b) => a.score - b.score);
  const weakest = sortedPillars.slice(0, 3);
  const strongest = sortedPillars.slice(-3).reverse();

  const variance = (() => {
    const avg = pillarScores.reduce((a, b) => a + b, 0) / 9;
    const v = pillarScores.reduce((a, s) => a + Math.pow(s - avg, 2), 0) / 9;
    return Math.sqrt(v);
  })();

  const balanceLabel = variance < 1 ? "Excellent" : variance < 1.8 ? "Good" : variance < 2.5 ? "Moderate" : "Needs Work";

  const insightMessage =
    variance < 1.5
      ? "Your wheel is well-rounded — you're rolling smoothly. Focus on pushing your lowest areas up to maintain momentum."
      : variance < 2.5
        ? "Your wheel has some flat spots. Targeting your 2-3 weakest pillars will create the biggest impact on your overall quality of life."
        : "Your wheel is significantly lopsided — life's bumps are hitting harder than they need to. Pick your weakest pillar and commit to one small change this week.";

  const pdfReportDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const balancePillPdfStyle =
    variance >= 2.5
      ? {
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          background: "rgba(255,107,53,0.12)",
          color: "#ff8f65",
          border: "1px solid rgba(255,107,53,0.3)",
        }
      : variance >= 1.8
        ? {
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            background: "rgba(255,217,61,0.12)",
            color: "#ffd93d",
            border: "1px solid rgba(255,217,61,0.35)",
          }
        : {
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            background: "rgba(107,203,119,0.15)",
            color: "#6bcb77",
            border: "1px solid rgba(107,203,119,0.35)",
          };

  const handleDownloadPdf = useCallback(async () => {
    const captureEl = pdfCaptureRef.current;
    const wheelCanvas = wheelCanvasRef.current;
    const wheelImg = pdfWheelImgRef.current;
    if (!captureEl || !wheelCanvas || !wheelImg) return;

    setPdfGenerating(true);
    try {
      wheelImg.src = wheelCanvas.toDataURL("image/png");
      await new Promise((resolve) => {
        if (wheelImg.complete) resolve();
        else {
          wheelImg.onload = () => resolve();
          wheelImg.onerror = () => resolve();
        }
      });
      await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const [{ jsPDF }, { default: html2canvasMod }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const canvas = await html2canvasMod(captureEl, {
        backgroundColor: "#07070d",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      addCanvasToPdfSinglePageTop(pdf, canvas, { topMm: 0, insetMm: 8 });

      const safeName = firstName.trim().replace(/[^\w\-]+/g, "_").slice(0, 48) || "results";
      pdf.save(`Power9-Results-${safeName}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setPdfGenerating(false);
    }
  }, [firstName]);

  const handleEmailResultsPlaceholder = useCallback(() => {
    setEmailResultsNotice(`Results will be sent to ${email}`);
  }, [email]);

  return (
    <div style={st.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07070d; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }
        @keyframes slideOut { to { opacity:0; transform:translateX(-40px); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(40px); } }
        input:focus { border-color: #ff6b35 !important; outline: none; }
        .mobile-sticky-back { position: static; }
        @media (max-width: 768px) {
          .mobile-sticky-back {
            position: sticky;
            top: 8px;
            z-index: 20;
          }
        }
      `}</style>

      <div style={st.topBar}>
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

        {/* HEADER */}
        <div style={st.header}>
          <img src={LOGO_BASE64} alt="Elite Performance" style={{ height: 40 }} />
          <div style={st.headerSub}>POWER 9 LIFE ASSESSMENT</div>
        </div>
      </div>

      {/* ===== GATE ===== */}
      {phase === "gate" && (
        <div style={st.card} key="gate">
          <h1 style={st.title}>Discover Your Life Balance</h1>
          <p style={st.desc}>
            Assess the 9 pillars that define a high-performing life.
            Get your personalized wheel, identify your strengths, and see where to focus next.
          </p>
          <div style={st.gateForm}>
            <div style={st.field}>
              <label style={st.label}>First Name</label>
              <input
                type="text" value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGate()}
                placeholder="Your first name"
                style={st.input}
              />
            </div>
            <div style={st.field}>
              <label style={st.label}>Email</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGate()}
                placeholder="you@email.com"
                style={st.input}
              />
            </div>
            <button
              onClick={handleGate}
              disabled={!email.includes("@") || !firstName.trim() || gateLoading}
              style={email.includes("@") && firstName.trim() && !gateLoading ? st.ctaPrimary : st.ctaDisabled}
            >
              {gateLoading ? "Saving…" : "Get Started →"}
            </button>
            {gateError ? (
              <p style={{ ...st.fine, color: "#ff9a9a", marginTop: 4 }}>{gateError}</p>
            ) : null}
            <p style={st.fine}>Your results will be associated with your email for future reference.</p>
          </div>
        </div>
      )}

      {/* ===== CHOOSE ===== */}
      {phase === "choose" && (
        <div style={st.card} key="choose">
          <h2 style={st.title}>Hey {firstName}, choose your assessment</h2>
          <p style={st.desc}>Both versions assess the same 9 pillars — the comprehensive version goes deeper.</p>
          <div style={st.chooseGrid}>
            <button onClick={() => { setMode("short"); setPhase("assess"); }} style={st.chooseCard}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
              <h3 style={st.chooseTitle}>Quick Assessment</h3>
              <div style={st.chooseMeta}>27 questions · ~5 minutes</div>
              <p style={st.chooseDesc}>3 questions per pillar. Fast baseline to see your life balance at a glance.</p>
            </button>
            <button onClick={() => { setMode("full"); setPhase("assess"); }} style={{ ...st.chooseCard, borderColor: "rgba(255,107,53,0.4)" }}>
              <div style={st.chooseBadge}>RECOMMENDED</div>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔬</div>
              <h3 style={st.chooseTitle}>Deep Dive Assessment</h3>
              <div style={st.chooseMeta}>90 questions · ~15 minutes</div>
              <p style={st.chooseDesc}>10 questions per pillar. Comprehensive analysis with detailed insights.</p>
            </button>
          </div>
        </div>
      )}

      {/* ===== ASSESS ===== */}
      {phase === "assess" && (
        <div style={st.assessCard} key="assess">
          {/* progress */}
          <div style={st.progressWrap}>
            <div style={st.progressTrack}>
              <div style={{ ...st.progressBar, width: `${(completedQ / totalQ) * 100}%` }} />
            </div>
            <div style={st.progressLabel}>{completedQ} / {totalQ} questions</div>
          </div>

          {/* pillar header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{pillar.icon}</span>
            <h2 style={{ ...st.pillarTitle, color: pillar.color }}>{pillar.name}</h2>
            <span style={st.pillarCount}>{pillarIdx + 1} / 9</span>
          </div>
          <div style={st.qProgress}>
            Question {qIdx + 1} of {questions.length}
          </div>

          {/* question */}
          <div style={{ ...st.questionBox, animation: showTransition ? "slideOut 0.3s ease forwards" : "fadeUp 0.4s ease" }} key={`${pillarIdx}-${qIdx}`}>
            <p style={st.questionText}>{questions[qIdx]}</p>
            <div style={st.scaleLabels}>
              <span>Never</span><span>Always</span>
            </div>
            <div style={st.ratingRow}>
              {[1,2,3,4,5,6,7,8,9,10].map((v) => {
                const current = answers[`${pillarIdx}-${qIdx}`];
                const active = current === v;
                return (
                  <button
                    key={v}
                    onClick={() => handleAnswer(v)}
                    style={active ? { ...st.ratingBtn, ...st.ratingActive, borderColor: pillar.color, color: pillar.color, background: `${pillar.color}18` } : st.ratingBtn}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {/* back */}
          {(pillarIdx > 0 || qIdx > 0) && (
            <button onClick={goBack} style={st.backBtn}>← Back</button>
          )}
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {phase === "results" && (
        <div key="results">
          {/* Single-page PDF capture: flush to top (no top padding), full report */}
          <div
            ref={pdfCaptureRef}
            aria-hidden
            style={{
              position: "absolute",
              left: "-10000px",
              top: 0,
              width: 760,
              padding: "0 44px 28px",
              background: "#07070d",
              color: "#e8e8f0",
              fontFamily: "'Outfit', sans-serif",
              boxSizing: "border-box",
            }}
          >
            <img
              src={`${window.location.origin}/elite_performance_no_tagline.png`}
              alt=""
              style={{ height: 44, width: "auto", display: "block", margin: "0 auto 14px" }}
            />
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                fontWeight: 800,
                textAlign: "center",
                margin: "0 0 6px",
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              Power 9 Life Assessment Results
            </h1>
            <p style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "rgba(255,107,53,0.75)", marginBottom: 22 }}>
              {firstName}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 22px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 18,
              }}
            >
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>NAME</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{firstName}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>EMAIL</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", wordBreak: "break-all", lineHeight: 1.3 }}>{email}</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>DATE</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{pdfReportDate}</div>
              </div>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(255,107,53,0.18), rgba(255,143,101,0.08))",
                border: "1px solid rgba(255,107,53,0.25)",
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 20,
                display: "flex",
                flexWrap: "wrap",
                gap: "14px 28px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>OVERALL SCORE</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: "#fff" }}>
                  <span style={{ color: "#ff8f65" }}>{totalScore}</span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 500 }}> / {maxScore}</span>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600, marginLeft: 6 }}>({overallPct}%)</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>BALANCE RATING</div>
                <span style={balancePillPdfStyle}>{balanceLabel}</span>
              </div>
            </div>
            <img
              ref={pdfWheelImgRef}
              alt=""
              style={{ width: 248, height: "auto", display: "block", margin: "0 auto" }}
            />

            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>PILLAR SCORES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {PILLARS.map((p, i) => (
                  <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{p.name}</span>
                    <div style={{ flex: 2, height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", maxWidth: 240 }}>
                      <div style={{ height: "100%", width: `${(pillarScores[i] / 10) * 100}%`, background: p.color, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: p.color, minWidth: 28, textAlign: "right" }}>{pillarScores[i].toFixed(1)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#6bcb77", marginBottom: 8 }}>TOP 3 STRENGTHS</div>
                  {strongest.map((p) => (
                    <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span>{p.icon}</span>
                      <span style={{ flex: 1, fontWeight: 600 }}>{p.name}</span>
                      <span style={{ color: p.color, fontWeight: 700 }}>{p.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#ff6b35", marginBottom: 8 }}>TOP 3 FOCUS AREAS</div>
                  {weakest.map((p) => (
                    <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span>{p.icon}</span>
                      <span style={{ flex: 1, fontWeight: 600 }}>{p.name}</span>
                      <span style={{ color: p.color, fontWeight: 700 }}>{p.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>{insightMessage}</p>
              <div
                style={{
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.38)",
                  textAlign: "center",
                  lineHeight: 1.45,
                }}
              >
                Elite Performance Living · eliteperformanceliving.com · Confidential
              </div>
            </div>
          </div>

          <div style={st.card}>
            <h2 style={st.title}>{firstName}'s Power 9 Results</h2>
            <p style={st.desc}>
              Total Score: <strong style={{ color: "#ff6b35" }}>{totalScore} / {maxScore}</strong> ({overallPct}%)
              &nbsp;·&nbsp;
              Wheel Balance: <strong style={{ color: variance < 2 ? "#6bcb77" : "#ffd93d" }}>{balanceLabel}</strong>
            </p>

            <WheelCanvas ref={wheelCanvasRef} scores={pillarScores} size={340} />

            {/* pillar breakdown */}
            <div style={st.breakdownGrid}>
              {PILLARS.map((p, i) => (
                <div key={i} style={st.breakdownRow}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <div style={st.barTrack}>
                    <div style={{ ...st.barFill, width: `${(pillarScores[i] / 10) * 100}%`, background: p.color }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: p.color, minWidth: 32, textAlign: "right" }}>
                    {pillarScores[i].toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={st.resultsActionsWrap}>
            {emailResultsNotice && (
              <div style={st.emailResultsNotice} role="status">
                {emailResultsNotice}
              </div>
            )}
            <div style={st.resultsBtnRow}>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={pdfGenerating}
                style={pdfGenerating ? { ...st.resultsBtnPrimary, opacity: 0.7, cursor: "wait" } : st.resultsBtnPrimary}
              >
                {pdfGenerating ? "Generating PDF…" : "Download Results"}
              </button>
              <button type="button" onClick={handleEmailResultsPlaceholder} style={st.resultsBtnSecondary}>
                Email My Results
              </button>
            </div>
          </div>

          {/* insights */}
          <div style={{ ...st.card, marginTop: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#fff" }}>💡 Key Insights</h3>
            <div style={st.insightGrid}>
              <div style={st.insightBox}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "#ff6b35", marginBottom: 8 }}>FOCUS AREAS</div>
                {weakest.map((p) => (
                  <div key={p.key} style={st.insightItem}>
                    <span>{p.icon}</span>
                    <span style={{ flex: 1 }}>{p.name}</span>
                    <span style={{ color: p.color, fontWeight: 700 }}>{p.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
              <div style={st.insightBox}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "#6bcb77", marginBottom: 8 }}>STRENGTHS</div>
                {strongest.map((p) => (
                  <div key={p.key} style={st.insightItem}>
                    <span>{p.icon}</span>
                    <span style={{ flex: 1 }}>{p.name}</span>
                    <span style={{ color: p.color, fontWeight: 700 }}>{p.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ ...st.desc, marginTop: 20, fontSize: 13 }}>{insightMessage}</p>
          </div>

          {/* restart */}
          <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 40 }}>
            <button
              onClick={() => {
                setPhase("choose");
                setPillarIdx(0);
                setQIdx(0);
                setAnswers({});
                setEmailResultsNotice(null);
              }}
              style={st.ctaSecondary}
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    background: "#07070d",
    color: "#e8e8f0",
    minHeight: "100vh",
    padding: "16px 16px 28px",
    maxWidth: 640,
    margin: "0 auto",
  },
  topBar: {
    position: "relative",
    zIndex: 3,
    background: "#07070d",
    paddingBottom: 6,
    marginBottom: 0,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginBottom: 0,
    paddingTop: 4,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 4,
    color: "rgba(255,107,53,0.6)",
  },
  card: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "28px 24px",
    animation: "fadeUp 0.5s ease",
    position: "relative",
    zIndex: 1,
  },
  assessCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "28px 24px",
    marginTop: 28,
    animation: "fadeUp 0.5s ease",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 8,
    color: "#fff",
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginBottom: 28,
  },

  // GATE
  gateForm: { maxWidth: 360, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "13px 16px",
    color: "#fff",
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s",
  },
  fine: { fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" },

  ctaPrimary: {
    background: "linear-gradient(135deg, #ff6b35, #ff8f65)",
    border: "none",
    borderRadius: 8,
    padding: "14px 32px",
    color: "#07070d",
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.5,
    marginTop: 8,
  },
  ctaDisabled: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "14px 32px",
    color: "rgba(255,255,255,0.25)",
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    cursor: "not-allowed",
    marginTop: 8,
  },
  ctaSecondary: {
    background: "transparent",
    border: "1px solid rgba(255,107,53,0.3)",
    borderRadius: 8,
    padding: "12px 28px",
    color: "#ff8f65",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
  },

  // CHOOSE
  chooseGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 },
  chooseCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "28px 20px",
    textAlign: "center",
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    color: "#e8e8f0",
    position: "relative",
    transition: "border-color 0.3s, transform 0.2s",
  },
  chooseBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#ff6b35",
    background: "rgba(255,107,53,0.1)",
    border: "1px solid rgba(255,107,53,0.2)",
    padding: "3px 8px",
    borderRadius: 100,
  },
  chooseTitle: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  chooseMeta: { fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 },
  chooseDesc: { fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.45)" },

  // ASSESS
  progressWrap: { marginBottom: 24 },
  progressTrack: { height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" },
  progressBar: { height: "100%", background: "linear-gradient(90deg, #ff6b35, #ff8f65)", borderRadius: 4, transition: "width 0.4s ease" },
  progressLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6, textAlign: "right" },

  pillarTitle: { fontSize: 20, fontWeight: 700 },
  pillarCount: { fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.25)", marginLeft: "auto", letterSpacing: 2 },
  qProgress: { fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 20 },

  questionBox: { marginBottom: 20 },
  questionText: { fontSize: 16, lineHeight: 1.7, color: "#fff", fontWeight: 500, marginBottom: 20 },
  scaleLabels: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 8, letterSpacing: 1, fontWeight: 600, textTransform: "uppercase" },
  ratingRow: { display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 },
  ratingBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "12px 0",
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  ratingActive: {
    fontWeight: 800,
    transform: "scale(1.08)",
  },

  backBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
    padding: "8px 0",
  },

  // RESULTS
  breakdownGrid: { display: "flex", flexDirection: "column", gap: 10, marginTop: 32 },
  breakdownRow: { display: "flex", alignItems: "center", gap: 10 },
  barTrack: { flex: 2, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4, transition: "width 0.8s ease" },

  resultsActionsWrap: { marginTop: 16 },
  emailResultsNotice: {
    background: "rgba(107,203,119,0.12)",
    border: "1px solid rgba(107,203,119,0.35)",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    color: "#a8e6b3",
    textAlign: "center",
    marginBottom: 12,
  },
  resultsBtnRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  resultsBtnPrimary: {
    flex: "1 1 160px",
    background: "linear-gradient(135deg, #ff6b35, #ff8f65)",
    border: "none",
    borderRadius: 8,
    padding: "13px 20px",
    color: "#07070d",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.3,
  },
  resultsBtnSecondary: {
    flex: "1 1 160px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 8,
    padding: "13px 20px",
    color: "#e8e8f0",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
  },

  insightGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  insightBox: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 16,
  },
  insightItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)", padding: "6px 0" },
};
