/**
 * @swagger
 * tags:
 *   name: Search
 *   description: جستجوی سراسری در دوره‌ها، دسته‌بندی‌ها و درس‌ها
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchResults:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             courses:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   title: { type: string }
 *                   image: { type: string }
 *                   slug: { type: string }
 *                   price: { type: number }
 *                   finalPrice: { type: number }
 *                   avgRating: { type: number }
 *             categories:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   title: { type: string }
 *                   slug: { type: string }
 *                   image: { type: string }
 *             lessons:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   title: { type: string }
 *                   image: { type: string }
 *                   videoTime: { type: number }
 *                   courseId:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       title: { type: string }
 *                       image: { type: string }
 *                       slug: { type: string }
 *         results:
 *           type: object
 *           properties:
 *             courses:
 *               type: integer
 *               example: 5
 *             categories:
 *               type: integer
 *               example: 2
 *             lessons:
 *               type: integer
 *               example: 8
 *             total:
 *               type: integer
 *               example: 15
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: جستجوی سراسری در دوره‌ها، دسته‌بندی‌ها و درس‌ها
 *     tags: [Search]
 *     security: []
 *     description: |
 *       جستجو همزمان در سه ماژول:
 *       - **دوره‌ها** — جستجو در `title`, `description`, `tags`
 *       - **دسته‌بندی‌ها** — جستجو در `title`
 *       - **درس‌ها** — جستجو در `title`, `description`
 *
 *       **نکات:**
 *       - کاربران عادی فقط نتایج `isPublished: true` و `status: "approved"` را می‌بینند
 *       - ادمین و سوپرادمین همه نتایج را می‌بینند
 *       - حداکثر ۵ نتیجه از هر ماژول برگردانده می‌شود
 *       - اگه هیچ نتیجه‌ای پیدا نشد، خطای 404 برمی‌گردد
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: عبارت جستجو
 *         example: "react"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: شماره صفحه
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: تعداد در هر صفحه (حداکثر ۵ نتیجه از هر ماژول)
 *         example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "مرتب‌سازی (مثال: -createdAt برای جدیدترین)"
 *         example: "-createdAt"
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: فیلتر سطح دوره
 *       - in: query
 *         name: isFree
 *         schema:
 *           type: boolean
 *         description: فیلتر دوره‌های رایگان
 *     responses:
 *       200:
 *         description: نتایج جستجو (موفق)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResults'
 *             example:
 *               success: true
 *               data:
 *                 courses:
 *                   - _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     title: "آموزش ری‌اکت پیشرفته"
 *                     image: "courses/react.jpg"
 *                     slug: "amoozesh-react-pishrafte"
 *                     price: 500000
 *                     finalPrice: 400000
 *                     avgRating: 4.5
 *                 categories:
 *                   - _id: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                     title: "برنامه‌نویسی وب"
 *                     slug: "barnameh-nevisi-web"
 *                     image: "categories/web.jpg"
 *                 lessons:
 *                   - _id: "64f1a2b3c4d5e6f7a8b9c0d3"
 *                     title: "مقدمه‌ای بر ری‌اکت"
 *                     image: "lessons/react-intro.jpg"
 *                     videoTime: 30
 *                     courseId:
 *                       _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                       title: "آموزش ری‌اکت پیشرفته"
 *                       image: "courses/react.jpg"
 *                       slug: "amoozesh-react-pishrafte"
 *               results:
 *                 courses: 5
 *                 categories: 2
 *                 lessons: 8
 *                 total: 15
 *       404:
 *         description: نتیجه‌ای یافت نشد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "نتیجه‌ای یافت نشد"
 */