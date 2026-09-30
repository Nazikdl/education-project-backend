import { query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== SEARCH QUERY VALIDATORS ====================

export const searchQueryValidation = () => {
  return [
    query("search")
      .optional()
      .isString()
      .withMessage("پارامتر جستجو باید رشته باشد")
      .trim(),

    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("شماره صفحه باید عددی مثبت باشد")
      .toInt(),

    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("تعداد در هر صفحه باید عددی مثبت باشد")
      .toInt(),
  ];
};

// ==================== SEARCH VALIDATOR ====================

export const validateSearch = [
  ...searchQueryValidation(),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  searchQueryValidation,
  validateSearch,
};