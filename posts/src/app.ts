import { errorHandler, NotFoundError } from "@akbar0102/common";
import express, { json } from "express";
import { ProductsRoute } from "./routes/ProductsRoute";
const app = express();

app.use(json());
app.set("trust proxy", true);
app.use("/api/products", ProductsRoute);
app.all("*", (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
