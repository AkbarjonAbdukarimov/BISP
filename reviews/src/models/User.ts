import mongoose from "mongoose";

export interface UserAttrs {
  email: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(user: UserAttrs): UserDoc;
}
interface UserDoc extends mongoose.Document {
  email: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export default User;
