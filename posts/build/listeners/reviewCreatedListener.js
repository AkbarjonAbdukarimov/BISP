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
exports.ReviewCreatedListener = void 0;
const common_1 = require("@akbar0102/common");
const queGroup_1 = require("./queGroup");
const Post_1 = __importDefault(require("../models/Post"));
const postUpdated_1 = require("../publisher/postUpdated");
class ReviewCreatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subject.ReviewCreated;
        this.queueGroupName = queGroup_1.queueGroupName;
    }
    onMessage(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findById(data.postId);
            if (!post) {
                throw new common_1.NotFoundError("Post not found");
            }
            post.reviews.push({ reviewId: data.id, rating: data.reating });
            yield post.save();
            yield new postUpdated_1.PostUpdatedPublisher(this.client).publish({
                id: post.id,
                version: post.version,
                //@ts-ignore
                name: post.name,
                //@ts-ignore
                description: post.description,
                //@ts-ignore
                author: post.author,
            });
            // ack the message
            msg.ack();
        });
    }
}
exports.ReviewCreatedListener = ReviewCreatedListener;
