import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== PARAM VALIDATORS ====================

export const validateUserId = () => {
  return param("id")
    .notEmpty()
    .withMessage("شناسه کاربر الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه کاربر معتبر نیست");
};

// ==================== QUERY VALIDATORS ====================

export const validateUserQuery = () => {
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

export const phoneNumberValidation = (optional = false) => {
  const chain = body("phoneNumber").trim();

  return optional
    ? chain
        .optional({ checkFalsy: true })
        .matches(/^09\d{9}$/)
        .withMessage(
          "فرمت شماره تلفن معتبر نیست (باید با 09 شروع شود و 11 رقم باشد، مثال: 09123456789)"
        )
    : chain
        .notEmpty()
        .withMessage("شماره تلفن الزامی است")
        .matches(/^09\d{9}$/)
        .withMessage(
          "فرمت شماره تلفن معتبر نیست (باید با 09 شروع شود و 11 رقم باشد، مثال: 09123456789)"
        );
};

export const fullNameValidation = () => {
  return body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("نام کامل باید بین 2 تا 100 کاراکتر باشد")
    .matches(/^[\u0600-\u06FF\sa-zA-Z]+$/)
    .withMessage("نام کامل فقط می‌تواند شامل حروف فارسی، انگلیسی و فاصله باشد");
};

export const birthYearValidation = () => {
  return body("birthYear")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("فرمت تاریخ معتبر نیست (از ISO 8601 استفاده کن: YYYY-MM-DD)")
    .toDate()
    .custom((value) => {
      const minDate = new Date("1900-01-01");
      const maxDate = new Date();
      if (value < minDate || value > maxDate) {
        throw new Error("تاریخ تولد باید بین 1900 تا امروز باشد");
      }
      return true;
    });
};

export const roleValidation = () => {
  return body("role")
    .optional()
    .isIn(["admin", "superAdmin", "student", "instructor"])
    .withMessage(
      "نقش باید یکی از این مقادیر باشد: admin, superAdmin, student, instructor"
    );
};

export const isActiveValidation = () => {
  return body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive باید boolean باشد (true یا false)")
    .toBoolean();
};

export const oldPasswordValidation = () => {
  return body("oldPassword")
    .optional({ checkFalsy: true })
    .isLength({ min: 8 })
    .withMessage("رمز قبلی باید حداقل 8 کاراکتر باشد");
};

export const newPasswordValidation = () => {
  return body("newPassword")
    .notEmpty()
    .withMessage("رمز جدید الزامی است")
    .isLength({ min: 8 })
    .withMessage("رمز جدید باید حداقل 8 کاراکتر باشد")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)
    .withMessage(
      "رمز جدید باید شامل حروف A-Z، a-z و 0-9 باشد و حداقل 8 کاراکتر داشته باشد"
    );
};

// ==================== USER VALIDATORS ====================

export const validateGetAllUsers = [
  ...validateUserQuery(),
  handleValidationErrors,
];

export const validateGetSingleUser = [
  validateUserId(),
  ...validateUserQuery(),
  handleValidationErrors,
];

export const validateUpdateUser = [
  validateUserId(),
  fullNameValidation(),
  birthYearValidation(),
  roleValidation(),
  isActiveValidation(),
  phoneNumberValidation(true),
  handleValidationErrors,
];

export const validateChangePassword = [
  validateUserId(),
  oldPasswordValidation(),
  newPasswordValidation(),
  handleValidationErrors,
];

export const validateMyProgress = [
  ...validateUserQuery(),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  validateUserId,
  validateUserQuery,
  validateGetAllUsers,
  validateGetSingleUser,
  validateUpdateUser,
  validateChangePassword,
  validateMyProgress,
};