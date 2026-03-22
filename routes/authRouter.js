import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema, emailSchema } from "../schemas/usersSchemas.js";
import * as authControllers from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), authControllers.register);
authRouter.post("/login", validateBody(loginSchema), authControllers.login);
authRouter.post("/logout", authenticate, authControllers.logout);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatar);
authRouter.get("/verify/:verificationToken", authControllers.verifyEmail);
authRouter.post("/verify", validateBody(emailSchema), authControllers.resendVerifyEmail);

export default authRouter;