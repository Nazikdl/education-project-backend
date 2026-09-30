import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";

import {
  create,
  getAll,
  getOne,
  remove,
  togglePublish,
  update,
} from "./lessonCn.js";

import {
  validateGetAllLessons,
  validateGetSingleLesson,
  validateCreateLesson,
  validateUpdateLesson,
  validateTogglePublish,
  validateRemoveLesson,
} from "./lessonValidator.js";

const lessonRouter = Router();

lessonRouter
  .route("/")
  .get(validateGetAllLessons, getAll)
  .post(isAdmin, validateCreateLesson, create);

lessonRouter
  .route("/change-publish/:id")
  .patch(isAdmin, validateTogglePublish, togglePublish);

lessonRouter
  .route("/:id")
  .get(validateGetSingleLesson, getOne)
  .patch(isAdmin, validateUpdateLesson, update)
  .delete(isAdmin, validateRemoveLesson, remove);

export default lessonRouter;