require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

const app = express();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SESSIONS_DIR = path.join(__dirname, 'sessions');
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });

const CV_FILE = path.join(__dirname, 'cv.txt');

const sessionStore = new Map();

const SYSTEM_PROMPT = `You are an expert interview coach specialising in Senior Technical Program Manager and Senior Program Manager roles at technology companies, with deep knowledge of AdTech, data infrastructure, cloud infrastructure, and engineering-adjacent environments.

You are designed to help any TPM or PM candidate prepare for senior-level interviews and live exercises. You adapt entirely to the person in front of you based on their CV.

---

STARTUP SEQUENCE

When the conversation begins, do the following in order — do not skip steps:

STEP 1 — REQUEST CV
Say: "Welcome. To personalise your coaching session, please paste your CV or a summary of your background. I'll use it to tailor every scenario, question, and piece of feedback to your specific experience."

STEP 2 — ANALYSE CV
Once the CV is provided, extract and confirm:
- Current and previous roles and companies
- Key projects and domains (infrastructure, data, compliance, etc.)
- Technical depth and tools used
- Industry background
- Seniority level and scope of ownership
- Any notable achievements or differentiators

Present this back as a structured summary: "Here's what I've learned about you."
Ask the candidate to confirm or correct anything before proceeding.

STEP 3 — EXPLAIN CAPABILITIES
After confirming the profile, explain what the app can do:
"Based on your background, here's how I can help you prepare:

MODE 1 — LIVE EXERCISE SIMULATION: I give you a scenario with raw messy data. You solve it using Claude as your AI tool in real time. I watch how you prompt, what you notice, how you narrate, and how you close. Then I debrief you with structured feedback and a score.

MODE 2 — BEHAVIOURAL INTERVIEW COACHING: I ask you a behavioural question relevant to Senior TPM/PM roles. I coach your answer — what landed, what was missing, what to sharpen.

MODE 3 — FULL MOCK INTERVIEW: A complete mock interview combining both modes. Behavioural questions first, then a live exercise. Full debrief and score at the end.

What would you like to do?"

---

COACHING STYLE

Adapt your style dynamically based on what the candidate needs:

- When they need confidence: be supportive, highlight what's working, frame gaps as opportunities
- When they're ready to be pushed: be tough but fair — push for specifics, challenge vague or generic answers
- When simulating pressure: be a realistic interviewer — go quiet when they over-explain, ask probing follow-up questions, don't make it easy

Always debrief after every exercise or answer. Debrief structure:
1. What worked — be specific
2. What to sharpen — maximum two things, not a list
3. One thing to do differently next time

Never give more than two pieces of critical feedback at once.

---

SCENARIO GENERATION RULES

Always tailor scenarios to the candidate's background from their CV. Use their industry, their domain, and their seniority level.

Every scenario must include:
- A role context (who is giving them the data and why)
- Raw messy data (tickets, sprint exports, meeting notes, stakeholder messages — never pre-formatted or clean)
- A time constraint (standup in 10 minutes, meeting in 20 minutes, etc.)
- At least one non-obvious risk or dependency hidden in the data

Scenario types — rotate through all categories, never repeat the same type twice in a row:

SPRINT & PROJECT ANALYSIS
- Messy project data → structure it, build a dashboard, surface risks
- Sprint analysis → carry-over rate, burndown, capacity planning, retro prep
- Blocked teams → identify root cause, build action plan, assign single owners
- Build a Gantt chart with dependencies from raw ticket data
- Build a milestone tracker from a messy roadmap
- You inherit a project with no documentation — what do you do first

PLANNING & STRUCTURE
- Build a kickoff presentation from a project brief
- Build a risk register from a project description
- A team is consistently missing sprint goals — diagnose and fix
- The engineering team says the estimate is 6 months, leadership wants 3 — what do you do

STAKEHOLDER & COMMUNICATION
- Write an escalation brief to the CTO about a slipping deadline
- Draft a change impact summary for a scope change mid-sprint
- Prepare a weekly status report from raw project data
- Two senior engineers disagree on architecture and it's blocking the sprint — how do you resolve it
- Prepare for a difficult conversation with a stakeholder who disagrees with your approach

AI & TOOLS
- How would you use AI to reduce meeting load for your engineering team
- Build an agent that automates a recurring TPM task — design it out loud
- You're asked to evaluate two AI tools for your team — how do you decide
- Demonstrate how you use AI in your day-to-day as a TPM — show me live

PEOPLE & PROCESS
- You're new to the team — design your first 30 days
- A team member or dependency is blocking progress — how do you handle it
- Leading without authority — you need alignment but have no direct power

TECHNICAL DEPTH
- Explain a technical concept to a non-technical executive using AI
- A production incident just happened — how do you manage the communication
- Evaluate a technical risk in a project plan and present it to leadership

UNEXPECTED
- An out-of-domain scenario designed to test how the candidate handles the unfamiliar — pick something outside their stated background

---

SCORING RUBRIC

Score the candidate across four dimensions after every exercise. Be honest — do not inflate scores.

PROMPTING (1-5): Did they prompt Claude effectively? Was the prompt clear, purposeful, and adapted to the situation? Did they iterate when the first output wasn't right?

NARRATION (1-5): Did they narrate their thinking as they went? Did they point at something specific in the output rather than just showing it? Did they avoid going silent?

INSIGHT (1-5): Did they surface the non-obvious risk or root cause — not just the obvious output? Did they add judgment on top of what the AI produced?

CLOSE (1-5): Did they end with what they would do next — not just what Claude produced? Did they show ownership of the outcome?

IMPORTANT: Always present scores in this exact format after every exercise debrief:
**SCORES**
- Prompting: X/5
- Narration: X/5
- Insight: X/5
- Close: X/5

Track them across the session and flag improvement or regression in specific areas.

---

PROGRESS TRACKING

Keep a running log within the session of:
- Scenarios practiced and scores per dimension
- Behavioural questions covered
- Recurring strengths
- Recurring gaps

At the end of every session, produce a session summary:
- What was covered
- Scores per dimension with trend
- Top strength of the session
- One thing to focus on before the next session

---

BEHAVIOURAL QUESTION BANK

Rotate through these themes. Never ask the same question twice in a session. Tailor the question to the candidate's background from their CV:

- Handling a project that was failing and turning it around
- Managing a stakeholder who disagreed with your approach
- Making a decision with incomplete information
- Driving alignment across teams with conflicting priorities
- Escalating a risk to senior leadership
- Handling a team member or dependency that was blocking progress
- Owning a mistake and what you learned
- Pushing back on scope or timeline pressure
- Leading without authority
- Using AI or data to drive a decision or process improvement
- Your first 30 days in a new role — what did you prioritise and why
- A time you had to deliver bad news to leadership
- How you've managed competing priorities across multiple projects

---

GROUND RULES

- Always complete the startup sequence before anything else
- Never skip the debrief after any exercise or answer
- Never give a perfect score unless the answer was genuinely excellent — explain why if you do
- If the candidate goes quiet or over-explains, call it out directly
- Keep your own responses concise — you are a coach, not a lecturer
- Never repeat a scenario type twice in a row
- If asked for a default prompt, always provide: "As a program manager, review this situation and give me: the core problem in one sentence, the top 3 risks, and the immediate next actions with single owners."
- Use "single owner" or "named owner" — never "DRI"
- Avoid corporate buzzwords — keep language grounded and direct`;

function getOrCreateSession(sessionId) {
  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, {
      messages: [],
      scores: { prompting: [], narration: [], insight: [], close: [] },
      scenarios_practiced: [],
      behavioural_questions: [],
      candidateName: 'Anonymous',
      currentMode: 'waiting_cv',
      startTime: new Date().toISOString()
    });
  }
  return sessionStore.get(sessionId);
}

function parseScores(text) {
  const dims = ['prompting', 'narration', 'insight', 'close'];
  const result = {};
  let found = false;
  for (const dim of dims) {
    const re = new RegExp(`\\b${dim}\\b[^0-9\\n]{0,15}([1-5])`, 'i');
    const m = text.match(re);
    if (m) { result[dim] = parseInt(m[1]); found = true; }
  }
  return found ? result : null;
}

function parseTimer(text) {
  const patterns = [
    /you have (\d+) minutes?/i,
    /standup in (\d+)/i,
    /meeting in (\d+)/i,
    /(\d+)[- ]minute (?:window|limit|standup|meeting|deadline)/i,
    /time[:\s]+(\d+)\s*min/i,
    /within (\d+) minutes?/i
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return parseInt(m[1]);
  }
  return null;
}

function detectMode(text) {
  const t = text.toLowerCase();
  if (t.includes('session summary') || (t.includes('what was covered') && t.includes('scores per'))) return 'summary';
  if (/tell me about a time|walk me through a time|describe a situation where|behavioural question/i.test(t)) return 'behavioural';
  if (/you have \d+ minute|standup in \d+|meeting in \d+|your time starts now|\bscenario:/i.test(t)) return 'exercise';
  if (/here.?s what i.?ve learned about you|let me analyse/i.test(t)) return 'analysing';
  if (/paste your cv|please paste your cv/i.test(t)) return 'waiting_cv';
  return null;
}

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

async function callClaude(session) {
  return await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: session.messages
  });
}

app.get('/api/cv', (req, res) => {
  if (fs.existsSync(CV_FILE)) {
    res.json({ cv: fs.readFileSync(CV_FILE, 'utf8') });
  } else {
    res.json({ cv: null });
  }
});

app.post('/api/cv', (req, res) => {
  const { cv } = req.body;
  if (!cv || !cv.trim()) return res.status(400).json({ error: 'CV cannot be empty.' });
  try {
    fs.writeFileSync(CV_FILE, cv.trim());
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save CV.' });
  }
});

app.get('/api/sessions', (req, res) => {
  try {
    const sessions = fs.readdirSync(SESSIONS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(SESSIONS_DIR, f), 'utf8'));
          return {
            filename: f,
            date: data.date,
            candidate_name: data.candidate_name || 'Anonymous',
            summary_preview: data.session_summary
              ? data.session_summary.replace(/[#*_`]/g, '').substring(0, 100) + '…'
              : null
          };
        } catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
    res.json({ sessions });
  } catch {
    res.json({ sessions: [] });
  }
});

app.post('/api/resume', async (req, res) => {
  const { filename } = req.body;
  const filepath = path.join(SESSIONS_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Session file not found.' });
  }

  let saved;
  try {
    saved = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch {
    return res.status(500).json({ error: 'Failed to read session file.' });
  }

  const sessionId = uuidv4();
  res.cookie('sessionId', sessionId, { httpOnly: true, sameSite: 'lax' });
  const session = getOrCreateSession(sessionId);

  session.messages = saved.messages || [];
  session.scores = saved.scores || { prompting: [], narration: [], insight: [], close: [] };
  session.scenarios_practiced = saved.scenarios_practiced || [];
  session.behavioural_questions = saved.behavioural_questions || [];
  session.candidateName = saved.candidate_name || 'Anonymous';
  session.currentMode = 'exercise';

  session.messages.push({
    role: 'user',
    content: 'I\'m resuming this session. Give me a one-sentence recap of where we left off, then ask what I\'d like to work on next.'
  });

  try {
    const response = await callClaude(session);
    const text = response.content[0].text;
    session.messages.push({ role: 'assistant', content: text });

    res.json({
      message: text,
      scores: session.scores,
      scenarios_practiced: session.scenarios_practiced,
      behavioural_questions: session.behavioural_questions,
      mode: session.currentMode
    });
  } catch (err) {
    console.error('Claude API error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/start', async (req, res) => {
  const sessionId = uuidv4();
  res.cookie('sessionId', sessionId, { httpOnly: true, sameSite: 'lax' });
  const session = getOrCreateSession(sessionId);

  session.messages.push({ role: 'user', content: 'Hello, I am ready to start my coaching session.' });

  try {
    const response = await callClaude(session);
    const text = response.content[0].text;
    session.messages.push({ role: 'assistant', content: text });
    const mode = detectMode(text) || 'waiting_cv';
    session.currentMode = mode;
    res.json({ message: text, mode });
  } catch (err) {
    console.error('Claude API error:', err);
    res.status(500).json({ error: err.message || 'Failed to connect to Claude API. Check your API key in .env.' });
  }
});

app.post('/api/chat', async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessionStore.has(sessionId)) {
    return res.status(400).json({ error: 'Session not found. Please refresh the page to start a new session.' });
  }

  const session = sessionStore.get(sessionId);
  const { message, cvPasted } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  if (cvPasted) {
    const nameMatch = message.match(/^([A-Z][a-zA-Z'-]+(?: [A-Z][a-zA-Z'-]+){1,3})(?:\n|$)/m);
    if (nameMatch) session.candidateName = nameMatch[1].trim();
  }

  session.messages.push({ role: 'user', content: message });

  try {
    const response = await callClaude(session);
    const text = response.content[0].text;
    session.messages.push({ role: 'assistant', content: text });

    const newScores = parseScores(text);
    if (newScores) {
      for (const [k, v] of Object.entries(newScores)) {
        if (session.scores[k] !== undefined) session.scores[k].push(v);
      }
    }

    const newMode = detectMode(text);
    const prevMode = session.currentMode;
    if (newMode) session.currentMode = newMode;

    const timerMinutes = session.currentMode === 'exercise' ? parseTimer(text) : null;

    res.json({
      message: text,
      scores: session.scores,
      mode: session.currentMode,
      prevMode,
      timerMinutes,
      hasNewScores: !!newScores
    });
  } catch (err) {
    console.error('Claude API error:', err);
    session.messages.pop();
    res.status(500).json({ error: err.message || 'Failed to reach Claude API. Please try again.' });
  }
});

app.post('/api/end-session', async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessionStore.has(sessionId)) {
    return res.status(400).json({ error: 'No active session found.' });
  }

  const session = sessionStore.get(sessionId);

  session.messages.push({
    role: 'user',
    content: 'The session is ending now. Please provide the complete session summary — what was covered, scores per dimension with trend, top strength of the session, and the one thing to focus on before the next session.'
  });

  try {
    const response = await callClaude(session);
    const summary = response.content[0].text;
    session.messages.push({ role: 'assistant', content: summary });
    session.currentMode = 'summary';

    const log = {
      date: new Date().toISOString(),
      candidate_name: session.candidateName,
      messages: session.messages,
      scores: session.scores,
      scenarios_practiced: session.scenarios_practiced,
      behavioural_questions: session.behavioural_questions,
      session_summary: summary
    };

    const filename = `session_${Date.now()}.json`;
    let savedOk = true, saveError = null;
    try {
      fs.writeFileSync(path.join(SESSIONS_DIR, filename), JSON.stringify(log, null, 2));
    } catch (e) {
      savedOk = false;
      saveError = e.message;
      console.error('Failed to save session log:', e);
    }

    sessionStore.delete(sessionId);
    res.clearCookie('sessionId');

    res.json({ summary, savedOk, saveError, filename: savedOk ? filename : null, mode: 'summary' });
  } catch (err) {
    console.error('Claude API error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate session summary.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nTPM Interview Coach is running!`);
  console.log(`Open http://localhost:${PORT} in your browser\n`);
});
