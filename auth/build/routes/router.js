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
const common_1 = require("@akbar0102/common");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Password_1 = require("../Models/Password");
const User_1 = __importDefault(require("../Models/User"));
const router = (0, express_1.Router)();
router.post("/signup", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email Address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
], common_1.validateRequest, (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = User_1.default.build({ email, password });
    yield user.save();
    // Generate JWT
    const userJwt = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_KEY);
    // Store it on session object
    req.session = {
        jwt: userJwt,
    };
    res.status(201).send(user);
})));
router.post("/signin", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email Address"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
], common_1.validateRequest, (0, common_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw new common_1.BadRequestError("Invalid Credentials");
    }
    const passCheck = yield Password_1.Password.compare(user.password, password);
    if (!passCheck) {
        throw new common_1.BadRequestError("Invalid Credentials");
    }
    const userJwt = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_KEY);
    // Store it on session object
    req.session = {
        jwt: userJwt,
    };
    res.status(201).send(user);
})));
router.post("/signout", common_1.requireAuth, (req, res, next) => {
    req.session = null;
    res.send({ message: "sign out" });
});
router.get("/currentuser", common_1.currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});
exports.default = router;
