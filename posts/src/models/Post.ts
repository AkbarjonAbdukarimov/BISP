import mongoose, { mongo } from "mongoose";

interface PostAttrs {
  name: String;
  description: String;
  author: mongoose.Schema.Types.ObjectId;
  images: Array<{ name: string; fileId: string }> | null;
  services: Array<String>;
  categories: Array<String>;
  reviews: Array<{ reviewId: String; rating: Number }>;
}
interface PostDoc extends mongoose.Document {
  name: String;
  description: String;
  author: mongoose.Schema.Types.ObjectId;
  images: Array<{ name: string; fileId: string }>;
  services: Array<String>;
  categories: Array<String>;
  version: number;
  reviews: Array<{ reviewId: String; rating: Number }>;
}
interface PostModel extends mongoose.Model<PostDoc> {
  build(post: PostAttrs): PostDoc;
}

const PostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    images: { type: [] },
    services: { type: [], required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    categories: [{ type: String }],
    reviews: [],
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

PostSchema.statics.build = (attrs: PostAttrs) => new Post(attrs);

const Post = mongoose.model<PostDoc, PostModel>("Post", PostSchema);

export default Post;
