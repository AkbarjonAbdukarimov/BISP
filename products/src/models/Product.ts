import mongoose, { mongo } from "mongoose";

interface ProductAttrs {
  name: String;
  price: Number;
  images: Array<String> | null;
  qty: Number;
  categories: Array<String>;
}
interface ProductDoc extends mongoose.Document {
  name: String;
  price: Number;
  images: Array<String>;
  qty: Number;
  categories: Array<String>;
}
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(product: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: { type: Number, reuired: true },
    images: { type: [] },
    qty: { type: Number, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

productSchema.statics.build = (attrs: ProductAttrs) => new Product(attrs);

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export default Product;
