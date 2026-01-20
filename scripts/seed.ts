import connectDB from '../lib/mongodb';
import Project from '../models/Project';
import Payment from '../models/Payment';
import TeamMember from '../models/TeamMember';
import Expense from '../models/Expense';

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Payment.deleteMany({});
    await TeamMember.deleteMany({});
    await Expense.deleteMany({});
    console.log('Cleared existing data');

    // Create team members
    const teamMember1 = await TeamMember.create({
      name: 'John Developer',
      role: 'Full Stack Developer',
      payoutType: 'percentage',
      payoutPercentage: 30,
    });

    const teamMember2 = await TeamMember.create({
      name: 'Sarah Designer',
      role: 'UI/UX Designer',
      payoutType: 'fixed',
      payoutAmount: 2000,
    });

    console.log('Created team members');

    // Create projects
    const project1 = await Project.create({
      name: 'E-commerce Platform',
      clientName: 'TechCorp Inc',
      startDate: new Date('2024-01-15'),
      expectedTotalAmount: 50000,
    });

    const project2 = await Project.create({
      name: 'Mobile App Redesign',
      clientName: 'StartupXYZ',
      startDate: new Date('2024-02-01'),
      expectedTotalAmount: 30000,
    });

    const project3 = await Project.create({
      name: 'Corporate Website',
      clientName: 'Business Solutions',
      startDate: new Date('2024-03-10'),
      expectedTotalAmount: 25000,
    });

    console.log('Created projects');

    // Create payments for current month
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    await Payment.create({
      projectId: project1._id,
      amount: 15000,
      month: currentMonth,
      year: currentYear,
      dateReceived: new Date(currentYear, currentMonth - 1, 5),
      notes: 'First milestone payment',
    });

    await Payment.create({
      projectId: project1._id,
      amount: 10000,
      month: currentMonth,
      year: currentYear,
      dateReceived: new Date(currentYear, currentMonth - 1, 15),
      notes: 'Second milestone',
    });

    await Payment.create({
      projectId: project2._id,
      amount: 12000,
      month: currentMonth,
      year: currentYear,
      dateReceived: new Date(currentYear, currentMonth - 1, 10),
    });

    await Payment.create({
      projectId: project3._id,
      amount: 8000,
      month: currentMonth,
      year: currentYear,
      dateReceived: new Date(currentYear, currentMonth - 1, 20),
    });

    // Create payments for previous months
    for (let i = 1; i <= 5; i++) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      await Payment.create({
        projectId: project1._id,
        amount: 10000 + Math.random() * 5000,
        month,
        year,
        dateReceived: new Date(year, month - 1, Math.floor(Math.random() * 28) + 1),
      });

      await Payment.create({
        projectId: project2._id,
        amount: 5000 + Math.random() * 3000,
        month,
        year,
        dateReceived: new Date(year, month - 1, Math.floor(Math.random() * 28) + 1),
      });
    }

    console.log('Created payments');

    // Create expenses for current month
    await Expense.create({
      projectId: project1._id,
      teamMemberId: teamMember1._id,
      type: 'team_payout',
      amount: 7500,
      month: currentMonth,
      year: currentYear,
      description: 'Monthly payout to John Developer (30% of $25k)',
      dateIncurred: new Date(currentYear, currentMonth - 1, 1),
    });

    await Expense.create({
      projectId: project2._id,
      teamMemberId: teamMember2._id,
      type: 'team_payout',
      amount: 2000,
      month: currentMonth,
      year: currentYear,
      description: 'Fixed monthly payout to Sarah Designer',
      dateIncurred: new Date(currentYear, currentMonth - 1, 1),
    });

    await Expense.create({
      projectId: project1._id,
      type: 'tools_subscription',
      amount: 299,
      month: currentMonth,
      year: currentYear,
      description: 'Figma Pro subscription',
      dateIncurred: new Date(currentYear, currentMonth - 1, 1),
    });

    await Expense.create({
      projectId: project2._id,
      type: 'miscellaneous',
      amount: 150,
      month: currentMonth,
      year: currentYear,
      description: 'Domain renewal',
      dateIncurred: new Date(currentYear, currentMonth - 1, 5),
    });

    // Create expenses for previous months
    for (let i = 1; i <= 5; i++) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      await Expense.create({
        projectId: project1._id,
        teamMemberId: teamMember1._id,
        type: 'team_payout',
        amount: 5000 + Math.random() * 3000,
        month,
        year,
        description: 'Team payout',
        dateIncurred: new Date(year, month - 1, 1),
      });

      await Expense.create({
        projectId: project1._id,
        type: 'tools_subscription',
        amount: 299,
        month,
        year,
        description: 'Monthly tools subscription',
        dateIncurred: new Date(year, month - 1, 1),
      });
    }

    console.log('Created expenses');

    console.log('\n✅ Seed data created successfully!');
    console.log(`\nCreated:`);
    console.log(`- ${await Project.countDocuments()} projects`);
    console.log(`- ${await Payment.countDocuments()} payments`);
    console.log(`- ${await TeamMember.countDocuments()} team members`);
    console.log(`- ${await Expense.countDocuments()} expenses`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
