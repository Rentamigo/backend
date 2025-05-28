"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("../models/signup")); // Import the User model
const emailservice_1 = __importDefault(require("../utils/emailservice")); // Import the email transporter
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signupRouter = express_1.default.Router();
// POST: Handle user signup
// POST: Handle user signup
signupRouter.post("/register", async (req, res) => {
    try {
        const { username, email, phone, address, city, state, password, role, acceptTerms } = req.body;
        // 🔹 Validate required fields
        if (!username || !email || !phone || !address || !city || !state || !password || !role || acceptTerms !== true) {
            return res.status(400).json({ error: "All fields are required, and terms must be accepted." });
        }
        // 🔹 Check if email or username already exists
        const existingUser = await signup_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists." });
        }
        // 🔹 Hash the password before storing it
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 🔹 Save the user to the database
        const newUser = new signup_1.default({
            username,
            email,
            phone,
            address,
            city,
            state,
            password: hashedPassword, // 🔹 Store hashed password
            role,
            acceptTerms,
        });
        await newUser.save();
        // 🔹 Send confirmation email to the user
        await emailservice_1.default.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to RentAmigo",
            html: `<h1>Welcome to RentAmigo</h1><p>Dear ${username},</p><p>Thank you for signing up for RentAmigo!</p>`,
        });
        // 🔹 Send user details to the company email
        await emailservice_1.default.sendMail({
            from: process.env.EMAIL_USER,
            to: "venkat.s@rentamigo.in",
            subject: "New User Registration",
            html: `
        <h1>New User Registration</h1>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}, ${city}, ${state}</p>
        <p><strong>Role:</strong> ${role}</p>
      `,
        });
        // 🔹 Respond with user details (excluding password)
        res.status(201).json({
            message: "User registered successfully, and emails sent.",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                address: `${newUser.address}, ${newUser.city}, ${newUser.state}`,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        // 🔹 Handle duplicate email/username error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ error: `${field} already exists.` });
        }
        res.status(500).json({ error: "An error occurred during registration." });
    }
});
// PUT: Update user by email
signupRouter.put("/update", async (req, res) => {
    try {
        const { email, username, phone, address, city, state, role } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required to update user." });
        }
        const updatedUser = await signup_1.default.findOneAndUpdate({ email }, { username, phone, address, city, state, role }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found for the provided email." });
        }
        res.status(200).json({ message: "User updated successfully.", user: updatedUser });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
});
// GET: Fetch all users
signupRouter.get("/users", async (_req, res) => {
    try {
        const users = await signup_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "An error occurred while fetching users." });
    }
});
// GET: Fetch a specific user by email
signupRouter.get("/users/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await signup_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "An error occurred while fetching the user." });
    }
});
exports.default = signupRouter;
