"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    images: { type: [] },
    services: { type: [], required: true },
    author: String,
    categories: [{ type: String }],
    reviews: [],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
PostSchema.statics.build = (attrs) => new Post(attrs);
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
