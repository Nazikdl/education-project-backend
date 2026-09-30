import { Router } from "express";
import isLogin from "../../Middlewares/isLogin.js";
import isAdmin from "../../Middlewares/isAdmin.js";

import {
  validateGetAllUsers,
  validateGetSingleUser,
  validateUpdateUser,
  validateChangePassword,
  validateMyProgress,
} from "./userValidator.js";

import {
  changePassword,
  getAll,
  getOne,
  update,
  getMyProgress,
} from "./userCn.js";

const userRouter = Router();

userRouter.route("/").get(isAdmin, validateGetAllUsers, getAll);

userRouter
  .route("/me/progress")
  .get(isLogin, validateMyProgress, getMyProgress);

userRouter
  .route("/:id")
  .patch(isLogin, validateUpdateUser, update)
  .get(isLogin, validateGetSingleUser, getOne);

userRouter
  .route("/change-password/:id")
  .patch(isLogin, validateChangePassword, changePassword);

export default userRouter;