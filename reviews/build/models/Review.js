"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    postId: { type: String, required: true },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
ReviewSchema.statics.build = (attrs) => new Review(attrs);
const Review = mongoose_1.default.model("Review", ReviewSchema);
exports.default = Review;
