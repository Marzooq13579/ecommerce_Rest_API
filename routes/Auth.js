import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Verify from "../MiddleWare/Verify.js";

const router = express.Router();

// Registration route
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, phone, street, city } = req.body;

    const findUser = await User.findOne({ email });

    if (findUser) {
      return res
        .status(404)
        .json({ status: false, message: "User Already Exists Please Login!" });
    }

    let address = {
      street,
      city,
    };

    const user = new User({
      name: username,
      email,
      password,
      address,
      phoneNumber: phone,
    });

    const savedUser = await user.save();

    if (savedUser) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: savedUser._id, isAdmin: savedUser.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Customize token expiration time
        }
      );

      // Exclude password from user object
      const sanitizedUser = {
        name: savedUser.name,
        email: savedUser.email,
        address: savedUser.address,
        phoneNumber: savedUser.phoneNumber,
      };

      res
        .status(201)
        .cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), // Customize cookie expiration time
        })
        .json({
          status: true,
          message: "User registered successfully",
          data: sanitizedUser,
        });
    } else {
      res
        .status(500)
        .json({ status: false, message: "Error registering user" });
    }
  } catch (err) {
    next(err);
  }
});

// Login route
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Compare password using the comparePassword method
    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Customize token expiration time
        }
      );

      const sanitizedUser = {
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
      };

      res
        .cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), // Customize cookie expiration time
        })
        .json({
          status: true,
          message: "Login successful",
          data: sanitizedUser,
        });
    } else {
      res.status(401).json({ status: false, message: "Invalid credentials" });
    }
  } catch (err) {
    next(err);
  }
});

//User Info Update Route

router.put("/updateUserInfo", Verify, async (req, res, next) => {
  console.log("inside update user info api");
  try {
    const { userId } = req.user; // Access user ID from decoded token
    const { username, email, phone, street, city } = req.body;

    console.log("req body is", req.body);

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    let address = {
      street,
      city,
    };

    // Update user details (excluding password)
    user.name = username;
    user.email = email;
    user.phoneNumber = phone;
    user.address = address;

    // Save updated user
    await user.save();

    // Exclude password from response
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
    };

    res.status(200).json({
      status: true,
      message: "User info updated successfully",
      data: sanitizedUser,
    });
  } catch (err) {
    next(err);
  }
});

// Logout route
router.get("/logout", async (req, res, next) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), // Customize cookie expiration time
      })
      .json({ status: true, message: "Logout successful" });
  } catch (err) {
    next(err);
  }
});

export default router;
