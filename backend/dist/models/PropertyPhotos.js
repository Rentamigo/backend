"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the PhotoUpload schema
const PhotoUploadSchema = new mongoose_1.Schema({
    property: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Property",
        required: [true, "Property reference is required"],
        index: true,
    },
    propertyName: {
        type: String,
        required: false,
        trim: true,
    },
    photos: {
        coverImage: { type: String, default: null },
        exteriorView: { type: String, default: null },
        livingRoom: { type: String, default: null },
        kitchen: { type: String, default: null },
        diningRoom: { type: String, default: null },
        utilityArea: { type: String, default: null },
        others: { type: String, default: null },
        propertyVideo: { type: String, default: null },
        bedrooms: { type: Map, of: String, default: {} },
        bathrooms: { type: Map, of: String, default: {} },
        balconies: { type: Map, of: String, default: {} },
        extraRooms: { type: Map, of: String, default: {} },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Middleware to populate `propertyName` before saving
PhotoUploadSchema.pre("save", async function (next) {
    const photoUpload = this;
    if (photoUpload.property) {
        try {
            const property = await (0, mongoose_1.model)("Property").findById(photoUpload.property);
            if (property) {
                photoUpload.propertyName = property.propertyName;
            }
            else {
                console.error(`Property with ID ${photoUpload.property} not found.`);
            }
        }
        catch (error) {
            console.error(`Error fetching property: ${error}`);
            return next(error);
        }
    }
    next();
});
// Define and export the PhotoUpload model
const PhotoUpload = mongoose_1.models.PhotoUpload || (0, mongoose_1.model)("PhotoUpload", PhotoUploadSchema);
exports.default = PhotoUpload;
