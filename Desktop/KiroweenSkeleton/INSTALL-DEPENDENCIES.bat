@echo off
echo ========================================
echo  Installing Dependencies
echo ========================================

echo Installing Tasks App drag-and-drop library...
cd apps\tasks-app
call npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

echo.
echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Now you can start the apps with:
echo START-BOTH-APPS.bat
echo.
pause