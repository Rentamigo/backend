"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EnqiuryForm_1 = __importDefault(require("../models/EnqiuryForm")); // Ensure this path matches your model file
const sendOtpService_1 = __importDefault(require("../services/sendOtpService")); // Assuming Twilio OTP service is defined here
const emailservice_1 = __importDefault(require("../utils/emailservice")); // Import email transporter
const router = express_1.default.Router();
/**
 * POST: Send OTP
 */
router.post("/send-otp", async (req, res) => {
    const { name, email, contactNumber } = req.body;
    if (!name || !email || !contactNumber) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }
    try {
        const response = await sendOtpService_1.default.sendOtp(contactNumber, "sms");
        if (response.success) {
            res.status(200).json({
                success: true,
                message: "OTP sent successfully.",
                sid: response.sid,
            });
        }
        else {
            throw new Error("Failed to send OTP.");
        }
    }
    catch (error) {
        console.error("Error sending OTP:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again.",
        });
    }
});
/**
 * POST: Submit Form
 */
router.post("/submit-form", async (req, res) => {
    const { name, email, contactNumber, selectedServices, isVerified } = req.body;
    if (!name || !email || !contactNumber || isVerified === undefined || !selectedServices) {
        return res.status(400).json({
            success: false,
            message: "Name, email, contact number, verification status, and services are required.",
        });
    }
    try {
        // Save the enquiry to the database
        const newEnquiry = new EnqiuryForm_1.default({
            name,
            email,
            mobileNo: contactNumber,
            isOtpVerified: isVerified,
            selectedServices,
        });
        const savedEnquiry = await newEnquiry.save();
        // Email content for the user
        const userEmailContent = `
      <h1>Thank You for Your Enquiry</h1>
      <p>Dear ${savedEnquiry.name},</p>
      <p>We have received your enquiry with the following details:</p>
      <ul>
        <li><strong>Contact Number:</strong> ${savedEnquiry.mobileNo}</li>
        <li><strong>Selected Services:</strong></li>
        <ul>
          ${savedEnquiry.selectedServices.map((service) => `<li>${service}</li>`).join("")}
        </ul>
      </ul>
      <p>We will get back to you shortly.</p>
      <p>Best Regards,<br>RentAmigo Team</p>
    `;
        // Email content for the company
        const companyEmailContent = `
      <h1>New Service Enquiry</h1>
      <p><strong>Name:</strong> ${savedEnquiry.name}</p>
      <p><strong>Email:</strong> ${savedEnquiry.email}</p>
      <p><strong>Contact Number:</strong> ${savedEnquiry.mobileNo}</p>
      <p><strong>Verified:</strong> ${savedEnquiry.isOtpVerified ? "Yes" : "No"}</p>
      <p><strong>Selected Services:</strong></p>
      <ul>
        ${savedEnquiry.selectedServices.map((service) => `<li>${service}</li>`).join("")}
      </ul>
      <p><strong>Submission Date:</strong> ${savedEnquiry.createdAt}</p>
    `;
        // Send email to the user
        await emailservice_1.default.sendMail({
            from: process.env.EMAIL_USER, // Your email
            to: savedEnquiry.email, // User's email
            subject: "Your Service Enquiry Confirmation",
            html: userEmailContent,
        });
        // Send email to the company
        await emailservice_1.default.sendMail({
            from: process.env.EMAIL_USER, // Your email
            to: "contact@rentamigo.in", // Company's email
            subject: "New Service Enquiry",
            html: companyEmailContent,
        });
        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully, and emails sent.",
            data: savedEnquiry,
        });
    }
    catch (error) {
        console.error("Error submitting form or sending emails:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit enquiry or send emails.",
        });
    }
});
/**
 * GET: Retrieve All Enquiries
 */
router.get("/enquiries", async (_req, res) => {
    try {
        const enquiries = await EnqiuryForm_1.default.find();
        res.status(200).json({ success: true, data: enquiries });
    }
    catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).json({ success: false, message: "Failed to fetch enquiries. Please try again." });
    }
});
/**
 * GET: Retrieve a Specific Enquiry by ID
 */
router.get("/enquiryget/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const enquiry = await EnqiuryForm_1.default.findById(id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found." });
        }
        res.status(200).json({ success: true, data: enquiry });
    }
    catch (error) {
        console.error("Error fetching enquiry:", error);
        res.status(500).json({ success: false, message: "Failed to fetch enquiry. Please try again." });
    }
});
/**
 * PUT: Update a Specific Enquiry by ID
 */
router.put("/enquiryput/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, contactNumber, selectedServices } = req.body;
    try {
        const updatedEnquiry = await EnqiuryForm_1.default.findByIdAndUpdate(id, { name, email, mobileNo: contactNumber, selectedServices }, { new: true } // Return the updated document
        );
        if (!updatedEnquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found for update." });
        }
        res.status(200).json({ success: true, message: "Enquiry updated successfully.", data: updatedEnquiry });
    }
    catch (error) {
        console.error("Error updating enquiry:", error);
        res.status(500).json({ success: false, message: "Failed to update enquiry. Please try again." });
    }
});
/**
 * DELETE: Delete a Specific Enquiry by ID
 */
router.delete("/enquirydel/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEnquiry = await EnqiuryForm_1.default.findByIdAndDelete(id);
        if (!deletedEnquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found for deletion." });
        }
        res.status(200).json({ success: true, message: "Enquiry deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting enquiry:", error);
        res.status(500).json({ success: false, message: "Failed to delete enquiry. Please try again." });
    }
});
exports.default = router;
