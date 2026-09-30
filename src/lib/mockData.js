import {
  BookOpen,
  Bird,
  Blocks,
  BrainCircuit,
  Brain,
  Car,
  ChartLine,
  CircuitBoard,
  Compass,
  Cpu,
  Drama,
  Feather,
  Flame,
  Flower,
  Gamepad2,
  Gem,
  Hammer,
  Mountain,
  Music,
  Moon,
  Orbit,
  Palette,
  Sparkles,
  Sprout,
  Star,
  Sun,
  Swords,
  Volume2,
  Waves,
} from "lucide-react";

/* =============================================================
   MOCK DATA
   ------------------------------------------------------------
   Every number in this file is invented sample data for the
   prototype. Nothing here is read from a real device.
   ============================================================= */

export const MOCK_NOTE =
  "Sample data for the prototype. EEG, sensor and AI readings are simulated.";

export const heroIcons = [
  { label: "Focus", Icon: Brain },
  { label: "Games", Icon: Gamepad2 },
  { label: "Culture", Icon: Sprout },
  { label: "Crafts", Icon: Hammer },
  { label: "AI", Icon: Sparkles },
];

export const dashboardCards = [
  {
    id: "focus",
    to: "#/focus",
    kicker: "Focus",
    title: "Train your attention",
    body: "Short attention drills with a live focus estimate from your session.",
    Icon: Sprout,
    accent: "var(--a-focus)",
    tint: "rgba(147,166,255,0.16)",
  },
  {
    id: "play",
    to: "#/play",
    kicker: "Play",
    title: "Challenge your thinking",
    body: "Stories from our past turned into puzzles, memory grids and strategy mazes.",
    Icon: Blocks,
    accent: "var(--a-play)",
    tint: "rgba(255,209,102,0.15)",
  },
  {
    id: "discover",
    to: "#/discover",
    kicker: "Discover India",
    title: "Stories, history & civilization",
    body: "Walk through 5,000 years of settlements, kingdoms, art and invention.",
    Icon: BookOpen,
    accent: "var(--a-discover)",
    tint: "rgba(255,143,177,0.15)",
  },
  {
    id: "create",
    to: "#/create",
    kicker: "Create",
    title: "Traditional crafts & skills",
    body: "Shape a pot or carve a motif, with guided hand movements.",
    Icon: Palette,
    accent: "var(--a-create)",
    tint: "rgba(255,159,69,0.16)",
  },
];

/* ---------------- Core skills (mock baseline) ---------------- */
export const baseSkills = [
  { key: "focus", label: "Focus", value: 72, from: "var(--a-focus)", to: "#6cc6ff" },
  { key: "memory", label: "Memory", value: 64, from: "#ffd166", to: "#ff9f45" },
  { key: "strategy", label: "Strategy", value: 81, from: "#43d9c0", to: "#93a6ff" },
  { key: "creativity", label: "Creativity", value: 75, from: "#ff8fb1", to: "#ffd166" },
];

/* ---------------- Culture / game modules ---------------- */
export const cultureModules = [
  {
    id: "mahabharata",
    kicker: "Story",
    title: "Mahabharata",
    tagline: "Think like a strategist",
    body: "Step into the charioteer's seat and make the calls nobody sees.",
    kind: "decision",
    Icon: Swords,
    accent: "var(--a-play)",
    tint: "rgba(255,209,102,0.16)",
    meta: ["Strategy", "Decision making", "3 choices"],
  },
  {
    id: "chakravyuha",
    kicker: "Game",
    title: "Chakravyuha",
    tagline: "Find your way through",
    body: "A spinning wheel of layers. Each ring asks a different kind of thinking.",
    kind: "chakravyuha",
    Icon: Orbit,
    accent: "var(--a-focus)",
    tint: "rgba(147,166,255,0.16)",
    meta: ["5 layers", "10 questions", "Memory → Problem solving"],
  },
  {
    id: "pottery",
    kicker: "Craft",
    title: "Indian Pottery",
    tagline: "Learn through creation",
    body: "Shape a pot wheel-to-wheel with guided, steady hands.",
    kind: "pottery",
    Icon: Gem,
    accent: "var(--a-create)",
    tint: "rgba(255,159,69,0.16)",
    meta: ["Hand control", "Focus", "3 guides"],
  },
  {
    id: "carving",
    kicker: "Craft",
    title: "Traditional Carving",
    tagline: "Create with your hands",
    body: "Trace the lotus motif a wood-carver would outline before cutting.",
    kind: "carving",
    Icon: Compass,
    accent: "var(--a-create)",
    tint: "rgba(255,159,69,0.16)",
    meta: ["Line accuracy", "Patience", "3 guides"],
  },
  {
    id: "traditions",
    kicker: "Culture",
    title: "Indian Traditions",
    tagline: "Explore our heritage",
    body: "Match each tradition to its home, and remember it a second later.",
    kind: "memory",
    Icon: Drama,
    accent: "var(--a-discover)",
    tint: "rgba(255,143,177,0.15)",
    meta: ["6 pairs", "Memory", "2 min"],
  },
];

/* ---------------- Chakravyuha content ---------------- */
export const chakraLayers = [
  {
    n: 1,
    name: "Memory",
    ring: "The outermost ring turns slowly. Remember what you saw.",
    color: "#93a6ff",
    questions: [
      {
        q: "At Kurukshetra, the Bhagavad Gita is a conversation between two people. Who asks the questions, and who answers them?",
        options: [
          "Arjuna asks, Krishna answers",
          "Krishna asks, Arjuna answers",
          "Bhishma asks, Karna answers",
          "Duryodhana asks, Shakuni answers",
        ],
        answer: 0,
        why: "Arjuna was unsure about what he should do. Krishna answered with the teaching of dharma — do what is right, not only what feels easy.",
      },
      {
        q: "Just before the battle, Arjuna's bow slipped from his hands and he could not lift it again. What did he use to tighten the bowstring?",
        options: ["A small spinning wheel", "A length of rope", "A flat stone", "Only his two hands"],
        answer: 0,
        why: "He used a small wheel called a chakra. The same word gives us the spinning discus — and the name of the challenge on this screen.",
      },
    ],
  },
  {
    n: 2,
    name: "Pattern Recognition",
    ring: "The second ring repeats. Spot the rule and it stops being noise.",
    color: "#6cc6ff",
    questions: [
      {
        q: "A rangoli is drawn by repeating one shape around a centre. What is the rule behind the design?",
        options: [
          "The same shape repeats and rotates, growing out from the centre",
          "The shapes shrink as they move inward",
          "Every corner is different, with no repetition",
          "The pattern only exists in the outer border",
        ],
        answer: 0,
        why: "Rangoli, mandala and many temple carvings are built from one shape repeated and turned around a centre. Find the repeat and the whole design explains itself.",
      },
      {
        q: "A weaver counts “pull, lift, pull, lift” to build one row of a Banarasi sari. What skill is the weaver using?",
        options: ["Pattern recognition", "Storytelling", "Guesswork", "Repetition for its own sake"],
        answer: 0,
        why: "Pattern recognition means noticing the rule that repeats — then using it to predict what comes next. That is the core of learning maths, music and reading.",
      },
    ],
  },
  {
    n: 3,
    name: "Decision Making",
    ring: "The third ring forks. More than one path can look reasonable.",
    color: "#43d9c0",
    questions: [
      {
        q: "Krishna gives Arjuna two possible approaches. Which choice shows strategic thinking?",
        options: [
          "Remove the charioteer from his side so he does not have to fight",
          "Fight fairly, keep to his duty, and choose the moment that protects everyone",
          "Leave the field quietly and say nothing",
          "Move only when nobody is watching",
        ],
        answer: 1,
        why: "Strategic thinking means choosing an action for a long-term good reason instead of the one that feels strongest right now. Krishna's answer balances duty, fairness and timing.",
      },
      {
        q: "Arjuna lowers his bow and asks one more question. What kind of decision-making does that model?",
        options: [
          "Pausing to check before choosing",
          "Waiting for someone else to choose",
          "Avoiding every difficult decision",
          "Changing the question until it is easier",
        ],
        answer: 0,
        why: "Asking one more clear question before acting is good judgement. It costs a moment and prevents a much larger mistake later.",
      },
    ],
  },
  {
    n: 4,
    name: "Strategy",
    ring: "The fourth ring moves in straight lines. Strength has to be placed, not scattered.",
    color: "#ffd166",
    questions: [
      {
        q: "In a game of strategy, why is it often smarter to hold one important spot than to defend everywhere?",
        options: [
          "Because defending is more fun",
          "Because holding a key point protects everything behind it",
          "Because it looks stronger to others",
          "Because you get tired less often",
        ],
        answer: 1,
        why: "Strength spread thin is weak everywhere. Protect the point that matters most and it protects the rest — the same idea in chess, in planning and in study routines.",
      },
      {
        q: "Before Hanuman crossed the ocean, his first thought was to learn about it, not to jump in. What does that show?",
        options: ["Preparing before acting", "Avoiding a challenge", "Being slow on purpose", "Asking friends to go first"],
        answer: 0,
        why: "Gathering the right information first is not delay — it is how you make the next action count. That is preparation, and it is a strategy skill.",
      },
    ],
  },
  {
    n: 5,
    name: "Problem Solving",
    ring: "The innermost ring. Solve the cause, not the symptom.",
    color: "#ff9f45",
    questions: [
      {
        q: "Subhadra was trained in the art of war so she could choose when to fight and when to keep the peace. Which skill is that?",
        options: [
          "Knowing when to act and when to wait",
          "Fighting more often",
          "Never asking questions",
          "Copying someone else's plan",
        ],
        answer: 0,
        why: "Knowing the difference between the two is what separates a reaction from a plan. It is one of the hardest skills there is, in games and in life.",
      },
      {
        q: "A potter's wheel spins too fast and the clay wobbles off. What is the best first fix?",
        options: [
          "Add more water to soften the clay",
          "Slow the wheel and steady the clay with firm hands",
          "Throw the clay away and start over",
          "Wait for the wheel to stop on its own",
        ],
        answer: 1,
        why: "A good fix solves the real cause — speed — instead of adding water and making the clay slip. Change the cause, not the symptom.",
      },
    ],
  },
];

export const chakraCentre = {
  name: "The Centre",
  text: "You reached the centre. Six layers of thinking, one calm moment — that is the whole idea of Chakravyuha.",
};

/* ---------------- Mahabharata decision story ---------------- */
export const mahabharata = {
  intro:
    "The Pandavas and Kauravas are two families of one kingdom. Both have a claim to it. The field of Kurukshetra is set, and both sides have chariots, banners and plans. You ride with the Pandavas.",
  scenes: [
    {
      n: 1,
      title: "The two armies",
      text: "From your chariot you can see both camps. The Kaurava line is wide and confident. The Pandava line is small but well-trained. Before the first arrow is loosed, what do you do?",
      options: [
        {
          label: "Count their strength first",
          good: true,
          result: "You count banners, watch how the archers stand, and find their left flank is thin. Knowledge first — you now know where the day can be won.",
          insight: "Strategic thinkers gather information before they commit.",
        },
        {
          label: "Charge the centre immediately",
          good: false,
          result: "The centre holds. You lose the better part of the morning and arrive late to the fight that mattered.",
          insight: "Moving early is not the same as moving wisely.",
        },
        {
          label: "Wait and do nothing",
          good: false,
          result: "The day passes without a decision. Waiting is a choice too — and this one cost you the initiative.",
          insight: "Delay only helps when it is deliberate.",
        },
      ],
    },
    {
      n: 2,
      title: "Krishna's counsel",
      text: "Evening before the battle. Arjuna is troubled. Krishna does not order him — he explains, and asks him to choose. What do you take from the conversation?",
      options: [
        {
          label: "Do your duty, but do it with care",
          good: true,
          result: "You carry the teaching into the morning: a clear duty, a fair method, and a steady mind. The army rests well and wakes ready.",
          insight: "Dharma without care becomes recklessness.",
        },
        {
          label: "Follow whoever wins",
          good: false,
          result: "Your side has no plan beyond guesswork. Soldiers notice, and confidence slips before the first arrow.",
          insight: "Chasing outcomes is not a plan.",
        },
        {
          label: "Refuse the fight entirely",
          good: false,
          result: "The kingdom still has to be governed, and someone must decide. Avoiding the choice does not remove the choice.",
          insight: "Some decisions cannot be postponed.",
        },
      ],
    },
    {
      n: 3,
      title: "The turn of the battle",
      text: "The Kaurava formation is strong. You have one chance to change the shape of the day. Which move do you make?",
      options: [
        {
          label: "Split your force and attack where they are weakest",
          good: true,
          result: "Two smaller pushes, aimed at the same weakness. Neither looks like enough on its own — together they are.",
          insight: "Two focused efforts beat one scattered one.",
        },
        {
          label: "Attack everything at once",
          good: false,
          result: "Every push is thin. Nothing breaks, and nothing is left for the next hour.",
          insight: "Spreading out strength is how strength disappears.",
        },
        {
          label: "Hold position and hope",
          good: false,
          result: "The formation holds, but the day slips away on its own. Hope is not a strategy.",
          insight: "Waiting is a decision — choose it on purpose.",
        },
      ],
    },
  ],
};

/* ---------------- Traditions memory match ---------------- */
export const traditionPairs = [
  { id: "t1", name: "Kathakali", from: "Kerala", Icon: Drama },
  { id: "t2", name: "Bharatanatyam", from: "Tamil Nadu", Icon: Feather },
  { id: "t3", name: "Sitar", from: "Rajasthan", Icon: Music },
  { id: "t4", name: "Rangoli", from: "Every home", Icon: Flower },
  { id: "t5", name: "Diwali lamps", from: "North India", Icon: Flame },
  { id: "t6", name: "Madhubani art", from: "Bihar", Icon: Palette },
  { id: "t7", name: "Panjabi dhol", from: "Punjab", Icon: Volume2 },
  { id: "t8", name: "Puri chariot", from: "Odisha", Icon: Sun },
];

/* ---------------- Civilization timeline ---------------- */
export const timeline = [
  {
    era: "c. 7000 BCE",
    name: "Mehrgarh",
    region: "Balochistan",
    Icon: Sprout,
    text: "One of the earliest farming settlements in South Asia. Wheat, barley and herded animals — the first steps towards settled life.",
  },
  {
    era: "c. 2600 BCE",
    name: "Indus Valley Civilisation",
    region: "Gujarat to Pakistan",
    Icon: Blocks,
    text: "Planned cities with drains, baked bricks and standardised weights. The world's earliest known urban planning.",
  },
  {
    era: "c. 1500 BCE",
    name: "Vedic age",
    region: "North India",
    Icon: BookOpen,
    text: "The Vedas are composed and taught. Oral tradition, memory and recitation become a formal art.",
  },
  {
    era: "c. 322 BCE",
    name: "Mauryan Empire",
    region: "Subcontinent",
    Icon: Mountain,
    text: "Chandragupta Maurya builds the first empire spanning most of South Asia, with roads, trade and a remarkable administration.",
  },
  {
    era: "c. 320–550 CE",
    name: "Gupta age",
    region: "North India",
    Icon: Gem,
    text: "Often called a golden age: temple architecture, astronomy, mathematics and literature flourish together.",
  },
  {
    era: "c. 850–1279",
    name: "Chola dynasty",
    region: "Tamil Nadu",
    Icon: Waves,
    text: "Temple towns and bronze casting of remarkable detail, plus a long reach across the sea to Sri Lanka and Southeast Asia.",
  },
  {
    era: "c. 1526–1707",
    name: "Mughal period",
    region: "North & central India",
    Icon: Sun,
    text: "Mughal gardens, miniature painting, cuisine and architecture that still shape Indian cities today.",
  },
  {
    era: "Today",
    name: "Living traditions",
    region: "Across India",
    Icon: Orbit,
    text: "Crafts, music, games and stories are still taught by hand — which is why BharatPlay is built around doing, not just reading.",
  },
];

/* ---------------- Craft guides (viewBox units 0-100) ---------------- */
export const craftGuides = {
  pottery: {
    label: "Pottery",
    unit: "Pot",
    hint: "Drag along the guide line. Keep a steady hand — a real potter works in circles, one revolution at a time.",
    guides: [
      { name: "The rim", points: [[38, 16], [50, 14], [62, 16]] },
      {
        name: "The wall",
        points: [
          [38, 16], [35, 24], [36, 31], [42, 36], [50, 37.5], [58, 36],
          [64, 31], [65, 24], [62, 16],
        ],
      },
      { name: "The foot", points: [[34, 62], [42, 78], [50, 82], [58, 78], [66, 62]] },
    ],
  },
  carving: {
    label: "Carving",
    unit: "Motif",
    hint: "Trace the motif a wood-carver would mark before cutting. Slow lines score better than fast ones.",
    guides: [
      {
        name: "Lotus outline",
        points: [
          [50, 88], [50, 74], [42, 70], [32, 68], [24, 60], [24, 48],
          [34, 38], [50, 32], [66, 38], [76, 48], [76, 60], [68, 68], [58, 70], [50, 74],
        ],
      },
      {
        name: "Centre vein",
        points: [[50, 88], [50, 74], [50, 56], [50, 32]],
      },
      {
        name: "Side veins",
        points: [[50, 70], [38, 60], [32, 48], [50, 56], [62, 60], [68, 48]],
      },
    ],
  },
};

/* ---------------- Craft kit sensors (simulated) ---------------- */
export const craftSensors = [
  { key: "motion", label: "Motion Sensor", unit: "mm/s", range: [0, 180] },
  { key: "pressure", label: "Pressure Sensor", unit: "N", range: [0, 12] },
  { key: "temp", label: "Clay Temperature", unit: "°C", range: [15, 40] },
];

/* ---------------- Focus game symbols ---------------- */
export const focusSymbols = [
  { key: "lotus", label: "Lotus", Icon: Flower },
  { key: "star", label: "Star", Icon: Star },
  { key: "sun", label: "Sun", Icon: Sun },
  { key: "moon", label: "Moon", Icon: Moon },
  { key: "flame", label: "Lamp", Icon: Flame },
  { key: "bird", label: "Peacock", Icon: Bird },
];

/* ---------------- Progress report (mock history) ---------------- */
export const reportBaseline = {
  focus: 78,
  accuracy: 84,
  problemSolving: 81,
  strategy: 76,
  creativity: 88,
  craft: 72,
};

export const sessionHistory = [
  { label: "S1", focus: 58, strategy: 61, creativity: 64, accuracy: 66 },
  { label: "S2", focus: 63, strategy: 62, creativity: 69, accuracy: 70 },
  { label: "S3", focus: 61, strategy: 67, creativity: 72, accuracy: 73 },
  { label: "S4", focus: 68, strategy: 70, creativity: 74, accuracy: 78 },
  { label: "S5", focus: 72, strategy: 71, creativity: 79, accuracy: 80 },
  { label: "S6", focus: 75, strategy: 74, creativity: 85, accuracy: 82 },
  { label: "S7", focus: 78, strategy: 76, creativity: 88, accuracy: 84 },
];

export const insightBank = [
  {
    title: "Creative problem solving is your strongest area",
    body: "Your craft and pattern scores have risen faster than your strategy scores over the last three sessions. Try one Chakravyuha decision layer this week to close that gap — it asks you to choose between two good options instead of finding one right answer.",
    focus: "Strategy",
  },
  {
    title: "Your focus holds longer when the goal is physical",
    body: "Sessions that ended in a craft trace or a drive finish stayed stable for longer than puzzle-only sessions. Pair one brain task with one hands-on task next time and watch the difference.",
    focus: "Focus",
  },
  {
    title: "Accuracy improves fastest on memory drills",
    body: "Your memory accuracy moved the most between session 4 and session 5, right after you added short recall rounds. Keep rounds under 30 seconds and keep them daily.",
    focus: "Memory",
  },
];

/* ---------------- How BharatPlay works ---------------- */
export const flowNodes = [
  {
    id: "user",
    label: "The Explorer",
    sub: "A child or adult learning",
    Icon: Sprout,
    title: "You",
    text: "Everything starts with one curious person. BharatPlay asks no real login, no email and no personal questions in this prototype.",
  },
  {
    id: "app",
    label: "BharatPlay App",
    sub: "Stories, games, crafts",
    Icon: Blocks,
    title: "The BharatPlay app",
    text: "A single screen holds focus training, culture games, craft guides and your progress report. Every activity is a few taps away.",
  },
  {
    id: "hardware",
    label: "Smart hardware",
    sub: "Headset, RC car, craft kit",
    Icon: CircuitBoard,
    title: "Optional smart hardware",
    text: "An EEG headset for attention estimation, an RC car for focus driving, and a craft kit with motion and pressure sensors. All of it is optional — the games work without them.",
  },
  {
    id: "esp",
    label: "ESP32 & sensors",
    sub: "Reads the kit, sends readings",
    Icon: Cpu,
    title: "ESP32 controller and sensors",
    text: "A small microcontroller in the craft kit and RC car reads motion, pressure and battery, then passes simple readings to the app.",
  },
  {
    id: "ai",
    label: "AI analysis",
    sub: "Finds patterns across sessions",
    Icon: Sparkles,
    title: "AI analysis",
    text: "Gameplay results and attention estimates from each session are compared. Patterns become one short, plain-language insight.",
  },
  {
    id: "report",
    label: "Progress report",
    sub: "What to practise next",
    Icon: ChartLine,
    title: "Your progress report",
    text: "Six skill scores, a seven-session trend and one next step. Progress you can see is progress you keep.",
  },
];

export const hardwareCards = [
  {
    title: "EEG headset",
    Icon: BrainCircuit,
    points: [
      "Estimates attention from forehead signals",
      "Used only to make a game harder or easier",
      "Nothing is recorded or shared in this prototype",
    ],
  },
  {
    title: "Smart RC car",
    Icon: Car,
    points: [
      "A physical track the player must stay focused on",
      "Steering is slow when attention dips",
      "Battery and connection shown as demo readings",
    ],
  },
  {
    title: "Smart craft kit",
    Icon: Hammer,
    points: [
      "Motion and pressure sensors under the work board",
      "Guides hand steadiness while shaping",
      "Readings are simulated in this prototype",
    ],
  },
];

export const privacyPoints = [
  {
    title: "Minimal personal information",
    text: "This prototype asks for no name, email, phone number or photo. It stores only your scores so the progress report can grow.",
  },
  {
    title: "User-controlled sessions",
    text: "Every session is started and stopped by you. There is no background tracking, and clearing your progress resets everything.",
  },
  {
    title: "EEG data for learning only",
    text: "Attention estimates would be used only to adjust difficulty during a game. In this prototype every reading is generated in the browser — no device is contacted.",
  },
  {
    title: "Local storage in the prototype",
    text: "Scores live in your own browser storage for the demo. There is no account server behind this build, and no data leaves your device.",
  },
];

export const growthItems = [
  { title: "More culture modules", text: "Each state has its own games, stories and instruments.", Icon: BookOpen },
  { title: "Regional crafts", text: "Each craft gets its own guided trace and tool kit.", Icon: Hammer },
  { title: "Story-based levels", text: "Longer arcs where one decision changes the next scene.", Icon: Feather },
  { title: "Classroom mode", text: "A teacher view for groups, streaks and shared goals.", Icon: Blocks },
];
