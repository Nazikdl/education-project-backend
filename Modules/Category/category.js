import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./categoryCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";

import {
  validateGetAllCategories,
  validateGetSingleCategory,
  validateCreateCategory,
  validateUpdateCategory,
  validateRemoveCategory,
} from "./categoryValidator.js";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(validateGetAllCategories, getAll)
  .post(isAdmin, validateCreateCategory, create);

categoryRouter
  .route("/:id")
  .get(validateGetSingleCategory, getOne)
  .delete(isAdmin, validateRemoveCategory, remove)
  .patch(isAdmin, validateUpdateCategory, update);

export default categoryRouter;