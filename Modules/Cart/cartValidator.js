import { body } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

export const validateAddItem = [
  body("courseId")
    .notEmpty()
    .withMessage("شناسه دوره الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه دوره معتبر نیست"),
  handleValidationErrors,
];

export const validateRemoveItem = [
  body("courseId")
    .notEmpty()
    .withMessage("شناسه دوره الزامی است")
    .isMongoId()
    .withMessage("فرمت شناسه دوره معتبر نیست"),
  handleValidationErrors,
];

export default {
  validateAddItem,
  validateRemoveItem,
};