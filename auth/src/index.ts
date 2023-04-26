import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { app } from "./app";

const start = async () => {
  console.log("Starting up........");
  mongoose.set("strictQuery", false);
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error("MongoDB connection Error", err);
  }
  app.listen(3000, () => {
    console.log("Listening on  3000");
  });
};

start();
