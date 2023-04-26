import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { app } from "./app";
import natsClient from "./natsClinet";

const start = async () => {
  mongoose.set("strictQuery", false);
  console.log("Starting up........");

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await natsClient.connect("manzil", "clientID", "http://nats-srv:4222");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
    app.listen(3000, () => {
      console.log("Listening on  3000");
    });
  } catch (err) {
    //@ts-ignore
    console.error(err.message, err);
    console.log("---------------------------------------");
  }
};

start();
