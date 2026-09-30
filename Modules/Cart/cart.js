import { Router } from "express";
import { addItem, clearCart, getOne, remove } from "./cartCn.js";

const cartRouter = Router();

cartRouter.route("/").get(getOne).post(addItem).patch(remove).delete(clearCart);

export default cartRouter;
