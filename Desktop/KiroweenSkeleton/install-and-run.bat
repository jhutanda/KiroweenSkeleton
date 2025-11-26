@echo off
echo Installing root dependencies...
npm install --no-workspaces

echo Installing Notes app dependencies...
cd apps\notes-app
npm install

echo Starting Notes App...
npm run dev

pause