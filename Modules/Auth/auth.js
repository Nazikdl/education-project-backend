import { Router } from "express";

import {
  auth,
  loginWithPassword,
  loginWithOtp,
  resendCode,
  forgetPassword,
} from "./authCn.js";

import {
  validateAuth,
  validateLoginWithPassword,
  validateLoginWithOtp,
  validateResendCode,
  validateForgetPassword,
} from "./authValidator.js";

const authRouter = Router();

authRouter.route("/").post(validateAuth, auth);

authRouter.route("/login-password").post(validateLoginWithPassword, loginWithPassword);

authRouter.route("/login-otp").post(validateLoginWithOtp, loginWithOtp);

authRouter.route("/resend-code").post(validateResendCode, resendCode);

authRouter.route("/forget-password").post(validateForgetPassword, forgetPassword);

export default authRouter;