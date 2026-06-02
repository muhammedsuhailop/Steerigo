"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingModel = void 0;
const ReviewType_1 = require("@domain/value-objects/ReviewType");
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    rideId: {
        type: String,
        ref: "Ride",
        required: true,
        index: true,
    },
    reviewerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    reviewerName: {
        type: String,
        required: true,
        trim: true,
    },
    revieweeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    reviewType: {
        type: String,
        enum: Object.values(ReviewType_1.ReviewType),
        required: true,
        index: true,
    },
    criteria: {
        type: Map,
        of: Number,
        required: true,
    },
    overallRating: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
        min: 0,
        max: 5,
        index: true,
    },
    review: {
        type: String,
        maxlength: 500,
        trim: true,
    },
}, { timestamps: true });
ratingSchema.index({ rideId: 1, reviewerId: 1 }, { unique: true });
ratingSchema.index({ revieweeId: 1, createdAt: -1 });
ratingSchema.index({ reviewType: 1, createdAt: -1 });
exports.RatingModel = (0, mongoose_1.model)("Rating", ratingSchema);
//# sourceMappingURL=RatingModel.js.map