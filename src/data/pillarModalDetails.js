/** Deep-dive copy for Power 9 pillar modals on HomePage — order matches PILLAR_DATA. */

const BOOK = "\u{1F4D6}";
const LIFT = "\u{1F3CB}\uFE0F";
const GLOBE = "\u{1F310}";
const MONEY = "\u{1F4B0}";

export const PILLAR_MODAL_DETAILS = [
  {
    spoke: "Your Navigation Spoke",
    whyItMatters:
      "Without clear goals, you're driving without a destination — any road will do, but none will satisfy. Clarity isn't just about knowing where you want to go. It's about building the roadmap to get there and reviewing it consistently so you stay on course.",
    tips: [
      "Write your top 3 goals every morning (2 minutes)",
      "Use Sunday planning sessions (30 minutes weekly)",
      'Avoid the "scroll" — protect your focus time',
      "Break big goals into weekly and monthly milestones",
      "Time management and calendar planning is the separator — you have 168 hours per week, same as everyone else",
    ],
    stats: [
      "People with written goals are 42% more likely to achieve them",
      "Only 3% of adults have clear, written goals — and they earn 10x more than those without",
    ],
    resources: [
      { kind: "book", icon: BOOK, title: "Atomic Habits", author: "James Clear", note: "Small changes, remarkable results" },
      { kind: "book", icon: BOOK, title: "Principles: Life and Work", author: "Ray Dalio", note: "Framework for decision-making" },
      { kind: "book", icon: BOOK, title: "The One Thing", author: "Gary Keller", note: "Focus on what matters most" },
    ],
  },
  {
    spoke: "Your Energy Spoke",
    whyItMatters:
      "Movement isn't just about fitness — it's about brain function, stress resilience, and leadership stamina. We're not too tired to go workout — we're tired because we don't workout. When in doubt, do 20 air squats and see how fast you wake up.",
    tips: [
      "Take the stairs — always (builds muscle, no gym required)",
      "Walking meetings for 1-on-1s (movement + connection)",
      "Park in the furthest spot (forced movement)",
      "HR goal: 180 minus your age for 15 minutes, 3 times a day",
      "Hire a personal trainer or join a group fitness session — it's worth it",
    ],
    stats: [
      "Muscle mass loss increases dementia risk by 60%",
      "Each 1-unit increase in muscle strength = 43% decrease in Alzheimer's risk",
      "Regular exercise adds 4.5 years to life expectancy",
      "150 minutes/week of movement reduces depression by 25%",
    ],
    resources: [
      { kind: "book", icon: BOOK, title: "Spark", author: "John Ratey", note: "The revolutionary science of exercise and the brain" },
      {
        kind: "link",
        icon: LIFT,
        before: "Use our ",
        linkText: "AI Workout Architect",
        after: " to build a personalized plan →",
        href: "/workout",
        external: false,
      },
    ],
  },
  {
    spoke: "Your Shock Absorption Spoke",
    whyItMatters:
      "Your mental state is contagious — in crisis, your team catches what you have. Building mental strength isn't about avoiding hard things. It's about developing the resilience, discipline, and emotional control to lead yourself through them.",
    tips: [
      "Start your day with what you're grateful for",
      "Pick up a hobby or passion project outside your daily work",
      "Book quarterly mental reset days — monthly massages aren't a luxury, they're maintenance",
      "Build affirmation cards to reference daily — you can't have bad thoughts when you're saying good words",
      "Practice box breathing when triggered — when emotions are high, intelligence is low",
      "Better sleep = better decisions",
    ],
    stats: [
      "95% of our decisions are unconscious/automatic",
      "Mental strength practices reduce impulse decisions significantly",
    ],
    resources: [
      { kind: "book", icon: BOOK, title: "The Code of the Extraordinary Mind", author: "Vishen Lakhiani", note: "" },
      {
        kind: "link",
        icon: GLOBE,
        before: "",
        linkText: "BetterHelp.com",
        after: " — Professional support when you need it",
        href: "https://www.betterhelp.com",
        external: true,
      },
    ],
  },
  {
    spoke: "Your Fuel Spoke",
    whyItMatters:
      "We can't lead on empty — poor fuel equals poor decisions. What you put in your body directly affects your cognitive performance, energy levels, and decision-making quality throughout the day.",
    tips: [
      "Water bottle on desk — drink before every meeting. When you have a hunger craving, drink 16oz of water first",
      "Meal prep Sundays — remove daily decision fatigue",
      "Body weight in grams of protein and ounces of water daily",
      "Your age or less in grams of sugar daily",
      "Don't totally cut out your treats — just don't keep them at your house or desk. Save them for when you're out",
    ],
    stats: [
      "Dehydration of just 2% impairs cognitive performance",
      "Blood sugar crashes reduce decision quality by 40%",
      "Leaders who skip breakfast make 15% more errors",
      "Mediterranean diet reduces cognitive decline by 35%",
    ],
    resources: [
      { kind: "book", icon: BOOK, title: "Life Force", author: "Tony Robbins", note: "" },
      {
        kind: "link",
        icon: GLOBE,
        before: "",
        linkText: "functionhealth.com",
        after: " — Bio marker testing to know exactly what your body needs",
        href: "https://www.functionhealth.com",
        external: true,
      },
    ],
  },
  {
    spoke: "Your Humanity Spoke",
    whyItMatters:
      "Leadership is lonely at times — and isolation makes every blow hit harder. Daily connection isn't about being social. It's about being intentional with the people in your life. Quality over quantity, always.",
    tips: [
      "Phone-free family dinner — presence over productivity",
      "Send one gratitude text daily (2 minutes, huge impact)",
      "Weekly 1-on-1s with direct reports — no agenda, just connect",
      "Wine Down at 5 — use it as a trigger to prompt reflection and connection with someone (it's not about the drink, it's about the ritual)",
      'Use your "dead time" to connect — airport lounges, commutes, waiting rooms',
    ],
    stats: [
      "Loneliness reduces life expectancy by 8 years",
      "Strong relationships increase survival odds by 50%",
      "Connected leaders are 5x more likely to be high-performing",
    ],
    resources: [
      { kind: "book", icon: BOOK, title: "The Five Love Languages", author: "Gary Chapman", note: "Understanding how others feel" },
      { kind: "book", icon: BOOK, title: "The Blue Zones", author: "Dan Buettner", note: "Read the book or watch the documentary" },
    ],
  },
  {
    spoke: "Your Recovery Zone",
    whyItMatters:
      "We can't fight battles on two fronts — home chaos equals work chaos. Your home should be your sanctuary, your recovery zone. When home is solid, you show up better everywhere else.",
    tips: [
      'Create one "no work" zone in your home',
      "Sunday family meeting — 15 minutes to align the week",
      "Display photos that remind you why you work — dream boards are never a bad idea",
      "Build your day around solid sleep — grounding sheets, cooling pad, blackout curtains. Why spend more on a car than your bed?",
      "Don't discuss important topics if it's past 10pm, you're hungry, tired, or if it's been a few too many",
    ],
    stats: [
      "Work-home conflict increases burnout risk by 230%",
      "Leaders with strong home life are 40% more resilient",
      "Family dinner 3x/week reduces anxiety by 25% in all family members",
      '"Sanctuary spaces" at home improve sleep quality by 30%',
    ],
    resources: [
      {
        kind: "book",
        icon: BOOK,
        title: "Men are like Waffles, Women are like Spaghetti",
        author: "Bill and Pam Farrel",
        note: "",
      },
    ],
  },
  {
    spoke: "Your Leadership Circle",
    whyItMatters:
      "Your network is your net worth, but your tribe is your true wealth. The people closest to you shape who you become. If you stopped reaching out, would they? Or have they stopped because you never responded?",
    tips: [
      "Join or create a monthly mastermind group (5-8 leaders)",
      "Quarterly coffee with someone who challenges your thinking",
      "Find mentors or hire a development coach",
      "Audit your inner circle — do they elevate or drain you?",
    ],
    stats: [
      "You become the average of your 5 closest associates",
      "Leaders with peer support groups are 70% less likely to burn out",
      "Mastermind participants report 30% faster goal achievement",
      "85% of jobs are filled through networking, not applications",
    ],
    resources: [
      { kind: "book", icon: BOOK, title: "10 Critical Laws of Relationships", author: "Rob Thompson", note: "" },
      { kind: "book", icon: BOOK, title: "The Go-Giver", author: "Bob Burg and John David Mann", note: "" },
      { kind: "text", icon: "", text: "Join local networking groups or a worship group" },
    ],
  },
  {
    spoke: "Your Imprint Spoke",
    whyItMatters:
      "Your imprint is the wake you leave behind — every room, every role, every resource you touch should be better because of you. Stewardship is about responsibly nurturing what you've been entrusted with: your finances, your career, your time, and your influence.",
    tips: [
      "The paper towel test — leave every space better than you found it, even when no one is watching",
      "Automate 20% to savings (pay yourself first) — steward your money so it funds your dreams",
      "Stay uncomfortable — pursue the hard goal that shows your kids what it looks like to succeed",
      "Ask yourself: if I left this role tomorrow, what imprint would I leave behind?",
    ],
    stats: [
      "Leaders who model accountability see 40% higher team trust and retention",
      "Children who watch parents pursue hard goals are 3x more likely to develop grit",
      "Leaders with 6-month emergency funds make 45% better strategic decisions",
      "Small acts of integrity compound — 82% of people follow the example set by the person before them",
    ],
    resources: [
      { kind: "book", icon: BOOK, title: "Extreme Ownership", author: "Jocko Willink and Leif Babin", note: "" },
      { kind: "book", icon: BOOK, title: "Stewardship", author: "Peter Block", note: "Choosing service over self-interest" },
      {
        kind: "link",
        icon: MONEY,
        before: "Run the ",
        linkText: "Stewardship Financial Assessment",
        after: " for a personalized financial health score, debt strategy, and savings roadmap →",
        href: "/stewardship",
        external: false,
      },
    ],
  },
  {
    spoke: "Your Adaptation Spoke",
    whyItMatters:
      "The blow often comes from blind spots — learning illuminates them before they hit. A good leader doesn't need to do more. They need to think more and solve bigger problems.",
    tips: [
      "20 minutes reading before bed (compounds to 12+ books/year)",
      "Listen to podcasts during your commute (turn dead time into growth)",
      "Teach what you learn — retention increases 90%",
      "Study failures — yours and others' (cheapest education available)",
    ],
    stats: [
      "Leaders who read 1+ book monthly earn 240% more",
      "Continuous learners are promoted 5x more often",
      "94% of employees would stay longer at companies that invest in their learning",
      "The half-life of skills is now just 5 years (down from 30)",
    ],
    resources: [
      { kind: "book", icon: BOOK, title: "The Magic of Thinking Big", author: "David J. Schwartz", note: "" },
      { kind: "book", icon: BOOK, title: "The Choice", author: "Og Mandino", note: "" },
    ],
  },
];
