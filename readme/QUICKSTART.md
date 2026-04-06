# Quick Start Guide

Get Sanjeevani up and running in 5 minutes.

## Prerequisites

- Node.js v18+
- Git
- A code editor (VS Code recommended)

## Installation (5 minutes)

### 1. Clone & Navigate

```bash
git clone https://github.com/yourusername/sanjeevani.git
cd sanjeevani
```

### 2. Install Dependencies

```bash
npm run setup
```

### 3. Configure Frontend

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from [Supabase](https://supabase.com)

### 4. Start Development

```bash
npm run dev
```

Open `http://localhost:5173`

## Done! ✅

Your app is running. Now:

- 📖 [Read Full Setup Guide](./SETUP_INSTRUCTIONS.md)
- 🚀 [Deploy Guide](./DEPLOYMENT.md)
- 💻 [Frontend Guide](./FRONTEND_SETUP.md)
- ⚙️ [Backend Guide](./BACKEND_SETUP.md)
- 📁 [Project Structure](./STRUCTURE.md)

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --port 3000  # Use different port

# Building
npm run build            # Build for production
npm run build:dev        # Build for dev environment

# Testing & Quality
npm run frontend:test    # Run tests
npm run frontend:lint    # Check code quality

# Backend
npm run backend:start    # Start Supabase locally
npm run backend:stop     # Stop Supabase
```

## Folder Structure

```
sanjeevani/
├── frontend/          # React app
├── backend/          # Supabase backend
├── readme/           # Documentation
└── .gitignore        # Git ignore file
```

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**Module errors?**
```bash
cd frontend && rm -rf node_modules && npm install
```

**Supabase not working?**
- Check `.env` has correct credentials
- Verify project is active on Supabase

## Next Steps

1. Explore the app at `http://localhost:5173`
2. Start making changes in `frontend/src/`
3. Hot reload will show changes instantly
4. Read [Contribution Guide](./CONTRIBUTING.md) to contribute

## Need Help?

- 📚 See [Full Documentation](./README.md)
- 🐛 Check [Troubleshooting](./SETUP_INSTRUCTIONS.md#troubleshooting)
- 💬 [Create an issue](../issues) on GitHub

---

**Pro Tip:** Use Bun for 3x faster operations

```bash
curl -fsSL https://bun.sh/install | bash
bun run setup
bun run dev
```

Happy coding! 🚀
