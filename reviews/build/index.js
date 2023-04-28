"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const app_1 = require("./app");
const natsClinet_1 = __importDefault(require("./natsClinet"));
const postCreatedListener_1 = require("./listeners/postCreatedListener");
const postUpdatedListener_1 = require("./listeners/postUpdatedListener");
const postDeletedListener_1 = require("./listeners/postDeletedListener");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.set("strictQuery", false);
    console.log("Starting up................");
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    try {
        yield natsClinet_1.default.connect("manzil", "reviewSrvId", "http://nats-srv:4222");
        natsClinet_1.default.client.on("close", () => {
            console.log("NATS connection closed!");
            process.exit();
        });
        process.on("SIGINT", () => natsClinet_1.default.client.close());
        process.on("SIGTERM", () => natsClinet_1.default.client.close());
        new postCreatedListener_1.PostCreatedListener(natsClinet_1.default.client).listen();
        new postUpdatedListener_1.PostUpdatedListener(natsClinet_1.default.client).listen();
        new postDeletedListener_1.PostDeletedListener(natsClinet_1.default.client).listen();
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDb");
        app_1.app.listen(3000, () => {
            console.log("Listening on  3000");
        });
    }
    catch (err) {
        //@ts-ignore
        console.error(err.message, err);
        console.log("-------------------------------------");
    }
});
start();
