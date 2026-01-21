# FreeloLedger

A comprehensive company/team finance management application built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

## Features

- 🏢 **Multi-Tenant Company Management** - Each company has isolated data
- 👥 **Role-Based Access Control** - Admin, Manager, and Member roles
- 💰 **Project Financial Tracking** - Track project budgets, payments, and expenses
- 📊 **Analytics Dashboard** - Visual charts and reports for financial insights
- 💵 **Multi-Currency Support** - Support for multiple currencies per project
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🌓 **Dark Mode** - Beautiful dark and light themes
- ⚡ **Fast Performance** - Optimized queries and parallel data fetching

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: NextAuth.js
- **Deployment**: Ready for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Muhammad-Fasih07/FreeloLedger.git
cd FreeloLedger
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Optional: Email Configuration (for team invites)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
FreeloLedger/
├── app/                  # Next.js app directory
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard page
│   ├── projects/        # Project management
│   ├── payments/        # Payment tracking
│   ├── expenses/        # Expense management
│   └── team/            # Team member management
├── components/          # React components
├── lib/                 # Utility functions and server actions
│   ├── actions/        # Server actions for CRUD operations
│   ├── models/         # Mongoose models
│   └── utils/          # Helper functions
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## Key Features

### Project Management
- Create and manage projects with budgets
- Track payments received per project
- Monitor expenses and calculate profit margins
- Support for multiple currencies

### Financial Tracking
- Monthly income and expense tracking
- Project profitability analysis
- Team payout distribution
- Comprehensive financial reports

### Team Management
- Add team members with fixed or percentage payouts
- Track team member expenses
- Assign roles and permissions

### Dashboard
- Real-time financial overview
- Interactive charts and graphs
- Quick access to key metrics
- Monthly trend analysis

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

**Muhammad Fasih**
- GitHub: [@Muhammad-Fasih07](https://github.com/Muhammad-Fasih07)

## Support

For support, email your-email@example.com or create an issue in the repository.
