# GitHub Repository Setup Guide

## Initial Setup

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Enter repository name: `sanjeevani`
3. Add description: "Health Emergency Response System"
4. Choose visibility: Public or Private
5. Initialize without README (we have one)
6. Click "Create repository"

### 2. Initialize Git in Your Project

```bash
cd /path/to/sanjeevani
git init
git add .
git commit -m "Initial commit: Project structure with frontend and backend"
```

### 3. Add Remote and Push

```bash
git remote add origin https://github.com/yourusername/sanjeevani.git
git branch -M main
git push -u origin main
```

## Directory Structure for GitHub

Your repository should have this structure:

```
sanjeevani/
├── frontend/              # React + Vite application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ... (other config files)
├── backend/               # Supabase backend
│   └── supabase/
│       ├── functions/
│       ├── migrations/
│       └── config.toml
├── readme/                # Documentation
│   ├── README.md          # Main project documentation
│   ├── FRONTEND_SETUP.md  # Frontend setup guide
│   ├── BACKEND_SETUP.md   # Backend setup guide
│   ├── DEPLOYMENT.md      # Deployment instructions
│   └── CONTRIBUTING.md    # Contribution guidelines
├── .gitignore             # Git ignore file
├── package.json           # Root package.json with scripts
└── README.md              # (Optional) Link to readme/README.md
```

## .gitignore Configuration

The `.gitignore` file at the root automatically excludes:

```
# Node dependencies
node_modules/
package-lock.json
bun.lockb

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/

# IDE & OS
.vscode/
.idea/
.DS_Store
Thumbs.db

# And more...
```

**Important**: Never commit sensitive files like `.env` or `node_modules/`

## GitHub Actions (CI/CD)

### Create Workflow File

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: cd frontend && npm install
    
    - name: Lint
      run: cd frontend && npm run lint
    
    - name: Run tests
      run: cd frontend && npm run test
    
    - name: Build
      run: cd frontend && npm run build
```

## Branch Management

### Branch Naming Convention

```
main              # Production ready
develop           # Development branch
feature/*         # New features (feature/add-xyz)
fix/*             # Bug fixes (fix/bug-xyz)
docs/*            # Documentation (docs/update-xyz)
refactor/*        # Refactoring (refactor/xyz)
```

### Protected Branches

Setup in Repository > Settings > Branches:

1. Enable "Require pull request reviews before merging"
2. Enable "Require status checks to pass before merging"
3. Enable "Require branches to be up to date before merging"

## Collaboration

### Adding Contributors

1. Go to Repository > Settings > Collaborators
2. Click "Add people"
3. Search for username
4. Assign appropriate role

### Permission Levels

- **Pull** - Read-only access
- **Triage** - Pull + manage issues
- **Push** - Pull + push changes
- **Maintain** - Push + manage repo settings
- **Admin** - Full control

## README in Repository Root

Optionally, create a `README.md` at the root that links to detailed docs:

```markdown
# Sanjeevani - Health Emergency Response System

Quick start documentation and project overview.

- **📖 [Full Documentation](./readme/README.md)**
- **🚀 [Frontend Setup](./readme/FRONTEND_SETUP.md)**
- **⚙️ [Backend Setup](./readme/BACKEND_SETUP.md)**
- **🚢 [Deployment Guide](./readme/DEPLOYMENT.md)**
- **🤝 [Contributing Guide](./readme/CONTRIBUTING.md)**

## Quick Start

```bash
# Install and start frontend
npm run setup
npm run dev

# Start backend (separate terminal)
npm run backend:start
```

See [Full Documentation](./readme/README.md) for detailed instructions.
```

## Issue & PR Templates

### Issue Template (.github/ISSUE_TEMPLATE/bug_report.md)

```markdown
---
name: Bug Report
about: Create a bug report
title: '[BUG] '
labels: bug
---

## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: 
- Browser: 
- Node version: 

## Logs/Screenshots
Add relevant logs or screenshots
```

### PR Template (.github/pull_request_template.md)

```markdown
## Description
Describe your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Unit tests added
- [ ] Manual testing completed
- [ ] No regressions

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests pass
```

## Releases

### Create Release

1. Go to Repository > Releases
2. Click "Create a new release"
3. Tag: `v1.0.0` (semver)
4. Title: `version 1.0.0`
5. Add release notes
6. Publish release

### Version in package.json

Keep version in sync:

```json
{
  "version": "1.0.0"
}
```

## Secrets Management

### Add GitHub Secrets

1. Repository > Settings > Secrets and variables > Actions
2. Click "New repository secret"

**Common Secrets:**

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_ID
```

**Never commit:**
- API keys
- Passwords
- Private tokens
- Database credentials

## Repository Settings

### General Settings

- **Default branch**: main
- **Auto-delete head branches**: Enabled
- **Allow auto-merge**: Enabled
- **Squash merging**: Enabled

### Security

- **Branch protection rules**: Enable for main
- **Code scanning**: Enable if available
- **Dependabot**: Enable for dependency updates

## Documentation Best Practices

1. **README.md** - Project overview and quick start
2. **CONTRIBUTING.md** - How to contribute
3. **FRONTEND_SETUP.md** - Frontend development guide
4. **BACKEND_SETUP.md** - Backend development guide
5. **DEPLOYMENT.md** - Deployment instructions
6. **Inline comments** - Complex code explanations

## Continuous Integration

### Status Badges

Add to README.md:

```markdown
![CI Status](https://github.com/yourusername/sanjeevani/actions/workflows/ci.yml/badge.svg)
```

### Monitoring Deployments

1. Enable GitHub Pages for documentation
2. Setup branch protection
3. Require passing CI checks
4. Review pull requests

## Common Commands

```bash
# Clone repository
git clone https://github.com/yourusername/sanjeevani.git
cd sanjeevani

# Setup development
npm run setup
npm run dev

# Create feature branch
git checkout -b feature/your-feature

# Commit and push
git add .
git commit -m "feat: your feature"
git push origin feature/your-feature

# Create pull request via GitHub

# After merge, clean up
git checkout main
git pull origin main
git branch -d feature/your-feature
```

## Troubleshooting

### Git Issues

**Can't push to repository:**
```bash
git pull origin main
git push origin main
```

**Branch out of sync:**
```bash
git fetch origin
git rebase origin/main
git push origin feature-name --force
```

## Additional Resources

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org)

---

**Last Updated**: February 2026
