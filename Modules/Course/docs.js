/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: مدیریت دوره‌های آموزشی
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         instructorId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             fullName: { type: string }
 *             phoneNumber: { type: string }
 *         title:
 *           type: string
 *           example: "آموزش ری‌اکت پیشرفته"
 *         description:
 *           type: string
 *           example: "دوره جامع ری‌اکت با Hooks و Context"
 *         whatYouWillLearn:
 *           type: array
 *           items: { type: string }
 *           example: ["Hooks", "Context API"]
 *         slug:
 *           type: string
 *           example: "amoozesh-react-pishrafte"
 *         image:
 *           type: string
 *           example: "courses/react-advanced.jpg"
 *         previewVideo:
 *           type: string
 *           example: "courses/react-preview.mp4"
 *         tags:
 *           type: array
 *           items: { type: string }
 *           example: ["react", "javascript"]
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: advanced
 *         language:
 *           type: string
 *           example: fa
 *         totalDuration:
 *           type: number
 *           example: 1200
 *         lessonCount:
 *           type: number
 *           example: 45
 *         boughtCount:
 *           type: number
 *           example: 120
 *         ratingCount:
 *           type: number
 *           example: 85
 *         avgRating:
 *           type: number
 *           example: 4.5
 *         discountPercent:
 *           type: number
 *           example: 20
 *         price:
 *           type: number
 *           example: 500000
 *         finalPrice:
 *           type: number
 *           example: 400000
 *         isFree:
 *           type: boolean
 *           example: false
 *         inStock:
 *           type: boolean
 *           example: true
 *         isPublished:
 *           type: boolean
 *           example: true
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: approved
 *         categoryIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *         lessonIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *               duration: { type: number }
 *               isFree: { type: boolean }
 *         prerequisites:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *               image: { type: string }
 *               price: { type: number }
 *               slug: { type: string }
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CourseStats:
 *       type: object
 *       properties:
 *         pending: { type: number, example: 3 }
 *         approved: { type: number, example: 8 }
 *         rejected: { type: number, example: 1 }
 *         total: { type: number, example: 12 }
 *
 *     CourseProgress:
 *       type: object
 *       properties:
 *         courseId: { type: string }
 *         completedLessons: { type: number, example: 9 }
 *         totalLessons: { type: number, example: 20 }
 *         percentage: { type: number, example: 45 }
 *         lastLessonId: { type: string, nullable: true }
 *         lastWatchedAt: { type: string, format: date-time, nullable: true }
 *         lessons:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               lessonId: { type: string }
 *               watchedSeconds: { type: number, example: 320 }
 *               isCompleted: { type: boolean }
 *               lastWatchedAt: { type: string, format: date-time }
 *
 *     CreateCourseInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: "آموزش ری‌اکت پیشرفته"
 *         description:
 *           type: string
 *           minLength: 10
 *           example: "دوره جامع ری‌اکت"
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 500000
 *         discountPercent:
 *           type: number
 *           example: 20
 *         whatYouWillLearn:
 *           type: array
 *           items: { type: string }
 *         categoryIds:
 *           type: array
 *           items: { type: string }
 *         lessonIds:
 *           type: array
 *           items: { type: string }
 *         prerequisites:
 *           type: array
 *           items: { type: string }
 *         tags:
 *           type: array
 *           items: { type: string }
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         language:
 *           type: string
 *         image:
 *           type: string
 *         previewVideo:
 *           type: string
 *         inStock:
 *           type: boolean
 *
 *     UpdateCourseInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         discountPercent:
 *           type: number
 *         whatYouWillLearn:
 *           type: array
 *           items: { type: string }
 *         categoryIds:
 *           type: array
 *           items: { type: string }
 *         lessonIds:
 *           type: array
 *           items: { type: string }
 *         prerequisites:
 *           type: array
 *           items: { type: string }
 *         tags:
 *           type: array
 *           items: { type: string }
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         language:
 *           type: string
 *         image:
 *           type: string
 *         previewVideo:
 *           type: string
 *         inStock:
 *           type: boolean
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: دریافت لیست دوره‌ها
 *     tags: [Courses]
 *     security: []
 *     description: |
 *       - کاربران عادی، استاد و مهمان: فقط دوره‌های تأییدشده و منتشرشده
 *       - ادمین و سوپرادمین: همه دوره‌ها
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 1000 }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: لیست دوره‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 results: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * /api/courses/my-courses:
 *   get:
 *     summary: دریافت دوره‌های استاد همراه با آمار (فقط استاد)
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 1000 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: لیست دوره‌های استاد + آمار
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 results: { type: integer }
 *                 stats:
 *                   $ref: '#/components/schemas/CourseStats'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: این بخش مخصوص اساتید است
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: دریافت اطلاعات یک دوره
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: اطلاعات دوره + isBought, isFavorite, isRated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *                 isBought: { type: boolean }
 *                 isFavorite: { type: boolean }
 *                 isRated: { type: boolean }
 *       404:
 *         description: دوره یافت نشد
 */

/**
 * @swagger
 * /api/courses/{id}/progress:
 *   get:
 *     summary: دریافت پیشرفت کاربر توی دوره
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: پیشرفت کاربر
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/CourseProgress'
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: دوره یافت نشد
 */

/**
 * @swagger
 * /api/courses/{id}/lessons/{lessonId}/progress:
 *   patch:
 *     summary: ثبت پیشرفت تماشای یه درس
 *     tags: [Courses]
 *     description: |
 *       فرانت هر چند ثانیه یه بار این روت رو صدا می‌زنه و `watchedSeconds` رو می‌فرسته.
 *       اگه 90٪ ویدیو دیده بشه، درس به صورت خودکار `isCompleted: true` می‌شه.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               watchedSeconds:
 *                 type: number
 *                 example: 320
 *     responses:
 *       200:
 *         description: پیشرفت ذخیره شد
 *       400:
 *         description: این درس متعلق به این دوره نیست
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: درس یافت نشد
 */

/**
 * @swagger
 * /api/courses/post-instructor:
 *   post:
 *     summary: ایجاد دوره توسط استاد (وضعیت pending)
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseInput'
 *     responses:
 *       201:
 *         description: دوره ایجاد شد و در انتظار تأیید است
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط استاد
 */

/**
 * @swagger
 * /api/courses/admin:
 *   post:
 *     summary: ایجاد دوره توسط ادمین یا سوپرادمین (وضعیت approved)
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseInput'
 *     responses:
 *       201:
 *         description: دوره ایجاد و منتشر شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   patch:
 *     summary: به‌روزرسانی دوره (فقط ادمین و سوپرادمین)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCourseInput'
 *     responses:
 *       200:
 *         description: دوره با موفقیت به‌روزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: شما مجاز نیستید
 *       404:
 *         description: دوره یافت نشد
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: حذف دوره (فقط ادمین و سوپرادمین)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: دوره با موفقیت حذف شد
 *       400:
 *         description: این دوره خریداری شده و قابل حذف نیست
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: شما مجاز نیستید
 *       404:
 *         description: دوره یافت نشد
 */

/**
 * @swagger
 * /api/courses/{id}/toggle-publish:
 *   patch:
 *     summary: تاگل وضعیت انتشار دوره (فقط ادمین و سوپرادمین)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: وضعیت انتشار با موفقیت تغییر کرد
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: شما مجاز نیستید
 *       404:
 *         description: دوره یافت نشد
 */

/**
 * @swagger
 * /api/courses/{id}/favorite:
 *   patch:
 *     summary: افزودن یا حذف دوره از لیست علاقه‌مندی‌ها
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: دوره به لیست علاقه‌مندی‌ها اضافه یا از آن حذف شد
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: دوره یافت نشد
 */