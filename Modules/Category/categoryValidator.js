import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== PARAM VALIDATORS ====================

export const validateCategoryId = () => {
  return param("id")
    .notEmpty()
    .withMessage("شناسه دسته‌بندی الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه دسته‌بندی معتبر نیست");
};

// ==================== QUERY VALIDATORS ====================

export const validateCategoryQuery = () => {
  return [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 1000 }).toInt(),
    query("sort").optional().isString().trim(),
    query("fields").optional().isString().trim(),
    query("search").optional().isString().trim().isLength({ min: 1 }),
    query("populate").optional().isString().trim(),
  ];
};

// ==================== BODY VALIDATORS ====================

export const titleValidation = (optional = false) => {
  const chain = body("title").trim();

  return optional
    ? chain
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("عنوان باید بین 2 تا 50 کاراکتر باشد")
    : chain
        .notEmpty()
        .withMessage("عنوان دسته‌بندی الزامی است")
        .isLength({ min: 2, max: 50 })
        .withMessage("عنوان باید بین 2 تا 50 کاراکتر باشد");
};

export const imageValidation = () => {
  return body("image").optional().isString().trim();
};

export const isPublishedValidation = () => {
  return body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished باید boolean باشد")
    .toBoolean();
};

export const supCategoryIdValidation = () => {
  return body("supCategoryId")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("فرمت شناسه دسته‌بندی والد معتبر نیست");
};

// ==================== CATEGORY VALIDATORS ====================

export const validateGetAllCategories = [
  ...validateCategoryQuery(),
  handleValidationErrors,
];

export const validateGetSingleCategory = [
  validateCategoryId(),
  ...validateCategoryQuery(),
  handleValidationErrors,
];

export const validateCreateCategory = [
  titleValidation(),
  imageValidation(),
  isPublishedValidation(),
  supCategoryIdValidation(),
  handleValidationErrors,
];

export const validateUpdateCategory = [
  validateCategoryId(),
  titleValidation(true),
  imageValidation(),
  isPublishedValidation(),
  supCategoryIdValidation(),
  handleValidationErrors,
];

export const validateRemoveCategory = [
  validateCategoryId(),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  validateCategoryId,
  validateCategoryQuery,
  validateGetAllCategories,
  validateGetSingleCategory,
  validateCreateCategory,
  validateUpdateCategory,
  validateRemoveCategory,
};