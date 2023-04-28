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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const common_1 = require("@akbar0102/common");
const express_1 = __importStar(require("express"));
const PostRoutes_1 = require("./routes/PostRoutes");
const cookie_session_1 = __importDefault(require("cookie-session"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cookie_session_1.default)({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
    maxAge: 12 * 60 * 60 * 1000,
}));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, express_1.json)());
app.set("trust proxy", true);
app.use(common_1.currentUser);
app.use("/api/posts", PostRoutes_1.ProductsRoute);
app.all("*", (req, res) => {
    console.log("not found");
    throw new common_1.NotFoundError();
});
//@ts-ignore
app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof common_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(400).send({
        errors: [{ message: "Something went wrong" }],
    });
});
