# Vercel Deployment Troubleshooting Guide

## Common Build Errors and Solutions

### 1. **"MONGODB_URI not defined" Error**

**Error Message:**
```
Error: Please define the MONGODB_URI environment variable
```

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `MONGODB_URI` = `your_mongodb_connection_string`
3. Make sure to add it for **Production**, **Preview**, and **Development** environments
4. Click "Save" and redeploy

---

### 2. **"NEXTAUTH_SECRET not defined" Error**

**Error Message:**
```
Error: Please define the NEXTAUTH_SECRET environment variable
```

**Solution:**
1. Generate a secret key:
   ```bash
   openssl rand -base64 32
   ```
   Or use: https://generate-secret.vercel.app/32

2. Add to Vercel Environment Variables:
   - `NEXTAUTH_SECRET` = `your_generated_secret`

3. Redeploy

---

### 3. **Build Timeout Errors**

**Error Message:**
```
Build exceeded maximum time limit
```

**Solution:**
- The build might be slow due to TypeScript compilation
- Try optimizing by:
  1. Clear Vercel build cache
  2. Make sure you're not importing unnecessary dependencies
  3. Check if there are any large files in your repository

---

### 4. **Module Not Found Errors**

**Error Message:**
```
Module not found: Can't resolve 'xxx'
```

**Solution:**
1. Make sure all dependencies are in `package.json`
2. Delete `node_modules` and `package-lock.json` locally
3. Run `npm install` to regenerate lock file
4. Commit and push `package-lock.json`
5. Redeploy on Vercel

---

### 5. **TypeScript Errors**

**Error Message:**
```
Type error: ...
```

**Solution:**
1. Run `npm run build` locally to catch TypeScript errors
2. Fix all TypeScript errors before deploying
3. Make sure `tsconfig.json` is properly configured

---

### 6. **MongoDB Connection Errors (At Runtime)**

**Error Message:**
```
MongoNetworkError: failed to connect
```

**Solution:**
1. **For MongoDB Atlas:**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add Vercel IPs)
   - Save changes

2. **Check Connection String:**
   - Make sure your `MONGODB_URI` includes the database name
   - Format: `mongodb+srv://user:pass@cluster.mongodb.net/database_name`
   - Remove any special characters or spaces

---

### 7. **Next.js Version Warning**

**Warning:**
```
npm warn deprecated next@14.2.5
```

**Solution:**
- ✅ Already fixed! Updated to Next.js 14.2.18
- If you still see this, make sure you've pulled the latest code

---

### 8. **Environment Variables Not Loading**

**Symptom:**
- App works locally but not on Vercel
- Environment variables seem undefined

**Solution:**
1. Make sure env vars are added in Vercel Dashboard (not just `.env.local`)
2. Check that you selected the correct environment (Production/Preview/Development)
3. After adding variables, **redeploy** the project
4. Verify variable names match exactly (case-sensitive)

---

### 9. **Function Timeout Errors**

**Error Message:**
```
Function execution exceeded timeout
```

**Solution:**
- This happens when database queries take too long
- Optimize your database queries
- Add indexes to frequently queried fields
- Consider upgrading Vercel plan for longer timeouts

---

### 10. **Static Page Generation Errors**

**Error Message:**
```
Error occurred prerendering page
```

**Solution:**
- Make sure pages using `getServerSession` have `export const dynamic = 'force-dynamic'`
- ✅ Already implemented in your codebase

---

## Quick Checklist

Before deploying, make sure:

- [ ] All environment variables are set in Vercel:
  - [ ] `MONGODB_URI`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL` (auto-set by Vercel)

- [ ] MongoDB Atlas Network Access allows Vercel IPs (or all IPs)

- [ ] All TypeScript errors are fixed (run `npm run build` locally)

- [ ] `package.json` is committed and up to date

- [ ] No large files in repository (images should be in `public/` folder)

- [ ] `.env.local` is in `.gitignore` (should not be committed)

---

## Debugging Steps

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments → Click on failed deployment
   - Review the build logs line by line
   - Look for red error messages

2. **Check Function Logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Check runtime errors after deployment

3. **Test Locally:**
   ```bash
   npm run build
   npm start
   ```
   - If build fails locally, it will fail on Vercel too

4. **Verify Environment Variables:**
   - Double-check variable names (case-sensitive)
   - Make sure values don't have extra spaces
   - Verify MongoDB connection string format

---

## Getting Help

If you're still having issues:

1. Copy the full error message from Vercel logs
2. Check the specific error line number
3. Review this troubleshooting guide
4. Check Vercel's documentation: https://vercel.com/docs
5. Open an issue on GitHub with error details

---

## Useful Commands

```bash
# Test build locally
npm run build

# Start production server locally
npm start

# Check for TypeScript errors
npx tsc --noEmit

# Clear Next.js cache
rm -rf .next

# Verify environment variables (local)
echo $MONGODB_URI
```

---

## Common Vercel Build Log Patterns

**Successful Build:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

**Failed Build:**
```
✗ Error: [error message]
✗ Build failed
```

If you see the installation step completing, the next step should be the build. Watch for any error messages that come after "Running 'build' command..."
