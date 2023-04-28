"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: { type: Number, reuired: true },
    images: { type: [] },
    qty: { type: Number, required: true },
    categories: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category" }],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
productSchema.statics.build = (attrs) => new Product(attrs);
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
