import mongoose from "mongoose";

interface PostAttrs {
  name: String;
  description: String;
  author: mongoose.Schema.Types.ObjectId;
  images: Array<{ name: string; fileId: string }> | null;
  services: Array<String>;
  categories: Array<String>;
  reviews: Array<String>;
}
interface PostDoc extends mongoose.Document {
  name: String;
  description: String;
  author: mongoose.Schema.Types.ObjectId;
  images: Array<{ name: string; fileId: string }>;
  services: Array<String>;
  categories: Array<String>;
  version: number;
  reviews: Array<String>;
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
    services: { type: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    categories: [{ type: String }],
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
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
PostSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Post.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
PostSchema.statics.build = (attrs: PostAttrs) => new Post(attrs);

const Post = mongoose.model<PostDoc, PostModel>("Post", PostSchema);

export default Post;
