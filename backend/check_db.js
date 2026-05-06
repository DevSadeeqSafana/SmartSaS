const { Class } = require('./models');
const { connectDB } = require('./config/db');

async function check() {
  await connectDB();
  const count = await Class.count();
  console.log('Total classes in MySQL:', count);
  const classes = await Class.findAll();
  console.log('Classes:', JSON.stringify(classes, null, 2));
  process.exit(0);
}

check();
