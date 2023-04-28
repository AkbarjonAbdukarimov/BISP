import mongoose from "mongoose";
interface UserAttrs {
    email: string;
    password: string;
}
interface UserModel extends mongoose.Model<UserDoc> {
    build(user: UserAttrs): UserDoc;
}
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}
declare const User: UserModel;
export default User;
