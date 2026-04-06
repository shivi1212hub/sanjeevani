# Installation & Setup Instructions

## Complete Setup Guide for Sanjeevani

Follow these steps to set up the Sanjeevani project locally for development or deployment.

## Prerequisites

Before you begin, ensure you have installed:

- **Git**: https://git-scm.com
- **Node.js** (v18 or higher): https://nodejs.org
- **npm** or **Bun**: https://bun.sh (recommended for speed)
- **Code Editor**: VS Code recommended from https://code.visualstudio.com

### Verify Installation

```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
git --version     # Should be 2.x or higher
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/sanjeevani.git
cd sanjeevani
```

## Step 2: Initial Setup

### Quick Setup (Recommended)

```bash
npm run setup
```

This command:
- Installs root dependencies
- Installs all frontend dependencies
- Sets up the project

### Manual Setup

If automatic setup fails, do this manually:

```bash
# Install root dependencies (if needed)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 3: Environment Configuration

### Frontend Environment

Create `.env` file in the `frontend/` directory:

```bash
cd frontend
touch .env
```

Add the following environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get these values from:**

1. Go to [Supabase](https://supabase.com)
2. Sign in or create an account
3. Create a new project
4. Go to Project Settings > API
5. Copy `Project URL` and `anon public key`

### Backend Environment (Optional)

For backend development:

```bash
cd backend/supabase
touch .env.local
```

Add:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 4: Start Development

### Option A: Frontend Only

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Option B: Frontend + Backend

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run backend:start
```

The frontend will be available at `http://localhost:5173`

### Option C: Using Individual Commands

**Frontend Development:**
```bash
cd frontend
npm run dev
```

**Backend (Supabase):**
```bash
npm install -g supabase
cd backend/supabase
supabase start
```

## Step 5: Verify Installation

### Frontend

1. Open `http://localhost:5173` in your browser
2. You should see the Sanjeevani landing page
3. Check browser console for any errors (F12 > Console)

### Backend

If running Supabase locally:

1. Go to `http://localhost:54323` (Supabase Dashboard)
2. Verify database is running
3. Check function logs

## Troubleshooting

### Problem: "Port 5173 is already in use"

**Solution:** Vite will automatically try the next available port. Check the terminal output for the actual port.

Or manually specify a port:

```bash
cd frontend
npm run dev -- --port 3000
```

### Problem: "Module not found" errors

**Solution:** Clear and reinstall dependencies:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problem: Supabase environment variables not working

**Solution:** 
1. Verify `.env` file exists in `frontend/` (not `frontend/src/`)
2. Ensure variables are prefixed with `VITE_`
3. Restart development server after creating `.env`

### Problem: "Cannot find Supabase project"

**Solution:**
1. Verify credentials in `.env` are correct
2. Check project is active in Supabase dashboard
3. Ensure you have internet connection

### Problem: Build fails with TypeScript errors

**Solution:**
```bash
cd frontend
npm run lint -- --fix
npm run build
```

## Project Structure

```
sanjeevani/
├── frontend/                      # React frontend (Vite)
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── hooks/                # Custom hooks
│   │   ├── App.tsx               # Root component
│   │   └── main.tsx              # Entry point
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.ts            # Vite config
│   └── .env                      # Environment variables
│
├── backend/                       # Backend services
│   └── supabase/                 # Supabase config
│       ├── functions/            # Edge functions
│       ├── migrations/           # Database migrations
│       └── config.toml           # Supabase config
│
├── readme/                        # Documentation
│   ├── README.md                 # Main documentation
│   ├── FRONTEND_SETUP.md         # Frontend guide
│   ├── BACKEND_SETUP.md          # Backend guide
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── GITHUB_SETUP.md           # GitHub setup
│   ├── CONTRIBUTING.md           # Contribution guide
│   └── SETUP_INSTRUCTIONS.md     # This file
│
├── .gitignore                     # Git ignore rules
├── package.json                   # Root package.json
└── README.md                      # (Optional) Quick README
```

## Development Workflow

### Making Changes

1. Create a branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `frontend/` or `backend/` directories

3. If modified frontend:
   ```bash
   cd frontend
   npm run lint
   npm run test
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: describe your feature"
   git push origin feature/your-feature-name
   ```

5. Create a pull request on GitHub

### Available Scripts

**At root level:**
```bash
npm run setup                # Install all dependencies
npm run dev                  # Start frontend dev server
npm run build                # Build frontend for production
npm run frontend:lint        # Lint frontend code
npm run frontend:test        # Run frontend tests
npm run backend:start        # Start Supabase locally
npm run backend:stop         # Stop Supabase
```

**In frontend directory:**
```bash
npm run dev                  # Start dev server
npm run build                # Build for production
npm run preview              # Preview production build
npm run test                 # Run tests
npm run test:watch           # Watch mode testing
npm run lint                 # Lint code
```

## Next Steps

1. ✅ **Setup Complete?** Start the development server
   ```bash
   npm run dev
   ```

2. 📖 **Read Documentation**
   - [Frontend Setup](./readme/FRONTEND_SETUP.md)
   - [Backend Setup](./readme/BACKEND_SETUP.md)
   - [Main README](./readme/README.md)

3. 🚀 **Deploy When Ready**
   - See [Deployment Guide](./readme/DEPLOYMENT.md)

4. 🤝 **Contributing**
   - See [Contributing Guide](./readme/CONTRIBUTING.md)

5. 💾 **GitHub Setup**
   - See [GitHub Setup](./readme/GITHUB_SETUP.md)

## System Requirements

| Requirement | Minimum | Recommended |
|---|---|---|
| Node.js | 18.0 | 20.x LTS |
| npm | 9.0 | 10.x |
| RAM | 4 GB | 8 GB or more |
| Disk Space | 2 GB | 5 GB or more |

## Performance Tips

1. **Use Bun** - It's 3x faster than npm
   ```bash
   curl -fsSL https://bun.sh/install | bash
   bun run setup
   bun run dev
   ```

2. **Keep dependencies updated**
   ```bash
   npm update
   ```

3. **Use VSCode extensions**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter
   - ESLint

## Getting Help

1. **Check documentation**
   - Read the relevant setup guide in `readme/`

2. **Check logs**
   - Frontend: Browser console (F12)
   - Backend: Terminal output

3. **Search issues**
   - GitHub Issues section
   - Look for similar problems

4. **Create an issue**
   - Go to GitHub > Issues
   - Provide detailed description
   - Include error logs

## Security Reminders

⚠️ **IMPORTANT** - Never commit:
- `.env` files
- `.env.local` files
- `node_modules/` directory
- Private API keys
- Passwords or secrets

The `.gitignore` file prevents most of these, but always double-check before pushing.

## Uninstall / Clean Up

To reset everything:

```bash
# Remove node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Reset backend
cd ../backend/supabase
supabase db reset

# Or completely remove and clone again
cd ..
rm -rf sanjeevani
git clone https://github.com/yourusername/sanjeevani.git
```

## Success Checklist

- [ ] Node.js v18+ installed
- [ ] Project cloned
- [ ] Dependencies installed (`npm run setup`)
- [ ] `.env` file created in frontend/
- [ ] Supabase credentials added to `.env`
- [ ] Development server starts (`npm run dev`)
- [ ] Browser shows Sanjeevani app
- [ ] No console errors (F12)
- [ ] Can navigate the application

If all boxes are checked, you're ready to start developing! 🎉

---

**Questions?** See [FAQ](./readme/README.md#faq) in main documentation

**Need help?** Check [Troubleshooting](./readme/FRONTEND_SETUP.md#troubleshooting)

**Ready to contribute?** See [Contributing Guide](./readme/CONTRIBUTING.md)

**Want to deploy?** See [Deployment Guide](./readme/DEPLOYMENT.md)
