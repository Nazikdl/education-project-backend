import { Router } from "express";
import { getAll, getOne, requestPayment, update, verify } from "./orderCn.js";
import isLogin from "../../Middlewares/isLogin.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import {
  validateGetAll,
  validateGetOne,
  validateUpdate,
  validateRequestPayment,
  validateVerify,
} from "./orderValidator.js";

const orderRouter = Router();

orderRouter
  .route("/")
  .get(isLogin, validateGetAll, getAll)
  .post(isLogin, validateRequestPayment, requestPayment);

orderRouter.route("/verify").post(validateVerify, verify);

orderRouter
  .route("/:id")
  .get(isLogin, validateGetOne, getOne)
  .patch(isAdmin, validateUpdate, update);

export default orderRouter;