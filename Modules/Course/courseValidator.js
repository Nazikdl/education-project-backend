import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== PARAM VALIDATORS ====================

export const validateCourseId = () => {
  return param("id")
    .notEmpty()
    .withMessage("شناسه دوره الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه دوره معتبر نیست");
};

export const validateLessonId = () => {
  return param("lessonId")
    .notEmpty()
    .withMessage("شناسه درس الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه درس معتبر نیست");
};

// ==================== QUERY VALIDATORS ====================

export const validateCourseQuery = () => {
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

    query("status")
      .optional()
      .isIn(["pending", "approved", "rejected"])
      .withMessage(
        "وضعیت باید یکی از این مقادیر باشد: pending, approved, rejected"
      ),
  ];
};

// ==================== BODY VALIDATORS ====================

export const titleValidation = (optional = false) => {
  const chain = body("title").trim();

  return optional
    ? chain
        .optional()
        .isLength({ min: 3, max: 150 })
        .withMessage("عنوان باید بین 3 تا 150 کاراکتر باشد")
    : chain
        .notEmpty()
        .withMessage("عنوان دوره الزامی است")
        .isLength({ min: 3, max: 150 })
        .withMessage("عنوان باید بین 3 تا 150 کاراکتر باشد");
};

export const descriptionValidation = (optional = false) => {
  const chain = body("description").trim();

  return optional
    ? chain
        .optional()
        .isLength({ min: 10 })
        .withMessage("توضیحات باید حداقل 10 کاراکتر باشد")
    : chain
        .notEmpty()
        .withMessage("توضیحات دوره الزامی است")
        .isLength({ min: 10 })
        .withMessage("توضیحات باید حداقل 10 کاراکتر باشد");
};

export const priceValidation = (optional = false) => {
  const chain = body("price");

  return optional
    ? chain
        .optional()
        .isFloat({ min: 0 })
        .withMessage("قیمت باید عددی مثبت باشد")
        .toFloat()
    : chain
        .notEmpty()
        .withMessage("قیمت دوره الزامی است")
        .isFloat({ min: 0 })
        .withMessage("قیمت باید عددی مثبت باشد")
        .toFloat();
};

export const discountPercentValidation = () => {
  return body("discountPercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("درصد تخفیف باید بین 0 تا 100 باشد")
    .toFloat();
};

export const categoryIdsValidation = () => {
  return body("categoryIds")
    .optional()
    .isArray()
    .withMessage("دسته‌بندی‌ها باید آرایه باشند")
    .custom((ids) => {
      if (!ids.every((id) => /^[0-9a-fA-F]{24}$/.test(id))) {
        throw new Error("همه شناسه‌های دسته‌بندی باید معتبر باشند");
      }
      return true;
    });
};

export const lessonIdsValidation = () => {
  return body("lessonIds")
    .optional()
    .isArray()
    .withMessage("درس‌ها باید آرایه باشند")
    .custom((ids) => {
      if (!ids.every((id) => /^[0-9a-fA-F]{24}$/.test(id))) {
        throw new Error("همه شناسه‌های درس باید معتبر باشند");
      }
      return true;
    });
};

export const prerequisitesValidation = () => {
  return body("prerequisites")
    .optional()
    .isArray()
    .withMessage("پیش‌نیازها باید آرایه باشند")
    .custom((ids) => {
      if (!ids.every((id) => /^[0-9a-fA-F]{24}$/.test(id))) {
        throw new Error("همه شناسه‌های پیش‌نیاز باید معتبر باشند");
      }
      return true;
    });
};

export const whatYouWillLearnValidation = () => {
  return body("whatYouWillLearn")
    .optional()
    .isArray()
    .withMessage("مطالب آموزشی باید آرایه باشند")
    .custom((items) => {
      if (!items.every((item) => typeof item === "string")) {
        throw new Error("همه مطالب آموزشی باید رشته باشند");
      }
      return true;
    });
};

export const tagsValidation = () => {
  return body("tags")
    .optional()
    .isArray()
    .withMessage("تگ‌ها باید آرایه باشند")
    .custom((tags) => {
      if (!tags.every((tag) => typeof tag === "string")) {
        throw new Error("همه تگ‌ها باید رشته باشند");
      }
      return true;
    });
};

export const levelValidation = () => {
  return body("level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage(
      "سطح دوره باید یکی از این مقادیر باشد: beginner, intermediate, advanced"
    );
};

export const languageValidation = () => {
  return body("language")
    .optional()
    .isString()
    .withMessage("زبان باید رشته باشد")
    .trim();
};

export const imageValidation = () => {
  return body("image")
    .optional()
    .isString()
    .withMessage("آدرس تصویر باید رشته باشد")
    .trim();
};

export const previewVideoValidation = () => {
  return body("previewVideo")
    .optional()
    .isString()
    .withMessage("آدرس ویدیو پیش‌نمایش باید رشته باشد")
    .trim();
};

export const inStockValidation = () => {
  return body("inStock")
    .optional()
    .isBoolean()
    .withMessage("inStock باید boolean باشد")
    .toBoolean();
};

// ==================== COURSE VALIDATORS ====================

export const validateGetAllCourses = [
  ...validateCourseQuery(),
  handleValidationErrors,
];

export const validateGetSingleCourse = [
  validateCourseId(),
  ...validateCourseQuery(),
  handleValidationErrors,
];

export const validateCreateCourse = [
  titleValidation(),
  descriptionValidation(),
  priceValidation(),
  discountPercentValidation(),
  categoryIdsValidation(),
  lessonIdsValidation(),
  prerequisitesValidation(),
  whatYouWillLearnValidation(),
  tagsValidation(),
  levelValidation(),
  languageValidation(),
  imageValidation(),
  previewVideoValidation(),
  inStockValidation(),
  handleValidationErrors,
];

export const validateUpdateCourse = [
  validateCourseId(),
  titleValidation(true),
  descriptionValidation(true),
  priceValidation(true),
  discountPercentValidation(),
  categoryIdsValidation(),
  lessonIdsValidation(),
  prerequisitesValidation(),
  whatYouWillLearnValidation(),
  tagsValidation(),
  levelValidation(),
  languageValidation(),
  imageValidation(),
  previewVideoValidation(),
  inStockValidation(),
  handleValidationErrors,
];

export const validateRemoveCourse = [
  validateCourseId(),
  handleValidationErrors,
];

export const validateTogglePublish = [
  validateCourseId(),
  handleValidationErrors,
];

export const validateToggleFavorite = [
  validateCourseId(),
  handleValidationErrors,
];

export const validateUpdateLessonProgress = [
  validateCourseId(),
  validateLessonId(),
  body("watchedSeconds")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("زمان تماشا باید عددی مثبت باشد")
    .toFloat(),
  handleValidationErrors,
];

export const validateGetProgress = [
  validateCourseId(),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  validateCourseId,
  validateLessonId,
  validateCourseQuery,
  validateGetAllCourses,
  validateGetSingleCourse,
  validateCreateCourse,
  validateUpdateCourse,
  validateRemoveCourse,
  validateTogglePublish,
  validateToggleFavorite,
  validateUpdateLessonProgress,
  validateGetProgress,
};