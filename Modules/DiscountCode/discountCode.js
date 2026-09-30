import isLogin from "../../Middlewares/isLogin.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import { Router } from "express";
import {
  checkDiscountCode,
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./discountCodeCn.js";
import {
  validateDiscountCodeCreate,
  validateDiscountCodeUpdate,
  validateDiscountCodeGet,
  validateDiscountCodeDelete,
  validateDiscountCodeCheck,
  validateDiscountCodeExists,
  validateCanDelete,
} from "./discountCodeValidator.js";

const discountCodeRouter = Router();

discountCodeRouter
  .route("/")
  .get(isAdmin, validateDiscountCodeGet, getAll)
  .post(isAdmin, validateDiscountCodeCreate, create);

discountCodeRouter
  .route("/check")
  .post(isLogin, validateDiscountCodeCheck, checkDiscountCode);

discountCodeRouter
  .route("/:id")
  .get(isAdmin, validateDiscountCodeGet, getOne)
  .patch(
    isAdmin,
    validateDiscountCodeExists,
    validateDiscountCodeUpdate,
    update,
  )
  .delete(
    isAdmin,
    validateDiscountCodeExists,
    validateCanDelete,
    validateDiscountCodeDelete,
    remove,
  );

export default discountCodeRouter;
