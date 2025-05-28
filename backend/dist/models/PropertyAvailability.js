"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the PropertyAvailability schema
const PropertyAvailabilitySchema = new mongoose_1.Schema({
    property: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Property", // Reference to the Property collection
        required: [true, "Property reference is required"],
    },
    propertyName: {
        type: String,
        required: false, // Will be populated dynamically
        trim: true,
    },
    availableFrom: {
        type: Date,
        required: [true, "Availability date is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
// Middleware to populate `propertyName` before saving
PropertyAvailabilitySchema.pre("save", async function (next) {
    const propertyAvailability = this;
    if (propertyAvailability.property) {
        // Fetch the associated property document
        const property = await (0, mongoose_1.model)("Property").findById(propertyAvailability.property);
        if (property) {
            propertyAvailability.propertyName = property.propertyName; // Dynamically assign propertyName
        }
    }
    next();
});
// Define and export the PropertyAvailability model
const PropertyAvailability = mongoose_1.models.PropertyAvailability ||
    (0, mongoose_1.model)("PropertyAvailability", PropertyAvailabilitySchema);
exports.default = PropertyAvailability;
