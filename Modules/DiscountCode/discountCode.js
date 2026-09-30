import { Router } from "express";
import isLogin from "../../Middlewares/isLogin.js";
import isAdmin from "../../Middlewares/isAdmin.js";

import {
  checkDiscountCode,
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./discountCodeCn.js";

import {
  validateGetAllCodes,
  validateGetSingleCode,
  validateCreateCode,
  validateUpdateCode,
  validateRemoveCode,
  validateCheckCode,
} from "./discountCodeValidator.js";

const discountCodeRouter = Router();

discountCodeRouter
  .route("/")
  .get(isLogin, isAdmin, validateGetAllCodes, getAll)
  .post(isLogin, isAdmin, validateCreateCode, create);

discountCodeRouter
  .route("/check")
  .post(isLogin, validateCheckCode, checkDiscountCode);

discountCodeRouter
  .route("/:id")
  .get(isLogin, isAdmin, validateGetSingleCode, getOne)
  .patch(isLogin, isAdmin, validateUpdateCode, update)
  .delete(isLogin, isAdmin, validateRemoveCode, remove);

export default discountCodeRouter;