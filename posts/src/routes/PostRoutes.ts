import {
  BadRequestError,
  catchAsync,
  NotFoundError,
  requireAuth,
} from "@akbar0102/common";
import { Router } from "express";

import multer, { MulterError } from "multer";
import { deletefiles, uploadFile } from "../utils/cloud";
import Product from "../models/Post";
import { body } from "express-validator";
import mongoose from "mongoose";

import ImageKit from "imagekit";
import { PostCreatedPublisher } from "../publisher/postCreated";
import natsClient from "../natsClinet";
import { PostUpdatedPublisher } from "../publisher/postUpdated";

const imagekit = new ImageKit({
  //@ts-ignore
  urlEndpoint: process.env.IMAGE_KIT_URL,
  //@ts-ignore
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  //@ts-ignore
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const { name, categories, id } = req.query;

    let query = {};
    if (name) {
      //@ts-ignore
      query = { ...query, name: { $regex: new RegExp(name, "i") } };
    }
    if (id) {
      //@ts-ignore
      query = { _id: id };
    }
    //@ts-ignore
    if (categories && categories.length > 0) {
      query = { ...query, categories: { $in: categories } };
    }
    const products = await Product.find(query);
    // if (products.length === 0) {
    //   throw new NotFoundError(`Product${id ? "" : "s"} Not Found`);
    // }
    res.send(products);
  })
);
router.post(
  "/create",
  requireAuth,
  [
    body("name").trim().notEmpty().withMessage("Please give Business Name"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Please give Business Description"),
    body("categories")
      .notEmpty()
      .withMessage("Please Select Business Category"),
    body("services")
      .notEmpty()
      .withMessage("Please Provide Services Business Offers"),
  ],
  upload.array("images"),

  catchAsync(async (req, res, next) => {
    const { body, files } = req;
    let uploadedFiles: { name: string; fileId: string }[] = [];
    if (!files || files.length === 0) {
      throw new BadRequestError("Please upload Images");
    }
    //@ts-ignore
    if (files.length > 5) {
      throw new BadRequestError("Can't upload more than 5 files");
    }
    //@ts-ignore
    const imgs: number = -1;

    //@ts-ignore
    for (let i = 0; i < files.length; i++) {
      //@ts-ignore
      const file = files[i];
      const res = await imagekit.upload({
        file: file.buffer.toString("base64"), //required
        fileName: file.originalname, //required
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
    const product = Product.build({
      name: name,
      description: description,
      images: uploadedFiles,
      services: services,
      //@ts-ignore
      //author: req.currentUser.id
      author: new mongoose.Types.ObjectId(),
      categories: categories,
    });
    await product.save();
    new PostCreatedPublisher(natsClient.client).publish({
      //@ts-ignore
      id: post.id, //@ts-ignore
      name: post.name, //@ts-ignore
      author: post.author, //@ts-ignore
      version: post.version, //@ts-ignore
    });
    res.status(201).send(product);
  })
);

router.put(
  "/update/:id",
  requireAuth,
  [
    body("name").trim().notEmpty().withMessage("Please give Business Name"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Please give Business Description"),
    body("categories")
      .notEmpty()
      .withMessage("Please Select Business Category"),
    body("services")
      .notEmpty()
      .withMessage("Please Provide Services Business Offers"),
  ],
  upload.array("images"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, description, services, categories, deletedImages } = req.body;
    const { files } = req;

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError("Product Not Found");
    }
    let delImgs: { name: string; fileId: string }[] = [...product.images];

    //@ts-ignore

    deletedImages.forEach((element) => {
      imagekit.deleteFile(element.fileId).then((response) => {
        console.log(response);
      });
    });

    //@ts-ignore
    deletedImages.forEach(async (i) => {
      await deletefiles(i);
    });
    if (deletedImages && deletedImages.length > 0) {
      if (deletedImages.length === product.images.length) {
        if (!files || files.length === 0) {
          throw new BadRequestError("Please upload Images");
        }
        //@ts-ignore
        if (files.length > 5) {
          throw new BadRequestError("Can't upload more than 5 files");
        }
        //@ts-ignore
        for (let i = 0; i <= files.length; i++) {
          //@ts-ignore
          const file = await uploadFile(files[i]);
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
    await product.save();
    new PostUpdatedPublisher(natsClient.client).publish({
      //@ts-ignore
      id: post.id, //@ts-ignore
      name: post.name, //@ts-ignore
      author: post.author, //@ts-ignore
      version: post.version, //@ts-ignore
      description: post.description,
    });
    res.send(product);
  })
);
router.delete(
  "/delete/:id",
  requireAuth,
  catchAsync(async (req, res) => {
    const pr = await Product.findById(req.params.id);
    if (!pr) throw new NotFoundError("Product Not Found");
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    //@ts-ignore
    pr.images.forEach(async (i) => {
      imagekit
        .deleteFile(i.fileId)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    res.send(deletedProduct);
  })
);

export { router as ProductsRoute };
