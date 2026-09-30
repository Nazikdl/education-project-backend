import { Router } from "express";
import { addItem, clearCart, getOne, remove } from "./cartCn.js";
import {
  validateAddItem,
  validateRemoveItem,
} from "./cartValidator.js";

const cartRouter = Router();

cartRouter
  .route("/")
  .get(getOne)
  .post(validateAddItem, addItem)
  .patch(validateRemoveItem, remove)
  .delete(clearCart);

export default cartRouter;