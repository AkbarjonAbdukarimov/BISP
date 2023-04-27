import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface PostAttrs {
  id: string;
  name: String;
  description: String;
  author: String;
  images: Array<{ name: string; fileId: string }> | null;
  services: Array<String>;
  categories: Array<String>;
  reviews: Array<String>;
}
interface PostDoc extends mongoose.Document {
  id: string;
  name: String;
  description: String;
  author: String;
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
    postId: String,
    name: {
      type: String,
      required: true,
    },
    description: String,
    images: { type: [] },
    services: { type: [] },
    author: { type: String },
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
    postId: event.id,
  });
};
PostSchema.statics.build = (attrs: PostAttrs) =>
  new Post({
    postId: attrs.id,
    name: attrs.name,
    description: attrs.description,
    images: attrs.images,
    services: attrs.services,
    author: attrs.author,
    categories: attrs.categories,
    reviews: attrs.reviews,
  });

const Post = mongoose.model<PostDoc, PostModel>("Post", PostSchema);

export default Post;
