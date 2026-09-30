/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: مدیریت درس‌های دوره‌ها
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         courseId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             title: { type: string }
 *             image: { type: string }
 *         title:
 *           type: string
 *           example: "مقدمه‌ای بر ری‌اکت"
 *         slug:
 *           type: string
 *           example: "moqadame-ee-bar-react"
 *         description:
 *           type: string
 *           example: "در این درس با مفاهیم اولیه ری‌اکت آشنا می‌شوید"
 *         image:
 *           type: string
 *           example: "lessons/react-intro.jpg"
 *         videoUrl:
 *           type: string
 *           example: "lessons/react-intro.mp4"
 *         videoTime:
 *           type: number
 *           example: 30
 *         attachments:
 *           type: array
 *           items: { type: string }
 *           example: ["files/react-cheatsheet.pdf"]
 *         order:
 *           type: number
 *           example: 1
 *         isFree:
 *           type: boolean
 *           example: false
 *         isPublished:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateLessonInput:
 *       type: object
 *       required:
 *         - courseId
 *         - title
 *         - videoUrl
 *         - videoTime
 *       properties:
 *         courseId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: "مقدمه‌ای بر ری‌اکت"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: "توضیحات درس"
 *         image:
 *           type: string
 *           example: "lessons/react-intro.jpg"
 *         videoUrl:
 *           type: string
 *           example: "lessons/react-intro.mp4"
 *         videoTime:
 *           type: number
 *           minimum: 1
 *           example: 30
 *         attachments:
 *           type: array
 *           items: { type: string }
 *           example: ["files/cheatsheet.pdf"]
 *         order:
 *           type: number
 *           example: 1
 *         isFree:
 *           type: boolean
 *           example: false
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     UpdateLessonInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         videoUrl:
 *           type: string
 *         videoTime:
 *           type: number
 *         attachments:
 *           type: array
 *           items: { type: string }
 *         order:
 *           type: number
 *         isFree:
 *           type: boolean
 *         isPublished:
 *           type: boolean
 */

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: دریافت لیست درس‌ها
 *     tags: [Lessons]
 *     security: []
 *     description: |
 *       - کاربران عادی و مهمان: فقط درس‌های `isPublished: true`
 *       - ادمین و سوپرادمین: همه درس‌ها
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
 *     responses:
 *       200:
 *         description: لیست درس‌ها
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
 *                     $ref: '#/components/schemas/Lesson'
 */

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: ایجاد درس جدید (فقط ادمین و سوپرادمین)
 *     tags: [Lessons]
 *     description: پس از ایجاد، درس به صورت خودکار به `lessonIds` دوره اضافه می‌شود
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLessonInput'
 *     responses:
 *       201:
 *         description: درس با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 *       404:
 *         description: دوره یافت نشد
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: دریافت اطلاعات یک درس
 *     tags: [Lessons]
 *     security: []
 *     description: |
 *       - کاربران عادی: فقط درس‌های `isPublished: true`
 *       - ادمین و سوپرادمین: همه درس‌ها
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: اطلاعات درس + اطلاعات دوره و دسته‌بندی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: درس یافت نشد
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   patch:
 *     summary: به‌روزرسانی درس (فقط ادمین و سوپرادمین)
 *     tags: [Lessons]
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
 *             $ref: '#/components/schemas/UpdateLessonInput'
 *     responses:
 *       200:
 *         description: درس با موفقیت به‌روزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 *       404:
 *         description: درس یافت نشد
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: حذف درس (فقط ادمین و سوپرادمین)
 *     tags: [Lessons]
 *     description: پس از حذف، درس به صورت خودکار از `lessonIds` دوره حذف می‌شود
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: درس با موفقیت حذف شد
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 *       404:
 *         description: درس یافت نشد
 */

/**
 * @swagger
 * /api/lessons/change-publish/{id}:
 *   patch:
 *     summary: تغییر وضعیت انتشار درس (فقط ادمین و سوپرادمین)
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: وضعیت انتشار تغییر کرد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 *       404:
 *         description: درس یافت نشد
 */