"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const body_parser_1 = require("body-parser");
const router_1 = __importDefault(require("./routes/router"));
const common_1 = require("@akbar0102/common");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, body_parser_1.json)());
app.set("trust proxy", true);
app.use((0, cookie_session_1.default)({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
    maxAge: 12 * 60 * 60 * 1000,
}));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(common_1.currentUser);
app.use("/api/users", router_1.default);
app.all("*", (req, res) => {
    throw new common_1.NotFoundError();
});
app.use(common_1.errorHandler);
