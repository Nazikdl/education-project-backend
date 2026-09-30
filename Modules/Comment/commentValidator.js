import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== PARAM VALIDATORS ====================

export const validateCommentId = () => {
  return param("id")
    .notEmpty()
    .withMessage("شناسه نظر الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه نظر معتبر نیست");
};

export const validateCommentIdParam = () => {
  return param("commentId")
    .notEmpty()
    .withMessage("شناسه نظر الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه نظر معتبر نیست");
};

export const validateCourseIdParam = () => {
  return param("courseId")
    .notEmpty()
    .withMessage("شناسه دوره الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه دوره معتبر نیست");
};

// ==================== QUERY VALIDATORS ====================

export const validateCommentQuery = () => {
  return [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("شماره صفحه باید عددی مثبت باشد")
      .toInt(),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage("تعداد در هر صفحه باید بین 1 تا 1000 باشد")
      .toInt(),

    query("sort")
      .optional()
      .isString()
      .withMessage("پارامتر مرتب‌سازی باید رشته باشد")
      .trim(),

    query("fields")
      .optional()
      .isString()
      .withMessage("پارامتر فیلدها باید رشته باشد")
      .trim(),

    query("search")
      .optional()
      .isString()
      .withMessage("پارامتر جستجو باید رشته باشد")
      .trim()
      .isLength({ min: 1 })
      .withMessage("عبارت جستجو نمی‌تواند خالی باشد"),

    query("populate")
      .optional()
      .isString()
      .withMessage("پارامتر populate باید رشته باشد")
      .trim(),
  ];
};

// ==================== BODY VALIDATORS ====================

export const contentValidation = () => {
  return body("content")
    .trim()
    .notEmpty()
    .withMessage("متن نظر الزامی است")
    .isLength({ min: 2, max: 1000 })
    .withMessage("متن نظر باید بین 2 تا 1000 کاراکتر باشد");
};

export const rateValidation = () => {
  return body("rate")
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 5 })
    .withMessage("امتیاز باید بین 1 تا 5 باشد")
    .toFloat();
};

export const courseIdBodyValidation = () => {
  return body("courseId")
    .notEmpty()
    .withMessage("شناسه دوره الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه دوره معتبر نیست");
};

// ==================== COMMENT VALIDATORS ====================

export const validateGetAllComments = [
  ...validateCommentQuery(),
  handleValidationErrors,
];

export const validateGetCommentsOfCourse = [
  validateCourseIdParam(),
  ...validateCommentQuery(),
  handleValidationErrors,
];

export const validateCreateComment = [
  courseIdBodyValidation(),
  contentValidation(),
  rateValidation(),
  handleValidationErrors,
];

export const validateReply = [
  validateCommentIdParam(),
  contentValidation(),
  handleValidationErrors,
];

export const validateRemoveComment = [
  validateCommentId(),
  handleValidationErrors,
];

export const validateChangePublished = [
  validateCommentId(),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  validateCommentId,
  validateCommentIdParam,
  validateCourseIdParam,
  validateCommentQuery,
  validateGetAllComments,
  validateGetCommentsOfCourse,
  validateCreateComment,
  validateReply,
  validateRemoveComment,
  validateChangePublished,
};