import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== PARAM ====================
export const validateOrderId = () => {
  return param("id")
    .notEmpty()
    .withMessage("شناسه سفارش الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه سفارش معتبر نیست");
};

// ==================== QUERY ====================
export const validateOrderQuery = () => {
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

    query("search")
      .optional()
      .isString()
      .withMessage("پارامتر جستجو باید رشته باشد")
      .trim(),

    query("status")
      .optional()
      .isIn(["pending", "success", "failed", "canceled"])
      .withMessage(
        "وضعیت باید یکی از این مقادیر باشد: pending, success, failed, canceled"
      ),
  ];
};

// ==================== VALIDATORS ====================
export const validateGetAllOrders = [
  ...validateOrderQuery(),
  handleValidationErrors,
];

export const validateGetSingleOrder = [
  validateOrderId(),
  ...validateOrderQuery(),
  handleValidationErrors,
];

export const validateRequestPayment = [
  handleValidationErrors,
];

export const validateVerifyPayment = [
  body("authority")
    .trim()
    .notEmpty()
    .withMessage("شناسه پرداخت (authority) الزامی است"),
  handleValidationErrors,
];

export const validateUpdateOrder = [
  validateOrderId(),
  body("status")
    .optional()
    .isIn(["pending", "success", "failed", "canceled"])
    .withMessage(
      "وضعیت باید یکی از این مقادیر باشد: pending, success, failed, canceled"
    ),
  handleValidationErrors,
];

export default {
  handleValidationErrors,
  validateOrderId,
  validateOrderQuery,
  validateGetAllOrders,
  validateGetSingleOrder,
  validateRequestPayment,
  validateVerifyPayment,
  validateUpdateOrder,
};