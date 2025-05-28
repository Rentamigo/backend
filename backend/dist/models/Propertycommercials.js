"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the PropertyCommercials schema
const PropertyCommercialsSchema = new mongoose_1.Schema({
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
    monthlyRent: {
        type: String,
        required: [true, "Monthly rent is required"],
    },
    maintenance: {
        type: String,
        required: [true, "Maintenance status is required"],
        enum: ["Included", "Excluded"],
    },
    maintenanceAmount: {
        type: String,
        required: function () {
            return this.maintenance === "Excluded";
        },
    },
    securityDeposit: {
        type: String,
        required: [true, "Security deposit is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
// Middleware to populate `propertyName` before saving
PropertyCommercialsSchema.pre("save", async function (next) {
    const propertyCommercials = this;
    if (propertyCommercials.property) {
        // Fetch the associated property document
        const property = await (0, mongoose_1.model)("Property").findById(propertyCommercials.property);
        if (property) {
            propertyCommercials.propertyName = property.propertyName; // Dynamically assign propertyName
        }
    }
    next();
});
// Define and export the PropertyCommercials model
const PropertyCommercials = mongoose_1.models.PropertyCommercials ||
    (0, mongoose_1.model)("PropertyCommercials", PropertyCommercialsSchema);
exports.default = PropertyCommercials;
