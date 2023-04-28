import mongoose from "mongoose";
interface CategoryAttrs {
    name: String;
}
interface CategoryDoc extends mongoose.Document {
    name: String;
}
interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(product: CategoryAttrs): CategoryDoc;
}
declare const Category: CategoryModel;
export default Category;
