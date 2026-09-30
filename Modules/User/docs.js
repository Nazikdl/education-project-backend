/**
 * @swagger
 * tags:
 *   name: Users
 *   description: مدیریت کاربران (دانشجو، استاد، ادمین)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         fullName:
 *           type: string
 *           example: "علی رضایی"
 *         role:
 *           type: string
 *           enum: [admin, superAdmin, student, instructor]
 *           example: student
 *         isActive:
 *           type: boolean
 *           example: true
 *         birthYear:
 *           type: string
 *           format: date
 *           example: "1995-05-20"
 *         favoriteCourseIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *               image: { type: string }
 *               price: { type: number }
 *         boughtCourseIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *               image: { type: string }
 *               price: { type: number }
 *         ratedCourseIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *               image: { type: string }
 *               price: { type: number }
 *         progress:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   title: { type: string }
 *                   image: { type: string }
 *                   price: { type: number }
 *               percentage: { type: number, example: 45 }
 *               lessons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lessonId: { type: string }
 *                     watchedSeconds: { type: number }
 *                     isCompleted: { type: boolean }
 *                     lastWatchedAt: { type: string, format: date-time }
 *               lastLessonId: { type: string, nullable: true }
 *               lastWatchedAt: { type: string, format: date-time, nullable: true }
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     MyProgress:
 *       type: object
 *       properties:
 *         courseId: { type: string }
 *         title: { type: string }
 *         image: { type: string }
 *         slug: { type: string }
 *         percentage: { type: number, example: 45 }
 *         completedLessons: { type: number, example: 9 }
 *         totalLessons: { type: number, example: 20 }
 *         totalWatchedSeconds: { type: number, example: 7200 }
 *         lastWatchedAt: { type: string, format: date-time, nullable: true }
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "علی رضایی"
 *         birthYear:
 *           type: string
 *           format: date
 *           example: "1995-05-20"
 *         role:
 *           type: string
 *           enum: [admin, superAdmin, student, instructor]
 *         isActive:
 *           type: boolean
 *
 *     ChangePasswordInput:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           example: "OldPass123"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           example: "NewPass123"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: دریافت لیست همه کاربران (فقط ادمین و سوپرادمین)
 *     tags: [Users]
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
 *         name: fields
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: لیست کاربران
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
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: عدم دسترسی
 */

/**
 * @swagger
 * /api/users/me/progress:
 *   get:
 *     summary: دریافت پیشرفت کاربر توی همه دوره‌ها (داشبورد)
 *     tags: [Users]
 *     description: لیست دوره‌هایی که کاربر توشون پیشرفت داره (حتی اگه یه درس رو کامل دیده باشه)
 *     responses:
 *       200:
 *         description: لیست پیشرفت دوره‌ها
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
 *                     $ref: '#/components/schemas/MyProgress'
 *       401:
 *         description: عدم دسترسی
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: دریافت اطلاعات یک کاربر
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: اطلاعات کاربر
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: کاربر یافت نشد
 */

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: به‌روزرسانی اطلاعات کاربر
 *     tags: [Users]
 *     description: |
 *       - دانشجو و استاد: فقط اطلاعات خودشون
 *       - ادمین: همه به جز ادمین و سوپرادمین
 *       - سوپرادمین: همه
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
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: کاربر با موفقیت به‌روزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: کاربر یافت نشد
 */

/**
 * @swagger
 * /api/users/change-password/{id}:
 *   patch:
 *     summary: تغییر رمز عبور کاربر
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: رمز با موفقیت تغییر کرد
 *       400:
 *         description: خطای اعتبارسنجی یا رمز اشتباه
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: کاربر یافت نشد
 */