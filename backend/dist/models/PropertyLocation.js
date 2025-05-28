"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the PropertyLocation schema
const PropertyLocationSchema = new mongoose_1.Schema({
    property: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Property", // Reference to the Property collection
        required: [true, "Property reference is required"],
    },
    propertyName: {
        type: String,
        trim: true,
    },
    flatNo: {
        type: String,
        required: [true, "Flat number is required"],
        trim: true,
    },
    addressLine1: {
        type: String,
        required: [true, "Address Line 1 is required"],
        trim: true,
    },
    addressLine2: {
        type: String,
        trim: true,
    },
    addressLine3: {
        type: String,
        trim: true,
    },
    latitude: {
        type: String,
        required: [true, "Latitude is required"],
        validate: {
            validator: (value) => /^-?\d+(\.\d+)?$/.test(value),
            message: "Please enter a valid latitude",
        },
    },
    longitude: {
        type: String,
        required: [true, "Longitude is required"],
        validate: {
            validator: (value) => /^-?\d+(\.\d+)?$/.test(value),
            message: "Please enter a valid longitude",
        },
    },
    locality: {
        type: String,
        required: [true, "Locality is required"],
        trim: true,
    },
    area: {
        type: String,
        trim: true,
    },
    pinCode: {
        type: String,
        required: [true, "Pincode is required"],
        match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
// Middleware to populate `propertyName` before saving
PropertyLocationSchema.pre("save", async function (next) {
    const propertyLocation = this;
    if (propertyLocation.property) {
        // Fetch the associated property document
        const property = await (0, mongoose_1.model)("Property").findById(propertyLocation.property);
        if (property) {
            propertyLocation.propertyName = property.propertyName; // Assign propertyName dynamically
        }
    }
    next();
});
// Define and export the PropertyLocation model
const PropertyLocation = mongoose_1.models.PropertyLocation ||
    (0, mongoose_1.model)("PropertyLocation", PropertyLocationSchema);
exports.default = PropertyLocation;
