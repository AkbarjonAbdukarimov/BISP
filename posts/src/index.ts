import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { app } from "./app";
import natsClient from "./natsClinet";
import { ReviewCreatedListener } from "./listeners/reviewCreatedListener";
const port = 3000;
const start = async () => {
  mongoose.set("strictQuery", false);
  console.log("Starting up........");

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    // await natsClient.connect("manzil", "posgSrvId", "http://nats-srv:4222");

    // natsClient.client.on("close", () => {
    //   console.log("NATS connection closed!");
    //   process.exit();
    // });
    // process.on("SIGINT", () => natsClient.client.close());
    // process.on("SIGTERM", () => natsClient.client.close());
    // new ReviewCreatedListener(natsClient.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
    app.listen(port, () => {
      console.log("Listening on " + port);
    });
  } catch (err) {
    //@ts-ignore
    console.error(err.message, err);
    console.log("-------------------------------------");
  }
};

start();
