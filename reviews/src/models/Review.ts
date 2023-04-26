import mongoose, { mongo } from "mongoose";

interface ReviewAttrs {
  rating: Number;
  comment: String;
  author: String;
  date: Date;
  postId: String;
}
interface ReviewDoc extends mongoose.Document {
  rating: Number;
  comment: String;
  author: String;
  date: Date;
  postId: String;
}
interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(Review: ReviewAttrs): ReviewDoc;
}

const ReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now },
    postId: { type: mongoose.Types.ObjectId, required: true },
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

ReviewSchema.statics.build = (attrs: ReviewAttrs) => new Review(attrs);
ReviewSchema.pre("save", function preSave(next) {
  //@ts-ignore
  this.date(Date.now());
  next();
});
const Review = mongoose.model<ReviewDoc, ReviewModel>("Review", ReviewSchema);

export default Review;
