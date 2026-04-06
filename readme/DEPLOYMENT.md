# Deployment Guide

This guide covers deploying both the frontend and backend of the Sanjeevani application.

## Frontend Deployment

The frontend is a static React application that can be deployed to any static hosting service.

### Build for Production

```bash
cd frontend
npm run build
```

This creates a `dist/` directory with the optimized production build.

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Environment Variables**
   - Set in Vercel Dashboard > Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Custom Domain**
   - Configure in Vercel Dashboard > Domains

### Option 2: Netlify

1. **Connect Repository**
   - Go to Netlify and connect your GitHub repo
   - Select frontend directory

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Site settings > Build & deploy > Environment
   - Add Supabase credentials

4. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

### Option 3: GitHub Pages

1. **Update vite.config.ts**
   ```typescript
   export default {
     base: '/repository-name/',
     // ...
   }
   ```

2. **Create GitHub Action** (`.github/workflows/deploy.yml`)
   ```yaml
   name: Deploy

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: cd frontend && npm install && npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./frontend/dist
   ```

3. **Enable GitHub Pages**
   - Repository > Settings > Pages
   - Set source to gh-pages branch

### Option 4: AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify
   - Connect your GitHub repo

2. **Build Settings**
   - Build command: `cd frontend && npm install && npm run build`
   - Output directory: `frontend/dist`

3. **Deploy**
   - Amplify handles deployment automatically

### Option 5: Docker

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t sanjeevani-frontend:latest frontend/
docker run -p 80:80 sanjeevani-frontend:latest
```

## Backend Deployment

The backend uses Supabase, which is managed cloud infrastructure.

### Deploy Database Migrations

```bash
cd backend/supabase
supabase db push
```

### Deploy Edge Functions

```bash
supabase functions deploy
```

### Environment Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create a new project

2. **Get Credentials**
   - Project Settings > API
   - Copy PROJECT_URL and ANON_KEY

3. **Add to Frontend .env**
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Database Backups

Supabase provides:
- Daily automatic backups
- Manual point-in-time recovery
- Backup downloads in Project Settings

## Full Stack Deployment

### CI/CD Pipeline with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Sanjeevani

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm install && npm run lint && npm run test && npm run build

  deploy-frontend:
    needs: test-frontend
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm install && npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: cd backend/supabase && supabase db push && supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

### Manual Deployment Checklist

- [ ] All tests pass locally
- [ ] Code is linted
- [ ] Environment variables are set correctly
- [ ] Database migrations are created
- [ ] Edge functions are tested
- [ ] Frontend builds without errors
- [ ] .env files are NOT committed
- [ ] Production secrets are secured
- [ ] Database backups are configured
- [ ] Monitoring is enabled

## Production Best Practices

### Security

1. **Secrets Management**
   - Use environment variables for all sensitive data
   - Never commit .env files
   - Rotate secrets regularly

2. **CORS Configuration**
   - Set appropriate CORS headers
   - Whitelist frontend domain

3. **Database Security**
   - Enable Row Level Security (RLS)
   - Use strong passwords
   - Regular security audits

### Performance

1. **Frontend**
   - Enable caching headers
   - Use CDN for static assets
   - Monitor Web Vital metrics

2. **Backend**
   - Use database indexes
   - Implement caching strategies
   - Monitor query performance

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Track user analytics

### Scaling

1. **Database**
   - Monitor storage usage
   - Plan for growth
   - Archive old data

2. **Functions**
   - Monitor invocation count
   - Optimize cold starts
   - Set rate limits

## Domain & DNS

### Custom Domain Setup

1. **Update DNS Records**
   - Add CNAME record pointing to hosting provider

2. **SSL/TLS Certificate**
   - Most providers auto-generate certificates
   - Ensure HTTPS is enforced

3. **Email Configuration** (Optional)
   - Set up SPF, DKIM, DMARC records if using email

## Monitoring & Logging

### Frontend Monitoring

- Sentry for error tracking
- LogRocket for session recording
- Google Analytics for user behavior

### Backend Monitoring

- Supabase Dashboard for database metrics
- Application Performance Monitoring (APM)
- Custom logs in Edge Functions

## Rollback Procedures

### Frontend Rollback

1. **Vercel/Netlify**
   - Revert to previous deployment
   - Takes ~5 minutes

2. **GitHub Pages**
   - Revert commit and push
   - Rebuild automatically

### Backend Rollback

1. **Database**
   ```bash
   supabase db reset
   supabase db push --version [previous-version]
   ```

2. **Functions**
   - Redeploy previous version
   - Update environment variables if needed

## Troubleshooting Deployments

### Frontend Won't Build

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase Connection Error

- Verify credentials in .env
- Check project is active
- Review Supabase Dashboard logs

### Function Deployment Failed

```bash
cd backend/supabase
supabase functions list
supabase functions delete [function-name]
supabase functions deploy
```

## Support

For deployment issues:
1. Check provider documentation
2. Review application logs
3. Contact support team

---

**Last Updated**: February 2026
