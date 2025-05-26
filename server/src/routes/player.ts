import { Router } from "express";
import {
  createPlayer,
  googleSignIn,
  googleSignInCallback,
  signIn,
} from "../handlers/player";
import { z } from "zod";
import validate from "../utils/validate";

const playerRouter: Router = Router();

playerRouter.post(
  "/login",
  validate(
    z.object({
      email: z.string().email({ message: "Invalid email address" }),
      password: z.string(),
    })
  ),
  signIn
);

playerRouter.post(
  "/register",
  validate(
    z.object({
      email: z.string().email({ message: "Invalid email address" }),
      username: z.string(),
      password: z.string(),
    })
  ),
  createPlayer
);

playerRouter.get("/google", googleSignIn);
playerRouter.get("/google/callback", googleSignInCallback);

export default playerRouter;
