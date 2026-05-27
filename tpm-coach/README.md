# TPM Interview Coach

An AI-powered interview coaching app for Senior TPM and PM candidates.
Built with Claude AI. Runs locally on your computer.

---

## What it does

- Reads your CV and personalises every session to your background
- Runs live exercise simulations with real messy data (just like actual interviews)
- Coaches you through behavioural interview questions
- Scores you across four dimensions after every exercise
- Tracks your progress across the session
- Saves a full session log when you're done

---

## Before you start

You need two things installed on your computer:

**1. Node.js**
Go to https://nodejs.org and download the LTS version. Install it.
To check it worked, open Terminal (Mac) or Command Prompt (Windows) and type:
node --version
You should see a version number starting with 18 or higher.

**2. A Claude API key**
Go to https://console.anthropic.com
Sign in or create an account.
Go to "API Keys" and create a new key.
Copy it — you'll need it in the next step.

---

## Setup (do this once)

**Step 1 — Download the app**
Put the tpm-coach folder somewhere on your computer (Desktop is fine).

**Step 2 — Open Terminal**
On Mac: press Cmd + Space, type "Terminal", press Enter.
On Windows: press Win + R, type "cmd", press Enter.

**Step 3 — Navigate to the app folder**
Type this and press Enter (replace the path with where you put the folder):

cd ~/Desktop/tpm-coach

**Step 4 — Install dependencies**
Type this and press Enter:

npm install

Wait for it to finish. You'll see a lot of text — that's normal.

**Step 5 — Add your API key**
In the tpm-coach folder, find the file called .env.example.
Duplicate it and rename the copy to .env (just .env, no .example).
Open it with any text editor and replace YOUR_API_KEY_HERE with your 
Claude API key. Save the file.

It should look like this:
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxx

---

## Running the app

Every time you want to use the app:

**Step 1 — Open Terminal and navigate to the folder:**
cd ~/Desktop/tpm-coach

**Step 2 — Start the server:**
npm start

**Step 3 — Open your browser and go to:**
http://localhost:3000

**Step 4 — When you're done, stop the server:**
Press Ctrl + C in the Terminal window.

---

## How to use it

**Starting a session:**
1. Click "Paste CV" and paste your CV text into the box
2. Click Submit — the coach will analyse your background
3. Confirm your profile when the coach summarises it
4. Choose a mode: Exercise, Behavioural, or Full Mock Interview

**During an exercise:**
- A timer will appear when the exercise starts — it mirrors real interview pressure
- Type your responses in the input box
- Press Enter to send, Shift+Enter for a new line
- The coach will debrief you after each exercise with scores

**Ending a session:**
- Click "End Session" when you're done
- The coach will produce a full session summary
- Your session log is automatically saved to the /sessions folder

---

## Sharing with friends

To share the app with someone:

1. Send them the tpm-coach folder
2. They follow the Setup steps above
3. They need their own Claude API key (free to create at console.anthropic.com)
4. Their sessions are saved separately on their own computer

---

## Your session logs

Every session is saved as a JSON file in the /sessions folder.
The filename includes the date and time so you can find it easily.

Each log contains:
- The full conversation
- Your scores per exercise
- Scenarios and questions covered
- The session summary

You can open these files in any text editor to review past sessions.

---

## Troubleshooting

**"command not found: node"**
Node.js isn't installed. Go to https://nodejs.org and install it.

**"Cannot find module" or similar errors**
Run npm install again from the tpm-coach folder.

**"Invalid API key" or no response from the coach**
Check your .env file. Make sure the key starts with sk-ant- and has no 
extra spaces.

**The page won't load**
Make sure the server is running (npm start) and you're going to 
http://localhost:3000 not https.

**Something else is wrong**
Close the Terminal window, open a new one, navigate to the folder, 
and run npm start again.

---

## Questions?

The app runs entirely on your computer. Your CV and session data never 
leave your machine — everything is stored locally in the /sessions folder.

The only data that goes outside your computer is the conversation text 
sent to Claude's API to generate responses. This is subject to 
Anthropic's privacy policy at https://www.anthropic.com/privacy
