import mongoose from "mongoose";
interface ReviewAttrs {
    rating: Number;
    comment: String;
    author: String;
    date: Date;
    postId: String;
    version: number;
}
interface ReviewDoc extends mongoose.Document {
    rating: Number;
    comment: String;
    author: String;
    date: Date;
    postId: String;
    version: number;
}
interface ReviewModel extends mongoose.Model<ReviewDoc> {
    build(Review: ReviewAttrs): ReviewDoc;
}
declare const Review: ReviewModel;
export default Review;
