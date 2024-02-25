import User from "../models/User.js";

const seedAdmin = async () => {
    try {
      // Check if an admin user already exists
      const existingAdmin = await User.findOne({ isAdmin: true });
  
      if (existingAdmin) {
        console.log("Admin user already exists, skipping seeding.");
        return;
      }
  
  
      const admin = new User({
        name: "Admin",
        email: "admin@example.com",
        password: process.env.ADMIN_PASSWORD,
        isAdmin: true,
        phoneNumber:1234567890
      });
  
      await admin.save();
      console.log("Admin user seeded successfully.");
    } catch (err) {
      console.error("Error seeding admin user:", err);
    } 
  };
  
export default seedAdmin;
