import { query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== QUERY VALIDATORS ====================

export const validateLimit = () => {
  return query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("تعداد باید بین 1 تا 50 باشد")
    .toInt();
};

export const validateYear = () => {
  return query("year")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("سال باید بین 2000 تا 2100 باشد")
    .toInt();
};

export const validateDays = () => {
  return query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("تعداد روز باید بین 1 تا 365 باشد")
    .toInt();
};

export const validateMonths = () => {
  return query("months")
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage("تعداد ماه باید بین 1 تا 24 باشد")
    .toInt();
};

// ==================== REPORT VALIDATORS ====================

export const validateGetLatestCourses = [
  validateLimit(),
  handleValidationErrors,
];

export const validateGetTopSellingCourses = [
  validateLimit(),
  handleValidationErrors,
];

export const validateGetTopRatedCourses = [
  validateLimit(),
  handleValidationErrors,
];

export const validateGetPopularCourses = [
  validateLimit(),
  handleValidationErrors,
];

export const validateGetFreeCourses = [
  validateLimit(),
  handleValidationErrors,
];

export const validateGetMonthlySales = [
  validateYear(),
  handleValidationErrors,
];

export const validateGetNewUsers = [
  validateDays(),
  handleValidationErrors,
];

export const validateGetRevenueGrowth = [
  validateMonths(),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  validateLimit,
  validateYear,
  validateDays,
  validateMonths,
  validateGetLatestCourses,
  validateGetTopSellingCourses,
  validateGetTopRatedCourses,
  validateGetPopularCourses,
  validateGetFreeCourses,
  validateGetMonthlySales,
  validateGetNewUsers,
  validateGetRevenueGrowth,
};