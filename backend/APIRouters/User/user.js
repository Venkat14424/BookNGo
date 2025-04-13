import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import sendMail from "../mail/mailsender.js";

const userRouter = express.Router();
userRouter.use(express.json());

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    aadhaar: { type: String, required: true, unique: true },
    userid: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { collection: "Users" }
);

const User = mongoose.model("User", UserSchema);

userRouter.post("/sendotpforresetpassword", async (req, res) => {
  try {
    const { userid, otp } = req.body;

    if (!userid || !otp) {
      return res.status(400).json({ error: "User ID and OTP are required." });
    }

    const user = await User.findOne({ userid });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const gmail = user.gmail;
    console.log(gmail)

    sendMail(
      gmail,
      "Gmail Verification OTP",
      `Hi,\nYour email verification OTP is: ${otp}. Please use this code to complete the verification process.\nIf you did not request this, please ignore this message.\n\nBest, BOOKNGO.`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
});
userRouter.put("/reset-password", async (req, res) => {
  try {
    const { userid, password } = req.body;
    if (!userid || !password) {
      return res.status(400).json({ error: "User ID and new password are required." });
    }

    const user = await User.findOne({ userid });
    if (!user) return res.status(404).json({ error: "User not found" });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    sendMail(
      user.gmail,
      "Password Change Notification",
      `Hi ${user.username},\n\nYour password has been successfully changed. If you didn't make this change, please contact us immediately at support@bookngowebsite.com.\n\nBest, BOOKNGO.`
    );
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error changing password", details: err.message });
  }
});
userRouter.post("/signup", async (req, res) => {
  try {
    const { username, gmail, gender, dob, aadhaar, userid, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (isNaN(Date.parse(dob))) {
      return res.status(400).json({ error: "Invalid Date of Birth" });
    }

    const userExist = await User.findOne({ userid });
    if (userExist) {
      return res.status(400).json({ error: "User ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, gmail, gender, dob, aadhaar, userid, password: hashedPassword });

    await newUser.save();
    sendMail(
      gmail,
      "Welcome to BookNGo",
      `Hi ${username},\nWelcome to BookNGo! Your account has been successfully created. We're excited to have you on board. If you need any assistance, feel free to contact us at support@bookngowebsite.com.\nBest, BOOKNGO.`
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user", details: err.message });
  }
});

userRouter.post("/send-otp", async (req, res) => {
  try {
    const { gmail, otp } = req.body;
    if (!gmail || !otp) {
      return res.status(400).json({ error: "Gmail and OTP are required." });
    } sendMail(
      gmail,
      "Gmail Verification OTP",
      `Hi,\nYour email verification OTP is: ${otp}. Please use this code to complete the verification process.\nIf you did not request this, please ignore this message.\nBest, BOOKNGO.`
    );
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { userid, password } = req.body;
    const user = await User.findOne({ userid });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    sendMail(
      user.gmail,
      "You're Logged In!",
      `Hi ${user.username},\nYou are now logged in to your BookNGo website!\nIf you need any assistance, please reach out to us at support@bookngowebsite.com.\nBest, BOOKNGO.`
    );
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Error logging in", details: err.message });
  }
});

userRouter.get("/:userNumber", async (req, res) => {
  try {
    const userExist = await User.findOne({ aadhaar: req.params.userNumber });
    if (!userExist) {
      return res.status(400).json({ error: "User not found with this Aadhaar number" });
    }
    res.json({ user: userExist });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

userRouter.get("/details/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ userid });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user details", details: err.message });
  }
});

userRouter.put("/change-password/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ userid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    sendMail(
      user.gmail,
      "Password Change Notification",
      `Hi ${user.username},\nYour password has been successfully changed. If you didn't make this change, please contact us immediately at support@bookngowebsite.com.\nBest, BOOKNGO.`
    );
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error changing password", details: err.message });
  }
});

userRouter.put("/update/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const { newUserid, ...updatedData } = req.body;

    const user = await User.findOne({ userid });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!updatedData.username || !updatedData.gmail || !updatedData.gender || !updatedData.dob) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newUserid && newUserid !== userid) {
      const existingUser = await User.findOne({ userid: newUserid });
      if (existingUser) return res.status(400).json({ error: "New User ID already exists" });
      updatedData.userid = newUserid;
    }

    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, updatedData, { new: true });
    if (!updatedUser) return res.status(500).json({ error: "Failed to update user" });
    sendMail(
      updatedUser.gmail,
      "Profile Updated",
      `Hi ${updatedUser.username},\nYour profile has been successfully updated. If you did not make these changes or have any questions, feel free to contact us at support@bookngowebsite.com.\nBest, BOOKNGO.`
    );
    res.json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Error updating user details", details: err.message });
  }
});

export default userRouter;
