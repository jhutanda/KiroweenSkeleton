# Vercel Deployment Guide

## Deploy Notes App to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `jhutanda/KiroweenSkeleton`
4. Configure the project settings:

   **Framework Preset:** Vite
   
   **Root Directory:** `apps/notes-app` (click "Edit" and select this folder)
   
   **Build Command:**
   ```bash
   npm install && npm run build
   ```
   
   **Output Directory:**
   ```
   dist
   ```
   
   **Install Command:**
   ```bash
   npm install
   ```

5. Click **"Deploy"**

### Option 2: Deploy Tasks App

Follow the same steps but use:
- **Root Directory:** `apps/tasks-app`

### Troubleshooting

If you get a 404 error:
1. Check the build logs in Vercel
2. Make sure the Root Directory is set to `apps/notes-app`
3. Verify the Output Directory is `dist` (not `apps/notes-app/dist`)
4. The build command should run from within the app directory

### Environment Variables

If needed, add these in Vercel Project Settings → Environment Variables:
- `VITE_API_URL` (if using external API)
- Any other environment variables from `.env.example`

## Deploy Both Apps

To deploy both apps, create two separate Vercel projects:
1. One for Notes App (from `apps/notes-app`)
2. One for Tasks App (from `apps/tasks-app`)

Each will have its own URL.
