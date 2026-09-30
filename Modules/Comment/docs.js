/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: مدیریت نظرات و پاسخ‌ها روی دوره‌ها
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
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
 *         userId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             fullName: { type: string }
 *             phoneNumber: { type: string }
 *             role: { type: string }
 *         content:
 *           type: string
 *           example: "دوره بسیار عالی بود، ممنون از استاد"
 *         rate:
 *           type: number
 *           nullable: true
 *           example: 5
 *         isPublished:
 *           type: boolean
 *           example: true
 *         isReply:
 *           type: boolean
 *           example: false
 *         isBought:
 *           type: boolean
 *           example: true
 *         role:
 *           type: string
 *           enum: [instructor, admin, superAdmin, student]
 *           example: student
 *         replyIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               content: { type: string }
 *               role: { type: string }
 *               isPublished: { type: boolean }
 *               userId:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   fullName: { type: string }
 *                   phoneNumber: { type: string }
 *                   role: { type: string }
 *         likes:
 *           type: array
 *           items: { type: string }
 *         likeCount:
 *           type: number
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCommentInput:
 *       type: object
 *       required:
 *         - courseId
 *         - content
 *       properties:
 *         courseId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         content:
 *           type: string
 *           minLength: 2
 *           maxLength: 1000
 *           example: "دوره بسیار عالی بود"
 *         rate:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *           description: "فقط کاربرانی که دوره را خریده‌اند می‌توانند امتیاز بدهند"
 *
 *     ReplyCommentInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 2
 *           maxLength: 1000
 *           example: "ممنون از نظر شما"
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: دریافت لیست همه نظرات (فقط ادمین و سوپرادمین)
 *     tags: [Comments]
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
 *         description: لیست نظرات
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
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: عدم دسترسی
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: ثبت نظر جدید روی یک دوره
 *     tags: [Comments]
 *     description: |
 *       - همه کاربران لاگین‌شده می‌توانند نظر ثبت کنند
 *       - فقط خریداران دوره می‌توانند امتیاز (rate) بدهند
 *       - هر کاربر فقط یک بار می‌تواند امتیاز بدهد
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentInput'
 *     responses:
 *       201:
 *         description: نظر با موفقیت ثبت شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: دوره یافت نشد
 */

/**
 * @swagger
 * /api/comments/reply/{commentId}:
 *   post:
 *     summary: پاسخ به یک نظر
 *     tags: [Comments]
 *     description: |
 *       - پاسخ استاد و دانشجو: نیاز به تأیید ادمین دارد (isPublished: false)
 *       - پاسخ ادمین و سوپرادمین: بدون تأیید منتشر می‌شود (isPublished: true)
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReplyCommentInput'
 *     responses:
 *       200:
 *         description: پاسخ با موفقیت ثبت شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: نظر یافت نشد
 */

/**
 * @swagger
 * /api/comments/{courseId}:
 *   get:
 *     summary: دریافت نظرات یک دوره
 *     tags: [Comments]
 *     security: []
 *     description: |
 *       - کاربران عادی و مهمان: فقط نظرات تأییدشده (isPublished: true)
 *       - ادمین و سوپرادمین: همه نظرات
 *       - فقط نظرات اصلی نمایش داده می‌شوند (isReply: false)
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 1000 }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: لیست نظرات دوره
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
 *                     $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     summary: تغییر وضعیت انتشار نظر (فقط ادمین و سوپرادمین)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: وضعیت نظر تغییر کرد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: نظر یافت نشد
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: حذف نظر و همه پاسخ‌های آن (فقط ادمین و سوپرادمین)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: نظر با موفقیت حذف شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: نظر یافت نشد
 */