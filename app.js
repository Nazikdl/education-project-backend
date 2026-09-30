import express from "express";
import morgan from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { catchError } from "vanta-api";
import userRouter from "./Modules/User/user.js";
import authRouter from "./Modules/Auth/auth.js";
import authValidation from "./Middlewares/authValidation.js";
import isLogin from "./Middlewares/isLogin.js";
import isAdmin from "./Middlewares/isAdmin.js";
import uploadRouter from "./Modules/Upload/upload.js";
import categoryRouter from "./Modules/Category/category.js";
import commentRouter from "./Modules/Comment/comment.js";
import searchRouter from "./Modules/Search/search.js";
import discountCodeRouter from "./Modules/DiscountCode/discountCode.js";
import cartRouter from "./Modules/Cart/cart.js";
import { swaggerSpec } from "./Utils/Swagger.js";
import swaggerUi from "swagger-ui-express";
import courseRouter from "./Modules/Course/course.js";
import lessonRouter from "./Modules/Lesson/lesson.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/files", express.static(`${__dirname}/Public`));
app.use(authValidation);
app.use("/api/users", isLogin, userRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/uploads",isLogin, isAdmin, uploadRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);
app.use("/api/search", searchRouter);
app.use('/api/lessons',lessonRouter)
app.use("/api/discount-code", discountCodeRouter);
app.use("/api/cart", isLogin, cartRouter);

app.use(catchError);
export default app;
