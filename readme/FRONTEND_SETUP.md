# Frontend Setup Guide

## Overview

The frontend is a React + Vite application built with TypeScript and Tailwind CSS.

## Quick Start

### 1. Install Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
# or with Bun
bun install
```

### 2. Environment Setup

Create a `.env` file in the `frontend` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── AppSidebar.tsx
│   │   ├── Header.tsx
│   │   └── ...more components
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Auth.tsx
│   │   ├── AiAssistant.tsx
│   │   └── ...more pages
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React context providers
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript types
│   ├── data/             # Mock data & constants
│   ├── integrations/     # API integrations
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies & scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vitest.config.ts      # Testing configuration
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Preview production build
npm run preview

# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Lint code with ESLint
npm run lint
```

## Key Dependencies

### UI & Styling
- **react**: Core React library
- **tailwindcss**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **class-variance-authority**: Utility for creating variants

### State & Data Management
- **@tanstack/react-query**: Data fetching & caching
- **react-hook-form**: Efficient form management

### Backend Integration
- **@supabase/supabase-js**: Supabase client library

### Router
- **react-router-dom**: Client-side routing

### Utilities
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **clsx**: Class name utility
- **next-themes**: Theme management (light/dark mode)
- **zod**: TypeScript-first schema validation

## Configuration Files

### vite.config.ts
Vite build configuration for development and production.

### tailwind.config.ts
Tailwind CSS configuration for design tokens and customization.

### tsconfig.json
TypeScript compiler options and path aliases.

### vitest.config.ts
Testing framework configuration.

## Development Tips

### Creating Components

Use shadcn/ui components where possible:

```bash
npx shadcn-ui@latest add [component-name]
```

### Custom Hooks

Place custom hooks in `src/hooks/` with the naming convention `use[HookName].ts`

### Type Definitions

Use TypeScript interfaces and types in `src/types/` for consistency.

### Styling

- Use Tailwind CSS classes for styling
- Use CSS modules or inline styles when Tailwind isn't sufficient
- Maintain design consistency with the design system

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory. This can be deployed to any static hosting service.

## Debugging

### VS Code

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

### Browser DevTools

- React DevTools extension for component inspection
- Network tab for API debugging

## Troubleshooting

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port in use (5173)
```bash
npm run dev -- --port 3000
```

### Build errors
- Clear `.vite` cache: `rm -rf frontend/.vite`
- Rebuild: `npm run build`

## Performance Optimization

- Code splitting is automatic with Vite
- Image optimization: Use appropriate formats and sizes
- Lazy load components with React.lazy()
- Use React Query for efficient data fetching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
