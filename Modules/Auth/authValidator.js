import { body } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== BODY VALIDATORS ====================

// ✅ شماره تلفن - فقط ایرانی (09xxxxxxxxx)
export const phoneNumberValidation = () => {
  return body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("شماره تلفن الزامی است")
    .matches(/^09\d{9}$/)
    .withMessage(
      "فرمت شماره تلفن معتبر نیست (باید با 09 شروع شود و 11 رقم باشد، مثال: 09123456789)"
    );
};

// ✅ رمز عبور (اجباری - برای login)
export const passwordValidation = () => {
  return body("password")
    .notEmpty()
    .withMessage("رمز عبور الزامی است")
    .isLength({ min: 8 })
    .withMessage("رمز عبور باید حداقل 8 کاراکتر باشد");
};

// ✅ کد یکبار مصرف
export const otpCodeValidation = () => {
  return body("code")
    .trim()
    .notEmpty()
    .withMessage("کد یکبار مصرف الزامی است")
    .isLength({ min: 4, max: 6 })
    .withMessage("کد باید بین 4 تا 6 رقم باشد")
    .isNumeric()
    .withMessage("کد باید فقط شامل اعداد باشد");
};

// ✅ رمز جدید (برای forget password)
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

// ==================== AUTH VALIDATORS ====================

// 1️⃣ بررسی وجود کاربر (auth)
export const validateAuth = [
  phoneNumberValidation(),
  handleValidationErrors,
];

// 2️⃣ ورود با رمز عبور
export const validateLoginWithPassword = [
  phoneNumberValidation(),
  passwordValidation(),
  handleValidationErrors,
];

// 3️⃣ ورود با رمز یکبار مصرف
export const validateLoginWithOtp = [
  phoneNumberValidation(),
  otpCodeValidation(),
  handleValidationErrors,
];

// 4️⃣ ارسال مجدد کد
export const validateResendCode = [
  phoneNumberValidation(),
  handleValidationErrors,
];

// 5️⃣ فراموشی رمز عبور
export const validateForgetPassword = [
  phoneNumberValidation(),
  otpCodeValidation(),
  newPasswordValidation(),
  handleValidationErrors,
];

// ==================== DEFAULT EXPORT ====================

export default {
  handleValidationErrors,
  phoneNumberValidation,
  passwordValidation,
  otpCodeValidation,
  newPasswordValidation,
  validateAuth,
  validateLoginWithPassword,
  validateLoginWithOtp,
  validateResendCode,
  validateForgetPassword,
};