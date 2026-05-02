import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Download, RotateCcw, Compass, Loader2, Check } from 'lucide-react';

// ============================================================================
// PILLAR DEFINITIONS — Power Nine framework
// ============================================================================

const PILLARS = [
  {
    id: 'clarity',
    number: '01',
    name: 'Clarity & Plan',
    essence: 'Living with intention — not drift.',
    framing: 'Every elite life starts with knowing what matters and refusing to let default routines decide for you. This pillar is about how clearly you see your priorities and how reliably you act on them.',
    question: 'What does living with clarity look like for you in this season?',
    placeholder: "e.g., I do a weekly review every Sunday, I know my top 3 priorities, and most days I end feeling like I spent my time on what actually mattered.",
  },
  {
    id: 'movement',
    number: '02',
    name: 'Movement',
    essence: 'A body built for the life you want to live.',
    framing: 'Movement is not about a physique. It is about capability — being able to do what your life requires of you, and what you want to be able to do, with energy left over.',
    question: 'What does a body that serves your life look like for you?',
    placeholder: "e.g., I move 4-5 times a week, I'm strong enough to keep up with my kids, I feel energetic. I'm not chasing aesthetics — I'm chasing capability.",
  },
  {
    id: 'mental',
    number: '03',
    name: 'Mental Health',
    essence: 'Recovery, regulation, the voice in your head.',
    framing: 'Not the absence of stress — the relationship you have with it. How quickly you recover, how you talk to yourself, who you reach out to when it gets heavy.',
    question: 'What does mental fitness look like for you?',
    placeholder: "e.g., I notice when I'm spiraling and have tools to come back. I'm not always calm, but I recover faster. I have at least one person I can be real with.",
  },
  {
    id: 'nutrition',
    number: '04',
    name: 'Nutrition',
    essence: 'How you fuel yourself — your way.',
    framing: 'There is no universal answer here. Your version of eating well has to fit your life, your goals, and your relationship with food. Your A+ might not look like anyone else\'s.',
    question: 'What does eating well look like for you?',
    placeholder: "e.g., I eat clean ~80% of the time — Whole Foods, high protein, low sugar, Mediterranean-leaning. I enjoy food, I don't track obsessively, and I have the energy to do what I want. That's my A+.",
  },
  {
    id: 'connection',
    number: '05',
    name: 'Daily Connection',
    essence: 'Presence with your closest person.',
    framing: 'The quality of your inner circle relationships — spouse, partner, the people you live alongside. Not just being there, but actually being there.',
    question: 'What does deep connection look like in your closest relationship(s)?',
    placeholder: "e.g., We have daily check-ins, I'm fully present at dinner with no phone, we're aligned on what this season is about. I'm not just physically there — I'm actually there.",
  },
  {
    id: 'home',
    number: '06',
    name: 'Home Life',
    essence: 'The environment you live inside of.',
    framing: 'Your home as a system — the rhythms, the space, the household function. Does the environment support the life you want, or fight against it?',
    question: 'What does a thriving home look like for you?',
    placeholder: "e.g., Our home feels calm and intentional. Routines work. I'm engaged with my kids' lives, not just managing them. The space supports who we're becoming.",
  },
  {
    id: 'tribe',
    number: '07',
    name: 'Tribe',
    essence: 'The community beyond your inner circle.',
    framing: 'Friends, mentors, peers — the people who sharpen you, challenge you, and remind you who you are when you forget. Iron sharpens iron.',
    question: 'What does your tribe look like?',
    placeholder: "e.g., I have 3-5 people I genuinely connect with monthly, at least one mentor I learn from, and I'm building community in spaces I care about.",
  },
  {
    id: 'finances',
    number: '08',
    name: 'Finances',
    essence: 'Systems and security that buy you focus.',
    framing: 'Money is not the goal — it is the infrastructure that lets you focus on what is. This is about clarity over your numbers and systems that run without your constant attention.',
    question: 'What does financial health look like for you in this season?',
    placeholder: "e.g., I review my numbers monthly, I'm building toward [specific goal], I'm not anxious about most decisions, and my systems run without me babysitting them.",
  },
  {
    id: 'learning',
    number: '09',
    name: 'Learning',
    essence: 'Sharpening the saw.',
    framing: 'Curiosity, growth, deliberate sharpening. The inputs you let into your mind, the skills you\'re developing, the people who are stretching how you think.',
    question: 'What does growth and learning look like for you?',
    placeholder: "e.g., I read consistently, I'm developing one specific skill this year, and I have inputs — people, podcasts, books — that are stretching how I think.",
  },
];

const IMPORTANCE_OPTIONS = [
  { value: 'foundational', label: 'Foundational', desc: 'Critical to my current season — non-negotiable.' },
  { value: 'important', label: 'Important & Active', desc: 'Actively investing here right now.' },
  { value: 'steady', label: 'Steady State', desc: 'Maintaining is enough — not focused on growth here.' },
  { value: 'low', label: 'Conscious Low Priority', desc: 'Intentionally on the back burner this season.' },
];

const STATUS_OPTIONS = [
  { value: 'behind', label: 'Behind', desc: 'I know I\'m drifting from this.' },
  { value: 'building', label: 'Building', desc: 'Working toward it — not there yet.' },
  { value: 'on-track', label: 'On Track', desc: 'Mostly living this version.' },
  { value: 'thriving', label: 'Thriving', desc: 'This is where I live now.' },
];

const TIME_OPTIONS = [
  { value: 'almost-none', label: 'Almost none', desc: 'Barely any of my time and energy goes here.' },
  { value: 'a-little', label: 'A little', desc: 'Some attention, but inconsistent.' },
  { value: 'meaningful-share', label: 'A meaningful share', desc: 'Real, regular investment.' },
  { value: 'a-lot', label: 'A lot', desc: 'A major focus right now.' },
];

// ============================================================================
// STYLES — Editorial dark theme with bronze accent
// ============================================================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
  
  .eva-root {
    --bg: #0e0e0e;
    --bg-elevated: #161616;
    --bg-card: #1a1a1a;
    --border: #2a2a2a;
    --border-light: #333333;
    --text: #f5f1ea;
    --text-dim: #a8a29a;
    --text-faint: #6b6862;
    --accent: #c89860;
    --accent-bright: #e0b27c;
    --accent-faint: #c8986020;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Manrope', -apple-system, sans-serif;
    
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    width: 100%;
  }
  
  .eva-display { font-family: var(--serif); font-weight: 500; letter-spacing: -0.02em; }
  .eva-eyebrow { font-family: var(--sans); font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: 600; }
  .eva-number { font-family: var(--serif); font-style: italic; color: var(--accent); }
  
  .eva-button {
    background: var(--accent);
    color: #1a1a1a;
    border: none;
    padding: 14px 28px;
    font-family: var(--sans);
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .eva-button:hover { background: var(--accent-bright); transform: translateY(-1px); }
  .eva-button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  
  .eva-button-ghost {
    background: transparent;
    color: var(--text-dim);
    border: 1px solid var(--border-light);
    padding: 12px 24px;
    font-family: var(--sans);
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .eva-button-ghost:hover { color: var(--text); border-color: var(--text-dim); }
  
  .eva-option {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
    width: 100%;
    color: var(--text);
    font-family: var(--sans);
  }
  .eva-option:hover { border-color: var(--text-faint); background: var(--bg-elevated); }
  .eva-option.selected { border-color: var(--accent); background: var(--accent-faint); }
  
  .eva-textarea {
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.7;
    padding: 18px 20px;
    width: 100%;
    min-height: 140px;
    resize: vertical;
    transition: border-color 0.15s ease;
  }
  .eva-textarea:focus { outline: none; border-color: var(--accent); }
  .eva-textarea::placeholder { color: var(--text-faint); font-style: italic; }
  
  .eva-progress-bar {
    height: 1px;
    background: var(--border);
    overflow: hidden;
  }
  .eva-progress-fill {
    height: 100%;
    background: var(--accent);
    transition: width 0.4s ease;
  }
  
  .eva-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border-light), transparent);
  }
  
  @keyframes eva-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .eva-fade-in { animation: eva-fade-in 0.5s ease both; }
  .eva-fade-in-1 { animation-delay: 0.1s; }
  .eva-fade-in-2 { animation-delay: 0.2s; }
  .eva-fade-in-3 { animation-delay: 0.3s; }
  
  @keyframes eva-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  .eva-pulse { animation: eva-pulse 2s ease-in-out infinite; }
  
  .eva-vision-doc {
    font-family: var(--serif);
    font-size: 19px;
    line-height: 1.75;
    color: var(--text);
  }
  .eva-vision-doc h2 {
    font-family: var(--serif);
    font-style: italic;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent);
    font-weight: 500;
    margin: 32px 0 16px 0;
  }
  .eva-vision-doc p { margin: 0 0 20px 0; }
  .eva-vision-doc strong { color: var(--accent-bright); font-weight: 600; }
`;

// ============================================================================
// SCREEN COMPONENTS
// ============================================================================

function WelcomeScreen({ onStart }) {
  return (
    <div className="eva-fade-in" style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
      <div className="eva-eyebrow eva-fade-in eva-fade-in-1" style={{ marginBottom: '32px' }}>
        Elite Performance · The Power Nine
      </div>
      <h1 className="eva-display eva-fade-in eva-fade-in-2" style={{ fontSize: 'clamp(48px, 7vw, 84px)', lineHeight: 1.05, margin: '0 0 32px 0' }}>
        The Elite<br />
        <em style={{ color: 'var(--accent)' }}>Time Audit</em>
      </h1>
      <p className="eva-fade-in eva-fade-in-3" style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text-dim)', margin: '0 0 48px 0', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
        Everyone&apos;s version of elite is different. This is your honest audit — across nine pillars, you&apos;ll define what thriving looks like for you, look at where your time and energy are actually going, and see where you&apos;re aligned with your own standard versus where you&apos;re drifting. No benchmarks. No comparisons. Just clarity.
      </p>
      
      <div className="eva-divider eva-fade-in eva-fade-in-3" style={{ margin: '0 auto 48px auto', maxWidth: '200px' }} />
      
      <div className="eva-fade-in eva-fade-in-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', maxWidth: '720px', margin: '0 auto 56px auto', textAlign: 'left' }}>
        <div>
          <div className="eva-eyebrow" style={{ marginBottom: '8px' }}>Time</div>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>~20 minutes. Move at your own pace.</p>
        </div>
        <div>
          <div className="eva-eyebrow" style={{ marginBottom: '8px' }}>Output</div>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>Your personal Vision of Elite — yours to keep and revisit.</p>
        </div>
        <div>
          <div className="eva-eyebrow" style={{ marginBottom: '8px' }}>Cadence</div>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>Revisit every 90 days. Your wheel adjusts as life does.</p>
        </div>
      </div>
      
      <button onClick={onStart} className="eva-button eva-fade-in eva-fade-in-3">
        Begin <ChevronRight size={16} />
      </button>
    </div>
  );
}

function PillarScreen({ pillar, answer, onAnswer, onNext, onBack, currentIndex, totalPillars }) {
  const isComplete = answer && answer.importance && answer.vision && answer.vision.trim().length > 0 && answer.time && answer.status;
  const progress = ((currentIndex + 1) / totalPillars) * 100;
  
  return (
    <div className="eva-fade-in" style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px 24px' }}>
      
      {/* Progress */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="eva-eyebrow">Pillar {currentIndex + 1} of {totalPillars}</div>
          <div className="eva-eyebrow" style={{ color: 'var(--text-faint)' }}>{Math.round(progress)}%</div>
        </div>
        <div className="eva-progress-bar">
          <div className="eva-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '12px' }}>
          <span className="eva-number" style={{ fontSize: '48px' }}>{pillar.number}</span>
          <h2 className="eva-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: 0, lineHeight: 1.1 }}>
            {pillar.name}
          </h2>
        </div>
        <p className="eva-display" style={{ fontStyle: 'italic', fontSize: '20px', color: 'var(--accent)', margin: '0 0 24px 0' }}>
          {pillar.essence}
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-dim)', margin: 0, maxWidth: '600px' }}>
          {pillar.framing}
        </p>
      </div>
      
      <div className="eva-divider" style={{ margin: '40px 0' }} />
      
      {/* Q1: Importance */}
      <div style={{ marginBottom: '40px' }}>
        <div className="eva-eyebrow" style={{ marginBottom: '8px' }}>Question 01</div>
        <h3 className="eva-display" style={{ fontSize: '24px', margin: '0 0 20px 0', fontWeight: 500 }}>
          How important is this pillar to you in this season?
        </h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {IMPORTANCE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onAnswer({ ...answer, importance: opt.value })}
              className={`eva-option ${answer?.importance === opt.value ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  marginTop: '4px',
                  width: '14px', height: '14px', borderRadius: '50%',
                  border: `1.5px solid ${answer?.importance === opt.value ? 'var(--accent)' : 'var(--border-light)'}`,
                  background: answer?.importance === opt.value ? 'var(--accent)' : 'transparent',
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{opt.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.5 }}>{opt.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Q2: Vision */}
      <div style={{ marginBottom: '40px' }}>
        <div className="eva-eyebrow" style={{ marginBottom: '8px' }}>Question 02</div>
        <h3 className="eva-display" style={{ fontSize: '24px', margin: '0 0 12px 0', fontWeight: 500 }}>
          {pillar.question}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-faint)', margin: '0 0 16px 0', fontStyle: 'italic' }}>
          Be specific. Use your own words. This is your standard — not anyone else's.
        </p>
        <textarea
          className="eva-textarea"
          placeholder={pillar.placeholder}
          value={answer?.vision || ''}
          onChange={(e) => onAnswer({ ...answer, vision: e.target.value })}
        />
      </div>
      
      {/* Q3: Time & energy */}
      <div style={{ marginBottom: '40px' }}>
        <div className="eva-eyebrow" style={{ marginBottom: '8px' }}>Question 03</div>
        <h3 className="eva-display" style={{ fontSize: '24px', margin: '0 0 20px 0', fontWeight: 500 }}>
          How much of your time and energy is currently going into this pillar?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          {TIME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onAnswer({ ...answer, time: opt.value })}
              className={`eva-option ${answer?.time === opt.value ? 'selected' : ''}`}
              style={{ textAlign: 'center', padding: '20px 16px' }}
            >
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>{opt.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.5 }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Q4: Status */}
      <div style={{ marginBottom: '48px' }}>
        <div className="eva-eyebrow" style={{ marginBottom: '8px' }}>Question 04</div>
        <h3 className="eva-display" style={{ fontSize: '24px', margin: '0 0 20px 0', fontWeight: 500 }}>
          Where are you right now relative to that vision?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onAnswer({ ...answer, status: opt.value })}
              className={`eva-option ${answer?.status === opt.value ? 'selected' : ''}`}
              style={{ textAlign: 'center', padding: '20px 16px' }}
            >
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>{opt.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.5 }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={onBack} className="eva-button-ghost" disabled={currentIndex === 0}>
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={onNext} className="eva-button" disabled={!isComplete}>
          {currentIndex === totalPillars - 1 ? 'Synthesize Vision' : 'Continue'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function SynthesisScreen({ answers, onSynthesize, synthesis, loading, error }) {
  const hasStarted = useRef(false);
  
  useEffect(() => {
    if (!hasStarted.current && !synthesis && !loading) {
      hasStarted.current = true;
      onSynthesize();
    }
  }, [synthesis, loading, onSynthesize]);
  
  if (loading) {
    return (
      <div className="eva-fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <Sparkles size={32} className="eva-pulse" style={{ color: 'var(--accent)', marginBottom: '32px' }} />
        <h2 className="eva-display" style={{ fontSize: '36px', margin: '0 0 16px 0' }}>
          Synthesizing your vision
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
          Drawing the threads of your nine pillars into a single, coherent picture of what elite means for you.
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="eva-fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <h2 className="eva-display" style={{ fontSize: '32px', margin: '0 0 16px 0' }}>Something went wrong</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '32px' }}>{error}</p>
        <button onClick={() => { hasStarted.current = false; onSynthesize(); }} className="eva-button">
          Try Again
        </button>
      </div>
    );
  }
  
  return null;
}

function VisionDocument({ synthesis, answers, onRestart, onDownload }) {
  return (
    <div className="eva-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 80px 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div className="eva-eyebrow eva-fade-in eva-fade-in-1" style={{ marginBottom: '20px' }}>
          Your Vision of Elite
        </div>
        <h1 className="eva-display eva-fade-in eva-fade-in-2" style={{ fontSize: 'clamp(40px, 6vw, 64px)', margin: '0 0 16px 0', lineHeight: 1.1 }}>
          This is your<br /><em style={{ color: 'var(--accent)' }}>standard.</em>
        </h1>
        <p className="eva-fade-in eva-fade-in-3" style={{ color: 'var(--text-dim)', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          Save this. Revisit it. Adjust it as life adjusts. The wheel turns.
        </p>
      </div>
      
      <div className="eva-divider" style={{ marginBottom: '48px' }} />
      
      <div className="eva-vision-doc eva-fade-in eva-fade-in-3"
        dangerouslySetInnerHTML={{ __html: synthesis }}
      />
      
      <div className="eva-divider" style={{ margin: '64px 0 40px 0' }} />
      
      {/* Pillar summary grid */}
      <div style={{ marginBottom: '56px' }}>
        <div className="eva-eyebrow" style={{ marginBottom: '24px', textAlign: 'center' }}>Your Nine Pillars at a Glance</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {PILLARS.map(p => {
            const a = answers[p.id];
            const importanceLabel = IMPORTANCE_OPTIONS.find(o => o.value === a?.importance)?.label || '';
            const timeLabel = TIME_OPTIONS.find(o => o.value === a?.time)?.label || '';
            const statusLabel = STATUS_OPTIONS.find(o => o.value === a?.status)?.label || '';
            return (
              <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <span className="eva-number" style={{ fontSize: '14px' }}>{p.number}</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 500 }}>{p.name}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  {importanceLabel} · {timeLabel} · {statusLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={onDownload} className="eva-button">
          <Download size={16} /> Download My Vision
        </button>
        <button onClick={onRestart} className="eva-button-ghost">
          <RotateCcw size={14} /> Start Over
        </button>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '64px', color: 'var(--text-faint)', fontSize: '13px', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
        "Your version of elite is yours alone. Hold yourself to it. Adjust it when life demands it. The wheel turns."
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EliteVisionAssessment() {
  // step: 'welcome' | 0..8 (pillar index) | 'synthesizing' | 'complete'
  const [step, setStep] = useState('welcome');
  const [answers, setAnswers] = useState({});
  const [synthesis, setSynthesis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleStart = () => setStep(0);
  
  const handleAnswer = (pillarId, answer) => {
    setAnswers(prev => ({ ...prev, [pillarId]: answer }));
  };
  
  const handleNext = () => {
    if (step < PILLARS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep('synthesizing');
    }
  };
  
  const handleBack = () => {
    if (typeof step === 'number' && step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleSynthesize = async () => {
    setLoading(true);
    setError(null);
    
    const userInputSummary = PILLARS.map(p => {
      const a = answers[p.id];
      const imp = IMPORTANCE_OPTIONS.find(o => o.value === a?.importance)?.label || '';
      const timeLabel = TIME_OPTIONS.find(o => o.value === a?.time)?.label || '';
      const stat = STATUS_OPTIONS.find(o => o.value === a?.status)?.label || '';
      return `**${p.name}** (Importance: ${imp} | Time/Energy investment: ${timeLabel} | Current state: ${stat})\nVision: ${a?.vision || ''}`;
    }).join('\n\n');
    
    const prompt = `You are a coach writing on behalf of Elite Performance Group, a brand built on the philosophy that everyone's version of "elite" is their own — defined by self-awareness, intentional goal-setting, and accountability to one's own standard, not external benchmarks.

The user has just completed the Elite Time Audit across the Power Nine pillars. For each pillar, they reported:
- How important the pillar is to them in this season (Foundational, Important & Active, Steady State, or Conscious Low Priority)
- What "thriving" looks like for them in their own words
- How much of their time and energy is currently going into the pillar (Almost none, A little, A meaningful share, A lot)
- Where they are right now relative to their stated vision (Behind, Building, On Track, Thriving)

Your task: Write a personalized "Vision of Elite" document for this person. It should:

1. Open with a 2-3 paragraph synthesis written in second person ("You..."), drawing from their actual answers, capturing the through-line of who they are trying to be in this season. Use their language and values. Do not invent goals they did not state. Be honest and a little philosophical.

2. Then a section titled "What This Season Is Asking of You" — identify the 2-3 highest-leverage pillars based on misalignment between stated importance, time investment, and current status. The strongest signals are pillars marked Foundational or Important & Active where the user is Behind or Building AND giving them Almost none or A little time. Speak directly to those specific gaps. Where time and importance disagree, name it.

3. Then a section titled "Where Your Time Is Telling the Truth" — call out 1-2 pillars where time investment, importance, and status are aligned (whether high or intentionally low). This is where they're being honest with themselves. Acknowledge it.

4. Then a section titled "What You Are Consciously Setting Aside" — name the pillars marked Steady State or Conscious Low Priority. No judgment. Conscious deprioritization is clarity, not failure.

5. Close with a single paragraph tying back to the wheel metaphor: their wheel does not need to be perfectly even — it needs to be intentional, and it will adjust as life adjusts.

Format the response as clean HTML using <p>, <h2>, and <strong> tags only. No markdown, no other tags. Use <h2> for section headers. Keep it to roughly 600-800 words total. Tone: grounded, direct, warm but not soft. Like a coach who actually listens.

Here are the user's answers:

${userInputSummary}`;

    try {
      const response = await fetch('/.netlify/functions/anthropic-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      
      const data = await response.json();
      const text = (data.content || [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n')
        .trim();
      
      if (!text) throw new Error('Received an empty response. Please try again.');
      
      setSynthesis(text);
      setStep('complete');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not synthesize your vision. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRestart = () => {
    setAnswers({});
    setSynthesis(null);
    setError(null);
    setStep('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDownload = () => {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Strip HTML to plain text for download
    const plainSynthesis = synthesis
      .replace(/<h2>/g, '\n\n')
      .replace(/<\/h2>/g, '\n')
      .replace(/<\/p>/g, '\n\n')
      .replace(/<p>/g, '')
      .replace(/<strong>/g, '')
      .replace(/<\/strong>/g, '')
      .replace(/<[^>]*>/g, '')
      .trim();
    
    const pillarDetails = PILLARS.map(p => {
      const a = answers[p.id];
      const imp = IMPORTANCE_OPTIONS.find(o => o.value === a?.importance)?.label || '';
      const timeLabel = TIME_OPTIONS.find(o => o.value === a?.time)?.label || '';
      const stat = STATUS_OPTIONS.find(o => o.value === a?.status)?.label || '';
      return `${p.number} — ${p.name.toUpperCase()}\nImportance: ${imp}\nTime & Energy Investment: ${timeLabel}\nCurrent State: ${stat}\nMy Vision: ${a?.vision || ''}\n`;
    }).join('\n---\n\n');
    
    const content = `MY VISION OF ELITE
${date}
Elite Performance · The Power Nine

${plainSynthesis}

================================================================
THE NINE PILLARS — MY ANSWERS
================================================================

${pillarDetails}

================================================================
"Your version of elite is yours alone. Hold yourself to it.
Adjust it when life demands it. The wheel turns."
================================================================
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `My-Vision-of-Elite-${date.replace(/,? /g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="eva-root">
      <style>{styles}</style>
      
      {step === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      
      {typeof step === 'number' && (
        <PillarScreen
          key={step}
          pillar={PILLARS[step]}
          answer={answers[PILLARS[step].id]}
          onAnswer={(a) => handleAnswer(PILLARS[step].id, a)}
          onNext={handleNext}
          onBack={handleBack}
          currentIndex={step}
          totalPillars={PILLARS.length}
        />
      )}
      
      {step === 'synthesizing' && (
        <SynthesisScreen
          answers={answers}
          onSynthesize={handleSynthesize}
          synthesis={synthesis}
          loading={loading}
          error={error}
        />
      )}
      
      {step === 'complete' && synthesis && (
        <VisionDocument
          synthesis={synthesis}
          answers={answers}
          onRestart={handleRestart}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
