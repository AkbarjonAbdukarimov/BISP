import mongoose, { mongo } from "mongoose";

interface CategoryAttrs {
  name: String;
}
interface CategoryDoc extends mongoose.Document {
  name: String;
}
interface CategoryModel extends mongoose.Model<CategoryDoc> {
  build(product: CategoryAttrs): CategoryDoc;
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
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

categorySchema.statics.build = (attrs: CategoryAttrs) => new Category(attrs);

const Category = mongoose.model<CategoryDoc, CategoryModel>(
  "Catecory",
  categorySchema
);

export default Category;
