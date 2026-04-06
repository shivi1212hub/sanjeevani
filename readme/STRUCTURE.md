# Directory Structure Explanation

## Overview

The Sanjeevani project is organized into three main directories:

## Directory Layout

```
sanjeevani/
├── frontend/               # Frontend Application
├── backend/               # Backend Services
├── readme/                # Documentation
├── .gitignore             # Git ignore configuration
└── package.json           # Root package.json with helper scripts
```

## Detailed Structure

### 1. Frontend Directory (`frontend/`)

React + Vite application for the user interface.

```
frontend/
├── src/                          # Source code
│   ├── components/              # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── AppSidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ... (more components)
│   ├── pages/                   # Page-level components
│   │   ├── Dashboard.tsx
│   │   ├── Auth.tsx
│   │   ├── Index.tsx
│   │   ├── AiAssistant.tsx
│   │   ├── FirstAidGuide.tsx
│   │   ├── RppgMonitor.tsx
│   │   └── ... (more pages)
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useRppg.ts
│   ├── contexts/                # React context providers
│   │   └── AuthContext.tsx
│   ├── lib/                     # Utility functions
│   │   ├── analytics.ts
│   │   ├── translations.ts
│   │   └── utils.ts
│   ├── types/                   # TypeScript type definitions
│   │   └── sanjeevani-tagger.d.ts
│   ├── data/                    # Mock data & constants
│   │   ├── mockAlerts.ts
│   │   └── mockData.ts
│   ├── integrations/            # Third-party integrations
│   │   └── supabase/
│   │       └── ... (Supabase client config)
│   ├── test/                    # Test files
│   │   ├── example.test.ts
│   │   └── setup.ts
│   ├── assets/                  # Images, icons, etc.
│   ├── App.tsx                  # Root React component
│   ├── App.css                  # App styles
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles
│   └── vite-env.d.ts            # Vite type definitions
│
├── public/                       # Static assets served as-is
│   └── robots.txt
│
├── index.html                    # HTML template
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── components.json              # shadcn/ui config
├── eslint.config.js             # ESLint configuration
├── package.json                 # Frontend dependencies
├── package-lock.json            # Dependency versions lock
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # TypeScript app config
├── tsconfig.node.json           # TypeScript Node config
├── vite.config.ts               # Vite build configuration
├── vitest.config.ts             # Vitest testing config
└── README.md                    # Frontend-specific README
```

**Key Files:**
- `package.json` - All frontend dependencies
- `vite.config.ts` - Build and dev server config
- `.env` - Supabase credentials (create this)
- `src/main.tsx` - App entry point
- `src/App.tsx` - Root component

### 2. Backend Directory (`backend/`)

Supabase backend configuration and serverless functions.

```
backend/
└── supabase/                    # Supabase project
    ├── functions/              # Edge Functions (serverless)
    │   └── health-assistant/   # Health assistance function
    │       ├── index.ts
    │       └── package.json
    │
    ├── migrations/              # Database migrations
    │   └── 20260226164740_*.sql # Migration files
    │
    ├── config.toml             # Supabase configuration
    ├── .env.local              # Local env variables
    └── README.md               # Backend documentation
```

**Key Files:**
- `config.toml` - Supabase project settings
- `functions/*/index.ts` - Serverless function code
- `migrations/*.sql` - Database schema migrations

### 3. Documentation Directory (`readme/`)

Comprehensive documentation for the project.

```
readme/
├── README.md                    # Main project documentation
├── SETUP_INSTRUCTIONS.md        # Complete setup guide
├── FRONTEND_SETUP.md            # Frontend development guide
├── BACKEND_SETUP.md             # Backend development guide
├── DEPLOYMENT.md                # Deployment instructions
├── GITHUB_SETUP.md              # GitHub repository setup
├── CONTRIBUTING.md              # Contribution guidelines
└── STRUCTURE.md                 # This file
```

**Documentation Guide:**
- **Start here:** [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- **Frontend dev:** [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)
- **Backend dev:** [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Deploying:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **GitHub:** [GITHUB_SETUP.md](./GITHUB_SETUP.md)

### 4. Root Configuration Files

```
sanjeevani/
├── .gitignore                   # What to ignore in Git
├── package.json                 # Root package.json with helper scripts
└── README.md                    # (Optional) Quick reference README
```

## Important Files Explained

### .env (Frontend)

Place in `frontend/` directory. Never commit to Git.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### .gitignore (Root)

Prevents committing:
- `node_modules/` - Dependencies
- `.env` - Secrets
- `dist/` - Build output
- `.vscode/` - Editor config
- And more...

### package.json (Root)

Helper scripts for the entire project:

```json
{
  "scripts": {
    "setup": "Install all dependencies",
    "dev": "Start frontend dev server",
    "build": "Build frontend for production",
    "frontend:*": "Run frontend commands",
    "backend:*": "Run backend commands"
  }
}
```

### vite.config.ts (Frontend)

Configures Vite build tool:
- Port: 5173
- TypeScript support
- React plugin
- Tailwind CSS
- Path aliases

## File Types by Purpose

### React Components
- Location: `src/components/`
- Pattern: PascalCase.tsx
- Example: `Header.tsx`, `SOSAlertCard.tsx`

### Pages/Views
- Location: `src/pages/`
- Pattern: PascalCase.tsx
- Example: `Dashboard.tsx`, `Auth.tsx`

### Custom Hooks
- Location: `src/hooks/`
- Pattern: useHookName.ts(x)
- Example: `useRppg.ts`

### Utilities & Helpers
- Location: `src/lib/`
- Pattern: descriptionInKebabCase.ts
- Example: `analytics.ts`, `utils.ts`

### Type Definitions
- Location: `src/types/`
- Pattern: nameOfType.ts
- Example: `sanjeevani-tagger.d.ts`

### Styling
- Tailwind CSS classes (primary)
- Location: `src/*.css` for global
- Pattern: Use utility classes

### Configuration Files
- `vite.config.ts` - Vite build
- `tailwind.config.ts` - Tailwind
- `tsconfig.json` - TypeScript
- `postcss.config.js` - PostCSS

## Data Flow

```
Browser
  ↓
index.html → main.tsx → App.tsx
  ↓
React Components (pages & components)
  ↓
Hooks (useQuery, useState, etc.)
  ↓
hooks/ → lib/ (utilities)
  ↓
integrations/supabase/ (client)
  ↓
Backend (Supabase)
  ↓
PostgreSQL Database
```

## Environment-Specific Files

### Development
- `.env` (frontend)
- Hot reload via Vite
- Source maps enabled

### Production
- Build output in `dist/`
- Minified and optimized
- Environment-specific .env

## Ignored Directories

These are in `.gitignore` and not committed:

```
node_modules/        # Dependencies
dist/                # Build output
.vite/               # Vite cache
.vscode/             # Editor settings
.idea/               # IDE settings
.DS_Store            # macOS
coverage/            # Test coverage
.env                 # Secrets
```

## Development Workflow

Typical file modifications:

```
1. Modify component → src/components/MyComponent.tsx
2. Update styles → Add Tailwind classes
3. Add logic → src/hooks/ or src/lib/
4. Create tests → __tests__/ folder
5. Commit changes → Git
6. Deploy → Run build & deploy scripts
```

## Building & Deployment

### Development
```bash
npm run dev          # Runs Vite dev server
```

### Production
```bash
npm run build        # Creates dist/ folder
npm run preview      # Preview production build
```

The `dist/` folder is deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

## Key Concepts

### Separation of Concerns
- **Frontend** - All UI code
- **Backend** - Database, functions, auth
- **Documentation** - All guides

### Modularity
- Components are small and reusable
- Hooks for complex logic
- Utils for shared functions

### Scalability
- Easy to add new components
- Backend scales independently
- Documentation stays current

## File Navigation

### Adding a New Page
1. Create `src/pages/PageName.tsx`
2. Add route in `App.tsx`
3. Add link in navigation

### Adding a Component
1. Create `src/components/ComponentName.tsx`
2. Use in pages or other components
3. Add export to index if needed

### Adding a Utility
1. Create in `src/lib/utilityName.ts`
2. Export function
3. Import where needed

### Adding a Hook
1. Create `src/hooks/useHookName.ts`
2. Export custom hook
3. Use in components

## Performance Considerations

### Frontend
- Components code-split automatically
- Images optimized
- CSS tree-shaking with Tailwind

### Backend
- Database indexes on key columns
- Edge functions cached
- Real-time subscriptions selective

## Version Control

### Commit Files
- Source code
- Configuration files
- Documentation

### Don't Commit
- node_modules
- .env files
- Build output (dist)
- IDE settings
- OS files

## Links to Detailed Docs

- [Main README](./README.md) - Full overview
- [Setup Instructions](./SETUP_INSTRUCTIONS.md) - Getting started
- [Frontend Setup](./FRONTEND_SETUP.md) - Frontend development
- [Backend Setup](./BACKEND_SETUP.md) - Backend development
- [Deployment](./DEPLOYMENT.md) - How to deploy
- [Contributing](./CONTRIBUTING.md) - How to contribute

---

This structure ensures:
- ✅ Clear organization
- ✅ Easy navigation
- ✅ Scalability
- ✅ Maintainability
- ✅ Team collaboration

**Questions about structure?** See [Contributing Guide](./CONTRIBUTING.md)
