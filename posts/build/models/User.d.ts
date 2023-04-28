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
declare const User: UserModel;
export default User;
