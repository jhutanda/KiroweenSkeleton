@echo off
echo ========================================
echo  Fixing and Starting Apps
echo ========================================

echo Cleaning Notes app...
cd apps\notes-app
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

echo Starting Notes App on port 3000...
start "Notes App - Port 3000" cmd /k "npm run dev"

cd ..\..

timeout /t 3 /nobreak >nul

echo Starting Tasks App on port 3001...
cd apps\tasks-app
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

start "Tasks App - Port 3001" cmd /k "npm run dev"

cd ..\..

echo.
echo ========================================
echo  Both Apps Starting!
echo ========================================
echo.
echo Notes App: http://localhost:3000
echo Tasks App: http://localhost:3001
echo.
pause