# SimplePractice Calendar & Appointment Sync Integration

A specialized integration allowing clients whose therapy is hosted on SimplePractice to seamlessly sync their counseling appointments, import calendar invite files (.ics), subscribe to their SimplePractice calendar feed, and quickly parse appointment confirmation emails into session schedules and prep agendas.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmed choices in Phase 1:
> - **Confirmed Sync Scope**: **Calendar and appointment sync only** (avoiding intrusive EHR/document sync and keeping data lightweight, private, and focused on scheduling).
> - **Confirmed Source Format**: **Email summaries & calendar invites** (the standard way SimplePractice notifies clients of upcoming appointments and telehealth links).

- **Confirmed Decision 1**: Built-in SimplePractice Calendar Importer supporting drag-and-drop `.ics` calendar invites directly from SimplePractice email confirmations.
- **Confirmed Decision 2**: SimplePractice Calendar Feed Subscription URL (`webcal://` or `https://`) auto-sync that pulls recurring appointment dates and telehealth video links automatically.
- **Confirmed Decision 3**: Email Confirmation Quick-Paste parser powered by Gemini to extract session date, time, and telehealth video link from confirmation emails sent by SimplePractice.

---

## 1. Overview & Core Concept

- **What It Does**: SimplePractice does not provide a public client REST API due to HIPAA/EHR constraints. However, it issues calendar invite files (`.ics`), calendar subscription feeds, and email notifications for appointments and telehealth video calls. TheraBloom bridges this gap by providing a dedicated **SimplePractice Sync Suite**:
  1. **Drop & Import `.ics` Invites**: Drag and drop any calendar invite attachment from SimplePractice emails to instantly update your next session date, time, and telehealth URL.
  2. **Calendar Feed URL Sync**: Paste your private SimplePractice client portal calendar feed URL to automatically keep upcoming sessions in sync.
  3. **Email Quick-Parse**: Paste an appointment confirmation or email summary from SimplePractice to automatically parse date, time, counselor name, and telehealth video link.
  4. **One-Click Telehealth Launch**: Direct launcher button to your SimplePractice video appointment or client portal.
- **Target Persona**: Therapy clients using SimplePractice through their therapist's private practice who want automated appointment reminders and session prep without manual data entry.
- **Key Value**: Bridges SimplePractice scheduling with between-session growth, ensuring upcoming session countdowns, prep debriefs, and homework deadlines always reflect the actual calendar.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Opening SimplePractice Sync**:
   - In the **Schedule Modal** or **Sessions** tab, the user clicks **"Sync with SimplePractice"**.
   - A dedicated SimplePractice sync card appears with clear tabs:
     - **Import `.ics` File**: Drag and drop the `.ics` file downloaded from SimplePractice or email invite.
     - **Calendar Subscription Feed**: Enter the calendar feed URL provided in the SimplePractice Client Portal.
     - **Paste Email Invite / Summary**: Paste the confirmation text from SimplePractice to parse date, time, and link via Gemini.
2. **Review & Auto-Populate**:
   - The parsed appointment details (Date, Time, Telehealth Meeting Link, Counselor Name) are displayed with a clear preview.
   - User clicks **"Confirm & Sync Schedule"** to immediately update the app's countdown, agenda, and between-session cadence.
3. **One-Click Pre-Session Launcher**:
   - On session day, the app displays a prominent **"Join SimplePractice Telehealth"** action button alongside the **"Prep Next Session"** debrief report.

### Visual Identity & Theme
- **Aesthetic Direction**: Grounded, clinical-grade sanctuary aesthetic with serene sage green (`#2D5A43`), warm stone surfaces, and clean unboxed metadata adhering to zero-pill rules.
- **Color Tokens**:
  - Dominant Neutral: Canvas `#FAF8F5`, Surface Card `#FFFFFF`, Border `#E8E2D9`.
  - Brand Accent: Sage `#2D5A43`, Warm Clay `#C86D51`.
  - SimplePractice Badge: Refined dark teal unboxed indicator (`#006B70` brand recognition without garish badges).
- **Typography**: Display headlines in `Fraunces` and interface controls in `Plus Jakarta Sans`, with tabular numerals (`tabular-nums`) for appointment dates and timestamps.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Native `.ics` Parser vs. OAuth API**
  - *Chosen Approach*: Client-side `.ics` (iCalendar) parser paired with optional calendar feed URL polling.
  - *Why*: SimplePractice does not offer public client OAuth APIs due to HIPAA regulations. `.ics` invites and calendar feeds are universally supported, 100% HIPAA-compliant on the client side, and work with every SimplePractice clinician.
  - *Alternatives Considered*: Direct scraping or credential sharing was rejected as insecure and violating privacy standards.
- **Decision 2: Email Quick-Parse via Server-Side Gemini**
  - *Chosen Approach*: Users can paste appointment confirmation emails directly; Gemini 3.8 Flash extracts date, time, format, and meeting URLs into structured JSON.
  - *Why*: Many therapy clients simply receive email notifications ("Your upcoming appointment with Dr. Brooks on Wednesday, Nov 18 at 3:00 PM"). Pasting the text takes 2 seconds and avoids manual form filling.

---

## 4. Technical Architecture & Data Strategy

### System Layout & Component Flow
```
┌────────────────────────────────────────────────────────┐
│                   User Interface                       │
│  [Schedule Modal]  ─►  [SimplePractice Sync Drawer]    │
│    │                        │                          │
│    ▼                        ▼                          │
│  Manual Schedule        Three Input Channels:          │
│  Inputs (Date/Time)     1. .ics File Drag & Drop       │
│                         2. Calendar Feed URL (.ics)    │
│                         3. Email Confirmation Text     │
└────────────┬────────────────────────┬──────────────────┘
             │                        │
             ▼                        ▼
┌─────────────────────────┐  ┌───────────────────────────┐
│ Client-side .ics Parser │  │ /api/sync/simplepractice  │
│ - Parses VEVENT fields  │  │ - Gemini 3.8 Flash email  │
│ - Extracts DTSTART/DTEND│  │   extraction to JSON      │
│ - Extracts LOCATION/URL │  └─────────────┬─────────────┘
└────────────┬────────────┘                │
             │                             │
             └──────────────┬──────────────┘
                            ▼
             ┌─────────────────────────────┐
             │    CounselingSchedule State │
             │  - nextSessionDate/Time     │
             │  - telehealthUrl            │
             │  - source: 'simplepractice' │
             │  - TherapyStorage (persist) │
             └─────────────────────────────┘
```

### Data Model Updates
Update `CounselingSchedule` in `src/types/therapy.ts`:
- `source?: 'manual' | 'simplepractice_ics' | 'simplepractice_feed' | 'simplepractice_email'`
- `simplePracticePortalUrl?: string`
- `calendarFeedUrl?: string`
- `lastSyncTimestamp?: string`

### Backend Endpoints
- `POST /api/sync/simplepractice`: Server-side endpoint accepting raw email text or calendar invite snippet, using `gemini-3.8-flash` with structured JSON output schema to return `{ sessionDate, sessionTime, counselorName, appointmentType, telehealthUrl, notes }`.
