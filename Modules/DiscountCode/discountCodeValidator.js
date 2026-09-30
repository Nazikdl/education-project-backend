import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== PARAM VALIDATORS ====================

export const validateDiscountId = () => {
  return param("id")
    .notEmpty()
    .withMessage("شناسه کد تخفیف الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه کد تخفیف معتبر نیست");
};

// ==================== QUERY VALIDATORS ====================

export const validateDiscountQuery = () => {
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

export const codeValidation = (optional = false) => {
  const chain = body("code").trim();

  return optional
    ? chain
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage("کد تخفیف باید بین 3 تا 30 کاراکتر باشد")
        .matches(/^[A-Za-z0-9_-]+$/)
        .withMessage("کد تخفیف فقط می‌تواند شامل حروف، اعداد، _ و - باشد")
    : chain
        .notEmpty()
        .withMessage("کد تخفیف الزامی است")
        .isLength({ min: 3, max: 30 })
        .withMessage("کد تخفیف باید بین 3 تا 30 کاراکتر باشد")
        .matches(/^[A-Za-z0-9_-]+$/)
        .withMessage("کد تخفیف فقط می‌تواند شامل حروف، اعداد، _ و - باشد");
};

export const typeValidation = (optional = false) => {
  const chain = body("type");

  return optional
    ? chain
        .optional()
        .isIn(["percentage", "fixed"])
        .withMessage("نوع کد باید percentage یا fixed باشد")
    : chain
        .notEmpty()
        .withMessage("نوع کد الزامی است")
        .isIn(["percentage", "fixed"])
        .withMessage("نوع کد باید percentage یا fixed باشد");
};

export const valueValidation = (optional = false) => {
  const chain = body("value");

  return optional
    ? chain
        .optional()
        .isFloat({ min: 0 })
        .withMessage("مقدار کد باید عددی مثبت باشد")
        .toFloat()
    : chain
        .notEmpty()
        .withMessage("مقدار کد الزامی است")
        .isFloat({ min: 0 })
        .withMessage("مقدار کد باید عددی مثبت باشد")
        .toFloat();
};

export const usageLimitValidation = (optional = false) => {
  const chain = body("usageLimit");

  return optional
    ? chain
        .optional()
        .isInt({ min: 1 })
        .withMessage("حداکثر استفاده باید حداقل 1 باشد")
        .toInt()
    : chain
        .notEmpty()
        .withMessage("حداکثر استفاده الزامی است")
        .isInt({ min: 1 })
        .withMessage("حداکثر استفاده باید حداقل 1 باشد")
        .toInt();
};

export const userUsedLimitValidation = (optional = false) => {
  const chain = body("userUsedLimit");

  return optional
    ? chain
        .optional()
        .isInt({ min: 1 })
        .withMessage("حداکثر استفاده هر کاربر باید حداقل 1 باشد")
        .toInt()
    : chain
        .notEmpty()
        .withMessage("حداکثر استفاده هر کاربر الزامی است")
        .isInt({ min: 1 })
        .withMessage("حداکثر استفاده هر کاربر باید حداقل 1 باشد")
        .toInt();
};

export const startTimeValidation = () => {
  return body("startTime")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("فرمت زمان شروع معتبر نیست")
    .toDate();
};

export const expireTimeValidation = () => {
  return body("expireTime")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("فرمت زمان انقضا معتبر نیست")
    .toDate();
};

export const minPriceValidation = () => {
  return body("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("حداقل قیمت باید عددی مثبت باشد")
    .toFloat();
};

export const maxPriceValidation = () => {
  return body("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("حداکثر قیمت باید عددی مثبت باشد")
    .toFloat();
};

export const isPublishedValidation = () => {
  return body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished باید boolean باشد")
    .toBoolean();
};

// ==================== DISCOUNT CODE VALIDATORS ====================

export const validateGetAllCodes = [
  ...validateDiscountQuery(),
  handleValidationErrors,
];

export const validateGetSingleCode = [
  validateDiscountId(),
  ...validateDiscountQuery(),
  handleValidationErrors,
];

export const validateCreateCode = [
  codeValidation(),
  typeValidation(),
  valueValidation(),
  usageLimitValidation(),
  userUsedLimitValidation(),
  startTimeValidation(),
  expireTimeValidation(),
  minPriceValidation(),
  maxPriceValidation(),
  isPublishedValidation(),
  handleValidationErrors,
];

export const validateUpdateCode = [
  validateDiscountId(),
  codeValidation(true),
  typeValidation(true),
  valueValidation(true),
  usageLimitValidation(true),
  userUsedLimitValidation(true),
  startTimeValidation(),
  expireTimeValidation(),
  minPriceValidation(),
  maxPriceValidation(),
  isPublishedValidation(),
  handleValidationErrors,
];

export const validateRemoveCode = [
  validateDiscountId(),
  handleValidationErrors,
];

export const validateCheckCode = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("کد تخفیف الزامی است")
    .isLength({ min: 3, max: 30 })
    .withMessage("کد تخفیف باید بین 3 تا 30 کاراکتر باشد"),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  validateDiscountId,
  validateDiscountQuery,
  validateGetAllCodes,
  validateGetSingleCode,
  validateCreateCode,
  validateUpdateCode,
  validateRemoveCode,
  validateCheckCode,
};