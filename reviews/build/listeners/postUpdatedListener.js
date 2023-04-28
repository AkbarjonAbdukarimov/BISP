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
exports.PostUpdatedListener = void 0;
const common_1 = require("@akbar0102/common");
const queGroup_1 = require("./queGroup");
const Post_1 = __importDefault(require("../models/Post"));
class PostUpdatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subject.PostUpdated;
        this.queueGroupName = queGroup_1.queueGroupName;
    }
    onMessage(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, author, version } = data;
            //@ts-ignore
            const post = yield Post_1.default.findByEvent({ id, version });
            if (!post) {
                throw new common_1.NotFoundError();
            }
            post.set({
                name,
                author,
            });
            yield post.save();
            msg.ack();
        });
    }
}
exports.PostUpdatedListener = PostUpdatedListener;
