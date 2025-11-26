# Troubleshooting: "New Task" Button Not Visible

## Quick Checks

### 1. Check Browser Console
1. Open Tasks app: `http://localhost:3001`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for any **red error messages**
5. Share the error if you see one

### 2. Check if Page is Loading
- Do you see the "Task Board" title?
- Do you see the statistics cards (Total Tasks, To Do, etc.)?
- Do you see the three columns (To Do, In Progress, Completed)?

### 3. Check Button Location
The "New Task" button should be in the **top-right corner** of the page, next to "AI Schedule" button.

**If you see "AI Schedule" but not "New Task":**
- The button might be cut off
- Try zooming out (Ctrl + Mouse Wheel)
- Try making browser window wider

### 4. Check if Tasks App is Running
```bash
# Make sure you're running the Tasks app on port 3001
# Open a new terminal and run:
cd apps/tasks-app
npm run dev
```

## Common Issues & Solutions

### Issue 1: Page Shows Blank/White Screen
**Solution:**
```bash
EMERGENCY-FIX.bat
```

### Issue 2: Button is Hidden by Layout
**Try this:**
1. Press `F12` (Developer Tools)
2. Press `Ctrl+Shift+C` (Element Inspector)
3. Click where the button should be (top-right)
4. Check if button exists in HTML but is hidden

### Issue 3: Wrong App Running
**Make sure you're on the right app:**
- Notes App: `http://localhost:3000` (has "Smart Notes" title)
- Tasks App: `http://localhost:3001` (has "Task Board" title)

### Issue 4: Component Error
**Check for these errors in console:**
- "Cannot read properties of undefined"
- "Module not found"
- "Failed to fetch"

## Quick Test

**Can you see these elements?**
- [ ] "Task Board" title with chart icon
- [ ] "Manage your tasks efficiently" subtitle
- [ ] 5 colored statistics cards
- [ ] "AI Schedule" button (purple/secondary)
- [ ] "New Task" button (blue/primary)
- [ ] Three columns: To Do, In Progress, Completed

**If you can see everything EXCEPT "New Task" button:**
1. Take a screenshot
2. Check browser zoom level (should be 100%)
3. Try pressing `Ctrl+0` to reset zoom
4. Try a different browser

## Manual Fix

If button still doesn't appear, try this temporary fix:

1. Open: `apps/tasks-app/src/pages/TasksPageSimple.tsx`
2. Find line ~127 (the New Task button)
3. Change it to:
```tsx
<Button 
  onClick={handleCreateTask}
  style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px' }}
>
  <Plus className="w-4 h-4 mr-2" />
  CREATE TASK
</Button>
```
4. Save and refresh page
5. You should see a RED button that says "CREATE TASK"

## What to Report

If none of this works, please tell me:
1. **What DO you see** on the Tasks app page?
2. **Any error messages** in the console (F12)?
3. **Screenshot** of what you see
4. **Browser** you're using (Chrome, Firefox, Edge?)
5. **Zoom level** (bottom-right of browser, should be 100%)

## Emergency Alternative

If you still can't see the button, you can create tasks directly in localStorage:

1. Press `F12`
2. Go to **Console** tab
3. Paste this code:
```javascript
const tasks = JSON.parse(localStorage.getItem('kiroween_tasks') || '[]');
tasks.push({
  id: Date.now().toString(),
  userId: 'user-123',
  title: 'Test Task',
  description: 'Created manually',
  status: 'pending',
  priority: 'high',
  deadline: new Date(Date.now() + 86400000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});
localStorage.setItem('kiroween_tasks', JSON.stringify(tasks));
location.reload();
```
4. Press Enter
5. Page will reload with a new task

This will help us confirm if the issue is with the button or the whole page.