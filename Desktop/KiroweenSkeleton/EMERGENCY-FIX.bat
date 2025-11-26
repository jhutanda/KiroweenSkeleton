@echo off
echo ========================================
echo  Emergency Fix - Clearing Cache
echo ========================================

echo Step 1: Stopping any running processes...
taskkill /F /IM node.exe 2>nul

echo Step 2: Cleaning Notes app cache...
cd apps\notes-app
if exist node_modules\.vite (
    echo Removing Vite cache...
    rmdir /s /q node_modules\.vite
)
if exist dist (
    echo Removing dist folder...
    rmdir /s /q dist
)

echo Step 3: Cleaning Tasks app cache...
cd ..\tasks-app
if exist node_modules\.vite (
    echo Removing Vite cache...
    rmdir /s /q node_modules\.vite
)
if exist dist (
    echo Removing dist folder...
    rmdir /s /q dist
)

cd ..\..

echo.
echo ========================================
echo  Cache Cleared! Now Starting Apps...
echo ========================================
echo.

echo Starting Notes App...
start "Notes App - Port 3000" cmd /k "cd apps\notes-app && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Tasks App...
start "Tasks App - Port 3001" cmd /k "cd apps\tasks-app && npm run dev"

echo.
echo ========================================
echo  Done!
echo ========================================
echo.
echo If you still see errors:
echo 1. Close both terminal windows
echo 2. Run this script again
echo.
echo Apps will be available at:
echo - Notes: http://localhost:3000
echo - Tasks: http://localhost:3001
echo.
pause