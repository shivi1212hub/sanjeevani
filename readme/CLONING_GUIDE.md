# How to Run After Cloning

This guide explains how to get the application running after someone clones your GitHub repository.

## Cloning the Repository

```bash
git clone https://github.com/yourusername/sanjeevani.git
cd sanjeevani
```

## Directory Structure When Cloned

After cloning, you'll have:

```
sanjeevani/
├── frontend/              # React + Vite application
├── backend/              # Supabase configuration
├── readme/               # All documentation
├── .gitignore           # Git configuration
├── package.json         # Root package.json
└── README.md            # This file
```

**Important:** 
- No `node_modules/` directory (it's in `.gitignore`)
- No `.env` files (they're in `.gitignore` for security)
- Frontend config files are included (vite.config.ts, tsconfig.json, etc.)

## Installation Steps

### 1. Install Dependencies

From the root directory, run:

```bash
npm run setup
```

This will:
- Install root-level dependencies
- Navigate to `frontend/` and install all frontend dependencies
- Set up everything you need

**Alternative (manual step-by-step):**

```bash
npm install
cd frontend
npm install
cd ..
```

### 2. Configure Environment Variables

The application needs Supabase credentials. Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
touch .env
```

Add the following (replace with your actual values):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to get these values:**
1. Go to https://supabase.com
2. Sign in to your account
3. Go to your project
4. Click "Settings" → "API"
5. Copy `Project URL` and `anon public key`
6. Paste them in the `.env` file

### 3. Start the Development Server

From the root directory:

```bash
npm run dev
```

The application will start at `http://localhost:5173`

**Alternative (from frontend directory):**

```bash
cd frontend
npm run dev
```

## How It Works

### Frontend Application

Located in `frontend/` folder:
- Built with React + Vite
- All source code in `frontend/src/`
- Build tool: Vite (hot reload enabled)
- Styling: Tailwind CSS
- Components: shadcn/ui

The Vite dev server handles:
- Hot module reloading (HMR)
- TypeScript compilation
- CSS processing
- Asset bundling

### Backend Integration

The frontend connects to Supabase backend:
- Database: PostgreSQL
- Authentication: Supabase Auth
- Real-time: WebSocket subscriptions
- Functions: Edge functions for business logic

### Build Process

When you run `npm run dev` (from root or frontend):

1. Vite starts a development server
2. React components are compiled
3. Tailwind CSS is processed
4. Hot reload watchers are activated
5. Server listens on `http://localhost:5173`
6. Changes trigger automatic reload

## File Independence

The folders work independently:

```
npm run dev          # Runs frontend dev server
npm run build        # Builds frontend only
npm run backend:*    # Runs backend commands
```

Each folder is self-contained:
- `frontend/` has its own `package.json`
- `backend/supabase/` has its own config
- No cross-dependencies between folders
- Clean separation of concerns

## Configuration Files (Location: `frontend/`)

### vite.config.ts
Controls Vite development server:
- Port: `5173`
- React plugin
- TypeScript support
- Tailwind CSS

### tailwind.config.ts
Tailwind CSS configuration and customization

### tsconfig.json
TypeScript compiler settings

### package.json
All frontend dependencies and scripts

### .env
Supabase credentials (YOU create this - not in repo)

## Running Custom Scripts

From root or specific folders:

```bash
# From root
npm run frontend:dev          # Start frontend
npm run frontend:build        # Build frontend
npm run frontend:lint         # Lint code
npm run frontend:test         # Run tests

# From frontend/
cd frontend
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run test                  # Run tests
npm run lint                  # Check code style
npm run preview               # Preview production build
```

## Port Customization

If port 5173 is already in use:

```bash
npm run dev -- --port 3000
# or
cd frontend && npm run dev -- --port 3000
```

Vite will also suggest the next available port.

## Understanding the Application Flow

When you run `npm run dev`:

```
1. Vite dev server starts on port 5173
2. Loads index.html
3. Loads React app (main.tsx)
4. React renders App component
5. Components load and connect to Supabase
6. App is interactive at http://localhost:5173
7. Changes trigger hot reload
```

## Debugging the Application

### Browser Console
Press `F12` or right-click → "Inspect"

### VS Code Debugger
Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

### React DevTools
Install extension:
- [React DevTools Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [React DevTools Firefox](https://addons.mozilla.org/firefox/addon/react-devtools/)

## Build for Production

To create a production build:

```bash
npm run build
```

This creates a `dist/` folder with optimized files. These can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify
- Any static host

See [DEPLOYMENT.md](./readme/DEPLOYMENT.md)

## Common Issues When Cloning

### Issue: "Cannot find module"
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: ".env not found" error
**Solution:**
Create `frontend/.env` with Supabase credentials

### Issue: "Port 5173 is in use"
**Solution:**
```bash
npm run dev -- --port 3000
```

### Issue: "Supabase connection error"
**Solution:**
1. Verify `.env` has correct URL and key
2. Check Supabase project is active
3. Verify internet connection
4. Restart dev server

### Issue: "Vite not found" or cannot run dev
**Solution:**
```bash
cd frontend
npm install
npm run dev
```

## Testing After Clone

Verify everything works:

1. ✅ Clone repository
2. ✅ Run `npm run setup`
3. ✅ Create `.env` in `frontend/`
4. ✅ Run `npm run dev`
5. ✅ Open `http://localhost:5173`
6. ✅ See the Sanjeevani landing page
7. ✅ Check browser console (F12) - no errors
8. ✅ All navigation works

If all checks pass, you're ready to develop! 🎉

## Performance Tips

1. **Use Bun instead of npm** (3x faster):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   bun run setup
   bun run dev
   ```

2. **Close unused browser tabs** while developing

3. **Use production build for testing**:
   ```bash
   npm run build
   npm run preview
   ```

4. **Monitor bundle size**:
   ```bash
   npm run build  # Check dist/ folder size
   ```

## Architecture Overview

```
Browser (http://localhost:5173)
           ↓
    React App (frontend/)
           ↓
  Supabase Client
           ↓
    Supabase Backend
           ↓
  PostgreSQL Database
```

## Next Steps After Cloning

1. ✅ [Setup instructions](./readme/SETUP_INSTRUCTIONS.md)
2. ✅ [Frontend guide](./readme/FRONTEND_SETUP.md)
3. ✅ [Full documentation](./readme/README.md)
4. ✅ [Ready to contribute?](./readme/CONTRIBUTING.md)

## Git Workflow After Cloning

```bash
# Stay updated
git pull origin main

# Create feature branch
git checkout -b feature/your-feature

# Make changes in frontend/src/

# Test locally
npm run frontend:test
npm run frontend:lint

# Commit changes
git add .
git commit -m "feat: describe your change"

# Push changes
git push origin feature/your-feature

# Create pull request on GitHub
```

## Support

If you encounter issues:

1. Check [Troubleshooting](./readme/SETUP_INSTRUCTIONS.md#troubleshooting)
2. Read [FAQ](./readme/README.md)
3. Create [GitHub Issue](../../issues)
4. Check [documentation](./readme/)

---

**The application is designed to work independently after cloning with just 3 steps:**

1. `npm run setup` - Install dependencies
2. Create `.env` - Add Supabase credentials
3. `npm run dev` - Start the app

**That's it!** 🚀

See [SETUP_INSTRUCTIONS.md](./readme/SETUP_INSTRUCTIONS.md) for detailed guides.

---

Last Updated: February 2026
