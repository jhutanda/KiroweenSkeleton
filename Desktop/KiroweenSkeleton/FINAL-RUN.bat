@echo off
echo ========================================
echo  KiroweenSkeleton - Final Setup
echo ========================================

echo Step 1: Installing root dependencies...
npm install --no-workspaces

echo Step 2: Installing Notes app dependencies...
cd apps\notes-app
npm install

echo Step 3: Starting the Notes App...
echo Opening http://localhost:3000
echo Use any email/password to login (e.g., test@example.com / password123)
echo.
npm run dev