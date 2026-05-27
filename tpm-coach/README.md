# TPM Interview Coach

An AI-powered coaching app for Senior TPM and PM interview preparation. Runs on your computer and uses Claude to run personalised coaching sessions.

---

## What it does

- Analyses your CV and tailors every session to your background
- Runs timed live exercises with messy, real-world data
- Coaches behavioural interview answers with detailed feedback
- Scores you across four dimensions after each exercise: Prompting, Narration, Insight, Close
- Saves a full session log and summary after each session

---

## Setup (one time)

### Step 1 — Install Node.js

If you don't have Node.js installed, download it from https://nodejs.org and install the "LTS" version. Just run the installer and accept all defaults.

To check it worked, open a Terminal and type:
```
node --version
```
You should see a version number like `v20.x.x`.

### Step 2 — Get your Anthropic API key

1. Go to https://console.anthropic.com/settings/keys
2. Click **Create Key**
3. Copy the key (it starts with `sk-ant-...`)

### Step 3 — Set up the app

Open a Terminal, navigate to this folder, and run these commands one at a time:

```bash
cd ~/claude_projects/tpm-coach
npm install
cp .env.example .env
```

Then open the `.env` file in any text editor and replace `your_api_key_here` with your actual API key:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

Save the file.

---

## Running the app

Every time you want to use the coach, open a Terminal and run:

```bash
cd ~/claude_projects/tpm-coach
npm start
```

Then open your browser and go to: **http://localhost:3000**

To stop the app, press `Ctrl+C` in the Terminal.

---

## How to use it

1. **Start a session** — the coach will greet you and ask for your CV
2. **Paste your CV** — click the "Paste CV" button and paste your CV or a written summary of your experience
3. **Choose a mode** — pick from live exercise, behavioural coaching, or a full mock interview
4. **Practice** — respond to scenarios and questions in the text box. Press Enter to send, Shift+Enter for a new line
5. **Watch the timer** — when an exercise starts, a countdown appears. It won't cut you off when it hits zero, but it shows you the pressure
6. **Track your scores** — the sidebar shows your running scores across all exercises
7. **End the session** — click "End Session" for a full debrief and summary. The session is automatically saved to the `sessions/` folder

---

## Session logs

Every completed session is saved as a JSON file in the `sessions/` folder inside this directory. Each file contains the full conversation, your scores, and the session summary.

---

## Troubleshooting

**"Failed to connect to Claude API"** — Check that your API key in `.env` is correct and that you have internet access.

**"Session not found"** — Refresh the browser page to start a new session.

**The page won't load** — Make sure the app is running (`npm start`) and that you're going to `http://localhost:3000`.

**Port already in use** — Another app is using port 3000. You can change the port by adding `PORT=3001` to your `.env` file and going to `http://localhost:3001` instead.
