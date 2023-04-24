import express from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import router from "./routes/router";
import { currentUser, errorHandler, NotFoundError } from "@akbar0102/common";
const app = express();
app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
    maxAge: 12 * 60 * 60 * 1000,
  })
);
app.use(currentUser);
app.use("/api/users", router);
app.all("*", (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
