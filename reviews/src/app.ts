import {
  currentUser,
  CustomError,
  errorHandler,
  NotFoundError,
} from "@akbar0102/common";
import express, { json } from "express";
import { ProductsRoute } from "./routes/PostRoutes";
import jwt from "jsonwebtoken";
import cookieSession from "cookie-session";
const app = express();

app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
    maxAge: 12 * 60 * 60 * 1000,
  })
);
app.use(json());
app.set("trust proxy", true);
app.use(currentUser);

app.use("/api/posts", ProductsRoute);
app.all("*", (req, res) => {
  console.log("not found");
  throw new NotFoundError();
});
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
});

export { app };
