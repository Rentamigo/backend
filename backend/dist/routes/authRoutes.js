"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const signup_1 = __importDefault(require("../models/signup")); // Importing the User model
dotenv_1.default.config();
const loginRouter = express_1.default.Router();
loginRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // 🔹 1️⃣ Check if the user exists
        const user = await signup_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // 🔹 2️⃣ Verify password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // 🔹 3️⃣ Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "2h", // 🔒 Securely setting expiration time
        });
        // 🔹 4️⃣ Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone,
                address: `${user.address}, ${user.city}, ${user.state}`,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});
exports.default = loginRouter;
