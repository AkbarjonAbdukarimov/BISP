import mongoose from "mongoose";
interface PostAttrs {
    id: string;
    name: String;
    description: String;
    author: String;
    images: Array<{
        name: string;
        fileId: string;
    }> | null;
    services: Array<String>;
    categories: Array<String>;
    reviews: Array<String>;
}
interface PostDoc extends mongoose.Document {
    id: string;
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
    reviews: Array<String>;
}
interface PostModel extends mongoose.Model<PostDoc> {
    build(post: PostAttrs): PostDoc;
}
declare const Post: PostModel;
export default Post;
