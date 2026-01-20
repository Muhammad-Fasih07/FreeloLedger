# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up MongoDB

### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Set `MONGODB_URI=mongodb://localhost:27017/freelo-ledger` in `.env.local`

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Set `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelo-ledger` in `.env.local`

## 3. Create Environment File

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB connection string.

## 4. Seed Database (Optional)

```bash
npm run seed
```

This will create sample projects, payments, team members, and expenses for testing.

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

- **Dashboard**: View monthly income, expenses, and profit with charts
- **Projects**: Create and manage freelance projects
- **Payments**: Record payments per project with monthly tracking
- **Expenses**: Track team payouts, tools, and miscellaneous expenses
- **Team**: Manage team members with fixed or percentage payouts

## Mobile vs Desktop

- **Mobile**: Bottom navigation bar for easy thumb access
- **Desktop**: Sidebar navigation with more space for tables and charts

Enjoy tracking your freelance finances! 🚀
