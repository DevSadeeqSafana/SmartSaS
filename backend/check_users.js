const { User } = require('./models');
const { connectDB } = require('./config/db');

async function check() {
  await connectDB();
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
  console.log('Users:', JSON.stringify(users, null, 2));
  process.exit(0);
}

check();
