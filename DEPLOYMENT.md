# Vercel Deployment Guide

This guide will help you deploy FreeloLedger to Vercel.

## Prerequisites

- A GitHub account with the FreeloLedger repository
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A MongoDB database (local or MongoDB Atlas)

## Step-by-Step Deployment

### 1. Prepare Your MongoDB Database

#### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (Free tier M0 is fine)
4. Click "Connect" → "Connect your application"
5. Copy your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Add your database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/freeloledger`

#### Option B: Use Existing MongoDB

- Use your existing MongoDB connection string
- Make sure it's accessible from the internet (not localhost)

### 2. Deploy to Vercel

1. **Import Your Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `Muhammad-Fasih07/FreeloLedger`
   - Click "Import"

2. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Add Environment Variables**
   Click "Environment Variables" and add the following:

   **Required Variables:**

   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

   ```
   NEXTAUTH_SECRET=your_random_secret_key_here
   ```
   
   **Generate NEXTAUTH_SECRET:**
   - You can use: `openssl rand -base64 32`
   - Or generate online: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

   **Optional (Auto-configured by Vercel):**

   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Once deployed, Vercel will provide you with a URL like: `https://freeloledger.vercel.app`

### 3. Post-Deployment Configuration

1. **Update NEXTAUTH_URL** (if needed)
   - Go to your project settings on Vercel
   - Update `NEXTAUTH_URL` to your actual deployment URL
   - Redeploy if needed

2. **Test Your Deployment**
   - Visit your Vercel URL
   - Try signing up with a new account
   - Verify all features work correctly

### 4. MongoDB Atlas Network Access (If Using Atlas)

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in the left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (or add Vercel's IP ranges)
5. Save the changes

### 5. Custom Domain (Optional)

1. Go to your project on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/freeloledger` |
| `NEXTAUTH_SECRET` | ✅ Yes | Secret key for NextAuth.js | Random 32+ character string |
| `NEXTAUTH_URL` | ⚠️ Auto | Your app URL (auto-set by Vercel) | `https://your-app.vercel.app` |

## Troubleshooting

### Build Fails

- **Error: "MONGODB_URI not defined"**
  - Make sure you've added `MONGODB_URI` in Vercel environment variables
  - Redeploy after adding variables

- **Error: "NEXTAUTH_SECRET not defined"**
  - Add `NEXTAUTH_SECRET` in Vercel environment variables
  - Use a secure random string

### Runtime Errors

- **Database Connection Issues**
  - Verify your MongoDB connection string is correct
  - Check MongoDB Atlas Network Access settings
  - Ensure your database is accessible from the internet

- **Authentication Not Working**
  - Verify `NEXTAUTH_SECRET` is set correctly
  - Check `NEXTAUTH_URL` matches your deployment URL
  - Clear browser cookies and try again

### Performance Issues

- Check Vercel Function Logs for errors
- Monitor MongoDB Atlas metrics
- Consider upgrading MongoDB Atlas tier if needed

## Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Review this guide again
4. Open an issue on GitHub

## Next Steps

After successful deployment:
- Share your app URL with team members
- Set up continuous deployment (already enabled by default)
- Configure custom domain if needed
- Set up monitoring and analytics
