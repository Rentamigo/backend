"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the FlatAmenities schema
const FlatAmenitiesSchema = new mongoose_1.Schema({
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
    selectedAmenities: {
        type: [String],
        validate: {
            validator: (value) => value.every((amenity) => [
                "Air Conditioner",
                "Bed",
                "Wardrobe",
                "TV",
                "Refrigerator",
                "Washing Machine",
                "Microwave",
                "Sofa",
                "Dining Table",
                "Gas Connection",
                "Play Station",
            ].includes(amenity)),
            message: "Invalid amenity provided",
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
// Middleware to populate `propertyName` before saving
FlatAmenitiesSchema.pre("save", async function (next) {
    const flatAmenities = this;
    if (flatAmenities.property) {
        // Fetch the associated property document
        const property = await (0, mongoose_1.model)("Property").findById(flatAmenities.property);
        if (property) {
            flatAmenities.propertyName = property.propertyName; // Dynamically assign propertyName
        }
    }
    next();
});
// Define and export the FlatAmenities model
const FlatAmenities = mongoose_1.models.FlatAmenities || (0, mongoose_1.model)("FlatAmenities", FlatAmenitiesSchema);
exports.default = FlatAmenities;
