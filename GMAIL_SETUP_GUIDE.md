# Gmail SMTP Setup Guide - Fix Authentication Error

## Current Error
```
535-5.7.8 Username and Password not accepted
```

## Step-by-Step Fix

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Under "Signing in to Google", find **"2-Step Verification"**
3. Click it and follow the steps to enable it
4. **This is REQUIRED** - App passwords only work if 2-Step Verification is enabled

### Step 2: Generate New App Password
1. Go to: https://myaccount.google.com/apppasswords
   - **Direct link**: https://myaccount.google.com/apppasswords
2. If you don't see "App passwords", make sure 2-Step Verification is enabled (Step 1)
3. Under "Select app", choose: **"Mail"**
4. Under "Select device", choose: **"Other (Custom name)"**
5. Type: **"FreeloLedger"**
6. Click **"Generate"**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
8. **Remove all spaces** when adding to `.env.local`

### Step 3: Update .env.local
Open `.env.local` and update:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=fasihshaukat642@gmail.com
SMTP_PASSWORD=your-16-char-app-password-no-spaces
```

**Important**: 
- Password must be **16 characters** with **NO SPACES**
- Example: If Gmail shows `abcd efgh ijkl mnop`, use `abcdefghijklmnop`

### Step 4: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: Test
1. Go to Settings → Team Members
2. Invite a team member
3. Check if email is sent successfully

## Alternative: Use OAuth2 (More Secure)
If app passwords don't work, you can use OAuth2, but it requires more setup.

## Troubleshooting

### If "App passwords" option is missing:
- Make sure 2-Step Verification is **enabled**
- Wait a few minutes after enabling 2-Step Verification
- Refresh the page

### If authentication still fails:
1. Double-check the app password has no spaces
2. Make sure you copied the entire 16-character password
3. Try generating a new app password
4. Verify your email address is correct in `.env.local`

### Check current configuration:
Run this in terminal to see your current SMTP settings:
```bash
Get-Content .env.local | Select-String "SMTP"
```
