"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    postId: String,
    name: {
        type: String,
        required: true,
    },
    description: String,
    images: { type: [] },
    services: { type: [] },
    author: { type: String },
    categories: [{ type: String }],
    reviews: [{ type: mongoose_1.default.Types.ObjectId, ref: "Review" }],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
PostSchema.statics.findByEvent = (event) => {
    return Post.findOne({
        postId: event.id,
    });
};
PostSchema.statics.build = (attrs) => new Post({
    postId: attrs.id,
    name: attrs.name,
    description: attrs.description,
    images: attrs.images,
    services: attrs.services,
    author: attrs.author,
    categories: attrs.categories,
    reviews: attrs.reviews,
});
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
