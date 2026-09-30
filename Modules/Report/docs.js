/**
 * @swagger
 * tags:
 *   name: Report
 *   description: گزارش‌ها و آمار (عمومی، کاربر، ادمین)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         users:
 *           type: object
 *           properties:
 *             student: { type: number, example: 500 }
 *             instructor: { type: number, example: 20 }
 *             admin: { type: number, example: 3 }
 *             superAdmin: { type: number, example: 1 }
 *             total: { type: number, example: 524 }
 *         courses:
 *           type: object
 *           properties:
 *             pending: { type: number, example: 5 }
 *             approved: { type: number, example: 30 }
 *             rejected: { type: number, example: 2 }
 *             total: { type: number, example: 37 }
 *         orders:
 *           type: object
 *           properties:
 *             pending: { type: number, example: 3 }
 *             success: { type: number, example: 120 }
 *             failed: { type: number, example: 5 }
 *             canceled: { type: number, example: 2 }
 *             total: { type: number, example: 130 }
 *         comments:
 *           type: object
 *           properties:
 *             published: { type: number, example: 85 }
 *             unpublished: { type: number, example: 15 }
 *             total: { type: number, example: 100 }
 *         revenue:
 *           type: object
 *           properties:
 *             totalRevenue: { type: number, example: 45000000 }
 *             totalOrders: { type: number, example: 120 }
 *             avgOrderValue: { type: number, example: 375000 }
 *
 *     PublicStats:
 *       type: object
 *       properties:
 *         students: { type: number, example: 500 }
 *         courses: { type: number, example: 30 }
 *         instructors: { type: number, example: 20 }
 *         totalHours: { type: number, example: 600 }
 *
 *     UserStats:
 *       type: object
 *       properties:
 *         boughtCourses: { type: number, example: 5 }
 *         completedCourses: { type: number, example: 2 }
 *         inProgressCourses: { type: number, example: 3 }
 *         favoriteCourses: { type: number, example: 8 }
 *         totalWatchedMinutes: { type: number, example: 450 }
 *         totalWatchedHours: { type: number, example: 7.5 }
 */

/**
 * @swagger
 * /api/reports/public-stats:
 *   get:
 *     summary: آمار کلی سایت (برای صفحه اصلی - عمومی)
 *     tags: [Report]
 *     security: []
 *     responses:
 *       200:
 *         description: آمار کلی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/PublicStats'
 */

/**
 * @swagger
 * /api/reports/latest-courses:
 *   get:
 *     summary: جدیدترین دوره‌ها (عمومی)
 *     tags: [Report]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 20 }
 *         example: 8
 *     responses:
 *       200:
 *         description: لیست دوره‌ها
 */

/**
 * @swagger
 * /api/reports/top-selling-courses:
 *   get:
 *     summary: پرفروش‌ترین دوره‌ها (عمومی)
 *     tags: [Report]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 20 }
 *     responses:
 *       200:
 *         description: لیست پرفروش‌ترین دوره‌ها
 */

/**
 * @swagger
 * /api/reports/top-rated-courses:
 *   get:
 *     summary: پرامتیازترین دوره‌ها (عمومی)
 *     tags: [Report]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 20 }
 *     responses:
 *       200:
 *         description: لیست پرامتیازترین دوره‌ها
 */

/**
 * @swagger
 * /api/reports/popular-courses:
 *   get:
 *     summary: محبوب‌ترین دوره‌ها بر اساس علاقه‌مندی‌ها (عمومی)
 *     tags: [Report]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 20 }
 *     responses:
 *       200:
 *         description: لیست دوره‌های محبوب
 */

/**
 * @swagger
 * /api/reports/free-courses:
 *   get:
 *     summary: دوره‌های رایگان (عمومی)
 *     tags: [Report]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 20 }
 *     responses:
 *       200:
 *         description: لیست دوره‌های رایگان
 */

/**
 * @swagger
 * /api/reports/user-stats:
 *   get:
 *     summary: آمار شخصی کاربر (داشبورد کاربر)
 *     tags: [Report]
 *     responses:
 *       200:
 *         description: آمار کاربر
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/UserStats'
 *       401:
 *         description: عدم دسترسی
 */

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: آمار کلی داشبورد ادمین
 *     tags: [Report]
 *     responses:
 *       200:
 *         description: آمار کلی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین
 */

/**
 * @swagger
 * /api/reports/monthly-sales:
 *   get:
 *     summary: فروش ماهانه (نمودار خطی/ستونی)
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *         example: 2024
 *     responses:
 *       200:
 *         description: فروش ماهانه
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     year: { type: integer }
 *                     monthly:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month: { type: integer }
 *                           name: { type: string, example: "فروردین" }
 *                           revenue: { type: number }
 *                           ordersCount: { type: number }
 *                     totalRevenue: { type: number }
 *                     totalOrders: { type: number }
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین
 */

/**
 * @swagger
 * /api/reports/new-users:
 *   get:
 *     summary: کاربران جدید (نمودار ستونی)
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, minimum: 1, maximum: 365 }
 *         example: 30
 *     responses:
 *       200:
 *         description: آمار کاربران جدید
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین
 */

/**
 * @swagger
 * /api/reports/pending-courses:
 *   get:
 *     summary: دوره‌های در انتظار تأیید
 *     tags: [Report]
 *     responses:
 *       200:
 *         description: لیست دوره‌های pending
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین
 */

/**
 * @swagger
 * /api/reports/course-sales:
 *   get:
 *     summary: آمار فروش هر دوره (Top 20)
 *     tags: [Report]
 *     responses:
 *       200:
 *         description: لیست آمار فروش
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین
 */

/**
 * @swagger
 * /api/reports/category-sales:
 *   get:
 *     summary: آمار فروش بر اساس دسته‌بندی
 *     tags: [Report]
 *     responses:
 *       200:
 *         description: آمار فروش دسته‌بندی‌ها
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین
 */

/**
 * @swagger
 * /api/reports/revenue-growth:
 *   get:
 *     summary: رشد درآمد در N ماه اخیر
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: integer, minimum: 1, maximum: 24 }
 *         example: 6
 *     responses:
 *       200:
 *         description: نمودار رشد درآمد
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین
 */