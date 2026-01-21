# Team Member Invite Guide

## How Invite System Works

### For Admins (Inviting Team Members)

1. **Go to Settings Page**
   - Click on the "Settings" icon in the navigation (gear icon)
   - Scroll to the "Team Members" section

2. **Invite a New Member**
   - Enter the team member's email address
   - Select their role:
     - **Admin**: Full access to everything, can invite users
     - **Manager**: Can create/edit projects, payments, expenses (cannot invite users)
     - **Member**: View-only access (cannot create/edit anything)
   - Click "Invite" button

3. **What Happens Next**
   - System creates an account for the user
   - Generates a temporary password
   - Sends an email with login credentials (if email configured)
   - User appears in the team members list

### For Invited Team Members (How to Login)

1. **Check Your Email**
   - Look for an email from FreeloLedger
   - The email contains:
     - Your email address (login username)
     - Your temporary password
     - Login link

2. **Login Steps**
   - Go to the login page: `http://your-domain.com/login`
   - Enter your email address
   - Enter the temporary password from the email
   - Click "Sign In"

3. **After First Login**
   - You'll see the dashboard with all company projects and finances
   - ⚠️ **Important**: Change your password immediately after first login for security
   - Your access level depends on the role assigned by the admin

### Email Configuration

To enable automatic email sending, you need to configure SMTP in `.env.local`:

#### Option 1: Gmail (Easiest)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use App Password, not regular password
```

**Getting Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Use that password in `SMTP_PASSWORD`

#### Option 2: Other SMTP Providers
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-smtp-password
```

**Popular SMTP Providers:**
- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Free tier (5,000 emails/month)
- **Resend**: Free tier (3,000 emails/month)
- **Outlook/Hotmail**: `smtp-mail.outlook.com`, port 587
- **Yahoo**: `smtp.mail.yahoo.com`, port 587

### Without Email Configuration

If SMTP is not configured:
- Invite will still work
- User account will be created
- System will show the temporary password in a popup
- Admin needs to manually share credentials with the user

### Troubleshooting

**Email not sending?**
- Check `.env.local` has correct SMTP settings
- Verify SMTP credentials are correct
- Check server logs for email errors
- Test SMTP connection using a mail testing tool

**User can't login?**
- Verify email address is correct
- Check if user received the email with password
- Admin can check user in Settings page
- User can request password reset (if implemented)

## Security Notes

1. **Temporary Passwords**: Automatically generated and sent securely
2. **Password Change**: Users should change password after first login
3. **Email Verification**: Currently not implemented (can be added)
4. **Invite Links**: Currently uses temporary password (can be upgraded to secure tokens)
