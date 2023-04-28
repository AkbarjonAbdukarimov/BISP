"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRoute = void 0;
const common_1 = require("@akbar0102/common");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloud_1 = require("../utils/cloud");
const Post_1 = __importDefault(require("../models/Post"));
const express_validator_1 = require("express-validator");
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
exports.ProductsRoute = router;
router.post("/create", 
//  requireAuth,
[
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Please give Product name"),
    (0, express_validator_1.body)("price")
        .trim()
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),
    (0, express_validator_1.body)("qty")
        .trim()
        .isFloat({ gt: 0 })
        .withMessage("Quantity must be greater than 0"),
], upload.array("images"), (0, common_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, files } = req;
    let uploadedFiles = [];
    if (!files || files.length === 0) {
        throw new common_1.BadRequestError("Please upload Images");
    }
    if (files.length > 5) {
        throw new common_1.BadRequestError("Can't upload more than 5 files");
    }
    //@ts-ignore
    const imgs = files.length - 1;
    for (let i = 0; i <= imgs; i++) {
        //@ts-ignore
        const file = yield (0, cloud_1.uploadFile)(files[i]);
        //@ts-ignore
        uploadedFiles.push(file.id);
    }
    const { name, price, qty, categories } = body;
    const product = Post_1.default.build({
        name,
        price,
        qty,
        images: uploadedFiles,
        categories,
    });
    yield product.save();
    res.status(201).send({
        product,
    });
})));
router.get("/", (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, minPrice, maxPrice, id } = req.query;
    let query = {
        price: { $lte: maxPrice || 1000000000, $gte: minPrice || 0 },
    };
    if (name) {
        //@ts-ignore
        query = Object.assign(Object.assign({}, query), { name: { $regex: new RegExp(name, "i") } });
    }
    if (id) {
        //@ts-ignore
        query = { _id: id };
    }
    const products = yield Post_1.default.find(query);
    if (products.length === 0) {
        throw new common_1.NotFoundError(`Product${id ? "" : "s"} Not Found`);
    }
    res.send(products);
})));
router.put("/update/:id", [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Please give Product name"),
    (0, express_validator_1.body)("price")
        .trim()
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),
    (0, express_validator_1.body)("qty")
        .trim()
        .isFloat({ gt: 0 })
        .withMessage("Quantity must be greater than 0"),
], upload.array("images"), (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, qty, price, categories, deletedImages } = req.body;
    const { files } = req;
    const product = yield Post_1.default.findById(id);
    if (!product) {
        throw new common_1.NotFoundError("Product Not Found");
    }
    let delImgs = [...product.images];
    //@ts-ignore
    deletedImages.forEach((element) => {
        delImgs = delImgs.filter((j) => j !== element);
    });
    //@ts-ignore
    deletedImages.forEach((i) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, cloud_1.deleteFiles)(i);
    }));
    if (deletedImages && deletedImages.length > 0) {
        if (deletedImages.length === product.images.length) {
            if (!files || files.length === 0) {
                throw new common_1.BadRequestError("Please upload Images");
            }
            if (files.length > 5) {
                throw new common_1.BadRequestError("Can't upload more than 5 files");
            }
            //@ts-ignore
            for (let i = 0; i <= files.length; i++) {
                //@ts-ignore
                const file = yield (0, cloud_1.uploadFile)(files[i]);
                //@ts-ignore
                delImgs.push(file.id);
            }
        }
    }
    product.name = name;
    product.price = price;
    product.qty = qty;
    if (categories && categories.length > 0) {
        product.categories = categories;
    }
    //@ts-ignore
    product.images = delImgs;
    yield product.save();
    res.send(product);
})));
router.delete("/delete/:id", (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProduct = yield Post_1.default.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
        throw new common_1.NotFoundError("Product Not Found");
    deletedProduct.images.forEach((i) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, cloud_1.deleteFiles)(i);
    }));
    res.send(deletedProduct);
})));
