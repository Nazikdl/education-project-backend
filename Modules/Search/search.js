import { Router } from "express";
import { search } from "./searchCn.js";

const searchRouter = Router();

searchRouter.route('/').get(search);

export default searchRouter;