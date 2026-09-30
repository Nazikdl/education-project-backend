import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== PARAM VALIDATORS ====================

export const validateLessonId = () => {
  return param("id")
    .notEmpty()
    .withMessage("شناسه درس الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه درس معتبر نیست");
};

// ==================== QUERY VALIDATORS ====================

export const validateLessonQuery = () => {
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

export const courseIdValidation = () => {
  return body("courseId")
    .notEmpty()
    .withMessage("شناسه دوره الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه دوره معتبر نیست");
};

export const titleValidation = (optional = false) => {
  const chain = body("title").trim();

  return optional
    ? chain
        .optional()
        .isLength({ min: 2, max: 150 })
        .withMessage("عنوان باید بین 2 تا 150 کاراکتر باشد")
    : chain
        .notEmpty()
        .withMessage("عنوان درس الزامی است")
        .isLength({ min: 2, max: 150 })
        .withMessage("عنوان باید بین 2 تا 150 کاراکتر باشد");
};

export const descriptionValidation = () => {
  return body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("توضیحات نمی‌تواند بیشتر از 1000 کاراکتر باشد");
};

export const imageValidation = () => {
  return body("image")
    .optional()
    .isString()
    .withMessage("آدرس تصویر باید رشته باشد")
    .trim();
};

export const videoUrlValidation = (optional = false) => {
  const chain = body("videoUrl").trim();

  return optional
    ? chain
        .optional()
        .isString()
        .withMessage("آدرس ویدیو باید رشته باشد")
    : chain
        .notEmpty()
        .withMessage("ویدیو درس الزامی است")
        .isString()
        .withMessage("آدرس ویدیو باید رشته باشد");
};

export const videoTimeValidation = (optional = false) => {
  const chain = body("videoTime");

  return optional
    ? chain
        .optional()
        .isFloat({ min: 1 })
        .withMessage("مدت زمان باید حداقل 1 دقیقه باشد")
        .toFloat()
    : chain
        .notEmpty()
        .withMessage("مدت زمان ویدیو الزامی است")
        .isFloat({ min: 1 })
        .withMessage("مدت زمان باید حداقل 1 دقیقه باشد")
        .toFloat();
};

export const attachmentsValidation = () => {
  return body("attachments")
    .optional()
    .isArray()
    .withMessage("فایل‌های ضمیمه باید آرایه باشند")
    .custom((items) => {
      if (!items.every((item) => typeof item === "string")) {
        throw new Error("همه فایل‌های ضمیمه باید رشته باشند");
      }
      return true;
    });
};

export const orderValidation = () => {
  return body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ترتیب باید عددی مثبت باشد")
    .toInt();
};

export const isFreeValidation = () => {
  return body("isFree")
    .optional()
    .isBoolean()
    .withMessage("isFree باید boolean باشد")
    .toBoolean();
};

export const isPublishedValidation = () => {
  return body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished باید boolean باشد")
    .toBoolean();
};

// ==================== LESSON VALIDATORS ====================

export const validateGetAllLessons = [
  ...validateLessonQuery(),
  handleValidationErrors,
];

export const validateGetSingleLesson = [
  validateLessonId(),
  ...validateLessonQuery(),
  handleValidationErrors,
];

export const validateCreateLesson = [
  courseIdValidation(),
  titleValidation(),
  descriptionValidation(),
  imageValidation(),
  videoUrlValidation(),
  videoTimeValidation(),
  attachmentsValidation(),
  orderValidation(),
  isFreeValidation(),
  isPublishedValidation(),
  handleValidationErrors,
];

export const validateUpdateLesson = [
  validateLessonId(),
  titleValidation(true),
  descriptionValidation(),
  imageValidation(),
  videoUrlValidation(true),
  videoTimeValidation(true),
  attachmentsValidation(),
  orderValidation(),
  isFreeValidation(),
  isPublishedValidation(),
  handleValidationErrors,
];

export const validateTogglePublish = [
  validateLessonId(),
  handleValidationErrors,
];

export const validateRemoveLesson = [
  validateLessonId(),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  validateLessonId,
  validateLessonQuery,
  validateGetAllLessons,
  validateGetSingleLesson,
  validateCreateLesson,
  validateUpdateLesson,
  validateTogglePublish,
  validateRemoveLesson,
};