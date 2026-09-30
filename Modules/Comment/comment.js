import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";

import {
  changePublished,
  create,
  getAll,
  getAllCommentOfCourse,
  remove,
  reply,
} from "./commentCn.js";

import {
  validateGetAllComments,
  validateGetCommentsOfCourse,
  validateCreateComment,
  validateReply,
  validateRemoveComment,
  validateChangePublished,
} from "./commentValidator.js";

const commentRouter = Router();

commentRouter
  .route("/")
  .get(isAdmin, validateGetAllComments, getAll)
  .post(isLogin, validateCreateComment, create);

commentRouter
  .route("/reply/:commentId")
  .post(isLogin, validateReply, reply);

commentRouter
  .route("/:courseId")
  .get(validateGetCommentsOfCourse, getAllCommentOfCourse);

commentRouter
  .route("/:id")
  .patch(isAdmin, validateChangePublished, changePublished)
  .delete(isAdmin, validateRemoveComment, remove);

export default commentRouter;