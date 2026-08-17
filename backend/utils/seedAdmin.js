require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

// Run with: npm run seed:admin
(async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@mindmate.app";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    process.exit(0);
  }

  await User.create({
    name: "MindMate Admin",
    email,
    password,
    role: "admin",
  });

  console.log(`Admin user created: ${email}`);
  process.exit(0);
})();
