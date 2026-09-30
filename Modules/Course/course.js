import { Router } from "express";
import isLogin from "../../Middlewares/isLogin.js";
import isInstructor from "../../Middlewares/isInstructor.js";
import isAdmin from "../../Middlewares/isAdmin.js";

import {
  getAll,
  getMyCourses,
  getOne,
  create,
  update,
  remove,
  toggleFavorite,
  togglePublish,
  updateLessonProgress,
  getProgress,
} from "./courseCn.js";

import {
  validateGetAllCourses,
  validateGetSingleCourse,
  validateCreateCourse,
  validateUpdateCourse,
  validateRemoveCourse,
  validateTogglePublish,
  validateToggleFavorite,
  validateUpdateLessonProgress,
  validateGetProgress,
} from "./courseValidator.js";

const courseRouter = Router();

// ✅ عمومی
courseRouter.route("/").get(validateGetAllCourses, getAll);
courseRouter.route("/:id").get(validateGetSingleCourse, getOne);

// ✅ داشبورد استاد
courseRouter.route("/my-courses")
  .get(isLogin, isInstructor, validateGetAllCourses, getMyCourses);

// ✅ ایجاد دوره توسط استاد → pending
courseRouter.route("/post-instructor")
  .post(isLogin, isInstructor, validateCreateCourse, create);

// ✅ ایجاد دوره توسط ادمین → approved
courseRouter.route("/admin")
  .post(isLogin, isAdmin, validateCreateCourse, create);

// ✅ آپدیت (فقط ادمین)
courseRouter.route("/:id")
  .patch(isLogin, isAdmin, validateUpdateCourse, update);

// ✅ حذف (فقط ادمین)
courseRouter.route("/:id")
  .delete(isLogin, isAdmin, validateRemoveCourse, remove);

// ✅ تاگل انتشار (فقط ادمین)
courseRouter.route("/:id/toggle-publish")
  .patch(isLogin, isAdmin, validateTogglePublish, togglePublish);

// ✅ علاقه‌مندی
courseRouter.route("/:id/favorite")
  .patch(isLogin, validateToggleFavorite, toggleFavorite);

// ✅ پیشرفت (فقط لاگین‌شده)
courseRouter.route("/:id/progress")
  .get(isLogin, validateGetProgress, getProgress);

courseRouter.route("/:id/lessons/:lessonId/progress")
  .patch(isLogin, validateUpdateLessonProgress, updateLessonProgress);

export default courseRouter;