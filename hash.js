const bcrypt = require('bcrypt');
const { AdminModel } = require('./app/models/user/admin');
const AdminData = require('./data/db.users.json');

async function createAdmin() {
  const adminFromFile = AdminData[0]; // Assuming it's an array of one object

  if (!adminFromFile?.username || !adminFromFile?.password) {
    throw new Error("Invalid admin data in db.users.json");
  }

  // Check if admin already exists
  const existing = await AdminModel.findOne({ username: adminFromFile.username.toLowerCase() });
  if (existing) {
    console.log("Admin user already exists. Skipping insert.");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminFromFile.password, 10);

  const newAdmin = new AdminModel({
    username: adminFromFile.username.toLowerCase(),
    password: hashedPassword,
  });

  await newAdmin.save();
  console.log("Admin user inserted with hashed password.");
}

module.exports = {
  createAdmin
};
