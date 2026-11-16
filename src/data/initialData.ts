import { Theme, Resource, Homework, MicroLesson, Session, UserGrowthProfile, JournalEntry, WeeklyFocus } from '../types/therapy';

export const INITIAL_THEMES: Theme[] = [
  {
    "id": "theme-space",
    "name": "I'm Allowed to Take Up Space",
    "category": "Self-Worth",
    "description": "I'm a human who is allowed to exist, ask for what I need, and take up space without being a burden.",
    "color": "#2D5A43",
    "masteryLevel": 1,
    "growthPoints": 0,
    "modality": "IFS",
    "affirmation": "I am human. I can take up space.",
    "personalTriggers": [
      "Asking for a need",
      "Setting a boundary with family"
    ]
  },
  {
    "id": "theme-mentalization",
    "name": "Mentalization",
    "category": "Cognitive",
    "description": "Get curious instead of filling in the blanks: notice what I see and feel, name the behavior, and ask for confirmation rather than assuming why people act the way they do.",
    "color": "#4B7B94",
    "masteryLevel": 1,
    "growthPoints": 0,
    "affirmation": "I notice, I name it, and I ask — I don't have to assume.",
    "personalTriggers": [
      "Short or distant responses",
      "Reading mood in a room"
    ]
  },
  {
    "id": "theme-okay",
    "name": "I'm Okay Even If They're Not Okay",
    "category": "Relational",
    "description": "Others own their feelings and reactions. I can stay steady, self-soothe, and act from my values instead of fear of rupture or abandonment.",
    "color": "#9C6644",
    "masteryLevel": 1,
    "growthPoints": 0,
    "modality": "EMDR",
    "affirmation": "I'm okay even if they're not okay.",
    "personalTriggers": [
      "Someone being upset or distant",
      "Feeling responsible for others' moods"
    ]
  },
  {
    "id": "theme-courage",
    "name": "Confidence, Courage & Competence",
    "category": "Values",
    "description": "Speak my truth, be vulnerable, and trust my competence — the way I feel at ease on a baseball field — in harder relationships.",
    "color": "#6A5D7B",
    "masteryLevel": 1,
    "growthPoints": 0,
    "affirmation": "I can say the thing. I can be as I am.",
    "personalTriggers": [
      "Conversations with Mom",
      "Fear of getting in trouble"
    ]
  }
];

// Add your own resources, homework, micro-lessons and journal entries in the app.
export const INITIAL_RESOURCES: Resource[] = [];

export const INITIAL_HOMEWORK: Homework[] = [];

export const INITIAL_MICRO_LESSONS: MicroLesson[] = [];

export const INITIAL_SESSIONS: Session[] = [
  {
    "id": "session-37",
    "sessionNumber": 37,
    "date": "2026-11-09",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Being assertive in session; bracing protector and early memories",
    "rawNotes": "Another counseling session today. There was a moment in session where I was assertive, and my counselor later called it out and said that it was really good. She asked me why I chose to be assertive, what felt right about that? I said that I feel comfortable, supportive, safe to say what I felt. I said that I'm often not assertive, and she asked why. I said that I'm afraid of embarrassment/misunderstanding/getting in trouble. Then she asked when did this first feel this way? I decided it started because I wasn't comfortable being myself. I wanted to be liked/accepted, but didn't know how to do that. I felt alone. She asked to find the earliest or most accessible memory, and I said Hood to Coast. I wanted to feel safe by making a connection and everyone I spoke with did not attune to me and did not engage in conversation. She moved to visiting my younger self. I was hesitant to go in the door of the home I grew up in. She suggested I use a resource and I used my dog. Everyone was where they always are, my dad in the living room, my mom in the kitchen, my brothers in their rooms with the doors closed – everybody unavailable. I met my younger self in my room and asked if he wanted to connect; he was skeptical, but curious. He did not want to stay in the house, he wanted to play outside.\nShe mentioned that being assertive in session is a reworking of neural pathways, it allows me to practice being assertive in a safe space to hopefully do that outside of session. Also associated with that feeling of embarrassment and misunderstanding was a protector part that braces while sharing about myself, and that was in my shoulders and neck.\nWe also talked about the week and how I was getting triggered by people being down or tired and not knowing them well enough to read them but had a connection at stake. Talked about needing to use mentalization in these instances. Said I always brace for the worst so I try to repair even if I'm not at fault – anything to avoid conflict.\n\nShe also mentioned a book called The Tao of Fully Feeling.\n\nTowards the end of session she was asking if there was a moment that shaped this feeling around being apprehensive to be myself for fear of embarrassment. I honestly can't think of anything until high school. I came in feeling like an outsider. There were already a lot of cliques and groups and it was hard to fit in. I often ate lunch alone and didn't have anyone to talk to. Home wasn't much comfort either as that was the peak of my dad's depression. Any complaint about school at home was met with them diving in to solve an injustice rather than attuning to and acknowledging my feelings. I felt less confident in myself.",
    "summary": "My counselor called out a moment where I was assertive; we traced my fear of embarrassment, misunderstanding and getting in trouble back to feeling alone, then visited my younger self at home with my dog as a resource.",
    "keyInsights": [
      "Being assertive in session is a reworking of neural pathways — practice in a safe space, then outside it",
      "A protector part braces (shoulders and neck) when I share about myself, tied to embarrassment and misunderstanding",
      "Use mentalization when I'm triggered by people being down or tired and don't know them well enough to read them",
      "I brace for the worst and repair even when I'm not at fault, to avoid conflict"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Confidence, Courage & Competence",
      "Mentalization",
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-11-09T12:00:00Z",
    "modalities": [
      "IFS"
    ],
    "counselorAdvice": "Notice when I'm assertive and what felt safe about it; use mentalization instead of bracing."
  },
  {
    "id": "session-36",
    "sessionNumber": 36,
    "date": "2026-10-26",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Fawning, negative beliefs, and EMDR with Dad",
    "rawNotes": "Notes from last session:\n- talked about fawning and how I was in a constant state of fawning in childhood and first marriage\n- went through a series of negative beliefs to see which I identified with and they were mostly around responsibility and being alone/unseen/rejected\n- did emdr to see when I noticed these negative thoughts — what my body took me to. Decided it took me to moments with my dad when I walked into a room and I was invisible. I could get his attention, I knew how, but I would have to rack my brain to come up with an idea rather than just showing up as I was. I wanted to be seen for who I was and the lack of noticing really hurt me — I had to be in trouble or need help for my dad to jump in. I had to stay out of trouble and not need help in order to stay in good graces with my mom. I chose my mom since I was with her more. Fawning helped me navigate that pain — I knew how to be okay and how to try to engage to minimize awkwardness. \n- the thoughts my therapist left me with were “I can control what I can” and “I can be as I am”. She encouraged me to take Safe risks to be vulnerable",
    "summary": "Identified fawning in childhood and my first marriage and used EMDR to find where negative beliefs live in the body.",
    "keyInsights": [
      "Constant fawning in childhood and first marriage",
      "Negative beliefs cluster around responsibility and being alone/unseen/rejected",
      "Takeaways: 'I can control what I can' and 'I can be as I am'; take safe risks to be vulnerable"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space",
      "I'm Okay Even If They're Not Okay",
      "Confidence, Courage & Competence"
    ],
    "createdAt": "2026-10-26T12:00:00Z",
    "modalities": [
      "EMDR"
    ],
    "counselorAdvice": "I can control what I can. I can be as I am."
  },
  {
    "id": "session-35",
    "sessionNumber": 35,
    "date": "2026-10-20",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "What am I afraid of? Getting in trouble",
    "rawNotes": "My counselor ended session this week challenging me to figure out what it is I’m afraid of. There is something that has me stuck — I have a fear when people are upset with me or when I feel like I’ve done something wrong. She wants me to write on it and bring it in next session. I need help drilling into this. \n\nThe start that I have is this:\nIt has always been a fear of mine that I will “get in trouble” — if I don’t follow rules then I get punished (sent to my room, broken up with, things taken away, etc). Somewhere along the line, I decided it wasn’t worth that pain — the risk of doing anything that may illicit the negative response ( grounded = can’t play with friends, upset partner = no connection). This meant trading for what I wanted. If I wanted to play sports, I couldn’t complain. If I wanted to stay in relationship; I couldn’t do the things they didn’t like me doing. So I did as much of what I wanted as I could within those parameters because there were things I wanted more. I lost myself in the process ( because there was no grey area). I realize some of this is healthy compromise and survival, I realize this is not necessarily a fear, but this is where my mind went.\n\nThe question / scenario my counselor left me with was this: we were talking about a fear that I get when I worry what will happen if I speak my mind or if I do something I “shouldn’t” (I.e. getting home late from work) even if it hasn’t been verbally expressed that this wasn’t okay. She said — what is that fear? And she wanted me to journal on it. What am I afraid will happen? \n\nIn the context of all we’ve just discussed here and all my sessions, how would you answer that?",
    "summary": "Counselor asked me to identify the fear I get when people are upset or I've done something wrong.",
    "keyInsights": [
      "Fear of 'getting in trouble' — punishment, loss of connection",
      "I traded parts of myself to stay within the rules, with no grey area",
      "Write on it and bring it to the next session"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Confidence, Courage & Competence",
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-10-20T12:00:00Z",
    "counselorAdvice": "Write about what I'm afraid will happen and bring it to next session."
  },
  {
    "id": "session-34",
    "sessionNumber": 34,
    "date": "2026-10-14",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Attunement: needing it and asking for it",
    "rawNotes": "I have another session today. What should I focus on? Have felt better this week taking things slower, have been surrendering more to circumstances (e.g. sitting through kids’ fits instead of getting overwhelmed), but also still feeling the need to make sure everyone at home is happy and taken care of. She always asks what I want to focus on today or what’s going on so I want to be prepared\n\nTalked a lot about attunement in session this week. And requesting attunement for others. She said that there is no one that consistently attunes to me on a regular basis and that is what I’m feeling. Important to recognize that attunement is what I’m looking for and I constantly am trying to create an environment in which people have the capacity to attune to me ( if I’m good enough, etc ), then I’m disappointed if it doesn’t happen (need to directly ask for attunement and have strategies for when life gets busy and it’s hard for others to attune because of circumstances)\n\nShe suggested making time with my wife to discuss how to navigate busy and stressful seasons to stay attuned to each other. \n\nShe wanted me to work on externalizing. \n\nShe wanted me to explore what connection feels like. \n\nShe wanted me to continue to experiment with staying calm and self soothing in stressful situations and see if that in turn calms them and/or the situation (instead of trying to do something external to make them feel better; find internal resource)\n\nI mentioned I still struggle being okay when others are not",
    "summary": "Discussed that no one consistently attunes to me, asking directly for attunement, and self-soothing as an internal resource.",
    "keyInsights": [
      "I keep trying to create conditions where people can attune to me, then I'm disappointed",
      "Directly ask for attunement and plan with my wife for busy seasons",
      "Experiment with staying calm and self-soothing instead of fixing externally"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay",
      "I'm Allowed to Take Up Space",
      "Confidence, Courage & Competence"
    ],
    "createdAt": "2026-10-14T12:00:00Z",
    "counselorAdvice": "Work on externalizing; explore what connection feels like."
  },
  {
    "id": "session-33",
    "sessionNumber": 33,
    "date": "2026-10-07",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Nervous system regulation: hypoarousal to ventral",
    "rawNotes": "Today’s session turned into nervous system regulation. I was having a hard time remembering what I was going to say and she paused and asked me to attune to what I was feeling. What came up is that I was feeling overwhelmed, that I didn’t feel like I had enough time for everything and that I wasn’t getting anytime to myself. It has been a stressful few weeks and I’m just trying to push through to the other side. I didn’t realize how stressed I was until this session. We talked through Exercises for moving from hypoarousal → ventral regulation attached below. I asked her how she could tell I was stressed and she said she noticed some flat affect, low tone, and lower responsiveness and her nervous system could feel my stress through attunement. \n\n1. Orienting + gentle movement\nSit or stand and slowly look around the room.\nName 5 neutral or pleasant things you see.\nTurn your head rather than only moving your eyes.\nAdd slow shoulder rolls, reaching, or stretching.\nSay: “I am here, in this room, right now.”\nThis can be especially helpful when someone feels disconnected or “checked out.”\n2. Rhythmic movement\nChoose something mildly activating:\nWalking\nSwaying side to side\nGentle dancing\nRocking\nMarching in place\nStretching to music\nTry 2–5 minutes, rather than demanding a workout.\nThe key is: movement without overwhelm.\n3. Music that gradually increases energy\nInstead of going directly from shutdown → upbeat music:\nquiet/slow → rhythmic → moderately energizing → pleasurable\nHave the person notice when they begin to feel a little more present, rather than trying to become “happy.”\n4. Temperature + sensory activation\nWhen someone is very shut down, stronger sensory input can help bring them back into their body:\nHold a warm mug.\nWash hands in comfortably warm water.\nStep outside and notice the temperature.\nSmell coffee, essential oils, lotion, or something familiar.\nWrap yourself in a textured blanket.\nUse a favorite scent.\nAsk:\n“What sensation tells my body that I'm here?”\n5. Vocalization\nThe social-engagement system can be recruited through the voice:\nHum\nSing quietly\nRead something aloud\nMake a long “mmm” sound\nTalk to a safe person\nLaugh if it naturally happens\nRather than focusing on making the exhale extremely long, experiment with comfortable, natural breathing and a relaxed voice.\n6. Connection before cognition\nHypoarousal can make cognitive strategies surprisingly ineffective.\nInstead of:\n“Think of something positive.”\nTry:\n“Who or what helps me feel 2% more connected?”\nPossibilities:\nText a safe person.\nPet an animal.\nSit near your partner.\nListen to a familiar voice.\nLook at pictures of loved ones.\nSpend time somewhere familiar and comforting.\n7. “Notice → Name → Choose”\nA simple grounding sequence:\nNotice:\n“What am I experiencing in my body?”\nName:\n“I feel heavy/disconnected/tired/numb.”\nChoose:\n“What is one thing that would bring me 5% more energy or connection?”\nThen do that thing.\nThis keeps the goal small enough that the nervous system doesn't experience it as another demand.\nA 5-minute hypoarousal reset\nYou could use this as a structured practice:\nMinute 1 — Orient\n“I'm here. I'm safe enough in this moment.”\nLook around and identify 3 things you see.\nMinute 2 — Activate\nStand up. Shake out your hands. Roll your shoulders. Stretch. March slowly.\nMinute 3 — Connect\nHum, sing, or speak aloud.\nIf possible, make eye contact with someone safe or interact with a pet.\nMinute 4 — Engage the senses\nNotice:\n1 thing you see\n1 thing you hear\n1 thing you feel\n1 thing you smell\nMinute 5 — Choice\nAsk:\n“What do I need next: movement, connection, nourishment, rest, or stimulation?”\nThen choose one small action.\nA more evidence-consistent framing is:\nhypoarousal → increased activation + orientation → present-moment awareness → social connection → flexible regulation\nAnd the goal is not calm at all costs. Sometimes someone needs a little activation before they can access calm.",
    "summary": "Session shifted into regulation after I noticed I was overwhelmed and short on time and space.",
    "keyInsights": [
      "I didn't realize how stressed I was until the session",
      "Counselor noticed flat affect, low tone, lower responsiveness through attunement",
      "Worked through exercises for moving from hypoarousal to ventral regulation"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-10-07T12:00:00Z"
  },
  {
    "id": "session-32",
    "sessionNumber": 32,
    "date": "2026-09-25",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Courage to say the thing; tolerating being separate",
    "rawNotes": "Another counseling session. Talked about having the courage to say the thing. It's not always going to be perfect, it will not always come out right. They can own their response.\n\nTalked about feeling in between -- standing up for myself by not being unwilling to listen or feel the need to immediately rescue. I can invite a conversation, but have to take them at face value (I noticed that ... do you want to talk about it?)\n\nI can't change others, I can only own what is mine.\n\nI am wanting to be attuned to, but not everyone is going to be capable of giving me what I need -- external locus of contral.\n\nShe mentioned that I'm still dealing with a lot of enmeshment and part of what I need to work on is being separate and tolerating being separate (tolerating the body sensation of feeling like something isn't right, tolerating the formation of what needs to be said, and tolerating the response to what I ultimately come up with to say). She said she also wanted to give me resources on co-dependency because I'm still exhibiting that -- I'm not okay unless you're okay, don't be over responsible.",
    "summary": "Practiced saying the thing even if imperfect and inviting conversation without rescuing.",
    "keyInsights": [
      "It won't always come out right — they can own their response",
      "Invite: 'I noticed that… do you want to talk about it?' and take them at face value",
      "Still working on enmeshment: tolerate being separate and not over-responsible"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Confidence, Courage & Competence",
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-09-25T12:00:00Z"
  },
  {
    "id": "session-31",
    "sessionNumber": 31,
    "date": "2026-09-14",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Competence as a value: the field vs. the room with Mom",
    "rawNotes": "Another session. Talked about competence as a value. She asked me to think of a time when I felt most at ease and I said on a baseball / softball field. She said to notice the sensations — I’m loose, I’m smiling, I’m not worried about perception or considering anything else / I’m present, I’m confident. Then she had me consider being in a room with my mom. I’m immediately tense, considering how she is feeling, not wanting to do the wrong thing or say the wrong thing because I don’t want to upset her — and part of that is having to read her upset and react rather than her just telling me. She wants me to try to translate that same feeling I have in the field to interactions like this. Keep a bubble around myself and I own what is mine and they own what is theirs. Instead of perceiving, they need to come to me if they are upset. I can ask and they can tell me, but I don’t have to assume.",
    "summary": "Contrasted how I feel on a baseball/softball field with how I feel around my mom, and how to carry that ease into hard interactions.",
    "keyInsights": [
      "On the field I'm loose, smiling, present, and confident",
      "Keep a bubble: I own what's mine, they own what's theirs",
      "If they're upset they can come to me — I can ask without assuming"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Confidence, Courage & Competence",
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-09-14T12:00:00Z",
    "counselorAdvice": "Translate the on-field feeling to interactions like this."
  },
  {
    "id": "session-30",
    "sessionNumber": 30,
    "date": "2026-09-07",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Practicing a hard conversation with Mom",
    "rawNotes": "Any podcasts or anything resource driven?",
    "summary": "Practiced telling my mom I want direct communication and hit a block; used the elephant-on-a-leash image.",
    "keyInsights": [
      "I couldn't bring myself to say it even in practice",
      "The elephant stays within 3 feet after the chain is gone — old bounds",
      "Challenge: what's the point of changing the status quo — why would it be worth it?"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Confidence, Courage & Competence",
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-09-07T12:00:00Z",
    "counselorAdvice": "Consider what changing the status quo would be worth."
  },
  {
    "id": "session-29",
    "sessionNumber": 29,
    "date": "2026-08-31",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Setting a boundary with Mom: fear, vulnerability, and the burden belief",
    "rawNotes": "Another session today:\n\nTalked about interaction with Mom, setting a boundary. Explored what my fear - worst case scenario was with me setting that boundary. That distance would be created. Talked about how if there was any sort of healthy bond, there would be an understanding and a working toward a resolution together. Went into the part to try to drill into that fear — went ultimately to that part needing to have courage. There was a fear of vulnerability, that vulnerability could cause distance. But without vulnerability, I’m not truly creating the closeness and connection I desire, I’m creating more transactional relationships. \n\nAnger of having to set boundaries. I try so hard not to create any sort of rift, but there are some moments that force me into either dealing with something that I don’t authentically believe, or standing up for myself and creating a certain degree of uncomfortability. The circumstance, and the one that I described from high school both have the commonality of being angry that there is potential for division, misunderstandings… Ultimately having to be in a situation that I feel as confrontational or disruptive.\n\nThis part must truly believe that I am a burden, that my opinions are too much and too upsetting to those around me. The more balanced belief is that I’m a human, and I can offer my beliefs and opinions freely, not to force them on others, but so that we can come to common ground if we approach it with curiosity and open this. It doesn’t have to be a situation that there is a rift, or if there is, it can be repaired. If I want people to see the real me, and if I want people to be comfortable with who I am and ultimately have myself be comfortable in my own skin, I have to be vulnerable, I have to share, I have to be me. This part feels like it’s a Burton to be me that I’m burdening others. And that just is not true, I need to break the link between others, knowing how I feel or what I want, and my goodness were amount of burden as a human.\nA simple but silly example was after my race. I was very tired, my wife offered to make me a coffee and I said no I can do it. She said let me serve you. That opened my eyes a little bit, it wasn’t that I was burdening her by having her make me a coffee, she wanted to, she wanted to serve me, she wanted to help me. My needs are not always a burden. When people get to know me they can help me.\n\nWe talked about this example last session. This is where we started to explore what my worst fear is. I still don’t know. I just know that it is my pattern. I stood up for myself. I felt guilty doing it because it made her uncomfortable. My tendency is to reach out and soften and repair. One fear is simply that she will be upset — upset usually meant punishment (grounded, sent to room, loss of privilege with Mom. Silent, sulking, or rage from dad). Feel like I caused the feeling and easy for me to repair by backing down. Another fear is lack of resources — I can’t ask for what I want or need because I don’t feel I deserve it — I’ve done something to upset her so the bank is closed…I can’t ask for favors, or help, I can’t get love or connection, nothing can happen until I feel like the situation is safe. Intellectually I know that she owns her feelings and reactions, but emotionally and reaction wise — I just can’t help but to feel the guilt and to over analyze. I’m angry that I can’t say what I feel and have that be okay — not right, but okay and be met with curiosity rather than defensiveness and distance. I still don’t know what the core fear is",
    "summary": "Drilled into the fear behind setting a boundary with my mom and the part that needs courage.",
    "keyInsights": [
      "Worst case is distance, but a healthy bond works toward resolution together",
      "Without vulnerability I create transactional, not close, relationships",
      "My needs aren't always a burden — my wife wanted to make me coffee"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space",
      "Confidence, Courage & Competence"
    ],
    "createdAt": "2026-08-31T12:00:00Z",
    "modalities": [
      "IFS"
    ]
  },
  {
    "id": "session-28",
    "sessionNumber": 28,
    "date": "2026-08-10",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "I matter: assertive communication with family",
    "rawNotes": "Today we talked about the fact that I matter. Context was pursuing an assertive response to my family because I don’t like the way we communicate. I matter and what I have to say matters. We are on level Plainfield. I can and should speak my truth – intimacy– doesn’t have to be justified. Their reaction is theirs, they own that. I have a bubble and I don’t need to/can’t take on the emotions of other people. They can speak their truth and we can collaborate and compromise with curiosity. Don’t automatically back down out of fear– feel empowered, have courage, take space – this is me. If I “steamroll“ it is their job to meet me, not mind to pull them out. I matter and can take up space.\n\nWe were talking about how my brother came to town and didn’t tell me. He communicated to my parents but not to me that it would be great to see me. Both my parents told me I should see him but I never heard directly from him. Ultimately my Dad said, the morning my brother was leaving, that I should see him and his flight leaves at 4pm. My innate reaction was to jump in and make it work. My reasonable self recognizes that me and my family were sick, this was short notice, and poor communication as I never heard directly from my brother. My counselor asked what it would feel like to address this communication style and say it doesn’t work for me and set reasonable boundaries about how I would like to be communicated to — giving more advanced notice, hearing directly from people, etc. This gave me doubts because I worry about what they might say behind my back or think of me. This led down the track that it is not mine to to control that. It is mine to speak my truth and tolerate the discomfort of whatever response comes — intimacy. I have had the job of controlling these communications and making people feel comfortable my entire life. But I don’t tell them what I need, I tell them what they want to hear. I can hope for curiosity, I can intend to negotiate, but I should speak my truth, I don’t even need a good reason for it, it just has to be authentic. There was a big weight lifted to know that they own the reaction to my request — I can’t make them feel a certain way, and I don’t have to let their reaction dictate my next action. I have been carrying the weight of the emotions of others for too long and failing to speak up for myself in the process out of fear.",
    "summary": "Discussed speaking my truth about family communication, and that their reactions are theirs to own.",
    "keyInsights": [
      "I matter and what I have to say matters; I can take up space",
      "Their reaction is theirs — I have a bubble and can't take on others' emotions",
      "Speaking my truth needs no justification, just authenticity — a big weight lifted"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space",
      "I'm Okay Even If They're Not Okay",
      "Confidence, Courage & Competence"
    ],
    "createdAt": "2026-08-10T12:00:00Z",
    "counselorAdvice": "Don't automatically back down out of fear — feel empowered, have courage, take space."
  },
  {
    "id": "session-27",
    "sessionNumber": 27,
    "date": "2026-08-03",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Challenging thoughts, resilience, and disconfirming experiences",
    "rawNotes": "Another counseling session today. \n\nShe wants me to challenge my thoughts. What is my belief and what does that mean will happen. What is a more positive / realistic belief. Understand needs. \n\nShe asked if something were different, what would it be. I told her I would want to show up authentically me and be vulnerable and have everything be okay (feedback if people don’t like things instead of severance). \n\nTalked about resilience (going through hard times with positivity)\n\nTalked about rigid beliefs around core values and rules. A + B should equal C\n\nHave tried to approach this with IFS and repaint young part, give love to boy who was neglected so he knows he’s loved. She was saying this felt like the right approach but her perception was that it wasn’t landing with me. \n\nI don’t feel unlovable - I just don’t want to experience loss — need more disconfirming experiences. \n\nVulnerability — exposing who I am, showing my true self to others",
    "summary": "Practiced the belief → prediction → more realistic belief exercise and talked about the IFS repainting approach not fully landing.",
    "keyInsights": [
      "I don't feel unlovable — I don't want to experience loss; I need more disconfirming experiences",
      "Rigid beliefs around values and rules (A + B should equal C)",
      "IFS repainting the neglected young part felt right but wasn't landing"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Confidence, Courage & Competence",
      "Mentalization"
    ],
    "createdAt": "2026-08-03T12:00:00Z",
    "modalities": [
      "IFS"
    ]
  },
  {
    "id": "session-26",
    "sessionNumber": 26,
    "date": "2026-07-27",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Illusion of control, needs vs. wants, and self-esteem",
    "rawNotes": "Another session today:\n\nTalked about growing up in a dynamic where I wasn’t attuned to and my needs weren’t met. I learned that I had to perform for attention — and that being good was the best way to assure safety. \n\nShe mentioned that I have this illusion of control — I give myself too much power — that I can control an outcome or people’s reactions or attachment to me by simply mirroring back what I think they want from me. When the reality is that they have autonomy and can still make their own decision despite how my actions come across. Try vulnerability is asking for what I need, having hard conversations, repairing, learning together — but being authentic, not just a mirror. \n\nTalked also about wants vs needs. She sent a list of human needs and to me, many of them seemed frivolous, extra — I didn’t feel deserving of them. I don’t ask for them because it feels selfish. Knowing that they are human needs and I am okay to ask for them gives me a better reframe and increases my comfortability instead of seeing myself as an inconvenience or burden. \n\nWe talked about three potential areas to walk away with and focus on:\n- Exploring what self esteem is — what does it mean to be me and believe I am inherently good\n- Needs met — try to get comfortable consciously asking for a need even if it is uncomfortable and feels burdensome — see what the reaction/response is (training nervous system)\n- focus on difference between Want vs need — willing to ask for one but not the other, but what is what and what separates them. \n\nI also mentioned that I don’t feel like I think I’m not good. Alone, by myself, in solution, I feel I am good — I make good choices, I am true to myself. When I being in relationships is where the barometer shifts — I want so badly for them to remain connected to me that I am willing to sacrifice some of my values, time, priorities, discomforts in order to make them comfortable, in doing so I learn what is acceptable or not in relationship and ultimately judge myself on how well I am adopting and adhering to these standards.",
    "summary": "Discussed the illusion that mirroring others controls outcomes, human needs as non-selfish, and three focus areas.",
    "keyInsights": [
      "I give myself too much power to control reactions by mirroring what people want",
      "Human needs aren't frivolous or selfish — it's okay to ask for them",
      "Focus: what self-esteem means; consciously asking for a need; wants vs. needs"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space",
      "Confidence, Courage & Competence",
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-07-27T12:00:00Z"
  },
  {
    "id": "session-25",
    "sessionNumber": 25,
    "date": "2026-07-20",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Challenging automatic beliefs and core beliefs",
    "rawNotes": "Another counseling session today. Cover a variety of topics. The core tenant was around, challenging automatic beliefs. I grew up dreamed to behave in a certain way that would get a certain reaction, and I’m fearful to move outside of that box. We spent a lot of time on the attached document on pages 44 through 47 and 49 through 51. She left me with the section around identifying negative core beliefs, and finding evidence, proof that I am lovable, even if I don’t help or too good. It feels like I need to do good in order to have people connected to me. If I am not good then there is no reason to connect to me. This has been evidenced by my parents distancing for my brother who has had trouble, and an ex-wife who left because seemingly I didn’t do enough right. \n\nAttachments aren’t working, but the document is a PDF from PESI titled Abandonment Trauma Treatment Strategies to Heal Inner Child Wounds and Restore Healthy Attachment (Ellen Biros)",
    "summary": "Worked through a PDF on abandonment trauma and inner-child wounds; identifying negative core beliefs and finding evidence I'm lovable even if I don't help.",
    "keyInsights": [
      "I grew up behaving to get a certain reaction and I'm fearful of leaving that box",
      "It feels like I must do good for people to connect with me",
      "Find evidence that I'm lovable even if I don't help or am not 'good'"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Confidence, Courage & Competence",
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-07-20T12:00:00Z",
    "counselorAdvice": "Identify negative core beliefs and find evidence I'm lovable even when I don't help."
  },
  {
    "id": "session-24",
    "sessionNumber": 24,
    "date": "2026-07-13",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Attuning vs. absorbing; defining goodness by helping",
    "rawNotes": "Another counseling session today\n- understanding what is expected of me versus assuming?\n- I can feel tension build, instead of letting it consume me and reacting to it, I should acknowledge it, self-soothe before re-entering situation\n- I am defining myself as good by the dopamine hit I get by helping — I anticipate, I rescue, I am right in my hyper vigilance, I am commended for being right (so I continue cycle)\n- attune to situation and ask what is needed instead of assuming\n- I am helpful in so many other situations throughout the day — if I’m not perfect or need to step away it doesn’t define me\n- enmeshment in context of two hands — one is independent, pushing kids into world, the other is enmeshment, bringing them back in and checking on them and helping to organize thoughts/feelings/emotions\n- challenge idea of goodness and acknowledge being (self esteem) … gave example of lion and giraffe —> a lion is not good and a giraffe is not bad and vice versa, they are just what they are innately — and I lion is not bad because it feasts on a wildabeast, it is what it does for food, it is what it is, it is it’s makeup. \n- taking on / absorbing feelings vs attuning\n- a lot of this was in the context of the idea that I’m defining connection as enmeshment and what it would look like to work out of codependent enmeshment\n- also in the context of: a lot of this requires me not to EARN love and connection, but I often define myself on my actions, if I’m not doing things that I feel are good (rescuing, helpings, etc), how can I believe I am enough innately who I am",
    "summary": "Looked at defining myself as good through helping and rescuing, and what it would mean to attune instead of assume.",
    "keyInsights": [
      "I get a dopamine hit from anticipating and rescuing — and being right in my hypervigilance",
      "Attune and ask what's needed instead of assuming; attuning isn't absorbing feelings",
      "A lion isn't good and a giraffe isn't bad — I don't have to earn love"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Mentalization",
      "I'm Okay Even If They're Not Okay",
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-07-13T12:00:00Z"
  },
  {
    "id": "session-23",
    "sessionNumber": 23,
    "date": "2026-07-06",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Enmeshment vs. connection; two things can be true",
    "rawNotes": "Notes from session today:\n- Enmeshment for me feels like connection. Reignites question of - what is connection?\n- Self-soothing / lifeboat to tolerate feelings of disappointment when I stand up for what I need\n- don’t feel like I can be myself and be connected to others \n- two things can be true\n- pattern of rupture and repair is part of healthy adult relationship\n- Dialectical connection — change of the butterfly changes the stars…do I put too much emphasis on singular moments? “Ands” — two things can be true\n- don’t make assumptions for what people are needing — they can ask if they truly need\n- can say “this is how I’m feeling” — not have to make a decision based on my own assumptions and compromises —> work together - don’t let resentment build, don’t do it on my own\n- lynchpin is accepting I would be okay if she were to leave — frees the need to impulsively appease or live in fear — not that I want that, but knowing I could handle it. More vulnerable relationship and requires work together knowing we’ll always be together",
    "summary": "Explored enmeshment feeling like connection, rupture and repair, and accepting I would be okay if she left.",
    "keyInsights": [
      "Enmeshment feels like connection — what is connection?",
      "Rupture and repair is part of healthy adult relationships; two things can be true",
      "Lynchpin: accepting I'd be okay if she left frees me from impulsive appeasing or fear"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay",
      "Mentalization"
    ],
    "createdAt": "2026-07-06T12:00:00Z"
  },
  {
    "id": "session-22",
    "sessionNumber": 22,
    "date": "2026-06-29",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Interpersonal neurobiology and over-responsibility",
    "rawNotes": "Another counseling session today.\n\nWe talked about interpersonal neurobiology and a couple of books that Dan Siegel wrote. We talked about managing others to soothe my anxiety, use the example of my dad when he would get depressed me feeling uncomfortable, and the desire to fix the situation was to provide comfort to myself more than to provide comfort to him, and I knew exactly what I could do which is a pattern that I repeat today. We also talked about balancing my own needs with serving the needs of others. My counselor mentioned that my behaviors are not bad things, the dysfunction lies within the desire to take on too much responsibility. She also had a thought around being comfortable with other people, not choosing me and the idea that I am connecting connection with how well I serve others. Will I be OK without connection, without people choosing?  She had mentioned a book from Dan Segal around parenting from the inside out and thought there were some elements that might be relevant to what we were discussing today.",
    "summary": "Examined managing others to soothe my own anxiety, and tying connection to how well I serve.",
    "keyInsights": [
      "Fixing Dad's mood was soothing me more than him — a pattern I repeat",
      "My behaviors aren't bad; the dysfunction is taking on too much responsibility",
      "Will I be okay without connection, without people choosing me?"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-06-29T12:00:00Z"
  },
  {
    "id": "session-21",
    "sessionNumber": 21,
    "date": "2026-06-22",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "I matter, you matter; repair and self-soothing",
    "rawNotes": "Another counseling session today\n- putting in language to my truth and engaging in problem-solving with partner – I matter and you matter\n- repair is possible\n- I thought yes was the only option growing up – there wasn’t space to have my own existence in that way\n- balancing out care for myself and care for my family (I can only care for my family if I care for myself)\n- people may notice flaws about me that are annoying, but not them as quirks in my character rather than a reason to leave\n-Given myself too much credit/power that I have the ability to impact the emotions of other\n- people need to know how I’m feeling what I value \n- talked about the idea of helping so that I can feel connected versus helping as an expression of that connection because connection all ready exists. Talked about how I can use better language to point out what I’m seeing and feeling and use that as a starting point for a conversation around what is actually true rather than making an assumption, communicating to partner that I have a desire to help and asking how I can best serve them in this moment and what they actually need.\n\nShe also talked about self-soothing today. If I find myself activated, talking to the part that is feeling activated and reassuring them that we are in the present and that I am here with them and I’m not going anywhere. \n\nWe discussed FAST framework and being important to me — specifically having the courage to speak my truth and not shy away from my needs",
    "summary": "Practiced putting my truth into language, self-soothing an activated part, and speaking my needs with courage (FAST).",
    "keyInsights": [
      "I matter and you matter — repair is possible",
      "Helping to feel connected vs. helping as an expression of connection that already exists",
      "Self-soothe: tell the activated part we're in the present and I'm not going anywhere",
      "FAST: courage to speak my truth and not shy away from my needs"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space",
      "Confidence, Courage & Competence",
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-06-22T12:00:00Z"
  },
  {
    "id": "session-20",
    "sessionNumber": 20,
    "date": "2026-06-01",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "I'm okay even if she's not okay",
    "rawNotes": "Another counseling session. \n\nThe biggest thing my therapist wanted me to take away is that “I’m okay even if she’s not okay”. I can’t let external influence my state — I need to let others handle their own stuff and not be so codependent. \nWe talked about intrinsic vs external. Am I doing this out of fear or a place of values? I am going to do the dishes so I don’t get in trouble vs I really value a clean home and doing the dishes is in line with that. \nAnother key and I think if I can digest it is the biggest one — if I abandon my fear of being left and accept that I will live even if the separation I fear most were to happen then I can make decisions in relationship from a place of self and values and not fear. Acting in intrinsic motivators leave open disappointment and accounts (reading that she is down and assuming she needs and wants this and says no —> rejection. Or “I did all this for you, you can’t leave” VS I have a value of being helpful and I’m noticing that you’re low energy, what can I do / I know I would like it if … would you like that?\nFeel like I only get connection if I’m not bad and I am good (only way I am okay is if she’s okay)",
    "summary": "Core takeaway: I'm okay even if she's not okay; act from values rather than fear.",
    "keyInsights": [
      "I'm okay even if she's not okay",
      "Intrinsic (values) vs. external (fear) motivation — 'I value a clean home' vs 'so I don't get in trouble'",
      "If I accept I'd survive the separation I fear most, I can act from self and values"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-06-01T12:00:00Z",
    "counselorAdvice": "I'm okay even if she's not okay."
  },
  {
    "id": "session-19",
    "sessionNumber": 19,
    "date": "2026-05-25",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "What is connection? Behavior vs. authenticity",
    "rawNotes": "Notes from counseling today:\n- exiting question was, do I know what connection is? collect data points\n- Am I afraid of being alone? We talked about it being more around being afraid of not being seen -- in the context of fear of loss of relationship, what is the fear within that\n- Is my behavior actually getting me what I want\n- Intimacy does not equal doing everyting everyone asks of me\nEven though I can do 100% of what people want, it requires some degree of self-abandonment. Some of the work may be tolerating whathappens if I don't do 100%...if I say, I can only do 80% without abandoning myself\n- I have built up that connection is based on behavior and if I don't do behavior, I will lose connection\n- Positive orientation -- idea that others will love you regardless of your behavior -- inherently connected -- they will draw boundaries and repair rupture, but will always be positively oriented towards you\n- What happens if I stop \"behaving good\"?\n- If I am not authentic, others cannot connect to me, only to my behaviors and that is no intimacy -- they orient to what you think they want you to be , not who you are -- what do you like about me?\n- Constructs of good and bad, not everything is inherently black and white",
    "summary": "Questioned whether I know what connection is, and what happens if I stop 'behaving good.'",
    "keyInsights": [
      "I've learned that connection is based on behavior",
      "Doing 100% of what people want requires self-abandonment — tolerate what happens at 80%",
      "If I'm not authentic, others connect to my behaviors, not to me"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space",
      "I'm Okay Even If They're Not Okay",
      "Confidence, Courage & Competence"
    ],
    "createdAt": "2026-05-25T12:00:00Z"
  },
  {
    "id": "session-18",
    "sessionNumber": 18,
    "date": "2026-05-18",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Mistakes as growth; expressing needs",
    "rawNotes": "Another counseling session today here are the summary items.\n- mistakes can be seen as growth instead of being bad or wrong\n- talked about values and window of tolerance when those values have opposition\n- historically, in my experience, mistakes have led to loss\n- building relationship that requires a lack of mistake is not authentic\n- expressed needs and see full cycle through\n- ask for some level of predictability/routine\nStaying in relationship is a choice and being good does not guarantee the other to make the choice you desire\n- mentioned continuing to use EMDR to solidify beliefs, moving from “that makes sense” or “I know that to “I believe that “",
    "summary": "Reframed mistakes as growth, discussed values and window of tolerance, and continued EMDR to move beliefs from 'I know' to 'I believe.'",
    "keyInsights": [
      "Mistakes can be growth — a relationship requiring no mistakes isn't authentic",
      "Staying in relationship is a choice; being good doesn't guarantee the other makes the choice I want",
      "Use EMDR to move from 'that makes sense' to 'I believe that'"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay",
      "Confidence, Courage & Competence"
    ],
    "createdAt": "2026-05-18T12:00:00Z",
    "modalities": [
      "EMDR"
    ]
  },
  {
    "id": "session-17",
    "sessionNumber": 17,
    "date": "2026-05-07",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Building skills: body sensations as data",
    "rawNotes": "Latest counseling session: Talked through the idea of building skills. Seeing body sensations as data points, but I tend to react to (hurt, scared, in need of comfort) and that I’m usually seeking external validation of goodness. But this isn’t showing up as me, it is melting into a vision of what they want me to be, which isn’t intimacy.\nIn the moment, believe that I can be OK even if they are not\nI can contribute/have worth by being calm and present (regulation, mirror neurons)\nLooking at the big picture holistically. I put a lot of emphasis on a moment and what that moment means. If I take a step back, it should help me see this is nothing more than a moment and that it is not a judge of my worth only a moment where I can be present and ask how it could be best of service instead of making assumptions\nData points – talked about acknowledging feelings, the sensation in my body is shock/hurt/desire for connection… It is leading me to want to distance – I can stay in this moment and take in the data",
    "summary": "Practiced treating sensations as data, staying in the moment instead of distancing, and believing I can be okay even if they are not.",
    "keyInsights": [
      "Body sensations are data points (shock, hurt, desire for connection) — stay with them instead of distancing",
      "I can be okay even if they're not okay",
      "A single moment is not a judge of my worth; zoom out holistically"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay",
      "Mentalization"
    ],
    "createdAt": "2026-05-07T12:00:00Z",
    "counselorAdvice": "Believe I can be okay even if they are not."
  },
  {
    "id": "session-16",
    "sessionNumber": 16,
    "date": "2026-04-20",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Depletion, pendulation, and 'I'm allowed to take up space'",
    "rawNotes": "Counseling again today. Emotional day. I was feeling exhausted, fragile, emotional. We started by sitting with the feeling and seeing where it manifested. Tired and heavy behind eyes and tension in chest. We did something - forget what it was called (pendulating?) where we focused on tension in chest and then a part of body (toes) that was loose and soft. Oscillating between these two loosened sensation. We tried to listen to what the tension was telling me. I could not identify so we used a feeling chart. Mostly Sad and Tired. Mostly from running on empty and not feeling connected. She said I’m exhibiting classic basal vagal response of essentially burn out after pushing hard for a long time. She said I’m doing a lot of work and it makes sense to be depleted. We talked about fitting in at home and being worried about being the dad and partner that I want to be. She said ultimately that I need to challenge the belief that I am a burden — that I am a human who is allowed to take up space and exist. She also asked if I was on meds — I am not, but I am open to it. She said it might help smooth out these bottoms I’m feeling today — essentially to help me stay in feelings a bit easier and move past them rather than falling into despair. She said she’s heard of gaba but that I should talk to my doctor to see what they might recommend.",
    "summary": "Sat with a tired, heavy, fragile state; used pendulation between tension and ease; named burnout-like depletion.",
    "keyInsights": [
      "Running on empty and feeling disconnected after pushing hard for a long time",
      "Challenge the belief that I'm a burden — I'm a human allowed to take up space and exist",
      "It makes sense to feel depleted given how much work I'm doing"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-04-20T12:00:00Z",
    "modalities": [
      "Somatic Experiencing"
    ],
    "counselorAdvice": "Challenge the belief that I am a burden — I'm human and allowed to take up space."
  },
  {
    "id": "session-15",
    "sessionNumber": 15,
    "date": "2026-04-06",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Inner child: urgency, productivity, and play",
    "rawNotes": "Talked today about inner child. We talked about being exhausted. We sat with that part and acknowledged the feeling. A knowledged its presence and validity and just observed. Did a full body scan -- tension in neck and shoulders. What is that trying to tell you? Urgency. Pushed into this feeling and it was urgency around a lack of time. Feeling like time had to be used productively or it was wasted and I was bad for having wasted it. Tried to go back to a time when this was true and couldn't find a specific tiem b ut I remember feeling like I couldn't play, couldn't relax until my responsibilities were handled -- homework done, chores done, etc. Feel that way as an adult -- can't get myself out from under all the things that need to get done and the needs of others are always above my own. Generally had this feeling and felt it brought me to connection -- family would connect with me if and when I was calm and obedient. Took me back to middle school me at my desk working on homework longing to be outside playing. Met with him and took him outside to play basketball in the front yard. The point was to connect with him. Acknowledge that we were raised in a particular way that made us feel like we were a burden unless we were helpful, calm, compliant -- not much room to be ourselves after a certain age. The idea as to remove him from the care of my parents -- they did a lot of great things but they are not what he needs anymore. I invited him to come with me to the present so together we can learn how to be ourselves. Transparently don't know how to lead him on this jouney and there will be mistakes but we'll figure it out together. What it feels like to be unburdened, explore what things we like and make informed decisions not out of ease of burden. Living authentically.",
    "summary": "Sat with exhaustion, traced urgency to a belief that unproductive time is wasted, and took my middle-school self outside to play.",
    "keyInsights": [
      "Tension in neck/shoulders was urgency about time having to be productive",
      "I felt like a burden unless I was helpful, calm, and compliant",
      "Invited that part into the present to learn together how to be ourselves"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-04-06T12:00:00Z",
    "modalities": [
      "IFS"
    ]
  },
  {
    "id": "session-14",
    "sessionNumber": 14,
    "date": "2026-03-04",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Mentalization, exposure, and vulnerability",
    "rawNotes": "Had another counseling session today. The main highlights were:\n- mentalization — instead of filling in the blanks and assuming why people are acting a certain way, get curious, nae the behavior, and ask for confirmation\n- exposure: I need affirmation that I won’t be left, that we are solid. I’m the past, “mistakes” have led to loss of relationship. I need more and more instances where that is not true, that rupture and repair are normal part of relationships\n- vulnerability — if I am not vulnerable, we are not in a relationship. They are in a relationship with the facade of me / the mask of me, and that is not genuine. \n- vulnerability creates bonds and bonds tie , I can’t control through acts, others have free will, but I can’t control be vulnerable and create strong healthy bonds\n\nThere is a core of control that I have. I want to know that if I do everything right that I can guarantee connection. In reality relationship is a series of ruptures and repairs. People can get mad and that is their own thing. I can ask them how they are feeling and what is going on and repair.\n\nI have to have some degree of exposure to these things. I have to be reassured constantly so that I get to a point where I believe it. I need to believe that I am chosen every day for who I am not what I do.\n\nI could do everything right and we could still lose connection. So it is more important to be vulnerable and create a bond a truly strong bond so that we know each other‘s hearts rather than to show a mask because at the end of the day it is more important to be connected based on vulnerability and who you are rather than the things that you do because you could stop doing the things that you do…\n\nIf I feel annoyed or resentful, it is because I didn’t push hard enough for something that I want. I can feel it in my body and I know when it’s true, it is OK to ask for that there might be some tension. There might be some friction, but it is OK to ask for what is on my heart.",
    "summary": "Practiced replacing assumptions with curiosity and confirmation, and reframed vulnerability as what creates real bonds.",
    "keyInsights": [
      "Mentalization: get curious, name the behavior, and ask for confirmation instead of filling in blanks",
      "Rupture and repair are normal; I need repeated experiences that I won't be left",
      "If I'm not vulnerable, people are in a relationship with my mask",
      "Annoyance/resentment means I didn't push hard enough for something I want"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Mentalization",
      "Confidence, Courage & Competence",
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-03-04T12:00:00Z"
  },
  {
    "id": "session-13",
    "sessionNumber": 13,
    "date": "2026-02-16",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Injustice, rigid rules, and control",
    "rawNotes": "Another counseling session today. She wanted to spend time walking through uncomfortable things to try to better understand them so we could re-pattern them with positive beliefs. Took us down a path of talking through my relationship with my ex wife and seeing that everything was perceived as my fault. I did everything I could to keep the relationship but there continued to be things that were blamed on me. She said she was getting the impression that there was an injustice component. I was playing by rules but still losing. Asked me to think of other instances and there were many. Landed on me having rigid view of life but that life lives on the margins. A lot of learning and bonding can happen there. Not saying I need to break rules, but it almost seems I am holding too tight out of fear and righteousness. \n\nA lot of activation today. Paused and noticed tension in head and neck and shoulders and chest. Put hand on chest and breathed into it and explored what it was telling me.  \n\nAlso talked about control — specifically through following rules.",
    "summary": "Walked through my ex-wife relationship and the sense that I played by the rules but still lost; noted physical activation and breathed into it.",
    "keyInsights": [
      "Everything was perceived as my fault — an injustice component",
      "I may be holding rules too tight out of fear and righteousness; life lives on the margins",
      "Noticed tension in head, neck, shoulders, chest — hand on chest, breathe into it"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Confidence, Courage & Competence",
      "Mentalization"
    ],
    "createdAt": "2026-02-16T12:00:00Z"
  },
  {
    "id": "session-12",
    "sessionNumber": 12,
    "date": "2026-02-09",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Mentalization: the mental ledger and my previous marriage",
    "rawNotes": "Had counseling session yesterday. Started off talking about mentalization — my brain is constantly analyzing and accounting (I asked friend X for a favor today, now I can’t ask for anything else for Y days. Or maybe I did something someone else didn’t like and that is a penny in the bucket against me, all adding up to them potentially leaving because I’m too much). Asked what I would do if I didn’t spend all my mental energy doing this and just had radical acceptance of the things outside of my control. Talked about how I’m over analyzing the bad and filtering out the good. Asked me to keep a journal so I can capture all of the good and instances of positive affirmations of a healthy relationship and safety. Talked about previous marriage - she had suggested maybe my ex had a mental disorder. I described it more as an immaturity and reluctance to share feelings and running to men, alcohol, etc to numb feelings. I was constantly making sure she was okay in fear of rupture because there was no repair, just rupture. Counselor asked me to think if there were any aspects of that relationship I’d like to use EMDR for, as she said she could sense my tension when she asked if my ex had cheated.",
    "summary": "Talked about constant analyzing and accounting in relationships, over-analyzing the bad while filtering the good, and possible EMDR for the previous marriage.",
    "keyInsights": [
      "The 'penny in the bucket' accounting — what if that energy went to radical acceptance of what I can't control?",
      "I over-analyze the bad and filter out the good",
      "Could use EMDR on parts of my previous marriage"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "Mentalization"
    ],
    "createdAt": "2026-02-09T12:00:00Z",
    "modalities": [
      "EMDR"
    ],
    "counselorAdvice": "Keep a journal capturing the good and positive signs of a healthy, safe relationship."
  },
  {
    "id": "session-11",
    "sessionNumber": 11,
    "date": "2026-02-02",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Being separate and internal validation",
    "rawNotes": "Had another counseling session today. Covered a lot of topics, but the place we ended was the most pertinent. We talked about the item that I was struggling with the most was being separate. I get so much validation externally, and I need to work on internal validation. The most pertinent part of the session was at the end when something came up and I mentioned that I don’t believe feedback. That I’ve learned to distressed. That others have lied to me or misled me and it just left me struggling to trust. The counselor said this felt like a wound for me.",
    "summary": "Identified being separate as the hardest piece; need to build internal validation, and named distrust of feedback as a wound.",
    "keyInsights": [
      "I get a lot of external validation and need to develop internal validation",
      "I don't believe feedback — I've learned to distrust it",
      "Counselor named this as a wound"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay",
      "Mentalization"
    ],
    "createdAt": "2026-02-02T12:00:00Z"
  },
  {
    "id": "session-10",
    "sessionNumber": 10,
    "date": "2026-01-26",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Sense of self, rules, and developmental repair",
    "rawNotes": "Another counseling session today. \n\n\nWe started by going inward and exploring. I mentioned that I see the world as a construct – there are rules and I followed them. The social adaptability works for me until I have a need. If that need conflicts with my construct, it becomes anxiety. How am I going to ask for it? Is it valid? Will it cause a burden/fracture? I weigh whether the need is worth it or if I earned it. After I ask a skin the room to make sure it’s OK. We sat without feeling and found protectors. Afraid of loss.\nExplored further… Anxious around doing the right thing and an anxious because it feels like I was never pursued so it took a while to find connection – now that I have it I don’t want to do anything to risk losing it because I might not get it again\nPart of problem is people are getting to know me for what I’m doing and not who I am\nTalked about me seemingly having a firm sense of self but abandon itself as soon as I need to help someone/comply/follow what I think I need to do to keep connection\nTalked about narcissistic personalities – not me. Thought my mom’s construct could be a bit of that lane – what can you do for me? Dad didn’t ask anything of me, just didn’t connect/was aloof\nTalked about how I missed out on developmental stage of pushing back and developing interdependence, so having to learn that now and repair it earlier\nTalked about how some of my stunting according to a book that she referenced called the flight from intimacy by Janae Weinhold, it happened likely between three and five years old when I was supposed to be gaining independence. Supposed to have others name my feelings and guide me instead I was sheltered and was told that things were scary, told what to do. So I have to do it now.\nShe is going to send me some resources around somatic exercises in order to try to get me to calm my body so that I can have a more regulated response to trigger instances.",
    "summary": "Explored how my sense of self drops away when I need to comply to keep connection, and how I missed the stage of building independence.",
    "keyInsights": [
      "Social adaptability works until I have a need that conflicts with my construct — then it becomes anxiety",
      "I missed the push-back / interdependence stage (~ages 3–5) and am learning it now",
      "Counselor will send somatic exercises to regulate my body in trigger situations"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space",
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2026-01-26T12:00:00Z",
    "modalities": [
      "IFS"
    ]
  },
  {
    "id": "session-9",
    "sessionNumber": 9,
    "date": "2026-01-19",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Protector part, perceived failure, and fear of abandonment",
    "rawNotes": "Another session today:\n\nTalked through protector part. Gave the example of being flooded and feeling the need to withdraw because of perceived safety of relationship\n\nTalked about how it isn’t actually the kids screaming, it is my perceived failure as a result of them screaming — I can’t do it, I’m not enough, I’m a bad partner\n\nTalked about having assurances of what it would take for the other person to leave — discovered it’s not so much about that and more about the loss of connection, distancing (I never should have married you, you are a burden) — gave the example of ex-wife saying she never should have married me. Less about leaving and more about not living up to expectations/not being enough. \n\nTalked about how it’s wholly unrealistic to have the expectations I have in regards to reading feelings, controlling the emotions of others, etc.\n\nTalked about how that wounding is the wounding of others who may not know how to communicate to me\n\nTalked about “If today went exactly how you would have wanted it to go, how would it go”\n\nTalked about zooming out and reminding self of commitment to each other and shared goals and what we’re working towards — not getting bogged down in day to day\n\nContinue working on this wound / held belief that says it is inevitable that I will be abandoned",
    "summary": "Talked through a protector that withdraws when flooded, and how the fear is less about leaving than about not being enough and losing connection.",
    "keyInsights": [
      "It isn't the kids screaming — it's my perceived failure ('I'm not enough, I'm a bad partner')",
      "The fear is less about someone leaving and more about distancing and not meeting expectations",
      "Zoom out: remember commitment to each other and shared goals"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay",
      "Mentalization"
    ],
    "createdAt": "2026-01-19T12:00:00Z",
    "modalities": [
      "IFS"
    ],
    "counselorAdvice": "Keep working on the held belief that abandonment is inevitable."
  },
  {
    "id": "session-8",
    "sessionNumber": 8,
    "date": "2026-01-14",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Beliefs, body response, and the 'I am human' mantra",
    "rawNotes": "Had another counseling session today.\n\nTalked about beliefs I hold, what these beliefs bring up in my body, the story that tells and what is a new belief. For example, activated equals noisy/overstimulated, body response equals anger, story equals I can’t handle this.\n\nTalked about equity – give intake in relationships and how I said I don’t often feel that – I feel I’m so desperate to connect that I’ll do anything and that it’s my fault if it doesn’t land.\n\nTalked about not really taking risks as a kid – time of social development. Hundreds of micro movements to learn these things but now I’m having to develop them and they feel\nControl and I’m responsible – how others respond\nRelationship – connection requires give-and-take and will require sitting in some degree of discomfort\nI am human, I can take up space, it is OK to not be perfect – I should not lose connection\n\nFeeling like we are getting at the foundation. I have many of my beliefs and values handed to me or drilled into me as a kid. I didn’t take risks, I followed rules to the letter. I reshaped these rules as I grew in a desire to be in and or maintain relationships because this is what neglect taught me. With little to no risk taking, I never established social skills that should have been built little by little. Learning them now takes risk and feels unsafe. Possible, but will take some reassuring from partner and or skilled building. Worked on the ladder at the end with ABC mapping(antecedent, behavior, consequence, and new narrative) parentheses\n\nThe goal of using the mantra “I am human”, is what she challenged me with. It is both daunting and gives permission. Permission not to be perfect, to try, to be vulnerable, to take up space. Daunting because I’m not sure what it means fully – what am I allowed to give myself lenient on, what do I need to own, etc.?",
    "summary": "Mapped belief → body response → story → new belief, talked about equity in relationships, and ended with the ABC ladder and the mantra 'I am human.'",
    "keyInsights": [
      "Activated = noisy/overstimulated → anger → 'I can't handle this' (old belief mapping)",
      "Connection requires give-and-take and sitting in some discomfort; I'm not responsible for how others respond",
      "'I am human' gives permission not to be perfect, to try, to be vulnerable, to take up space"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-01-14T12:00:00Z",
    "counselorAdvice": "Use the mantra 'I am human.'"
  },
  {
    "id": "session-7",
    "sessionNumber": 7,
    "date": "2026-01-05",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Mom, enmeshed systems, and externalizing",
    "rawNotes": "We spent a lot of time talking about my mom, and if she had addictive tendencies, and what type of a role I was playing in her life. Her thinking was that people who have addictions or addictive tendencies, tends to impact those around them, and create a meshed system of need. Where are we ultimately landed was that I am at a minimum involved in a type of web in which I am being reflected back a collapse. I am expressing needs and the mirror shown back to me is a much larger deal than what I actually. showed. As a result, I think that reasonable requests are unreasonable, and I have to soften quite often. What my counselor wants me to do is to try to externalize more often. To try to put thoughts out there and see how I feel about them and whether they’re reasonable or not. She talked about creating a safe space for parts so that they could relearn how to interact with the world and be repaired. I often times know what is right from a sense of self that hit some sort of a block. That block she is hypothesizing has to do with my ties to my mom. That I had to be a caretaker for her make sure. make sure that she was OK and do everything “right“. The idea is that if I give the parts a foundation in which they are not reaction reacting emotionally, then they can react out of a place of reason and learned new experiences. Right now it feels unsafe to ask for needs because that is what I was shown growing up. Something else that came up was that I had too much power. All of these instances, I had the power to influence people’s behaviors to make them feel good to make them feel bad and it was up to me. Part of what I think she was implying is that people need to manage their own emotions and historically I was in charge of that and I shouldn’t be.\n\nI remember from a young age I would test limits and would see what got me punished. I learned I did not like being yelled at, grounded, spanked. I learned where the lines were. It became my identity to be good. I was praised for it. Rewarded for it. I then became afraid to not be good - I followed rules to a T. It started out so I wouldn’t get punished. Can that tie into my ties with my Mom that we explored today?",
    "summary": "Explored my role in my mom's life and how my needs get reflected back as a bigger deal than I expressed, so I soften; practiced the idea of externalizing thoughts.",
    "keyInsights": [
      "When I express needs, the mirror shown back is much larger than what I showed — so reasonable requests feel unreasonable",
      "Externalize more often to test whether thoughts are reasonable",
      "People need to manage their own emotions; historically I was in charge of that and shouldn't be"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay",
      "Mentalization",
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2026-01-05T12:00:00Z",
    "modalities": [
      "IFS"
    ],
    "counselorAdvice": "Externalize more often; create a safe space for parts."
  },
  {
    "id": "session-6",
    "sessionNumber": 6,
    "date": "2025-12-31",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Codependency and updating my rulebook",
    "rawNotes": "Just had another counseling session. We spent the first part discussing codependency and decided there were some tendencies around codependency and some areas I could work on.\n\nWe ended the session talking about how I need to update my “rulebook“. We talked about how I am to take over parenting myself. That I had a lot of structure created by my family of origin to finding who I needed to be and who I was supposed to be. Peeling back layers and trying to define who I am and what I need– to find myself, not live out the way others defined for me.\n\nWe explored a scenario where I talked about ceiling panic between asking for a need and staying with him or foster in the meats of the system I was within him. In the example, autonomy was buffed when I was told I couldn’t hang out with friends on New Year’s. I was told this is what we were doing as a family, this is how it is. We had my adult self meet me at the restaurant and comfort him. What he truly wanted in that moment was compassion same things like oh man that’s rough. I know you really wanted that. You must feel disappointed. My counselor asked me to take a risk until the teenager that I’m taking over his parent and I am free from the guard reels that I can be myself, and I can feel without calculation of how things would play out, and I can show a emotion, express frustration, expressed myself without fear of how it might impact others. My adult self doesn’t judge and can hold space.\n\nShe also provided a needs worksheet. Her challenge to me was to express needs more often even as simple as the saying. I have this need.",
    "summary": "Looked at codependent tendencies, the need to update my 'rulebook' and parent myself, and comforted my teenage self at a family New Year's scenario.",
    "keyInsights": [
      "Some codependent tendencies to work on",
      "Update the rulebook — find who I am rather than live out how others defined me",
      "Express needs more often, even as simply as 'I have this need'"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2025-12-31T12:00:00Z",
    "modalities": [
      "IFS"
    ],
    "counselorAdvice": "Express needs more often — even as simply as saying 'I have this need.'"
  },
  {
    "id": "session-5",
    "sessionNumber": 5,
    "date": "2025-12-23",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Responsibility, power, and being myself vs. earning approval",
    "rawNotes": "Had counseling yesterday, here is the details:\n\nDiscussed a lot at the start. Said last session stuck with me a bit and brought up old memories -- trying to better understand and explain why I felt the way I did. Talked about how I felt responsible for a lot and that I actually had a lot of power in that regard. Power to help and make people feel certain ways. Got into the topic of self and she asked if people praised me for my character and if people attuned to my needs. Explained how I mostly followed rules because it felt safer so character wasn't complimented, obedience was. And lack of obedience felt like rupture. They didn't / couldn't attune to me because I was chasing approval, not being self. Mentioned we could go a lot of ways it depended on my goals. I explained how I would like to notice a trigger and pull out of the feeling I get from it sooner and repair / reconnect without people feeling my depression. She asked what a situation looked like. I have an example of forgetting to start the dishwasher where I felt like I let my wife down and inconvenienced her and I got into a lot of negative self talk and tried to make up for it and feared loss of connection and relationship over a simple mistake like that. My therapist asked what it would take to reconnect and I said -- just knowing we are good. That there is no risk of fracture. That there was frustration with an action but that was all, we're still good and that they are dealing with their own emotions. She mentioned that is healthy and with my history I am wanting to not manage other people's emotions and I want to feel securely attached. We had also talked about feedback and how no one addresses me directly and I have to go on feel and read or trust -- people tend to be fake around me. We talked about having space for my needs. Talked about how I manage better when I've woken early and moved/journaled/etc before there are any expectations of me or people to manage. Talked about asking for my needs but feeling guilty doing so -- feels intimate to ask for needs. She said I'm being wise in my approach -- figuring out how I can prioritize family first. She said I could approach it as -- I'm going to do this thing, how can it best fit in with what we have going on as a family. I said I still feel guilty because me doing something for myself takes away time someone else could be having. She said they need to ask - it's not my job to anticipate -- that is part of trust building. I can state my observations, I can share the story I'm telling myself, but they need to speak up and confirm/deny. I can hold space. We briefly talked about when I first felt the need to manage the feelings or expectations of others. WE landed on 8 (thinking now it's maybe closer to freshman year of high school, either way). We met with this part and discussed freeing it of its burden. Its job is to be a kid to play to leave the adult stuff that they took on and were confused by and simply let them be a kid. To go play, to not manage, to just be. The part didn't fully understand because they thought it was normal, but also truly saw that as a desire -- they didn't want this added responsibility of management. We left it there and said maybe next time we could do some EMDR around this.\n\nWe talked about some takeaways:\n- Could plan the week ahead and schedule time for the things I want to do\n- Can say: I'm noticing ... you're upset/tired/etc ... but don't manage, just notice and name\n- Can ask for reassurance that we are good (separate I am mad from we are good/bad)\n- The story I'm telling myself is ... (Brenee Brown)\n- My feelings were too much for my caregivers (remind 8 year old part that we are out of that situation and there are new inputs)\n- Being self allows others to attune to me, not my behavior",
    "summary": "Explored feeling responsible for others' feelings, being praised for obedience rather than character, asking for needs without guilt, and freeing a young part of the job of managing emotions.",
    "keyInsights": [
      "Being myself allows others to attune to me, not my behavior",
      "It's not my job to anticipate needs — others need to speak up; I can share the story I'm telling myself and hold space",
      "My feelings were too much for my caregivers — remind that young part we are out of that situation"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Allowed to Take Up Space",
      "Mentalization",
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2025-12-23T12:00:00Z",
    "modalities": [
      "IFS"
    ],
    "counselorAdvice": "Notice and name — don't manage. Ask for reassurance that we are good."
  },
  {
    "id": "session-4",
    "sessionNumber": 4,
    "date": "2025-12-15",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Teen at the dinner table: monitoring, feeling trapped, enmeshment",
    "rawNotes": "Had another session today. Talked about how it felt to be at home as a teenager. The image I chose was the dinner table when dad was in a depressive state. Felt how it was — the mood in the room, what I was feeling. How I was constantly monitoring and looking for cues. My counselor mentioned Dad’s lack of engagement and eye contact as a form of rejection. I was looking for what to do and how to act trying to making it comfortable for everyone. Talked about the feelings of being trapped and being powerless. My body struggled to get to the idea of powelessness because it felt like I had a semblance of control. We stuck with trapped. Looking for safety and a way to make things better we asked what that version of me would want to hear. Asked if there was a way to see dad in a different light and humanize him; understand why he was feeling that way. The me — now — can empathize almost too much — it doesn’t change how hard it was for the old me who didn’t get it and felt it was my fault or I had control. Talked about enmechment and how I had to be a part of the fabric to feel safe and attune to moods. Her challenge to me was to separate — someone can feel how they are feeling and connection can survive. She had me ask that part to come with me but it was hesitant, it wanted to make sure everyone was okay there. I stayed with the part there instead and said I am available anytime. \nThis was very emotional for me. Good to connect with why my dad acted the way he did, but couldn’t help but see myself a bit. Hard to revisit feeling and see that I carry that feeling into today.",
    "summary": "Revisited the dinner table when Dad was depressed — constant cue-monitoring and feeling trapped — and explored enmeshment.",
    "keyInsights": [
      "I had to be part of the fabric of the family's moods to feel safe",
      "Stayed with 'trapped' rather than 'powerless'",
      "Challenge: someone can feel how they feel and connection can survive"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2025-12-15T12:00:00Z",
    "modalities": [
      "IFS"
    ],
    "counselorAdvice": "Separate: someone can feel how they are feeling and connection can survive."
  },
  {
    "id": "session-3",
    "sessionNumber": 3,
    "date": "2025-12-11",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Relationship with Dad: the belief that connection must be earned",
    "rawNotes": "I had another session with my therapist. We talked about a variety of things but focused on my relationship with my dad. We went back to the part of me that was early high school age in my childhood home. I visited with that part of me. I introduced myself to him and we talked for a bit. I told him I was there to get to know him better. Together we went downstairs where dad was. There was a palpable tension for us both. We were constantly scanning the room to check what the mood was — to know whether there was a chance of connection. I pictured my dad sitting in his recliner with his laptop, wrapped up in whatever he was doing. We sat on the couch adjacent to him with no acknowledgment. It brought up feelings of not wanting to say or do anything that might put him in a depressive mood. The feeling in the air, the heaviness, the tension. I just wanted a safe place where I could be myself and have connection. If he was in a bad mood there was no connection and it was better not to be around. It was nice to have that version of me around since we knew we both understood the feeling. My counselor said to thank that part for the hypervigilance and that it was amazing that part could navigate that space. \n\nThis was all centered around the idea that when I meet people I believe that I attract them as a snapshot of who I am at that moment. If I change then it risk disconnection. My counselor thought this interaction with my dad could be the starting point of my belief that connection is based on merit and that I’m treating others the way I treat him. That love is conditional and I have to earn connection and that disconnection is my fault through action (or inaction)\n\nI had also described the feeling of incongruence. Not trusting the words that people say, but relying instead on body language and the way people say things — putting more stock in that than the words.",
    "summary": "Visited my early-high-school self in the childhood home, scanning for Dad's mood, and thanked that part for its hypervigilance.",
    "keyInsights": [
      "Thank that part for the hypervigilance — it navigated a tense home",
      "Possible root belief: connection is merit-based, love is conditional, disconnection is my fault",
      "I trust body language and tone over words (incongruence)"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay",
      "I'm Allowed to Take Up Space"
    ],
    "createdAt": "2025-12-11T12:00:00Z",
    "modalities": [
      "IFS"
    ],
    "counselorAdvice": "Thank that part for the hypervigilance."
  },
  {
    "id": "session-2",
    "sessionNumber": 2,
    "date": "2025-11-25",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "Creating safety: safe place, protector & window of tolerance",
    "rawNotes": "We talked today about creating safety. The theory was to create a mental and emotional environment that has been established through visualization and sensory to be a place where I feel safe. We could use this later with deep work to have a safe place for parts. She had me pick out a protector as well and I chose my family dog. I picked nature, specifically on a trail hiking as my safe place. I knew I felt safe because I was relaxed I wasn’t hypervigilant, I had no worries, no responsibilities, just freedom and autonomy. This was done in concurrence with EMDR buzzers. She told me that this is what safety felt like and asked me when I felt this way in real life, and I said not often. We discussed other things that made me feel safe — who, what, where, when. We also discussed the vagal nerve and window of tolerance. Implying that I can handle more in my window of tolerance and feeling safe would help me with my triggers, avoiding falling out of that window of tolerance. We also discussed things that detracted from my energy as they could be pulling me out of window of tolerance. Ultimately, we established a safe space in my mind that will be useful later, but also intriguing now.",
    "summary": "Built a visualized safe place (hiking trail in nature) with my family dog as protector, using EMDR buzzers, and discussed the vagus nerve and window of tolerance.",
    "keyInsights": [
      "Safety felt like relaxed, not hypervigilant, no responsibilities — freedom and autonomy",
      "Feeling safe widens my window of tolerance and helps with triggers",
      "Things that drain my energy can pull me out of my window of tolerance"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2025-11-25T12:00:00Z",
    "modalities": [
      "EMDR"
    ]
  },
  {
    "id": "session-1",
    "sessionNumber": 1,
    "date": "2025-11-21",
    "counselorName": "Danielle Biegler, MA, LPC",
    "focusTheme": "First session: fear of losing connection, held in the body",
    "rawNotes": "Completed my first session with this therapist. We got into how it feels in my body when I get anxious because I am fearing the loss of connection. Feel it in my chests and throat — a constriction, hard to take a deep breath. On high alert. We let my body guide me to the strongest instance of this feeling. It was my first marriage when I was told that our marriage was over. We went back to that place and witnessed the event. We asked to be alone — myself and my 27 year old self. We explored how he was feeling and his fears. We acknowledged his pain, his loss of connection, his penchant for action, and the fact that he never really felt that pain, never really sat in it. All he wanted was someone to sit with him, to listen, to provide company. We walked out of the house together and told him he is always welcome. That I am sorry that it took me this long, but I see him. We also acknowledged that this is just a feeling, but my feet are right here in this present moment. This provided a feeling of lifted weight.",
    "summary": "Traced the chest/throat constriction to the moment my first marriage ended, then met my 27-year-old self, acknowledged his pain, and told him he is always welcome.",
    "keyInsights": [
      "Fear of losing connection shows up as chest and throat constriction and high alert",
      "My 27-year-old self never got to sit in the pain; all he wanted was someone to sit with him",
      "It's a feeling — my feet are here in the present moment (brought a lifted-weight feeling)"
    ],
    "emotionBefore": "",
    "emotionAfter": "",
    "homeworkIds": [],
    "resourceIds": [],
    "themes": [
      "I'm Okay Even If They're Not Okay"
    ],
    "createdAt": "2025-11-21T12:00:00Z",
    "modalities": [
      "IFS"
    ]
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];

export const INITIAL_USER_PROFILE: UserGrowthProfile = {
  "name": "Tim",
  "counselorName": "Danielle Biegler, MA, LPC",
  "nextSessionDate": "",
  "lastSessionDate": "2026-11-09",
  "currentStreak": 0,
  "totalXP": 0,
  "gardenLevel": 1,
  "waterDroplets": 0,
  "badges": [],
  "activeModalities": [
    "EMDR",
    "IFS"
  ]
};

// Curated "this week" focus, keyed by the session it is based on.
export const INITIAL_WEEKLY_FOCUS: Record<string, WeeklyFocus> = {
  'session-37': {
    sessionId: 'session-37',
    source: 'curated',
    summary:
      "Last session you caught yourself being assertive and noticed it felt safe. Underneath is a protector that braces in your shoulders and neck when you share about yourself, afraid of embarrassment, misunderstanding and getting in trouble. It seems to trace back to feeling like an outsider and not being attuned to (Hood to Coast, high school, a home where everyone was unavailable). This week is about practicing small assertive moments, using mentalization before you brace or repair, and staying connected to the younger part of you who wants to play outside.",
    focusAreas: [
      { title: 'Practice small, safe assertiveness', why: "Being assertive in session is rewiring a pathway. Repeating it in low-stakes moments outside session is how it carries over." },
      { title: 'Mentalize before you brace or repair', why: "When someone seems down or tired, get curious instead of assuming the worst. Repair only what is actually yours." },
      { title: 'Befriend the bracing protector and your younger self', why: "The protector in your shoulders and neck is trying to keep you from embarrassment and conflict. Your younger self wanted connection and to play outside." },
    ],
    practices: [
      "Once a day, say one small true preference out loud (\"I'd rather...\") and notice your shoulders and neck afterward.",
      "Check in three times a day: drop your shoulders, hand on your neck, long exhale. Ask the bracing part what it is protecting you from.",
      "When someone seems down or tired, try: \"I notice you seem tired. I don't know what's going on. Do you want to talk, or some space?\" Then wait. Don't repair if you didn't cause it.",
      "Give your younger self 20 minutes of play or time outside (a hike, throwing a ball) with no goal.",
      "Write down one moment you braced for the worst and nothing bad happened. These are your disconfirming experiences.",
    ],
    journalPrompts: [
      "When did I feel safe enough to say what I felt this week? What made it feel safe?",
      "Where do I feel the brace in my body right now, and what is it afraid will happen if I'm fully myself?",
      "Think of someone who seemed down or tired this week. What did I assume? What else could be true? What could I ask?",
      "If I stopped repairing things that aren't mine, what would I feel in the first minute, and what would I do next?",
      "What would the younger me eating lunch alone in high school want to hear from me today?",
      "What is the difference between being liked for who I am and being liked for what I do?",
    ],
    affirmations: [
      "I'm allowed to say what I feel.",
      "Being myself is safe enough.",
      "Their mood is theirs. I can stay steady.",
      "The part of me that braces kept me safe, and I can thank it and loosen.",
      "My younger self is welcome to play, and I'm right here with him.",
    ],
    resources: [
      { title: 'The Tao of Fully Feeling', author: 'Pete Walker', why: 'Your counselor mentioned it last session. It covers feeling and processing emotions after a difficult childhood.', fromCounselor: true },
      { title: 'Parenting from the Inside Out', author: 'Daniel Siegel & Mary Hartzell', why: 'Your counselor mentioned it earlier this year. It connects your own history to how you attune in the present.', fromCounselor: true },
      { title: 'No Bad Parts', author: 'Richard Schwartz', why: 'An IFS book on protectors like the bracing part, and how to build trust with them.', fromCounselor: false },
      { title: 'Rising Strong', author: 'Brene Brown', why: 'The "story I\'m telling myself" practice fits the mentalization work.', fromCounselor: false },
    ],
  },
};
