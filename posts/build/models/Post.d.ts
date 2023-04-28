import mongoose from "mongoose";
interface PostAttrs {
    name: String;
    description: String;
    author: String;
    images: Array<{
        name: string;
        fileId: string;
    }> | null;
    services: Array<String>;
    categories: Array<String>;
    reviews: Array<{
        reviewId: String;
        rating: Number;
    }>;
}
interface PostDoc extends mongoose.Document {
    name: String;
    description: String;
    author: String;
    images: Array<{
        name: string;
        fileId: string;
    }>;
    services: Array<String>;
    categories: Array<String>;
    version: number;
    reviews: Array<{
        reviewId: String;
        rating: Number;
    }>;
}
interface PostModel extends mongoose.Model<PostDoc> {
    build(post: PostAttrs): PostDoc;
}
declare const Post: PostModel;
export default Post;
