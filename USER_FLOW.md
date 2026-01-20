# FreeloLedger - Complete User Flow Guide

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [User Registration & Authentication](#user-registration--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Project Management Flow](#project-management-flow)
5. [Payment Tracking Flow](#payment-tracking-flow)
6. [Expense Management Flow](#expense-management-flow)
7. [Team Management Flow](#team-management-flow)
8. [Role-Based Access](#role-based-access)

---

## 🚀 Getting Started

### Step 1: Access the Application
- Open your browser and go to `http://localhost:3000`
- You'll be automatically redirected to `/login` if not authenticated

---

## 👤 User Registration & Authentication

### Step 2: Sign Up (First Time Users)

1. **Navigate to Sign Up Page**
   - Click "Sign up" link on the login page
   - Or go directly to `/signup`

2. **Fill Registration Form**
   - **Full Name**: Enter your name
   - **Email**: Enter your email address (must be unique)
   - **Role Selection**:
     - **Senior Member (View Only)**: Can view all data but cannot create/edit/delete
     - **Team Lead / Finance Head (Full Access)**: Can manage everything
   - **Password**: Minimum 6 characters
   - **Confirm Password**: Must match password

3. **Submit Registration**
   - Click "Sign Up" button
   - Account is created and you're redirected to login page
   - You'll see a success message

### Step 3: Sign In

1. **Enter Credentials**
   - Email: The email you used during signup
   - Password: Your password

2. **Click "Sign In"**
   - System validates your credentials
   - On success, you're redirected to `/dashboard`
   - Your session is stored (JWT token)

3. **Authentication State**
   - You remain logged in until you sign out
   - All protected routes require authentication
   - Session persists across page refreshes

---

## 📊 Dashboard Overview

### Step 4: Dashboard Landing

After signing in, you land on the **Dashboard** (`/dashboard`):

#### What You See:

1. **Month Selector** (Top)
   - Shows current month by default (e.g., "February 2026")
   - Use arrows to navigate between months
   - Click "Today" to jump to current month
   - All data below is filtered by selected month

2. **Quick Add Project** (Team Leads Only)
   - Blue "Quick Add Project" button
   - Click to expand form
   - Fill in: Project Name, Client Name, Start Date, Total Budget
   - Click "Add Project" to create
   - Form collapses after successful creation

3. **Summary Cards** (4 Cards)
   - **Total Income**: Sum of all payments received this month
   - **Total Expenses**: Sum of all expenses this month
   - **Net Profit**: Income - Expenses (green if positive, red if negative)
   - **Active Projects**: Count of all your projects

4. **Projects Overview Section**
   - Grid of project cards (if you have projects)
   - Each card shows:
     - Project name and client
     - **Total Budget**: Expected project amount
     - **Total Received**: All payments received (across all months)
     - **Total Expenses**: All expenses for this project
     - **Net Profit**: Received - Expenses
     - **Remaining Budget**: Budget - Received
     - **Progress Bar**: Visual indicator of payment progress
   - Click any card to view project details

5. **Charts Section**
   - **Income vs Expenses (6 Months)**: Bar chart showing trend
   - **Project Profitability**: Pie chart showing profit distribution

---

## 📁 Project Management Flow

### Creating a Project

**Method 1: From Dashboard (Quick Add)**
1. Click "Quick Add Project" button
2. Fill in the form
3. Click "Add Project"

**Method 2: From Projects Page**
1. Navigate to `/projects` (click "Projects" in navigation)
2. Click "New Project" button (Team Leads only)
3. Fill in project details:
   - Project Name
   - Client Name
   - Start Date
   - Expected Total Amount (Total Budget)
4. Click "Create Project"

### Viewing Projects

1. **Projects List Page** (`/projects`)
   - Shows all your projects in a grid
   - Each card displays:
     - Project name and client
     - Expected amount
     - Received amount
     - Remaining amount
     - Progress bar
   - Click any project card to view details

2. **Project Detail Page** (`/projects/[id]`)
   - **Edit Form** (Team Leads only): Update project details
   - **Financial Summary Cards**:
     - Total Received
     - Total Expenses
     - Net Profit
   - **Recent Payments**: Last 5 payments for this project
   - **Recent Expenses**: Last 5 expenses for this project

### Editing/Deleting Projects

- **Team Leads**: Can edit and delete projects
- **Senior Members**: Can only view (no edit/delete buttons)

---

## 💰 Payment Tracking Flow

### Adding a Payment

1. **Navigate to Payments Page** (`/payments`)
   - Click "Add Payment" in navigation (mobile bottom nav or desktop sidebar)

2. **Fill Payment Form** (Left Side - Sticky on Desktop)
   - **Project**: Select from dropdown (only your projects)
   - **Amount**: Enter payment amount
   - **Date Received**: Select the date you received payment
   - **Notes** (Optional): Add any notes about the payment
   - **Month/Year**: Automatically set to current month (can be changed via month selector)

3. **Submit Payment**
   - Click "Add Payment" button
   - Payment is recorded and linked to the project
   - Form resets for next entry
   - Payment appears in the list immediately

### Viewing Payments

- **Payments List** (Right Side)
  - Shows all payments for the selected month
  - **Mobile**: Card view with project name, amount, date
  - **Desktop**: Table view with all details
  - Each payment shows:
    - Project name and client
    - Amount (green)
    - Date received
    - Notes
    - Delete button (Team Leads only)

### Payment Features

- **Monthly Filtering**: Automatically shows payments for selected month
- **Project Filtering**: Can filter by specific project
- **Automatic Calculations**: 
  - Monthly income totals
  - Project total received
  - Dashboard income updates

---

## 💸 Expense Management Flow

### Adding an Expense

1. **Navigate to Expenses Page** (`/expenses`)
   - Click "Expenses" in navigation

2. **Fill Expense Form** (Left Side)
   - **Project**: Select project this expense belongs to
   - **Expense Type**:
     - **Miscellaneous**: General expenses
     - **Tools/Subscription**: Software, tools, subscriptions
     - **Team Payout**: Payments to team members
   - **Team Member** (if Team Payout): Select team member
   - **Description**: What the expense is for
   - **Amount**: Expense amount
   - **Date Incurred**: When the expense occurred
   - **Month/Year**: Automatically set to current month

3. **Submit Expense**
   - Click "Add Expense"
   - Expense is recorded and linked to project
   - If team payout, also linked to team member

### Viewing Expenses

- **Expenses List** (Right Side)
  - Shows all expenses for selected month
  - **Mobile**: Card view
  - **Desktop**: Table view
  - Each expense shows:
    - Project name
    - Expense type
    - Team member (if applicable)
    - Description
    - Amount (red)
    - Date incurred
    - Delete button (Team Leads only)

### Expense Features

- **Categorization**: Team payouts, tools, miscellaneous
- **Team Member Linking**: Track which team member was paid
- **Automatic Calculations**:
  - Monthly expense totals
  - Project expense totals
  - Net profit calculations

---

## 👥 Team Management Flow

### Adding Team Members

1. **Navigate to Team Page** (`/team`)
   - Click "Team" in navigation

2. **Fill Team Member Form** (Left Side - Team Leads only)
   - **Name**: Team member's name
   - **Role**: Their role (e.g., "Developer", "Designer")
   - **Payout Type**:
     - **Fixed Amount**: Pay a fixed amount per month/project
     - **Percentage**: Pay a percentage of project income
   - **Payout Amount** (if Fixed): Enter fixed amount
   - **Payout Percentage** (if Percentage): Enter percentage (0-100)

3. **Submit**
   - Click "Add Team Member"
   - Team member is added to your team
   - Can now be selected when adding team payout expenses

### Viewing Team Members

- **Team Members List** (Right Side)
  - Shows all your team members
  - Each card displays:
    - Name and role
    - Payout type badge
    - Payout amount or percentage
  - **Edit/Delete** buttons (Team Leads only)

### Editing Team Members

1. Click edit icon (pencil) on team member card
2. Update details in the form
3. Click "Update Team Member"

---

## 🔐 Role-Based Access

### Team Lead / Finance Head (Full Access)

**Can Do:**
- ✅ Create, edit, and delete projects
- ✅ Add, edit, and delete payments
- ✅ Add, edit, and delete expenses
- ✅ Add, edit, and delete team members
- ✅ View all data and reports
- ✅ Access Quick Add Project on dashboard

**UI Indicators:**
- "New Project" buttons visible
- "Add Payment", "Add Expense" forms visible
- Edit/Delete buttons on all items
- Quick Add Project button on dashboard

### Senior Member (View Only)

**Can Do:**
- ✅ View dashboard
- ✅ View all projects
- ✅ View all payments
- ✅ View all expenses
- ✅ View team members
- ✅ See all financial summaries and charts

**Cannot Do:**
- ❌ Create, edit, or delete anything
- ❌ See "Add" forms
- ❌ See edit/delete buttons
- ❌ Access Quick Add Project

**UI Indicators:**
- No "New Project" buttons
- Forms show "Only team leads can..." message
- No edit/delete buttons visible
- Read-only interface

---

## 🔄 Complete Workflow Example

### Scenario: Starting a New Project

1. **Sign Up/Login**
   - Create account as Team Lead
   - Sign in

2. **Add Project**
   - Go to Dashboard
   - Click "Quick Add Project"
   - Enter: "Website Redesign", "Acme Corp", Start Date, $50,000 budget
   - Click "Add Project"

3. **Add Team Members**
   - Go to Team page
   - Add "John Developer" with 30% payout
   - Add "Sarah Designer" with $2,000 fixed payout

4. **Record Payments**
   - Go to Payments page
   - Select "Website Redesign" project
   - Add payment: $15,000, Date: Jan 5, 2026
   - Add another: $10,000, Date: Jan 15, 2026

5. **Record Expenses**
   - Go to Expenses page
   - Add team payout: $4,500 to John (30% of $15k)
   - Add team payout: $2,000 to Sarah (fixed)
   - Add tool subscription: $299 for Figma Pro

6. **View Dashboard**
   - See total income: $25,000
   - See total expenses: $6,799
   - See net profit: $18,201
   - See project card showing:
     - Budget: $50,000
     - Received: $25,000
     - Expenses: $6,799
     - Net Profit: $18,201
     - Remaining: $25,000
     - Progress: 50%

7. **Continue Tracking**
   - Add more payments as they come in
   - Add expenses as they occur
   - Dashboard updates automatically
   - Charts show trends over time

---

## 📱 Navigation

### Mobile (Bottom Navigation)
- **Dashboard**: Overview and quick add
- **Projects**: View all projects
- **Add Payment**: Quick payment entry
- **Expenses**: View and add expenses
- **Team**: Manage team members

### Desktop (Sidebar)
- Same navigation items
- Shows user name and role
- Sign out button at bottom
- More space for detailed views

---

## 🔒 Data Isolation

**Important**: Each user only sees their own data
- Projects you create are only visible to you
- Payments you record are only linked to your projects
- Expenses you add are only in your account
- Team members you add are only in your team
- All data is filtered by `userId` automatically

---

## 🎯 Key Features Summary

1. **Multi-User Support**: Each user has isolated data
2. **Role-Based Access**: Team Leads manage, Senior Members view
3. **Monthly Tracking**: All data organized by month/year
4. **Real-Time Calculations**: Automatic profit/loss calculations
5. **Quick Entry**: Fast forms for common tasks
6. **Visual Analytics**: Charts and progress indicators
7. **Mobile-First**: Optimized for mobile devices
8. **Responsive Design**: Works on all screen sizes

---

## 🚨 Common Issues & Solutions

### Can't Sign In
- Check email and password are correct
- Make sure account was created successfully
- Check browser console for errors

### Can't See Add Buttons
- Check your role (must be Team Lead)
- Sign out and sign in again
- Verify role in database

### Data Not Showing
- Check month selector (might be viewing different month)
- Verify you're logged in
- Check if data exists for selected month

### Dashboard Shows $0
- Make sure you've added payments/expenses
- Check month selector matches when you added data
- Verify data was saved successfully

---

This is the complete flow of FreeloLedger! 🎉
