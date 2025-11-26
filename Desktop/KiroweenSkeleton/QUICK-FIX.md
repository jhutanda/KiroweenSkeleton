# Quick Fix - Task Manager Not Showing

## The Problem
When you click "Task Manager", it opens a new tab to `localhost:3001` but shows nothing because the Tasks app isn't running yet.

## The Solution

You need to run BOTH apps simultaneously in separate terminals:

### Step 1: Install Tasks App Dependencies (if not done)
```bash
cd apps/tasks-app
npm install
cd ../..
```

### Step 2: Start Both Apps

**Terminal 1 - Notes App (already running):**
```bash
cd apps/notes-app
npm run dev
```
Keep this running on port 3000

**Terminal 2 - Tasks App (NEW):**
```bash
cd apps/tasks-app
npm run dev
```
This will start on port 3001

### Step 3: Access Both Apps

- **Notes App**: http://localhost:3000 (already working)
- **Tasks App**: http://localhost:3001 (now will work)

## Quick Start Scripts

Use these batch files to make it easier:

1. **START-NOTES.bat** - Starts Notes app on port 3000
2. **START-TASKS.bat** - Starts Tasks app on port 3001

Run both in separate command prompt windows!

## Verification

Once both are running:
1. Go to http://localhost:3000 (Notes app)
2. Login with any email/password
3. Click "Task Manager" in sidebar
4. New tab opens to http://localhost:3001 (Tasks app)
5. You'll see the Task Manager interface

Both apps share the same authentication, so you'll be logged in automatically!