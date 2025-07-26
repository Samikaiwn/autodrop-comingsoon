# AutoDrop Platform - Deployment Guide

## Overview
This guide helps you deploy your AutoDrop Platform from Replit to your custom domain https://autodropplatform.shop using GitHub and Vercel.

## Prerequisites
- GitHub account
- Vercel account (connected to GitHub)
- Access to your domain registrar for https://autodropplatform.shop

## Step 1: Push to GitHub

### Option A: Using Replit Git Integration
1. In Replit, open the Version Control tab (Git icon)
2. Connect to your GitHub account if not already connected
3. Create a new repository or push to existing one
4. Commit and push all your changes

### Option B: Manual GitHub Setup
1. Create a new repository on GitHub (e.g., `autodrop-platform`)
2. In Replit Terminal, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AutoDrop Platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/autodrop-platform.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it as a Node.js project
5. Configure the following settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

## Step 3: Environment Variables

In Vercel dashboard, add these environment variables:

### Database
- `DATABASE_URL`: Your PostgreSQL connection string

### Stripe (Required for payments)
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Same as above (for frontend)

### AliExpress (Optional - for product importing)
- `ALIEXPRESS_APP_KEY`: Your AliExpress API key
- `ALIEXPRESS_APP_SECRET`: Your AliExpress API secret

### AI Features (Optional)
- `OPENAI_API_KEY`: For AI-powered features

### Communication (Optional)
- `TWILIO_ACCOUNT_SID`: For SMS features
- `TWILIO_AUTH_TOKEN`: For SMS features
- `SENDGRID_API_KEY`: For email features

## Step 4: Custom Domain Setup

1. In Vercel dashboard, go to your project settings
2. Click "Domains" tab
3. Add your custom domain: `autodropplatform.shop`
4. Vercel will provide DNS configuration instructions
5. Update your domain's DNS settings with your registrar:
   - Add A record pointing to Vercel's IP
   - Or add CNAME record pointing to your Vercel deployment

## Step 5: SSL and Final Checks

1. Vercel automatically provides SSL certificates
2. Wait for DNS propagation (can take up to 24 hours)
3. Test your live site at https://autodropplatform.shop
4. Verify all features work:
   - Product browsing
   - Cart functionality  
   - Checkout process (if Stripe is configured)
   - Database connections

## Important Notes

### Database Migration
- Your Neon PostgreSQL database will work on Vercel
- Make sure `DATABASE_URL` environment variable is set correctly
- Run `npm run db:push` locally first to ensure schema is up to date

### Build Process
- The `vercel.json` file is configured for your project structure
- Frontend builds to `dist/public`
- Backend builds to `dist/index.js`
- Static files are served directly, API routes go through the Express server

### Security
- All hardcoded credentials have been removed from the code
- Environment variables are the only way to configure external services
- This is production-ready and secure

## Troubleshooting

### Build Failures
- Check Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation works locally

### Runtime Errors
- Check Vercel function logs
- Verify environment variables are set correctly
- Test database connectivity

### Domain Issues
- Verify DNS propagation: `nslookup autodropplatform.shop`
- Check domain configuration in registrar
- Allow up to 24 hours for full propagation

## Support
If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test the same configuration locally first
4. Contact Vercel support for platform-specific issues