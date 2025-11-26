@echo off
echo ========================================
echo  Starting KiroweenSkeleton Apps
echo ========================================
echo.
echo Starting Notes App on port 3000...
start "Notes App - Port 3000" cmd /k "cd apps\notes-app && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Tasks App on port 3001...
start "Tasks App - Port 3001" cmd /k "cd apps\tasks-app && npm run dev"

echo.
echo ========================================
echo  Both Apps Starting!
echo ========================================
echo.
echo Notes App: http://localhost:3000
echo Tasks App: http://localhost:3001
echo.
echo Two command windows will open.
echo Keep both running to use the apps.
echo.
echo Login with: test@example.com / password123
echo.
pause