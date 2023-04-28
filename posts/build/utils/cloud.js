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
exports.deletefiles = exports.uploadFile = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
var imagekit = new imagekit_1.default({
    publicKey: "public_2l80tUnD99sZdu//s8IpOj8f1tQ=",
    privateKey: "private_i9fi/GfZoQAtR65kGTVynH+vU5c=",
    urlEndpoint: "https://ik.imagekit.io/epvjvvihm",
});
const uploadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        return res;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.uploadFile = uploadFile;
const uploadedFile = (file) => {
    imagekit.upload({
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
    }, function (error, result) {
        if (error)
            console.log(error);
        else {
            console.log(result);
            return result;
        }
    });
};
const deletefiles = (file) => __awaiter(void 0, void 0, void 0, function* () {
    yield imagekit.deleteFile(file.fileId);
});
exports.deletefiles = deletefiles;
