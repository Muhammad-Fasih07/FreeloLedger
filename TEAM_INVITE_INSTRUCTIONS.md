# 📧 Team Member Invite & Login Instructions

## 🎯 Quick Summary

**For Admins:** Invite team members from Settings → Team Members section
**For Team Members:** Login with email + temporary password received via email

---

## 👨‍💼 For Admins: How to Invite Team Members

### Step-by-Step:

1. **Go to Settings**
   - Click the gear icon (⚙️) in navigation
   - Scroll to "Team Members" section

2. **Fill the Invite Form**
   - **Email**: Enter team member's email (e.g., `john@example.com`)
   - **Role**: Choose their access level:
     - **Admin**: Full access, can invite others
     - **Manager**: Can create/edit projects, payments, expenses
     - **Member**: View-only access
   - Click **"Invite"** button

3. **What Happens**
   - ✅ User account is created
   - ✅ Temporary password is generated
   - ✅ Email is sent (if SMTP configured) OR password shown in popup
   - ✅ User appears in team members list

---

## 👤 For Invited Team Members: How to Login

### Option 1: If You Received Email ✅

1. **Check Your Email**
   - Look for email from "FreeloLedger"
   - Subject: "You've been invited to join [Company Name]"

2. **Get Your Credentials**
   - Your **Email**: (the email you were invited with)
   - Your **Temporary Password**: (shown in the email)

3. **Login**
   - Go to: `http://your-domain.com/login` or click the link in email
   - Enter your **email address**
   - Enter your **temporary password**
   - Click **"Sign In"**

4. **After Login**
   - You'll see the dashboard
   - ⚠️ **IMPORTANT**: Change your password after first login!

### Option 2: If You Didn't Receive Email 📧

**Ask your Admin to:**
- Check if email was sent
- Get your temporary password manually
- Share it with you securely

Then login using:
- **Email**: Your email address
- **Password**: Temporary password from admin

---

## 📧 Email Configuration Setup

To enable automatic email sending, add these to `.env.local`:

### Gmail Setup (Recommended for Testing)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Getting Gmail App Password:**
1. Go to [Google Account](https://myaccount.google.com)
2. Click **Security** → **2-Step Verification** (enable it if not)
3. Click **App Passwords**
4. Select "Mail" and generate password
5. Copy the 16-character password → Use in `SMTP_PASSWORD`

### Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
```

**Custom SMTP:**
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-smtp-password
```

### Without Email Setup

If SMTP is not configured:
- ✅ Invite still works
- ✅ User account is created
- ⚠️ Password shown in popup (admin must share manually)
- 📝 System will alert admin to share credentials

---

## 🔐 Security Notes

1. **Temporary Passwords** are randomly generated (12+ characters)
2. **Users should change password** after first login
3. **Email contains credentials** - keep secure
4. **Admin can see** all team members in Settings

---

## ❓ Troubleshooting

### Email Not Sending?
- ✅ Check `.env.local` has SMTP settings
- ✅ Verify credentials are correct
- ✅ Check spam folder
- ✅ Test with email testing tool
- ✅ Check server logs for errors

### Can't Login?
- ✅ Verify email address is correct
- ✅ Check if you received invitation email
- ✅ Ask admin for temporary password
- ✅ Try password reset (if implemented)

### User Already Exists?
- ✅ System will add them to your company
- ✅ If they have another company → Error shown
- ✅ Admin can manage roles after invite

---

## 📋 Example Email Template

The email sent to invited members looks like:

```
🎉 Welcome to FreeloLedger!

You've been invited to join [Company Name] as a Manager.

Your Login Credentials:
Email: john@example.com
Temporary Password: abc123xyz789

⚠️ Important: Please change your password after your first login for security.

[Login Button] → Takes them to login page

Best regards,
The FreeloLedger Team
```

---

## 🚀 Quick Start Checklist

- [ ] Admin configures SMTP in `.env.local`
- [ ] Admin invites team member from Settings
- [ ] Team member receives email
- [ ] Team member logs in with credentials
- [ ] Team member changes password
- [ ] Team member can access dashboard!

---

**Need Help?** Check the `INVITE_GUIDE.md` file for detailed documentation.
