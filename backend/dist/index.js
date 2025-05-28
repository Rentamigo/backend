"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectToDb_1 = __importDefault(require("./utils/connectToDb"));
const cors_1 = __importDefault(require("cors"));
const verify_1 = __importDefault(require("./routes/verify"));
const googleAuth_1 = __importDefault(require("./routes/googleAuth"));
const email_1 = __importDefault(require("./routes/email"));
const employee_1 = __importDefault(require("./routes/employee"));
const services_intrst_user_1 = __importDefault(require("./routes/services-intrst-user"));
const ownerIntrst_1 = __importDefault(require("./routes/ownerIntrst"));
const Propertydetails_1 = __importDefault(require("./routes/Propertydetails"));
const subscriberform_1 = __importDefault(require("./routes/subscriberform"));
const ownerInterest_1 = __importDefault(require("./routes/ownerInterest"));
const Propertyphoto_1 = __importDefault(require("./routes/Propertyphoto"));
const propertyEnquiryRoutes_1 = __importDefault(require("./routes/propertyEnquiryRoutes"));
const enquiryRoutes_1 = __importDefault(require("./routes/enquiryRoutes"));
const signupform_1 = __importDefault(require("./routes/signupform")); // Replace with the correct file path for User
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const forgotPasswordRoutes_1 = __importDefault(require("./routes/forgotPasswordRoutes"));
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = ["ACCOUNT_SID", "AUTH_TOKEN", "VERIFY_SERVICE_SID"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}
const app = (0, express_1.default)();
(0, connectToDb_1.default)()
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Terminate the process if the database connection fails
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" })); // Set JSON payload size limit
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" })); // Set URL-encoded payload size limit
// Routes
app.use("/api/verify", verify_1.default);
app.use("/api/auth/google", googleAuth_1.default); // Google Auth routes
app.use("/api/email", email_1.default); // Email routes
app.use("/api/employees", employee_1.default); // Employee routes
app.use("/api", services_intrst_user_1.default); // Service interest routes
app.use("/api", ownerIntrst_1.default); // Owner interest routes
app.use("/api/properties", Propertydetails_1.default); // Property routes
app.use("/api/forms", subscriberform_1.default);
app.use("/api/owner-interest", ownerInterest_1.default);
app.use("/api/Photos", Propertyphoto_1.default);
app.use("/api/property", propertyEnquiryRoutes_1.default);
app.use("/api/service", enquiryRoutes_1.default);
app.use("/api/sign", signupform_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api", forgotPasswordRoutes_1.default);
// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});
// Enhanced error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Something went wrong!"
            : err.message,
    });
};
app.use(errorHandler);
// Start server
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Environment variables loaded:", {
        VERIFY_SERVICE_SID: process.env.VERIFY_SERVICE_SID ? "****" : undefined,
        ACCOUNT_SID: process.env.ACCOUNT_SID ? "****" : undefined,
        AUTH_TOKEN: process.env.AUTH_TOKEN ? "****" : undefined,
    });
});
