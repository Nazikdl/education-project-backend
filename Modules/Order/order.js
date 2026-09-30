import { Router } from "express";
import isLogin from "../../Middlewares/isLogin.js";
import isAdmin from "../../Middlewares/isAdmin.js";

import {
  getAll,
  getOne,
  requestPayment,
  update,
  verify,
} from "./orderCn.js";

import {
  validateGetAllOrders,
  validateGetSingleOrder,
  validateRequestPayment,
  validateUpdateOrder,
  validateVerifyPayment,
} from "./orderValidator.js";

const orderRouter = Router();

orderRouter
  .route("/")
  .get(isLogin, validateGetAllOrders, getAll)
  .post(isLogin, validateRequestPayment, requestPayment);

orderRouter.route("/verify").post(validateVerifyPayment, verify);

orderRouter
  .route("/:id")
  .get(isLogin, validateGetSingleOrder, getOne)
  .patch(isLogin, isAdmin, validateUpdateOrder, update);

export default orderRouter;