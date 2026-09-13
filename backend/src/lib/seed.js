require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const seedRoles = require('./seedRoles');

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// GROWL GROUP — PRODUCTION SEED DATA
// ─────────────────────────────────────────────────────────────────────────────

const GROWL_USERS = [
  // ── Super Admins ──────────────────────────────────────────────────────────
  {
    name: 'Wessam',
    email: 'wessam@growl.cloud',
    password: 'Growl@Wess2026!',
    role: 'SUPER_ADMIN',
    department: 'Executive',
  },
  {
    name: 'Mohamed Rabie',
    email: 'mo.rabie@growl.cloud',
    password: 'B&767076009539an',
    role: 'SUPER_ADMIN',
    department: 'Executive',
  },
  {
    name: 'Mohamed Bish',
    email: 'mo.bish@growl.cloud',
    password: 'Growl@Bish2026!',
    role: 'SUPER_ADMIN',
    department: 'Executive',
  },
  // ── Team Members ──────────────────────────────────────────────────────────
  {
    name: 'Nour Wael',
    email: 'nour.wael@growl.cloud',
    password: 'B&767076009539an',
    role: 'SALES_EXECUTIVE',
    department: 'Sales',
  },
  {
    name: 'Hagar Ehab',
    email: 'Hagar.ehab@growl.cloud',
    password: 'C*526326796623oj',
    role: 'SALES_EXECUTIVE',
    department: 'Sales',
  },
];

async function main() {
  console.log('\n🌱 Growl Group — Seeding complete system database...\n');

  // 1. Seed Roles
  await seedRoles(prisma);
  console.log('✅ Roles catalog seeded');

  // 2. Seed Users
  const userMap = {};
  for (const u of GROWL_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        department: u.department,
        status: 'ACTIVE',
        password: passwordHash,
      },
      create: {
        name: u.name,
        email: u.email,
        password: passwordHash,
        role: u.role,
        department: u.department,
        status: 'ACTIVE',
      },
    });
    userMap[u.email] = user;
    console.log(`   ✓ User [${u.role}]: ${u.name} <${u.email}>`);
  }

  const superAdmin = userMap['wessam@growl.cloud'] || Object.values(userMap)[0];
  const rabie = userMap['mo.rabie@growl.cloud'] || superAdmin;
  const nour = userMap['nour.wael@growl.cloud'] || superAdmin;
  const hagar = userMap['Hagar.ehab@growl.cloud'] || superAdmin;

  // 3. Seed Clients
  console.log('\n💼 Seeding Clients...');
  const clientsData = [
    {
      name: 'Acrotech Global Logistics',
      company: 'Acrotech International Ltd',
      phone: '+20-100-1122334',
      whatsapp_phone: '+20-100-1122334',
      email: 'procurement@acrotech.com',
      address: 'Smart Village, Building B12, Giza, Egypt',
      website: 'https://acrotech-logistics.com',
    },
    {
      name: 'Nile Valley Investment Holding',
      company: 'Nile Valley Capital',
      phone: '+20-102-3344556',
      whatsapp_phone: '+20-102-3344556',
      email: 'corp@nilevalley-holding.com',
      address: 'Nile City Towers, North Tower 24th Fl, Cairo',
      website: 'https://nilevalley.investments',
    },
    {
      name: 'Alpha Media & Creative Labs',
      company: 'Alpha Digital Network',
      phone: '+971-4-8899770',
      whatsapp_phone: '+971-4-8899770',
      email: 'hello@alphamedialabs.io',
      address: 'Dubai Media City, Building 4, UAE',
      website: 'https://alphamedialabs.io',
    },
    {
      name: 'Vertex Healthcare & Pharma',
      company: 'Vertex MedCare Group',
      phone: '+20-111-9988776',
      whatsapp_phone: '+20-111-9988776',
      email: 'partners@vertexmedcare.org',
      address: 'New Cairo 5th Settlement, Healthcare District',
      website: 'https://vertexmedcare.org',
    },
    {
      name: 'Horizon Retail & Omnichannel',
      company: 'Horizon Stores S.A.E',
      phone: '+20-106-5544332',
      whatsapp_phone: '+20-106-5544332',
      email: 'info@horizonretail.me',
      address: 'Mall of Arabia Commercial Wing, 6th of October',
      website: 'https://horizonretail.me',
    },
  ];

  const clientMap = {};
  for (const c of clientsData) {
    let client = await prisma.client.findFirst({ where: { email: c.email } });
    if (!client) {
      client = await prisma.client.create({ data: c });
    }
    clientMap[c.name] = client;
    console.log(`   ✓ Client: ${c.name}`);
  }

  // 4. Seed Leads
  console.log('\n🎯 Seeding Leads...');
  const leadsData = [
    {
      name: 'Tarek Mansour',
      phone: '+20-100-5544331',
      email: 'tarek.mansour@deltatech.eg',
      source: 'Google Ads',
      stage: 'QUALIFIED',
      deal_value: 65000,
      probability: 75,
      notes: 'Interested in CRM migration and multi-channel marketing automation.',
      created_by: nour.id,
    },
    {
      name: 'Lina Al-Sayed',
      phone: '+971-50-3322114',
      email: 'lina@gulfcapital-partners.com',
      source: 'LinkedIn B2B',
      stage: 'PROPOSAL_SENT',
      deal_value: 120000,
      probability: 85,
      notes: 'Enterprise ERP + POS rollout across 12 GCC branches.',
      created_by: hagar.id,
    },
    {
      name: 'Sherif El-Badry',
      phone: '+20-114-7766554',
      email: 's.badry@egyptpharma.com',
      source: 'Referral',
      stage: 'NEGOTIATION',
      deal_value: 95000,
      probability: 90,
      notes: 'Final contract stage for compliance audit & cloud ERP integration.',
      created_by: nour.id,
    },
    {
      name: 'Omar Farouk',
      phone: '+20-122-8877665',
      email: 'omar@primefmcg.com',
      source: 'Meta Ads',
      stage: 'CONTACTED',
      deal_value: 40000,
      probability: 50,
      notes: 'Lead captured via Growl Q3 Lead Gen campaign. Needs demo call.',
      created_by: hagar.id,
    },
    {
      name: 'Mona Zaki',
      phone: '+20-101-2233445',
      email: 'm.zaki@fashionhub.me',
      source: 'Website Form',
      stage: 'NEW',
      deal_value: 28000,
      probability: 30,
      notes: 'Inquired about inventory management and POS billing software.',
      created_by: nour.id,
    },
    {
      name: 'Karim Nabil',
      phone: '+20-109-9988112',
      email: 'karim@redsea-resorts.com',
      source: 'Referral',
      stage: 'WON',
      deal_value: 150000,
      probability: 100,
      notes: 'Won hospitality cloud operating system deployment.',
      created_by: rabie.id,
    },
  ];

  const leadRecords = [];
  for (const l of leadsData) {
    let lead = await prisma.lead.findFirst({ where: { email: l.email } });
    if (!lead) {
      lead = await prisma.lead.create({ data: l });
    }
    leadRecords.push(lead);
    console.log(`   ✓ Lead [${l.stage}]: ${l.name} ($${l.deal_value?.toLocaleString()})`);
  }

  // 5. Seed Deals
  console.log('\n🤝 Seeding Deals...');
  const dealsData = [
    {
      lead_id: leadRecords[0]?.id,
      client_id: clientMap['Acrotech Global Logistics']?.id,
      value: 65000,
      status: 'ACTIVE',
      expected_close_date: new Date(Date.now() + 15 * 86400000),
      notes: 'Contract review underway. Client requested SLA clause.',
    },
    {
      lead_id: leadRecords[1]?.id,
      client_id: clientMap['Horizon Retail & Omnichannel']?.id,
      value: 120000,
      status: 'ACTIVE',
      expected_close_date: new Date(Date.now() + 25 * 86400000),
      notes: 'Multi-store hardware + POS software licensing agreement.',
    },
    {
      lead_id: leadRecords[2]?.id,
      client_id: clientMap['Vertex Healthcare & Pharma']?.id,
      value: 95000,
      status: 'ACTIVE',
      expected_close_date: new Date(Date.now() + 8 * 86400000),
      notes: 'Security clearance and HIPAA compliance data migration.',
    },
    {
      lead_id: leadRecords[5]?.id,
      client_id: clientMap['Nile Valley Investment Holding']?.id,
      value: 150000,
      status: 'WON',
      expected_close_date: new Date(Date.now() - 10 * 86400000),
      notes: 'Deal finalized and signed. Phase 1 payment received.',
    },
    {
      client_id: clientMap['Alpha Media & Creative Labs']?.id,
      value: 48000,
      status: 'WON',
      expected_close_date: new Date(Date.now() - 20 * 86400000),
      notes: 'High-scale creative rendering server cluster & digital advertising stack.',
    },
  ];

  const dealRecords = [];
  for (const d of dealsData) {
    const existing = await prisma.deal.findFirst({
      where: { client_id: d.client_id, value: d.value }
    });
    const deal = existing || await prisma.deal.create({ data: d });
    dealRecords.push(deal);
    console.log(`   ✓ Deal [${d.status}]: $${d.value.toLocaleString()}`);
  }

  // 6. Seed Projects
  console.log('\n🚀 Seeding Projects...');
  const projectsData = [
    {
      title: 'Enterprise Cloud Migration & DevOps',
      description: 'End-to-end cloud infrastructure migration to high-availability cluster with CI/CD pipelines.',
      client_id: clientMap['Acrotech Global Logistics']?.id,
      deal_id: dealRecords[0]?.id,
      type: 'ICT',
      status: 'IN_PROGRESS',
      budget: 65000,
      progress_percentage: 65,
      start_date: new Date(Date.now() - 30 * 86400000),
      end_date: new Date(Date.now() + 45 * 86400000),
      created_by: superAdmin.id,
    },
    {
      title: 'Omnichannel POS & ERP Modernization',
      description: 'Point of sale deployment across 12 branch locations with centralized real-time stock sync.',
      client_id: clientMap['Horizon Retail & Omnichannel']?.id,
      deal_id: dealRecords[1]?.id,
      type: 'ICT',
      status: 'IN_PROGRESS',
      budget: 120000,
      progress_percentage: 40,
      start_date: new Date(Date.now() - 15 * 86400000),
      end_date: new Date(Date.now() + 60 * 86400000),
      created_by: rabie.id,
    },
    {
      title: 'AI Marketing & Performance Suite',
      description: 'Full programmatic ad attribution model with Meta & Google Ads deep bidirectional integration.',
      client_id: clientMap['Alpha Media & Creative Labs']?.id,
      deal_id: dealRecords[4]?.id,
      type: 'MARKETING',
      status: 'COMPLETED',
      budget: 48000,
      progress_percentage: 100,
      start_date: new Date(Date.now() - 60 * 86400000),
      end_date: new Date(Date.now() - 5 * 86400000),
      created_by: superAdmin.id,
    },
    {
      title: 'Executive Data Lake & Financial BI',
      description: 'Unified executive dashboard for holding company portfolio analytics and real-time P&L reporting.',
      client_id: clientMap['Nile Valley Investment Holding']?.id,
      deal_id: dealRecords[3]?.id,
      type: 'ICT',
      status: 'PLANNING',
      budget: 150000,
      progress_percentage: 15,
      start_date: new Date(Date.now() - 5 * 86400000),
      end_date: new Date(Date.now() + 90 * 86400000),
      created_by: superAdmin.id,
    },
  ];

  const projectRecords = [];
  for (const p of projectsData) {
    let proj = await prisma.project.findFirst({ where: { title: p.title } });
    if (!proj) {
      proj = await prisma.project.create({ data: p });
    }
    projectRecords.push(proj);
    console.log(`   ✓ Project: ${p.title} (${p.progress_percentage}%)`);
  }

  // 7. Seed Tasks
  console.log('\n📋 Seeding Tasks...');
  const tasksData = [
    {
      title: 'Configure Kubernetes ingress & TLS certificates',
      description: 'Finalize SSL/TLS certificates and load balancing on AWS EKS cluster.',
      project_id: projectRecords[0].id,
      assigned_to: rabie.id,
      created_by: superAdmin.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      due_date: new Date(Date.now() + 3 * 86400000),
    },
    {
      title: 'Complete POS hardware staging and thermal printer drivers',
      description: 'Test all barcode scanners and receipt printers for branch 1 to 4.',
      project_id: projectRecords[1].id,
      assigned_to: nour.id,
      created_by: rabie.id,
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      due_date: new Date(Date.now() + 2 * 86400000),
    },
    {
      title: 'Prepare final client acceptance report & invoice sign-off',
      description: 'Deliver the completion documentation and coordinate final sign-off with Alpha Media.',
      project_id: projectRecords[2].id,
      assigned_to: hagar.id,
      created_by: superAdmin.id,
      status: 'DONE',
      priority: 'MEDIUM',
      due_date: new Date(Date.now() - 2 * 86400000),
    },
    {
      title: 'Data schema definition for Executive Data Lake',
      description: 'Review multi-currency exchange rate conversions and consolidated balance sheet schemas.',
      project_id: projectRecords[3].id,
      assigned_to: nour.id,
      created_by: superAdmin.id,
      status: 'TODO',
      priority: 'HIGH',
      due_date: new Date(Date.now() + 10 * 86400000),
    },
    {
      title: 'Schedule client training session for POS managers',
      description: 'Conduct interactive Zoom workshop for Horizon retail store shift managers.',
      project_id: projectRecords[1].id,
      assigned_to: hagar.id,
      created_by: nour.id,
      status: 'TODO',
      priority: 'MEDIUM',
      due_date: new Date(Date.now() + 7 * 86400000),
    },
  ];

  for (const t of tasksData) {
    const existing = await prisma.task.findFirst({
      where: { project_id: t.project_id, title: t.title }
    });
    if (!existing) {
      await prisma.task.create({ data: t });
    }
    console.log(`   ✓ Task [${t.priority}]: ${t.title}`);
  }

  // 8. Seed Milestones
  console.log('\n🏁 Seeding Milestones...');
  const milestonesData = [
    {
      title: 'Phase 1: Architecture Blueprint Approved',
      description: 'Complete high-level and low-level network architecture design.',
      project_id: projectRecords[0].id,
      status: 'COMPLETED',
      due_date: new Date(Date.now() - 15 * 86400000),
      completed_date: new Date(Date.now() - 14 * 86400000),
      created_by: superAdmin.id,
    },
    {
      title: 'Phase 2: Database Migration & Zero-Downtime Cutover',
      description: 'Production migration of 2TB database with zero loss.',
      project_id: projectRecords[0].id,
      status: 'IN_PROGRESS',
      due_date: new Date(Date.now() + 20 * 86400000),
      created_by: superAdmin.id,
    },
    {
      title: 'Branch Pilot Deployment (Cairo Branches)',
      description: 'Live test rollout in 3 flagship store locations.',
      project_id: projectRecords[1].id,
      status: 'IN_PROGRESS',
      due_date: new Date(Date.now() + 14 * 86400000),
      created_by: rabie.id,
    },
  ];

  for (const m of milestonesData) {
    const existing = await prisma.milestone.findFirst({
      where: { project_id: m.project_id, title: m.title }
    });
    if (!existing) {
      await prisma.milestone.create({ data: m });
    }
    console.log(`   ✓ Milestone: ${m.title}`);
  }

  // 9. Seed Invoices & Payments
  console.log('\n💳 Seeding Invoices & Payments...');
  const invoicesData = [
    {
      invoice_number: 'INV-2026-001',
      client_id: clientMap['Nile Valley Investment Holding'].id,
      project_id: projectRecords[3].id,
      deal_id: dealRecords[3].id,
      amount: 75000,
      tax: 10500,
      total_amount: 85500,
      status: 'PAID',
      issued_date: new Date(Date.now() - 12 * 86400000),
      due_date: new Date(Date.now() + 18 * 86400000),
      notes: 'Initial 50% mobilization advance for Executive BI Platform.',
      created_by: superAdmin.id,
    },
    {
      invoice_number: 'INV-2026-002',
      client_id: clientMap['Alpha Media & Creative Labs'].id,
      project_id: projectRecords[2].id,
      deal_id: dealRecords[4].id,
      amount: 48000,
      tax: 6720,
      total_amount: 54720,
      status: 'PAID',
      issued_date: new Date(Date.now() - 25 * 86400000),
      due_date: new Date(Date.now() - 5 * 86400000),
      notes: 'Full turnkey delivery payment for AI Marketing Suite.',
      created_by: superAdmin.id,
    },
    {
      invoice_number: 'INV-2026-003',
      client_id: clientMap['Acrotech Global Logistics'].id,
      project_id: projectRecords[0].id,
      deal_id: dealRecords[0].id,
      amount: 32500,
      tax: 4550,
      total_amount: 37050,
      status: 'SENT',
      issued_date: new Date(Date.now() - 4 * 86400000),
      due_date: new Date(Date.now() + 26 * 86400000),
      notes: 'Milestone 1 completion invoice (Architecture & Cloud Setup).',
      created_by: superAdmin.id,
    },
    {
      invoice_number: 'INV-2026-004',
      client_id: clientMap['Horizon Retail & Omnichannel'].id,
      project_id: projectRecords[1].id,
      deal_id: dealRecords[1].id,
      amount: 60000,
      tax: 8400,
      total_amount: 68400,
      status: 'SENT',
      issued_date: new Date(Date.now() - 2 * 86400000),
      due_date: new Date(Date.now() + 28 * 86400000),
      notes: 'Phase 1 POS terminal hardware and initial software setup.',
      created_by: superAdmin.id,
    },
  ];

  for (const inv of invoicesData) {
    const existing = await prisma.invoice.findUnique({
      where: { invoice_number: inv.invoice_number }
    });
    const invoice = existing || await prisma.invoice.create({ data: inv });

    if (inv.status === 'PAID') {
      const existingPay = await prisma.payment.findFirst({
        where: { invoice_id: invoice.id }
      });
      if (!existingPay) {
        await prisma.payment.create({
          data: {
            invoice_id: invoice.id,
            amount_paid: invoice.total_amount,
            payment_method: 'BANK_TRANSFER',
            payment_date: new Date(Date.now() - 8 * 86400000),
            reference_number: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
            notes: 'Bank wire transfer confirmed via CIB corporate account.',
          },
        });
      }
    }
    console.log(`   ✓ Invoice [${inv.status}]: ${inv.invoice_number} ($${inv.total_amount.toLocaleString()})`);
  }

  // 10. Seed Expenses
  console.log('\n💸 Seeding Expenses...');
  const expensesData = [
    {
      title: 'AWS Cloud Infrastructure (Production Cluster & EKS)',
      category: 'INFRASTRUCTURE',
      amount: 4850,
      created_by: superAdmin.id,
      date: new Date(Date.now() - 10 * 86400000),
      notes: 'Monthly enterprise hosting bill for Growl Cloud Cluster.',
    },
    {
      title: 'Meta Ads Manager — Q3 B2B Campaigns',
      category: 'MARKETING',
      amount: 3200,
      created_by: superAdmin.id,
      date: new Date(Date.now() - 7 * 86400000),
      notes: 'Paid social lead generation ad spend.',
    },
    {
      title: 'Google Cloud Platform & BigQuery APIs',
      category: 'SOFTWARE',
      amount: 1950,
      created_by: rabie.id,
      date: new Date(Date.now() - 5 * 86400000),
      notes: 'Data pipeline and streaming ingestion charges.',
    },
    {
      title: 'Office Coworking Space & High-Speed Fiber Leased Line',
      category: 'OPERATIONS',
      amount: 2400,
      created_by: superAdmin.id,
      date: new Date(Date.now() - 2 * 86400000),
      notes: 'Monthly headquarters overhead.',
    },
  ];

  for (const exp of expensesData) {
    const existing = await prisma.expense.findFirst({
      where: { title: exp.title }
    });
    if (!existing) {
      await prisma.expense.create({ data: exp });
    }
    console.log(`   ✓ Expense: ${exp.title} ($${exp.amount.toLocaleString()})`);
  }

  // 11. Seed Marketing Campaigns
  console.log('\n📣 Seeding Marketing Campaigns...');
  const campaignsData = [
    {
      title: 'Growl Q3 Enterprise Business OS',
      description: 'Lead generation targeting CEOs and CTOs across MENA and GCC for cloud CRM & POS.',
      type: 'DIGITAL',
      platform: 'META',
      status: 'ACTIVE',
      budget: 15000,
      daily_budget: 500,
      spent: 6850,
      start_date: new Date(Date.now() - 20 * 86400000),
      end_date: new Date(Date.now() + 40 * 86400000),
      created_by: superAdmin.id,
    },
    {
      title: 'Google High-Intent Search: Cloud ERP Egypt',
      description: 'Google Ads search network bidding on ERP, POS, and Enterprise CRM keywords.',
      type: 'SEARCH',
      platform: 'GOOGLE',
      status: 'ACTIVE',
      budget: 12000,
      daily_budget: 400,
      spent: 8400,
      start_date: new Date(Date.now() - 25 * 86400000),
      end_date: new Date(Date.now() + 35 * 86400000),
      created_by: rabie.id,
    },
    {
      title: 'LinkedIn B2B Executive Growth Summit',
      description: 'Sponsored content targeting Logistics and Retail Operations VPs in Cairo & Dubai.',
      type: 'B2B',
      platform: 'LINKEDIN',
      status: 'ACTIVE',
      budget: 8000,
      daily_budget: 250,
      spent: 4200,
      start_date: new Date(Date.now() - 14 * 86400000),
      end_date: new Date(Date.now() + 16 * 86400000),
      created_by: superAdmin.id,
    },
  ];

  for (const camp of campaignsData) {
    let campaign = await prisma.campaign.findFirst({ where: { title: camp.title } });
    if (!campaign) {
      campaign = await prisma.campaign.create({ data: camp });
    }
    // Add campaign metrics
    const existingMetric = await prisma.campaignMetric.findFirst({
      where: { campaign_id: campaign.id }
    });
    if (!existingMetric) {
      await prisma.campaignMetric.create({
        data: {
          campaign_id: campaign.id,
          impressions: Math.floor(45000 + Math.random() * 25000),
          clicks: Math.floor(1800 + Math.random() * 900),
          conversions: Math.floor(85 + Math.random() * 40),
          spend: campaign.spent || 3000,
          revenue: (campaign.spent || 3000) * 3.8,
        },
      });
    }
    console.log(`   ✓ Campaign [${camp.platform}]: ${camp.title}`);
  }

  // 12. Seed Vendors & Procurement
  console.log('\n🏭 Seeding Vendors & Procurement...');
  const vendorsData = [
    {
      name: 'Amazon Web Services EMEA SARL',
      contact_name: 'Khaled Mansi',
      email: 'aws-support@amazon.com',
      phone: '+352-2789-0000',
      category: 'Cloud Infrastructure',
      rating: 5,
      status: 'ACTIVE',
      created_by: superAdmin.id,
    },
    {
      name: 'Dell Technologies Middle East',
      contact_name: 'Amr El-Gazzar',
      email: 'sales@dell-egypt.com',
      phone: '+20-2-3536-7000',
      category: 'Hardware & Servers',
      rating: 5,
      status: 'ACTIVE',
      created_by: superAdmin.id,
    },
    {
      name: 'Zebra Technologies Distribution',
      contact_name: 'Sarah Faris',
      email: 'orders@zebra-mena.com',
      phone: '+971-4-390-1122',
      category: 'POS & Scanners',
      rating: 4,
      status: 'ACTIVE',
      created_by: rabie.id,
    },
  ];

  const vendorMap = {};
  for (const v of vendorsData) {
    let vendor = await prisma.vendor.findFirst({ where: { name: v.name } });
    if (!vendor) {
      vendor = await prisma.vendor.create({ data: v });
    }
    vendorMap[v.name] = vendor;
    console.log(`   ✓ Vendor: ${v.name}`);
  }

  // 13. Seed Warehouses & Products & Inventory
  console.log('\n📦 Seeding Warehouses & Inventory...');
  const warehousesData = [
    { name: 'Growl Central Tech Warehouse (Cairo)', location: 'Nasr City Industrial Zone' },
    { name: 'Dubai Fulfillment Hub', location: 'Jebel Ali Free Zone (JAFZA)' },
  ];

  const warehouseMap = {};
  for (const w of warehousesData) {
    let wh = await prisma.warehouse.findFirst({ where: { name: w.name } });
    if (!wh) {
      wh = await prisma.warehouse.create({ data: w });
    }
    warehouseMap[w.name] = wh;
  }

  const categoriesData = ['POS Hardware', 'Networking & Servers', 'Software Licenses', 'Peripherals'];
  const categoryMap = {};
  for (const cat of categoriesData) {
    let c = await prisma.productCategory.findFirst({ where: { name: cat } });
    if (!c) {
      c = await prisma.productCategory.create({ data: { name: cat } });
    }
    categoryMap[cat] = c;
  }

  const productsData = [
    {
      name: 'Growl POS Smart Terminal Pro V2',
      sku: 'GWL-POS-V2',
      barcode: '622100088901',
      price: 680,
      cost: 420,
      category_id: categoryMap['POS Hardware']?.id,
    },
    {
      name: 'Growl Cloud Node Server 1U',
      sku: 'GWL-SRV-1U',
      barcode: '622100088902',
      price: 2400,
      cost: 1650,
      category_id: categoryMap['Networking & Servers']?.id,
    },
    {
      name: 'Omni-directional 2D Barcode Scanner',
      sku: 'GWL-SCN-2D',
      barcode: '622100088903',
      price: 180,
      cost: 95,
      category_id: categoryMap['Peripherals']?.id,
    },
    {
      name: 'Thermal Receipt High-Speed Printer (Ethernet/WiFi)',
      sku: 'GWL-PRN-80',
      barcode: '622100088904',
      price: 220,
      cost: 130,
      category_id: categoryMap['Peripherals']?.id,
    },
    {
      name: 'Growl Business OS — Annual Enterprise License',
      sku: 'GWL-LIC-ENT',
      barcode: '622100088905',
      price: 4800,
      cost: 600,
      category_id: categoryMap['Software Licenses']?.id,
    },
  ];

  const productRecords = [];
  const cairoWh = warehouseMap['Growl Central Tech Warehouse (Cairo)'];
  for (const p of productsData) {
    let product = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (!product) {
      product = await prisma.product.create({ data: p });
    }
    productRecords.push(product);

    if (cairoWh) {
      await prisma.inventory.upsert({
        where: {
          product_id_warehouse_id: {
            product_id: product.id,
            warehouse_id: cairoWh.id,
          },
        },
        update: { quantity: 150, min_quantity: 20 },
        create: {
          product_id: product.id,
          warehouse_id: cairoWh.id,
          quantity: 150,
          min_quantity: 20,
        },
      });
    }
    console.log(`   ✓ Product: ${p.name} ($${p.price})`);
  }

  // 14. Seed POS Sales
  console.log('\n🛒 Seeding POS Sales...');
  const existingSale = await prisma.posSale.findFirst({
    where: { sale_number: 'POS-2026-0001' }
  });
  if (!existingSale && cairoWh && productRecords.length >= 3) {
    const sale = await prisma.posSale.create({
      data: {
        sale_number: 'POS-2026-0001',
        customer_id: clientMap['Horizon Retail & Omnichannel']?.id,
        warehouse_id: cairoWh.id,
        subtotal: 1960,
        tax: 274.4,
        total: 2234.4,
        payment_method: 'CARD',
        payment_status: 'PAID',
        status: 'COMPLETED',
        created_by: nour.id,
        items: {
          create: [
            {
              product_id: productRecords[0].id,
              quantity: 2,
              price: productRecords[0].price,
              cost: productRecords[0].cost,
            },
            {
              product_id: productRecords[2].id,
              quantity: 2,
              price: productRecords[2].price,
              cost: productRecords[2].cost,
            },
            {
              product_id: productRecords[3].id,
              quantity: 1,
              price: productRecords[3].price,
              cost: productRecords[3].cost,
            },
          ],
        },
      },
    });
    console.log(`   ✓ POS Sale created: ${sale.sale_number} ($${sale.total.toFixed(2)})`);
  }

  // 15. Seed Notifications
  console.log('\n🔔 Seeding Notifications...');
  const notificationsData = [
    {
      user_id: superAdmin.id,
      type: 'SUCCESS',
      title: 'Invoice Paid: Nile Valley Investment',
      message: 'Payment of $85,500.00 received for INV-2026-001.',
      link: '/finance/invoices',
    },
    {
      user_id: nour.id,
      type: 'INFO',
      title: 'New Enterprise Lead Assigned',
      message: 'Lead Tarek Mansour ($65,000) assigned to you.',
      link: '/leads',
    },
    {
      user_id: hagar.id,
      type: 'WARNING',
      title: 'Proposal Follow-up Due Today',
      message: 'Follow up with Lina Al-Sayed regarding Gulf Capital Partners proposal.',
      link: '/leads',
    },
    {
      user_id: rabie.id,
      type: 'INFO',
      title: 'Task Due Soon: Kubernetes Ingress',
      message: 'Task due in 3 days for Cloud Migration project.',
      link: '/tasks',
    },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({ data: n });
  }
  console.log('   ✓ Notifications seeded');

  // 16. Seed Activity Logs
  console.log('\n📜 Seeding Activity Logs...');
  const activities = [
    {
      user_id: superAdmin.id,
      action: 'LOGIN',
      module: 'AUTH',
      description: 'Super Admin logged into Growl Business OS',
    },
    {
      user_id: superAdmin.id,
      action: 'CREATE',
      module: 'INVOICES',
      description: 'Generated Invoice INV-2026-001 for Nile Valley Investment Holding',
    },
    {
      user_id: nour.id,
      action: 'UPDATE',
      module: 'LEADS',
      description: 'Moved lead Tarek Mansour to stage QUALIFIED',
    },
    {
      user_id: hagar.id,
      action: 'CREATE',
      module: 'LEADS',
      description: 'Logged lead Lina Al-Sayed from LinkedIn B2B campaign',
    },
  ];

  for (const a of activities) {
    await prisma.activityLog.create({ data: a });
  }
  console.log('   ✓ Activity logs recorded');

  // ── Print Credentials Summary ─────────────────────────────────────────────
  console.log('\n' + '═'.repeat(62));
  console.log('  🚀  GROWL GROUP — SYSTEM READY & SEEDED');
  console.log('═'.repeat(62));
  console.log('');
  console.log('  SUPER ADMINS');
  console.log('  ────────────────────────────────────────────────────────');
  console.log('  Email                        Password');
  console.log('  ────────────────────────────────────────────────────────');
  for (const u of GROWL_USERS.filter(u => u.role === 'SUPER_ADMIN')) {
    console.log(`  ${u.email.padEnd(30)} ${u.password}`);
  }
  console.log('');
  console.log('  SALES & OPERATIONS TEAM');
  console.log('  ────────────────────────────────────────────────────────');
  console.log('  Email                        Password');
  console.log('  ────────────────────────────────────────────────────────');
  for (const u of GROWL_USERS.filter(u => u.role !== 'SUPER_ADMIN')) {
    console.log(`  ${u.email.padEnd(30)} ${u.password}`);
  }
  console.log('');
  console.log('═'.repeat(62));
  console.log('  ✅ Database fully populated with CRM, Operations & Finance data.');
  console.log('═'.repeat(62) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Growl seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
