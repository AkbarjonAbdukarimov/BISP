import {
  NotFoundError,
  catchAsync,
  currentUser,
  requireAuth,
} from "@akbar0102/common";
import { Router } from "express";

import { body } from "express-validator";
import Review from "../models/Review";
import Post from "../models/Post";
import { ReviewCreatedPublisher } from "../publisher/reviewCreated";
import natsClient from "../natsClinet";

const router = Router();
router.put(
  "/update/:id",
  currentUser,
  requireAuth,
  [
    body("comment")
      .trim()
      .notEmpty()
      .withMessage("Please provide valid feedback"),

    body("rating")
      .notEmpty()
      .isNumeric()
      .withMessage("Please Provide Rating in range from 0 to 5"),
  ],

  catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) throw new NotFoundError("Review Not Found");
    if (review?.author !== req.currentUser?.id)
      res.status(403).send({
        errors: [{ message: "You are not own this" }],
      });

    const { rating, comment } = req.body;
    review.set({ rating, comment, date: new Date() });
    await review.save();
    // review updated publisher
    res.send(review);
  })
);
router.delete(
  "/delete/:id",
  currentUser,
  requireAuth,
  catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw new NotFoundError("Review not fouind");
    if (review?.author !== req.currentUser?.id)
      res.status(403).send({
        errors: [{ message: "You are not own this" }],
      });
    const delRev = await Review.findByIdAndDelete(req.params.id);
    res.send(delRev);
  })
);
router.post(
  "/post/:postId/create",
  currentUser,
  requireAuth,
  [
    body("comment")
      .trim()
      .notEmpty()
      .withMessage("Please provide valid feedback"),

    body("rating")
      .notEmpty()
      .isNumeric()
      .withMessage("Please Provide Rating in range from 0 to 5"),
  ],
  catchAsync(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findOne({ postId: postId });
    console.log("post is", post);
    if (!post) throw new NotFoundError("Post Not Found");
    const { rating, comment } = req.body;
    const review = Review.build({
      rating,
      comment,
      //@ts-ignore
      author: req.currentUser?.id,
      postId,
      date: new Date(),
    });
    await review.save();
    //@ts-ignore
    new ReviewCreatedPublisher(natsClient.client).publish({
      id: review.id,
      postId,
      review: review.comment,
      reating: review.rating,
      author: review.author,
      version: review.version,
    });
    res.send(review);
  })
);
router.get(
  "/post/:postId",
  catchAsync(async (req, res) => {
    const reviews = await Review.find({ postId: req.params.postId });
    res.send(reviews);
  })
);

export { router as ReviewRoutes };
