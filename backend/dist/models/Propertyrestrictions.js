"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the PropertyRestrictions schema
const PropertyRestrictionsSchema = new mongoose_1.Schema({
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
    bachelorTenants: {
        type: String,
        required: [true, "Bachelor tenants preference is required"],
        enum: ["Yes", "No", "Doesn't Matter"],
    },
    nonVegTenants: {
        type: String,
        required: [true, "Non-veg tenants preference is required"],
        enum: ["Yes", "No", "Doesn't Matter"],
    },
    tenantWithPets: {
        type: String,
        required: [true, "Tenant with pets preference is required"],
        enum: ["Yes", "No", "Doesn't Matter", "NA"],
    },
    propertyOverlooking: {
        type: String,
        enum: ["Garden / Park", "Pool", "Main Road"],
        required: [true, "Property overlooking preference is required"],
    },
    carParking: {
        type: String,
        required: [true, "Car parking availability is required"],
        enum: ["Yes", "No"],
    },
    carParkingCount: {
        type: String,
        required: function () {
            return this.carParking === "Yes";
        },
    },
    twoWheelerParking: {
        type: String,
        required: [true, "Two-wheeler parking availability is required"],
        enum: ["Yes", "No"],
    },
    twoWheelerParkingCount: {
        type: String,
        required: function () {
            return this.twoWheelerParking === "Yes";
        },
    },
    flooringType: {
        type: String,
        required: [true, "Flooring type is required"],
        enum: [
            "Ceramic Tiles",
            "Marble",
            "Vitrified",
            "Mosaic",
            "Wooden",
            "Granite",
            "Normal Tiles",
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
// Middleware to populate `propertyName` before saving
PropertyRestrictionsSchema.pre("save", async function (next) {
    const propertyRestrictions = this;
    if (propertyRestrictions.property) {
        // Fetch the associated property document
        const property = await (0, mongoose_1.model)("Property").findById(propertyRestrictions.property);
        if (property) {
            propertyRestrictions.propertyName = property.propertyName; // Dynamically assign propertyName
        }
    }
    next();
});
// Define and export the PropertyRestrictions model
const PropertyRestrictions = mongoose_1.models.PropertyRestrictions ||
    (0, mongoose_1.model)("PropertyRestrictions", PropertyRestrictionsSchema);
exports.default = PropertyRestrictions;
