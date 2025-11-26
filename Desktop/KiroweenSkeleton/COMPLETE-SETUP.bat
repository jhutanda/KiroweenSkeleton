@echo off
echo ========================================
echo  KiroweenSkeleton - Complete Setup
echo ========================================

echo Step 1: Installing root dependencies...
npm install --no-workspaces

echo Step 2: Installing Notes app dependencies...
cd apps\notes-app
npm install
cd ..\..

echo Step 3: Installing Tasks app dependencies...
cd apps\tasks-app
npm install
cd ..\..

echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo To run the applications:
echo.
echo 1. Notes App (Port 3000):
echo    cd apps/notes-app
echo    npm run dev
echo.
echo 2. Tasks App (Port 3001):
echo    cd apps/tasks-app  
echo    npm run dev
echo.
echo Both apps will be available at:
echo - Notes: http://localhost:3000
echo - Tasks: http://localhost:3001
echo.
echo Login with any email/password (e.g., test@example.com / password123)
echo.
pause