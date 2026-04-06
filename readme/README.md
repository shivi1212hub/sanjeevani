# Sanjeevani - Health Emergency Response System

A comprehensive emergency response and health assistance platform designed to provide immediate support during medical emergencies.

## Project Overview

Sanjeevani is a full-stack application that combines modern frontend technologies with robust backend services to deliver real-time health emergencies response, medical assistance, and health monitoring capabilities.

### Key Features

- **Emergency SOS Alerts**: One-tap emergency notifications with location sharing
- **Health Monitoring**: Real-time health metrics monitoring
- **Medical History**: Comprehensive medical history management
- **First Aid Guidance**: AI-powered first aid recommendations
- **Warrior Registration**: Emergency responder registration and management
- **Dashboard**: Real-time analytics and notifications
- **Multi-language Support**: Support for multiple languages
- **Theme Support**: Light and dark mode

## Project Structure

```
├── frontend/          # React + Vite frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Supabase backend & serverless functions
│   └── supabase/
│       ├── functions/
│       └── migrations/
└── readme/            # Documentation
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Bun or npm
- Git

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
# or
bun install
```

#### 3. Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Start Development Server

```bash
cd frontend
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

### Backend Setup (Optional - Requires Supabase Account)

```bash
cd backend/supabase
supabase start
```

## Available Scripts

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build locally
npm run preview

# Run tests
npm run test

# Watch mode testing
npm run test:watch

# Lint code
npm run lint
```

## Technology Stack

### Frontend
- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn/ui**: Component library
- **React Router**: Client-side routing
- **TanStack React Query**: Data fetching
- **Framer Motion**: Animations
- **React Hook Form**: Form management
- **Supabase JS Client**: Backend integration

### Backend
- **Supabase**: PostgreSQL database & authentication
- **Edge Functions**: Serverless compute
- **Real-time Subscriptions**: WebSocket support

## Project Pages & Components

### Pages
- **Index**: Landing page
- **Dashboard**: User dashboard with stats and notifications
- **Auth**: Authentication page
- **Warrior Login/Registration**: Emergency responder onboarding
- **First Aid Guide**: First aid instruction content
- **Medical History**: Patient medical records
- **AI Assistant**: AI-powered health assistance
- **RPPG Monitor**: Remote photoplethysmography monitoring
- **Ministry**: Administrative interface

### Key Components
- Header & Footer
- Navigation & Sidebars
- Health Profile Section
- Emergency Response Dialog
- SOS Alert Cards
- Warrior Map & Registration
- Dashboard Panels (Notifications, Stats, Credit Points)
- Theme & Language Toggle

## Development Guidelines

### File Organization
- `/src/components` - Reusable React components
- `/src/pages` - Page-level components
- `/src/hooks` - Custom React hooks
- `/src/contexts` - React context providers
- `/src/lib` - Utility functions and helpers
- `/src/types` - TypeScript type definitions
- `/src/data` - Mock data and constants
- `/src/integrations` - Third-party service integrations

### Coding Standards
- Use TypeScript for type safety
- Follow React best practices
- Keep components small and focused
- Use hooks for state management
- Comment complex logic
- Write tests for critical functionality

## Building & Deployment

### Production Build

```bash
cd frontend
npm run build
```

The build output will be in the `dist/` directory.

### Deployment
The built application can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- GitHub Pages
- Any static hosting service

For Supabase backend, use the Supabase Dashboard or CLI:
```bash
cd backend/supabase
supabase deploy
```

## Testing

Run the test suite:

```bash
cd frontend
npm run test

# Watch mode
npm run test:watch
```

Tests are configured with Vitest and located in `/src/test`

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend
Configure in Supabase Dashboard or `.env.local` in `backend/supabase/`

## API Documentation

See `/backend/supabase/functions/` for backend function documentation.

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### Module Not Found
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Issues
- Verify environment variables are correct
- Check Supabase project is active
- Ensure network connectivity

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

[Add your license here]

## Support & Contact

For issues, feature requests, or questions:
1. Open an issue on GitHub
2. Contact the development team

## Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

**Last Updated**: February 2026
