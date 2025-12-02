import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../model/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Default admin credentials
    const adminData = {
      username: "admin",
      email: "admin@digitalbuddiess.com",
      password: "admin123", // Change this in production!
      role: "admin",
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }],
    });

    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Username: ${existingAdmin.username}`);
      process.exit(0);
    }

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Password: ${adminData.password}`);
    console.log("\n⚠️  Please change the default password after first login!");
    console.log("\n📝 To create another admin, run:");
    console.log("   node backend/scripts/createAdmin.js");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();

