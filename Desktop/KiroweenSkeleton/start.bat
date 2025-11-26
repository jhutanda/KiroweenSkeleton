@echo off
echo Installing dependencies...
call npm install

echo Starting Notes App...
cd apps/notes-app
call npm run dev