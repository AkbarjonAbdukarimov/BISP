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
exports.ReviewRoutes = void 0;
const common_1 = require("@akbar0102/common");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Review_1 = __importDefault(require("../models/Review"));
const Post_1 = __importDefault(require("../models/Post"));
const reviewCreated_1 = require("../publisher/reviewCreated");
const natsClinet_1 = __importDefault(require("../natsClinet"));
const router = (0, express_1.Router)();
exports.ReviewRoutes = router;
router.put("/update/:id", common_1.currentUser, common_1.requireAuth, [
    (0, express_validator_1.body)("comment")
        .trim()
        .notEmpty()
        .withMessage("Please provide valid feedback"),
    (0, express_validator_1.body)("rating")
        .notEmpty()
        .isNumeric()
        .withMessage("Please Provide Rating in range from 0 to 5"),
], (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const review = yield Review_1.default.findById(id);
    if (!review)
        throw new common_1.NotFoundError("Review Not Found");
    if ((review === null || review === void 0 ? void 0 : review.author) !== ((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id))
        res.status(403).send({
            errors: [{ message: "You are not own this" }],
        });
    const { rating, comment } = req.body;
    review.set({ rating, comment, date: new Date() });
    yield review.save();
    // review updated publisher
    res.send(review);
})));
router.delete("/delete/:id", common_1.currentUser, common_1.requireAuth, (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const review = yield Review_1.default.findById(req.params.id);
    if (!review)
        throw new common_1.NotFoundError("Review not fouind");
    if ((review === null || review === void 0 ? void 0 : review.author) !== ((_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.id))
        res.status(403).send({
            errors: [{ message: "You are not own this" }],
        });
    const delRev = yield Review_1.default.findByIdAndDelete(req.params.id);
    res.send(delRev);
})));
router.post("/post/:postId/create", common_1.currentUser, common_1.requireAuth, [
    (0, express_validator_1.body)("comment")
        .trim()
        .notEmpty()
        .withMessage("Please provide valid feedback"),
    (0, express_validator_1.body)("rating")
        .notEmpty()
        .isNumeric()
        .withMessage("Please Provide Rating in range from 0 to 5"),
], (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { postId } = req.params;
    const post = yield Post_1.default.findOne({ postId: postId });
    console.log("post is", post);
    if (!post)
        throw new common_1.NotFoundError("Post Not Found");
    const { rating, comment } = req.body;
    const review = Review_1.default.build({
        rating,
        comment,
        //@ts-ignore
        author: (_c = req.currentUser) === null || _c === void 0 ? void 0 : _c.id,
        postId,
        date: new Date(),
    });
    yield review.save();
    //@ts-ignore
    new reviewCreated_1.ReviewCreatedPublisher(natsClinet_1.default.client).publish({
        id: review.id,
        postId,
        review: review.comment,
        reating: review.rating,
        author: review.author,
        version: review.version,
    });
    res.send(review);
})));
router.get("/post/:postId", (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({ postId: req.params.postId });
    res.send(reviews);
})));
