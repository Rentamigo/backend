"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the PropertyFeatures schema
const PropertyFeaturesSchema = new mongoose_1.Schema({
    property: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Property", // Reference to the Property collection
        required: [true, "Property reference is required"],
    },
    propertyName: {
        type: String,
        trim: true,
    },
    bedrooms: {
        type: Number,
        required: [true, "Number of bedrooms is required"],
        min: [1, "At least 1 bedroom is required"],
        max: [10, "A maximum of 10 bedrooms is allowed"],
    },
    bathrooms: {
        type: Number,
        required: [true, "Number of bathrooms is required"],
        min: [1, "At least 1 bathroom is required"],
        max: [10, "A maximum of 10 bathrooms is allowed"],
    },
    balconies: {
        type: Number,
        required: [true, "Number of balconies is required"],
        min: [0, "Minimum 0 balconies"],
        max: [10, "A maximum of 10 balconies is allowed"],
    },
    extraRooms: {
        type: [String],
        validate: {
            validator: (value) => value.every((room) => ["Study Room", "Servant Room", "Puja Room", "Theater Room", "Gym Room"].includes(room)),
            message: "Invalid extra room(s) provided",
        },
    },
    floorNumber: {
        type: Number,
        required: [true, "Floor number is required"],
        min: [0, "Floor number must be 0 or greater"],
    },
    totalFloors: {
        type: Number,
        required: [true, "Total number of floors is required"],
        min: [1, "At least 1 floor is required"],
    },
    superBuiltupArea: {
        type: Number,
        required: [true, "Super Built-up Area is required"],
        min: [1, "Super Built-up Area must be greater than 0"],
    },
    builtupArea: {
        type: Number,
        required: [true, "Built-up Area is required"],
        min: [1, "Built-up Area must be greater than 0"],
    },
    carpetArea: {
        type: Number,
        required: [true, "Carpet Area is required"],
        min: [1, "Carpet Area must be greater than 0"],
    },
    propertyAge: {
        type: String,
        required: [true, "Property age is required"],
        enum: ["<5 Years", "5-10 Years", ">10 Years"],
    },
    propertyDescription: {
        type: String,
        required: [true, "Property description is required"],
        trim: true,
        minlength: [10, "Description must be at least 10 characters long"],
        maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
// Middleware to populate `propertyName` before saving
PropertyFeaturesSchema.pre("save", async function (next) {
    const propertyFeatures = this;
    if (propertyFeatures.property) {
        // Fetch the associated property document
        const property = await (0, mongoose_1.model)("Property").findById(propertyFeatures.property);
        if (property) {
            propertyFeatures.propertyName = property.propertyName; // Dynamically assign propertyName
        }
    }
    next();
});
// Define and export the PropertyFeatures model
const PropertyFeatures = mongoose_1.models.PropertyFeatures ||
    (0, mongoose_1.model)("PropertyFeatures", PropertyFeaturesSchema);
exports.default = PropertyFeatures;
