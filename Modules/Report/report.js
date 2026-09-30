import { Router } from "express";
import isLogin from "../../Middlewares/isLogin.js";
import isAdmin from "../../Middlewares/isAdmin.js";

import {
  getDashboardStats,
  getMonthlySales,
  getNewUsers,
  getTopSellingCourses,
  getTopRatedCourses,
  getLatestCourses,
  getPendingCourses,
  getCourseSalesStats,
  getCategorySales,
  getPublicStats,
  getUserStats,
  getPopularCourses,
  getRevenueGrowth,
  getFreeCourses,
} from "./reportCn.js";

import {
  validateGetLatestCourses,
  validateGetTopSellingCourses,
  validateGetTopRatedCourses,
  validateGetPopularCourses,
  validateGetFreeCourses,
  validateGetMonthlySales,
  validateGetNewUsers,
  validateGetRevenueGrowth,
} from "./reportValidator.js";

const reportRouter = Router();

// ============================================================
// عمومی (برای سایت اصلی)
// ============================================================
reportRouter.route("/public-stats").get(getPublicStats);

reportRouter
  .route("/latest-courses")
  .get(validateGetLatestCourses, getLatestCourses);

reportRouter
  .route("/top-selling-courses")
  .get(validateGetTopSellingCourses, getTopSellingCourses);

reportRouter
  .route("/top-rated-courses")
  .get(validateGetTopRatedCourses, getTopRatedCourses);

reportRouter
  .route("/popular-courses")
  .get(validateGetPopularCourses, getPopularCourses);

reportRouter.route("/free-courses").get(validateGetFreeCourses, getFreeCourses);

// ============================================================
// کاربر لاگین‌شده (داشبورد کاربر)
// ============================================================
reportRouter.route("/user-stats").get(isLogin, getUserStats);

// ============================================================
// ادمین (داشبورد ادمین)
// ============================================================
reportRouter.route("/dashboard").get(isLogin, isAdmin, getDashboardStats);

reportRouter
  .route("/monthly-sales")
  .get(isLogin, isAdmin, validateGetMonthlySales, getMonthlySales);

reportRouter
  .route("/new-users")
  .get(isLogin, isAdmin, validateGetNewUsers, getNewUsers);

reportRouter
  .route("/pending-courses")
  .get(isLogin, isAdmin, getPendingCourses);

reportRouter.route("/course-sales").get(isLogin, isAdmin, getCourseSalesStats);

reportRouter.route("/category-sales").get(isLogin, isAdmin, getCategorySales);

reportRouter
  .route("/revenue-growth")
  .get(isLogin, isAdmin, validateGetRevenueGrowth, getRevenueGrowth);

export default reportRouter;