"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Property Enquiry schema
const PropertyEnquirySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // Email validation
        trim: true,
    },
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
        match: [/^\+?\d{10,}$/, "Invalid phone number format"], // Ensures valid international phone format
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false, // Initially not verified
    },
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Property", // Establishes a reference to the Property model
        required: [true, "Property ID is required"],
    },
    propertyName: {
        type: String,
        required: [true, "Property name is required"],
        trim: true,
    },
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});
// Export the model, ensuring it is not recreated if already defined
const PropertyEnquiry = mongoose_1.models.PropertyEnquiry ||
    (0, mongoose_1.model)("PropertyEnquiry", PropertyEnquirySchema);
exports.default = PropertyEnquiry;
