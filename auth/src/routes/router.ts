import {
  BadRequestError,
  catchAsync,
  currentUser,
  requireAuth,
  UnauthorizedError,
  validateRequest,
} from "@akbar0102/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { Password } from "../Models/Password";
import User from "../Models/User";
const router = Router();

router.post(
  "/signup",

  [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,

  catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = User.build({ email, password });

    await user.save();
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  })
);
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid Credentials");
    }
    const passCheck = await Password.compare(user.password, password);
    if (!passCheck) {
      throw new BadRequestError("Invalid Credentials");
    }
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(user);
  })
);
router.post("/signout", requireAuth, (req, res, next) => {
  req.session = null;
  res.send({ message: "sign out" });
});

router.get("/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});
export default router;
