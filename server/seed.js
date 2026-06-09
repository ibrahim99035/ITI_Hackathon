require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const BookCategory = require('./models/BookCategory')
const Book = require('./models/Book')
const Member = require('./models/Member')
const Loan = require('./models/Loan')

const connectDB = require('./config/db')

async function seed() {
  await connectDB()
  console.log('🌱 Seeding database...')

  // ── Clear existing data ──
  await Promise.all([
    User.deleteMany({}),
    BookCategory.deleteMany({}),
    Book.deleteMany({}),
    Member.deleteMany({}),
    Loan.deleteMany({})
  ])
  console.log('  ✓ Cleared existing data')

  // ── 1. Users ──
  const adminUser = await User.create({
    name: 'أحمد القرشي',
    email: 'admin@nebras.sa',
    password: 'Admin123!',
    phone: '+966501234567',
    nationalId: '1234567890',
    role: 'Admin'
  })

  const librarianUser = await User.create({
    name: 'فاطمة الزهراء',
    email: 'librarian@nebras.sa',
    password: 'Lib123!',
    phone: '+966502345678',
    nationalId: '2345678901',
    role: 'Librarian'
  })

  const memberUsers = await User.create([
    { name: 'عمر الهاشمي',    email: 'omar@mail.com',     password: 'Member123!', phone: '+966503456789', role: 'Member' },
    { name: 'خديجة السيد',    email: 'khadija@mail.com',  password: 'Member123!', phone: '+966504567890', role: 'Member' },
    { name: 'يوسف إبراهيم',   email: 'yusuf@mail.com',    password: 'Member123!', phone: '+966505678901', role: 'Member' },
    { name: 'سارة النجار',    email: 'sara@mail.com',     password: 'Member123!', phone: '+966506789012', role: 'Member' },
  ])
  console.log('  ✓ Created 6 users (Admin, Librarian, 4 Members)')

  // ── 2. Categories ──
  const categories = await BookCategory.create([
    { name: 'تاريخ',  description: 'History and civilization studies' },
    { name: 'أدب',    description: 'Literature and prose' },
    { name: 'شعر',    description: 'Poetry and verse' },
    { name: 'فقه',    description: 'Islamic jurisprudence and religious sciences' },
    { name: 'فلسفة',  description: 'Philosophy and thought' },
    { name: 'لغة',    description: 'Language and linguistics' },
    { name: 'علوم',   description: 'Sciences and mathematics' },
  ])
  const catMap = {}
  categories.forEach(c => catMap[c.name] = c._id)
  console.log('  ✓ Created 7 categories')

  // ── 3. Books ──
  const books = await Book.create([
    { title: 'مقدمة ابن خلدون', author: 'Ibn Khaldun',               isbn: '978-0-691-16662-8', category: catMap['تاريخ'], totalCopies: 5, availableCopies: 2, publisher: 'دار الفكر',   publicationYear: 1377, description: 'A foundational text on sociology and history.' },
    { title: 'ألف ليلة وليلة',  author: 'Anonymous',                  isbn: '978-0-14-044915-1', category: catMap['أدب'],   totalCopies: 8, availableCopies: 2, publisher: 'دار المعارف', publicationYear: 850,  description: 'Classic collection of Middle Eastern folk tales.' },
    { title: 'كليلة ودمنة',     author: 'Ibn al-Muqaffa',             isbn: '978-977-09-1234-5', category: catMap['أدب'],   totalCopies: 4, availableCopies: 0, publisher: 'دار العلم',   publicationYear: 750,  description: 'Ancient fables of wisdom and morality.' },
    { title: 'نهج البلاغة',     author: 'Ali ibn Abi Talib',          isbn: '978-964-195-001-2', category: catMap['فقه'],   totalCopies: 6, availableCopies: 5, publisher: 'دار الهدى',   publicationYear: 1000, description: 'Collection of sermons and sayings.' },
    { title: 'ديوان المتنبي',   author: 'Al-Mutanabbi',               isbn: '978-977-02-5678-3', category: catMap['شعر'],   totalCopies: 3, availableCopies: 1, publisher: 'دار الكتب',   publicationYear: 965,  description: 'The collected poetry of Al-Mutanabbi.' },
    { title: 'رسالة الغفران',   author: 'Abu al-Ala al-Maarri',       isbn: '978-977-02-9876-1', category: catMap['أدب'],   totalCopies: 2, availableCopies: 1, publisher: 'دار المعارف', publicationYear: 1033, description: 'A philosophical literary masterpiece.' },
    { title: 'دلائل الإعجاز',   author: 'Abd al-Qahir al-Jurjani',    isbn: '978-977-02-1111-2', category: catMap['لغة'],   totalCopies: 4, availableCopies: 4, publisher: 'دار العلم',   publicationYear: 1078, description: 'Foundations of Arabic rhetoric.' },
    { title: 'قصص الأنبياء',    author: 'Ibn Kathir',                 isbn: '978-964-195-005-0', category: catMap['فقه'],   totalCopies: 7, availableCopies: 5, publisher: 'دار الهدى',   publicationYear: 1360, description: 'Stories of the prophets from Islamic tradition.' },
    { title: 'الفتوحات المكية', author: 'Ibn Arabi',                  isbn: '978-977-02-4444-3', category: catMap['فلسفة'], totalCopies: 3, availableCopies: 2, publisher: 'دار الفكر',   publicationYear: 1230, description: 'Major Sufi metaphysical work.' },
    { title: 'الكامل في التاريخ',author: 'Ibn al-Athir',              isbn: '978-977-02-5555-4', category: catMap['تاريخ'], totalCopies: 4, availableCopies: 3, publisher: 'دار الفكر',   publicationYear: 1231, description: 'Comprehensive history of the Islamic world.' },
  ])
  console.log('  ✓ Created 10 books')

  // ── 4. Members ──
  const now = new Date()
  const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

  // Admin and librarian also get member profiles
  const adminMember = await Member.create({
    user: adminUser._id, membershipNumber: 'MEM-00001', membershipType: 'Faculty',
    membershipStart: new Date('2023-01-15'), membershipEnd: oneYearFromNow, outstandingFine: 0
  })
  const libMember = await Member.create({
    user: librarianUser._id, membershipNumber: 'MEM-00002', membershipType: 'Faculty',
    membershipStart: new Date('2023-03-22'), membershipEnd: oneYearFromNow, outstandingFine: 15.5
  })
  const members = await Member.create([
    { user: memberUsers[0]._id, membershipNumber: 'MEM-00003', membershipType: 'Student', membershipStart: new Date('2022-11-08'), membershipEnd: oneYearFromNow, outstandingFine: 0 },
    { user: memberUsers[1]._id, membershipNumber: 'MEM-00004', membershipType: 'Public',  membershipStart: new Date('2024-02-10'), membershipEnd: oneYearFromNow, outstandingFine: 7.5 },
    { user: memberUsers[2]._id, membershipNumber: 'MEM-00005', membershipType: 'Student', membershipStart: new Date('2023-07-19'), membershipEnd: oneYearFromNow, outstandingFine: 0 },
    { user: memberUsers[3]._id, membershipNumber: 'MEM-00006', membershipType: 'Public',  membershipStart: new Date('2024-05-03'), membershipEnd: oneYearFromNow, outstandingFine: 22 },
  ])
  console.log('  ✓ Created 6 member profiles')

  // ── 5. Loans ──
  const pastDate = (daysAgo) => new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  const futureDate = (daysFromNow) => new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000)

  const loans = await Loan.create([
    // Overdue loan: Omar borrowed مقدمة ابن خلدون
    { book: books[0]._id, member: members[0]._id, issuedBy: librarianUser._id,
      loanDate: pastDate(24), expectedReturnDate: pastDate(10), status: 'Overdue',
      fineAmount: 0, finePaid: false },

    // Overdue loan: Khadija borrowed كليلة ودمنة
    { book: books[2]._id, member: members[1]._id, issuedBy: librarianUser._id,
      loanDate: pastDate(22), expectedReturnDate: pastDate(8), status: 'Overdue',
      fineAmount: 0, finePaid: false },

    // Active loan: Admin borrowed ألف ليلة وليلة
    { book: books[1]._id, member: adminMember._id, issuedBy: librarianUser._id,
      loanDate: pastDate(8), expectedReturnDate: futureDate(6), status: 'Active' },

    // Active loan: Librarian borrowed نهج البلاغة
    { book: books[3]._id, member: libMember._id, issuedBy: adminUser._id,
      loanDate: pastDate(3), expectedReturnDate: futureDate(11), status: 'Active' },

    // Active loan: Yusuf borrowed ديوان المتنبي
    { book: books[4]._id, member: members[2]._id, issuedBy: librarianUser._id,
      loanDate: pastDate(11), expectedReturnDate: futureDate(3), status: 'Active' },

    // Overdue loan: Sara borrowed الفتوحات المكية
    { book: books[8]._id, member: members[3]._id, issuedBy: librarianUser._id,
      loanDate: pastDate(18), expectedReturnDate: pastDate(4), status: 'Overdue',
      fineAmount: 0, finePaid: false },

    // Returned loan: Omar returned ألف ليلة (in the past)
    { book: books[1]._id, member: members[0]._id, issuedBy: librarianUser._id,
      loanDate: pastDate(45), expectedReturnDate: pastDate(31), actualReturnDate: pastDate(29),
      status: 'Returned', fineAmount: 0, finePaid: true },

    // Returned loan: Khadija returned مقدمة ابن خلدون (late, fine 18)
    { book: books[0]._id, member: members[1]._id, issuedBy: librarianUser._id,
      loanDate: pastDate(60), expectedReturnDate: pastDate(46), actualReturnDate: pastDate(44),
      status: 'Returned', fineAmount: 18, finePaid: false },

    // Returned loan: Admin returned نهج البلاغة
    { book: books[3]._id, member: adminMember._id, issuedBy: librarianUser._id,
      loanDate: pastDate(35), expectedReturnDate: pastDate(21), actualReturnDate: pastDate(23),
      status: 'Returned', fineAmount: 0, finePaid: true },
  ])
  console.log('  ✓ Created 9 loans (3 active, 3 overdue, 3 returned)')

  // ── Summary ──
  console.log('\n✅ Seeding complete!\n')
  console.log('   Login credentials:')
  console.log('   ─────────────────────────────')
  console.log('   Admin:     admin@nebras.sa     / Admin123!')
  console.log('   Librarian: librarian@nebras.sa / Lib123!')
  console.log('   Member:    omar@mail.com       / Member123!')
  console.log('   ─────────────────────────────')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
