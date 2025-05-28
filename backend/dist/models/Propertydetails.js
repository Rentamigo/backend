"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Mongoose schema for Property
const PropertySchema = new mongoose_1.Schema({
    propertyName: {
        type: String,
        required: [true, "Property name is required"],
        trim: true,
    },
    ownerName: {
        type: String,
        required: [true, "Owner name is required"],
        trim: true,
    },
    ownerNumber: {
        type: String,
        required: [true, "Owner contact number is required"],
        match: [/^\d{10}$/, "Please provide a valid 10-digit contact number"], // Adjust regex if needed
        trim: true,
    },
    propertyType: {
        type: String,
        enum: ["Apartment", "Standalone Building", "Villa", "Row House"], // Matches frontend options
        required: [true, "Property type is required"],
    },
    propertyConfiguration: {
        type: String,
        required: [true, "Property configuration is required"],
        enum: ["Studio Room (1 RK)", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"], // List of configurations
    },
    furnishingStatus: {
        type: String,
        required: [true, "Furnishing status is required"],
        enum: ["Unfurnished", "Semi Furnished", "Fully Furnished", "Partially Furnished"],
    },
    facing: {
        type: String,
        required: [true, "Facing direction is required"],
        enum: [
            "North",
            "East",
            "South",
            "West",
            "North-East",
            "South-East",
            "North-West",
            "South-West",
        ],
    },
    amenities: {
        type: [String], // Array of amenity IDs
        validate: {
            validator: (value) => Array.isArray(value),
            message: "Amenities must be an array of strings",
        },
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Create and export the Property model
const Property = mongoose_1.models.Property || (0, mongoose_1.model)("Property", PropertySchema);
exports.default = Property;
