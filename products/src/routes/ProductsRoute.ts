import {
  BadRequestError,
  catchAsync,
  NotFoundError,
  requireAuth,
} from "@akbar0102/common";
import { Router } from "express";
import { file } from "googleapis/build/src/apis/file";

import multer, { MulterError } from "multer";
import { deleteFiles, uploadFile } from "../utils/cloud";
import Product from "../models/Product";
import { body } from "express-validator";

const upload = multer();
const router = Router();

router.post(
  "/create",
  //  requireAuth,
  [
    body("name").trim().notEmpty().withMessage("Please give Product name"),
    body("price")
      .trim()
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("qty")
      .trim()
      .isFloat({ gt: 0 })
      .withMessage("Quantity must be greater than 0"),
  ],
  upload.array("images"),
  catchAsync(async (req, res, next) => {
    const { body, files } = req;
    let uploadedFiles: String[] = [];
    if (!files || files.length === 0) {
      throw new BadRequestError("Please upload Images");
    }
    if (files.length > 5) {
      throw new BadRequestError("Can't upload more than 5 files");
    }
    //@ts-ignore
    const imgs: Number = files.length - 1;
    for (let i = 0; i <= imgs; i++) {
      //@ts-ignore
      const file = await uploadFile(files[i]);
      //@ts-ignore
      uploadedFiles.push(file.id);
    }
    const { name, price, qty, categories } = body;
    const product = Product.build({
      name,
      price,
      qty,
      images: uploadedFiles,
      categories,
    });
    await product.save();
    res.status(201).send({
      product,
    });
  })
);
router.get(
  "/",
  catchAsync(async (req, res) => {
    const { name, minPrice, maxPrice, id } = req.query;

    let query = {
      price: { $lte: maxPrice || 1000000000, $gte: minPrice || 0 },
    };
    if (name) {
      //@ts-ignore
      query = { ...query, name: { $regex: new RegExp(name, "i") } };
    }
    if (id) {
      //@ts-ignore
      query = { _id: id };
    }
    const products = await Product.find(query);
    if (products.length === 0) {
      throw new NotFoundError(`Product${id ? "" : "s"} Not Found`);
    }
    res.send(products);
  })
);
router.put(
  "/update/:id",
  [
    body("name").trim().notEmpty().withMessage("Please give Product name"),
    body("price")
      .trim()
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("qty")
      .trim()
      .isFloat({ gt: 0 })
      .withMessage("Quantity must be greater than 0"),
  ],
  upload.array("images"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, qty, price, categories, deletedImages } = req.body;
    const { files } = req;

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError("Product Not Found");
    }
    let delImgs: String[] = [...product.images];

    //@ts-ignore

    deletedImages.forEach((element) => {
      delImgs = delImgs.filter((j) => j !== element);
    });

    //@ts-ignore
    deletedImages.forEach(async (i) => {
      await deleteFiles(i);
    });
    if (deletedImages && deletedImages.length > 0) {
      if (deletedImages.length === product.images.length) {
        if (!files || files.length === 0) {
          throw new BadRequestError("Please upload Images");
        }
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
    product.price = price;
    product.qty = qty;
    if (categories && categories.length > 0) {
      product.categories = categories;
    }
    //@ts-ignore
    product.images = delImgs;
    await product.save();
    res.send(product);
  })
);
router.delete(
  "/delete/:id",
  catchAsync(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) throw new NotFoundError("Product Not Found");
    deletedProduct.images.forEach(async (i) => {
      await deleteFiles(i);
    });
    res.send(deletedProduct);
  })
);

export { router as ProductsRoute };
