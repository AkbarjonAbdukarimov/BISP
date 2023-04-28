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
const imagekit_1 = __importDefault(require("imagekit"));
const postCreated_1 = require("../publisher/postCreated");
const natsClinet_1 = __importDefault(require("../natsClinet"));
const postUpdated_1 = require("../publisher/postUpdated");
const postDeleted_1 = require("../publisher/postDeleted");
const imagekit = new imagekit_1.default({
    //@ts-ignore
    urlEndpoint: process.env.IMAGE_KIT_URL,
    //@ts-ignore
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    //@ts-ignore
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
exports.ProductsRoute = router;
router.get("/", (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, categories, id } = req.query;
    let query = {};
    if (name) {
        //@ts-ignore
        query = Object.assign(Object.assign({}, query), { name: { $regex: new RegExp(name, "i") } });
    }
    if (id) {
        //@ts-ignore
        query = { _id: id };
    }
    //@ts-ignore
    if (categories && categories.length > 0) {
        query = Object.assign(Object.assign({}, query), { categories: { $in: categories } });
    }
    const products = yield Post_1.default.find(query);
    // if (products.length === 0) {
    //   throw new NotFoundError(`Product${id ? "" : "s"} Not Found`);
    // }
    res.send(products);
})));
router.post("/create", common_1.currentUser, common_1.requireAuth, [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Please give Business Name"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("Please give Business Description"),
    (0, express_validator_1.body)("categories")
        .notEmpty()
        .withMessage("Please Select Business Category"),
    (0, express_validator_1.body)("services")
        .notEmpty()
        .withMessage("Please Provide Services Business Offers"),
], upload.array("images"), (0, common_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, files } = req;
    let uploadedFiles = [];
    if (!files || files.length === 0) {
        throw new common_1.BadRequestError("Please upload Images");
    }
    //@ts-ignore
    if (files.length > 5) {
        throw new common_1.BadRequestError("Can't upload more than 5 files");
    }
    //@ts-ignore
    for (let i = 0; i < files.length; i++) {
        //@ts-ignore
        const file = files[i];
        const res = yield imagekit.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
            useUniqueFileName: true,
            extensions: [
                {
                    name: "google-auto-tagging",
                    maxTags: 5,
                    minConfidence: 95,
                },
            ],
        });
        uploadedFiles.push({ name: res.name, fileId: res.fileId });
    }
    const { name, description, services, categories } = body;
    const product = Post_1.default.build({
        name: name,
        description: description,
        images: uploadedFiles,
        services: services,
        //@ts-ignore
        author: req.currentUser.id,
        categories: categories,
        reviews: [],
    });
    yield product.save();
    new postCreated_1.PostCreatedPublisher(natsClinet_1.default.client).publish({
        //@ts-ignore
        id: product.id,
        name: product.name,
        author: product.author,
        version: product.version, //@ts-ignore
    });
    res.status(201).send(product);
})));
router.put("/update/:id", common_1.currentUser, common_1.requireAuth, [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Please give Business Name"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("Please give Business Description"),
    (0, express_validator_1.body)("categories")
        .notEmpty()
        .withMessage("Please Select Business Category"),
    (0, express_validator_1.body)("services")
        .notEmpty()
        .withMessage("Please Provide Services Business Offers"),
], upload.array("images"), (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, description, services, categories, deletedImages } = req.body;
    const { files } = req;
    const product = yield Post_1.default.findById(id);
    if (!product) {
        throw new common_1.NotFoundError("Product Not Found");
    }
    //@ts-ignore
    if (product.author !== ((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id))
        res.status(403).send({
            errors: [{ message: "You are not own this" }],
        });
    let delImgs = [...product.images];
    //@ts-ignore
    deletedImages.forEach((element) => {
        imagekit.deleteFile(element.fileId).then((response) => {
            console.log(response);
        });
    });
    //@ts-ignore
    deletedImages.forEach((i) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, cloud_1.deletefiles)(i);
    }));
    if (deletedImages && deletedImages.length > 0) {
        if (deletedImages.length === product.images.length) {
            if (!files || files.length === 0) {
                throw new common_1.BadRequestError("Please upload Images");
            }
            //@ts-ignore
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
    product.description = description;
    product.services = services;
    if (categories && categories.length > 0) {
        product.categories = categories;
    }
    //@ts-ignore
    product.images = delImgs;
    yield product.save();
    new postUpdated_1.PostUpdatedPublisher(natsClinet_1.default.client).publish({
        //@ts-ignore
        id: post.id,
        name: post.name,
        author: post.author,
        version: post.version,
        description: post.description,
    });
    res.send(product);
})));
router.delete("/delete/:id", common_1.currentUser, common_1.requireAuth, (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const pr = yield Post_1.default.findById(req.params.id);
    if (!pr)
        throw new common_1.NotFoundError("Product Not Found");
    //@ts-ignore
    if ((pr === null || pr === void 0 ? void 0 : pr.author) !== ((_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.id))
        res.status(403).send({
            errors: [{ message: "You are not own this" }],
        });
    const deletedProduct = yield Post_1.default.findByIdAndDelete(req.params.id);
    //@ts-ignore
    pr.images.forEach((i) => __awaiter(void 0, void 0, void 0, function* () {
        imagekit
            .deleteFile(i.fileId)
            .then((response) => {
            console.log(response);
        })
            .catch((error) => {
            console.log(error);
        });
    }));
    //@ts-ignore
    new postDeleted_1.PostDeletedPublisher(natsClinet_1.default.client).publish({
        //@ts-ignore
        id: pr.id,
        author: pr === null || pr === void 0 ? void 0 : pr.author,
    });
    res.send(deletedProduct);
})));
