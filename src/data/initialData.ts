import { Theme, Resource, Homework, MicroLesson, Session, UserGrowthProfile, JournalEntry } from '../types/therapy';

export const INITIAL_THEMES: Theme[] = [
  {
    id: 'theme-boundaries',
    name: 'Boundaries & Guilt Tolerance',
    category: 'Relational',
    description: 'Separating your emotional responsibility from others. Saying no without over-explaining and tolerating the temporary guilt.',
    color: '#2D5A43', // deep sage
    masteryLevel: 3,
    growthPoints: 340,
    modality: 'DBT',
    affirmation: 'I can love someone deeply and still say no to protect my nervous system.',
    personalTriggers: ['Family group chats after 8 PM', 'Colleagues asking for last-minute help'],
  },
  {
    id: 'theme-somatics',
    name: 'Somatic Nervous System Regulation',
    category: 'Physiological',
    description: 'Noticing bodily cues of hyperarousal (tight chest, shallow breath) and using physical grounding anchors before reacting.',
    color: '#4B7B94', // serene oceanic blue
    masteryLevel: 2,
    growthPoints: 210,
    modality: 'Somatic Experiencing',
    affirmation: 'My body is safe right now; this is an echo of the past, not danger in the present.',
    personalTriggers: ['Sudden critical feedback', 'Feeling trapped in meeting rooms'],
  },
  {
    id: 'theme-reframe',
    name: 'Cognitive Reframing & Thought Records',
    category: 'Cognitive',
    description: 'Catching cognitive distortions (all-or-nothing thinking, catastrophizing, mind-reading) and evaluating real evidence.',
    color: '#9C6644', // warm terracotta
    masteryLevel: 4,
    growthPoints: 480,
    modality: 'CBT',
    affirmation: 'Thoughts are automatic hypotheses, not verified courtroom facts.',
    personalTriggers: ['Vague Slack messages from boss', 'Unanswered phone calls'],
  },
  {
    id: 'theme-compassion',
    name: 'IFS Parts Work & Inner Critic',
    category: 'Parts Work',
    description: 'Befriending the perfectionist protector parts of self and offering compassion to vulnerable exiled feelings.',
    color: '#6A5D7B', // gentle lavender slate
    masteryLevel: 3,
    growthPoints: 290,
    modality: 'IFS',
    affirmation: 'Every part of me has a positive protective intention, even the anxious critic.',
    personalTriggers: ['Making a minor mistake in public', 'Procrastination spirals'],
  },
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Polyvagal Exercises for Safety & Connection',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=br8-q64BFHY',
    authorOrCreator: 'Deb Dana, LCSW & The Embody Lab',
    notes: 'Dr. Evelyn recommended this in Session #4 to explain why my throat tightens when I try to speak up at work.',
    distilledTakeaways: [
      'The nervous system scans for cues of safety vs. danger 24/7 (neuroception) before conscious logic kicks in.',
      'A physiological sigh (two quick inhales through nose, one long sigh out mouth) physically triggers the parasympathetic brake.',
      'Ventrovagal state allows social engagement; dorsal vagal causes shut down and numbness.',
    ],
    coreQuoteOrInsight: 'Story follows state. Change your physiological state first before trying to argue with your anxious thoughts.',
    microAction: 'Do 3 physiological sighs before answering difficult emails or speaking in meetings.',
    journalPrompt: 'What cues in my environment or interpersonal conversations trigger my nervous system into hyper-vigilance?',
    relatedThemeId: 'theme-somatics',
    completed: true,
    isAssignedByTherapist: true,
    estimatedTimeMinutes: 14,
    assignedDate: '2026-11-04',
    platformBadge: 'YouTube Video',
  },
  {
    id: 'res-2',
    title: 'Set Boundaries, Find Peace (Chapter 3: The Cost of People-Pleasing)',
    type: 'book',
    authorOrCreator: 'Nedra Glover Tawwab',
    notes: 'Therapist assigned chapter 3: "Recognizing Invisible Boundaries and the Resentment Meter".',
    distilledTakeaways: [
      'Resentment is your internal smoke alarm letting you know a boundary has been crossed or unexpressed.',
      'Guilt is a natural byproduct of breaking old compliance patterns, not evidence that you did something wrong.',
      'Clear is kind: indirect hints create anxiety for both parties.',
    ],
    coreQuoteOrInsight: 'Guilt is the price of admission to a peaceful, authentic life.',
    microAction: 'Practice saying: "I want to be fully present when I commit, and right now I don’t have capacity." without adding an excuse.',
    journalPrompt: 'Where in my life am I feeling simmering resentment right now, and what boundary does it point to?',
    relatedThemeId: 'theme-boundaries',
    completed: false,
    isAssignedByTherapist: true,
    estimatedTimeMinutes: 25,
    assignedDate: '2026-11-06',
    platformBadge: 'Book Chapter',
  },
  {
    id: 'res-3',
    title: 'Carousel: "4 Signs You’re in an Emotional Flashback vs. Present Distress"',
    type: 'social_post',
    url: 'https://instagram.com/theholisticpsychologist',
    authorOrCreator: 'Dr. Nicole LePera (@theholisticpsychologist)',
    notes: 'Found this saved post after discussing why critical feedback from my boss triggered feelings of being a helpless 8-year-old.',
    distilledTakeaways: [
      'Disproportionate reaction intensity (scale 9/10 reaction to a 3/10 event) is a hallmark of an emotional flashback.',
      'Somatic cues: feeling small, sudden temperature drop, or urge to flee/isolate.',
      'Anchor phrase: "I am an adult in 2026, I have choices, resources, and safety right now."',
    ],
    coreQuoteOrInsight: 'The feeling is old, but the moment is new.',
    microAction: 'Touch both feet flat to the floor and name 3 objects in the room you could not have seen as a child.',
    journalPrompt: 'When was the last time I felt suddenly childlike or powerless, and what historical memory was it echoing?',
    relatedThemeId: 'theme-somatics',
    completed: true,
    isAssignedByTherapist: false,
    estimatedTimeMinutes: 4,
    assignedDate: '2026-11-02',
    platformBadge: 'Instagram Post',
  },
  {
    id: 'res-4',
    title: 'Clinical Handout: The 7-Column CBT Thought Record',
    type: 'article',
    authorOrCreator: 'Beck Institute for Cognitive Behavior Therapy',
    notes: 'Handout from Dr. Evelyn to test the belief: "If I let people down, they will abandon me."',
    distilledTakeaways: [
      'Automatic thoughts are hypotheses, not verified courtroom facts.',
      'Separating the objective situation from your emotional interpretation prevents spiraling.',
      'Alternative balanced thoughts must be believable to the emotional brain, not just superficial positive thinking.',
    ],
    coreQuoteOrInsight: 'Don’t believe everything you think.',
    microAction: 'Write down 2 pieces of factual evidence that contradict your worst-case prediction.',
    journalPrompt: 'What catastrophe did I predict would happen that actually turned out completely manageable?',
    relatedThemeId: 'theme-reframe',
    completed: false,
    isAssignedByTherapist: true,
    estimatedTimeMinutes: 10,
    assignedDate: '2026-11-05',
    platformBadge: 'Therapy Handout',
  },
];

export const INITIAL_HOMEWORK: Homework[] = [
  {
    id: 'hw-1',
    title: 'The 24-Hour Boundary Delay',
    category: 'Behavioral Experiment',
    description: 'When asked for an extra favor, project, or commitment, pause and respond: "Let me check my calendar/capacity and get back to you by tomorrow."',
    suggestedFrequency: 'Whenever a non-urgent request arises',
    relatedThemeId: 'theme-boundaries',
    status: 'in_progress',
    difficultyRating: 4,
    reflectionNotes: 'Tried this with my coworker on Tuesday. My heart raced, but they just said "Sounds good, no rush!" It was such a relief.',
    xpReward: 50,
    linkedResourceId: 'res-2',
    sessionId: 'session-4',
  },
  {
    id: 'hw-2',
    title: '3-Minute Somatic Grounding at Desk',
    category: 'Somatic Practice',
    description: 'Twice daily or whenever chest tightness starts: 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) for 4 cycles with hand placed over sternum.',
    suggestedFrequency: 'Twice daily',
    relatedThemeId: 'theme-somatics',
    status: 'completed',
    difficultyRating: 2,
    reflectionNotes: 'Doing this right before the 2 PM team standup dropped my heart rate and helped me speak without shaky hands.',
    completedAt: '2026-11-08',
    xpReward: 35,
    linkedResourceId: 'res-1',
    sessionId: 'session-4',
  },
  {
    id: 'hw-3',
    title: 'Catch the "Shoulds" Audit',
    category: 'Cognitive Reframe',
    description: 'Notice every time you think "I should have done more" or "I shouldn’t feel tired". Reframe to: "I prefer to do more, but my body has real human limits today."',
    suggestedFrequency: 'Daily awareness',
    relatedThemeId: 'theme-reframe',
    status: 'pending',
    xpReward: 40,
    sessionId: 'session-3',
  },
  {
    id: 'hw-4',
    title: 'Watch Polyvagal Video & Note 1 Insight',
    category: 'Media / Reading',
    description: 'Watch the assigned Deb Dana video and write down what your personal dorsal vagal shut-down looks like.',
    suggestedFrequency: 'Once before next session',
    relatedThemeId: 'theme-somatics',
    status: 'completed',
    completedAt: '2026-11-07',
    reflectionNotes: 'Realized that when I doomscroll for 2 hours, that is actually my nervous system freezing in dorsal vagal.',
    xpReward: 30,
    linkedResourceId: 'res-1',
    sessionId: 'session-4',
  },
];

export const INITIAL_MICRO_LESSONS: MicroLesson[] = [
  {
    id: 'ml-1',
    title: 'The Guilt vs. Resentment Tradeoff',
    concept: 'When we struggle with boundaries, we often sacrifice our future peace to avoid immediate discomfort. Saying "Yes" when you want to say "No" saves you 5 minutes of guilt today, but buys you 3 weeks of silent, bitter resentment tomorrow.',
    practicalApplication: 'When hesitating, ask yourself: "Would I rather feel 10 minutes of clean, uncomfortable guilt right now, or days of slow-burning resentment toward this person later?"',
    reflectionPrompt: 'Who in your life are you currently feeling irritated or cold with, and what unstated boundary is waiting there?',
    quiz: {
      question: 'A friend asks you to help them move furniture on your only free Saturday morning. You are exhausted. What does healthy boundary awareness suggest?',
      options: [
        'Agree immediately because saying no makes you a terrible friend.',
        'Make up an elaborate false medical excuse to prevent them from feeling rejected.',
        'Acknowledge that feeling guilty is normal, but kindly decline to protect your nervous system.',
        'Ignore the message for three days and pretend you never saw it.'
      ],
      correctIndex: 2,
      explanation: 'Healthy boundaries tolerate the normal sting of guilt in order to prevent long-term burnout and resentment.'
    },
    relatedThemeId: 'theme-boundaries',
    completed: true,
    completedAt: '2026-11-08',
    xpReward: 45,
    userAnswerIndex: 2,
  },
  {
    id: 'ml-2',
    title: 'The Window of Tolerance & Micro-Breaks',
    concept: 'Dr. Dan Siegel’s "Window of Tolerance" is the optimal arousal zone where you can think clearly, process emotions, and stay grounded. When stressed, you either spike into hyperarousal (anxiety, rage, racing heart) or crash into hypoarousal (numbness, lethargy, detachment).',
    practicalApplication: 'Check your arousal meter right now (1 = numb/frozen, 5 = calm & clear, 10 = overwhelmed/panicking). If above 7, place an ice cube on your wrist or take 3 slow exhales.',
    reflectionPrompt: 'What is the earliest subtle warning sign that your body is leaving its Window of Tolerance?',
    quiz: {
      question: 'You notice your jaw clenching, your emails getting rushed, and you feel irritated at small noises. Which state are you in?',
      options: [
        'Optimal Window of Tolerance',
        'Spiking into Hyperarousal (fight/flight activation)',
        'Dorsal Vagal Hypoarousal (shutdown/freeze)',
        'Pure relaxation'
      ],
      correctIndex: 1,
      explanation: 'Jaw tension, irritability, and rushing are classic markers of sympathetic nervous system hyperarousal.'
    },
    relatedThemeId: 'theme-somatics',
    completed: false,
    xpReward: 45,
  },
  {
    id: 'ml-3',
    title: 'Dismantling "Catastrophic Mind-Reading"',
    concept: 'Mind reading happens when we assume we know what others are thinking without direct evidence—and we usually assume they are judging or disliking us. In reality, people are 95% preoccupied with their own insecurities and busy lives.',
    practicalApplication: 'Catch yourself thinking "They think I\'m incompetent." Ask: "Have they explicitly said that? Or is my anxious brain writing a fictional horror script?"',
    reflectionPrompt: 'What is a benign or neutral explanation for someone’s short reply or delay in responding?',
    quiz: {
      question: 'Your boss sends a message: "Do you have 5 minutes this afternoon?" What is the most cognitive-distortion-free interpretation?',
      options: [
        'I am definitely getting fired or put on probation.',
        'I messed up the project from yesterday and everyone knows it.',
        'They have an open question or quick sync topic that could be about anything.',
        'They are angry at me for taking a lunch break.'
      ],
      correctIndex: 2,
      explanation: 'A neutral, evidence-based stance refuses to jump to worst-case conclusions before actual facts are presented.'
    },
    relatedThemeId: 'theme-reframe',
    completed: false,
    xpReward: 45,
  },
];

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'session-4',
    sessionNumber: 4,
    date: '2026-11-04',
    counselorName: 'Dr. Evelyn Brooks, LMFT',
    focusTheme: 'Navigating Overwhelm, Boundaries with Family & Workplace Guilt',
    rawNotes: `Discussed why saying "no" to my sister's requests triggers deep somatic tightness in my throat and solar plexus.
Dr. Brooks pointed out that I conflate "being kind" with "being self-sacrificing".
We mapped out how my childhood role was the "peacekeeper who doesn't cause trouble."
Key breakthrough: When I say "yes" out of guilt, I end up venting and feeling resentful later anyway, so nobody actually wins.
Dr. Brooks recommended Nedra Glover Tawwab's book chapter on resentment and assigned the 24-hour delay experiment.
She also taught me the physiological sigh to regulate my nervous system before answering triggering phone calls.`,
    summary: 'Explored the root of people-pleasing as an old safety mechanism. Replaced automatic compliance with a 24-hour buffer and physiological resets.',
    keyInsights: [
      'Resentment is an unexpressed boundary screaming for attention.',
      'Guilt is not evidence of wrongdoing; it is just the unfamiliarity of prioritizing yourself.',
      'Somatic cues (throat tightness) appear before conscious thoughts—listen to the body first.',
    ],
    emotionBefore: 'Overwhelmed & Anxious (7/10)',
    emotionAfter: 'Grounded & Validated (4/10)',
    homeworkIds: ['hw-1', 'hw-2', 'hw-4'],
    resourceIds: ['res-1', 'res-2'],
    themes: ['Boundaries & Guilt Tolerance', 'Somatic Nervous System Regulation'],
    counselorAdvice: 'Remember: Your peace is worth 10 minutes of someone else’s temporary disappointment.',
    createdAt: '2026-11-04T15:30:00Z',
  },
  {
    id: 'session-3',
    sessionNumber: 3,
    date: '2026-10-21',
    counselorName: 'Dr. Evelyn Brooks, LMFT',
    focusTheme: 'Deconstructing the Harsh Inner Critic & Imposter Spirals',
    rawNotes: `Focused on my work project launch and the constant voice saying "You're going to be found out."
We identified this as classic imposter phenomenon mixed with All-or-Nothing thinking.
Dr. Brooks asked: "Whose voice does that critic sound like?" We traced it back to high school expectations.
Practiced writing a CBT thought record: disputing the idea that making a minor formatting error equals total failure.
Homework was to catch "should" statements throughout the day and practice speaking to myself like a close mentor.`,
    summary: 'Identified the lineage of the inner critic and practiced CBT thought disputing to counter perfectionistic spirals.',
    keyInsights: [
      'The inner critic was originally an adaptive defense trying to protect you from criticism by criticizing you first.',
      'Perfectionism is just shame wearing formal attire.',
      'Evidence-based thinking is more reliable than emotional reasoning.',
    ],
    emotionBefore: 'Defeated & Stressed (8/10)',
    emotionAfter: 'Relieved & Compassionate (4/10)',
    homeworkIds: ['hw-3'],
    resourceIds: ['res-3', 'res-4'],
    themes: ['Cognitive Reframing & Thought Records', 'Self-Compassion & Inner Critic Dialogue'],
    counselorAdvice: 'Talk to yourself the way you talk to someone you deeply love and believe in.',
    createdAt: '2026-10-21T16:00:00Z',
  },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-1',
    date: '2026-11-08',
    mode: 'Boundary Check-in',
    topic: 'Declining weekend work slack messages',
    content: `I almost logged into Slack at 9 PM on a Saturday because a notification popped up from marketing. My stomach knotted up immediately.
I used Soma to walk through my hesitation. I remembered Dr. Brooks saying "guilt is the price of admission to peace."
I turned off notifications and put the phone in another room. The anxiety stayed for about 15 minutes, then faded. I actually slept through the night!`,
    aiFeedback: 'What a profound victory! You tolerated the temporary spike of guilt and gave your nervous system real proof that the world does not end when you step away.',
    moodTag: 'Proud & Relieved',
    keyTakeaway: 'Anxiety peaked at minute 10, then dissipated naturally.',
  },
];

export const INITIAL_USER_PROFILE: UserGrowthProfile = {
  name: 'Taylor',
  counselorName: 'Dr. Evelyn Brooks, LMFT',
  nextSessionDate: '2026-11-18',
  lastSessionDate: '2026-11-04',
  currentStreak: 6,
  totalXP: 580,
  gardenLevel: 3, // Sapling
  waterDroplets: 4,
  badges: [
    {
      id: 'b-1',
      name: 'First Growth Sprout',
      icon: '🌱',
      description: 'Began the journey of intentional between-session reflection.',
      unlockedAt: '2026-10-22',
      category: 'streak',
    },
    {
      id: 'b-2',
      name: 'Boundary Pioneer',
      icon: '🛡️',
      description: 'Completed your first behavioral boundary experiment in the wild.',
      unlockedAt: '2026-11-06',
      category: 'homework',
    },
    {
      id: 'b-3',
      name: 'Somatic Grounder',
      icon: '🌊',
      description: 'Practiced 5 nervous system breath resets during moments of hyperarousal.',
      unlockedAt: '2026-11-08',
      category: 'learning',
    },
    {
      id: 'b-4',
      name: 'Insight Alchemist',
      icon: '✨',
      description: 'Synthesized 3 therapy resources into actionable daily micro-actions.',
      unlockedAt: '2026-11-07',
      category: 'learning',
    },
    {
      id: 'b-5',
      name: '7-Day Mindful Garden',
      icon: '🌿',
      description: 'Maintained a 7-day between-session practice streak.',
      category: 'streak',
    },
    {
      id: 'b-6',
      name: 'Session Master',
      icon: '📜',
      description: 'Generated and presented an actionable pre-session debrief to your therapist.',
      category: 'reflection',
    },
  ],
  schedule: {
    nextSessionDate: '2026-11-18',
    nextSessionTime: '15:00',
    cadence: 'biweekly',
    appointmentType: 'telehealth',
    telehealthUrl: 'https://meet.google.com/session-brooks',
    reminderEnabled: true,
    dailyMicroLearningReminderTime: '20:00',
    notes: 'Telehealth link via client portal. Focus for next session: Family boundaries roleplay.',
  },
  activeModalities: ['IFS', 'Somatic Experiencing', 'CBT', 'DBT'],
};
