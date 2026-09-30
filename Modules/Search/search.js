import { Router } from "express";
import { search } from "./searchCn.js";
import { validateSearch } from "./searchValidator.js";

const searchRouter = Router();

searchRouter.route("/").get(validateSearch, search);

export default searchRouter;