/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: مدیریت دسته‌بندی دوره‌ها (با پشتیبانی از دسته‌های تودرتو)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         title:
 *           type: string
 *           example: "برنامه‌نویسی"
 *         slug:
 *           type: string
 *           example: "barnameh-nevisi"
 *         image:
 *           type: string
 *           example: "categories/programming.jpg"
 *         isPublished:
 *           type: boolean
 *           example: true
 *         supCategoryId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id: { type: string }
 *             title: { type: string }
 *             slug: { type: string }
 *         subCategoryIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *               slug: { type: string }
 *               image: { type: string }
 *         courseIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *               slug: { type: string }
 *               image: { type: string }
 *               price: { type: number }
 *               finalPrice: { type: number }
 *         courseCount:
 *           type: number
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCategoryInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "برنامه‌نویسی وب"
 *         image:
 *           type: string
 *           example: "categories/web.jpg"
 *         isPublished:
 *           type: boolean
 *           example: true
 *         supCategoryId:
 *           type: string
 *           nullable: true
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *           description: "در صورت خالی بودن، دسته اصلی محسوب می‌شود"
 *         courseIds:
 *           type: array
 *           items: { type: string }
 *           example: []
 *
 *     UpdateCategoryInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "برنامه‌نویسی وب (ویرایش جدید)"
 *         image:
 *           type: string
 *           example: "categories/web-new.jpg"
 *         isPublished:
 *           type: boolean
 *           example: false
 *         supCategoryId:
 *           type: string
 *           nullable: true
 *           example: null
 *         courseIds:
 *           type: array
 *           items: { type: string }
 *           example: ["64f1a2b3c4d5e6f7a8b9c0d2"]
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: دریافت لیست دسته‌بندی‌ها
 *     tags: [Categories]
 *     security: []
 *     description: |
 *       - کاربران عادی و مهمان: فقط دسته‌های `isPublished: true`
 *       - ادمین و سوپرادمین: همه دسته‌ها
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
 *         description: لیست دسته‌بندی‌ها
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
 *                     $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: دریافت اطلاعات یک دسته‌بندی
 *     tags: [Categories]
 *     security: []
 *     description: |
 *       - کاربران عادی: فقط دسته‌های `isPublished: true`
 *       - ادمین و سوپرادمین: همه دسته‌ها
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: اطلاعات دسته‌بندی + زیردسته‌ها + دوره‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: دسته‌بندی یافت نشد
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: ایجاد دسته‌بندی جدید (فقط ادمین و سوپرادمین)
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       201:
 *         description: دسته‌بندی با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: به‌روزرسانی دسته‌بندی (فقط ادمین و سوپرادمین)
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/UpdateCategoryInput'
 *     responses:
 *       200:
 *         description: دسته‌بندی با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: خطای اعتبارسنجی یا دسته نمی‌تواند والد خودش باشد
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 *       404:
 *         description: دسته‌بندی یافت نشد
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: حذف دسته‌بندی (فقط ادمین و سوپرادمین)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: دسته‌بندی با موفقیت حذف شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *       400:
 *         description: این دسته شامل دوره یا زیردسته است و قابل حذف نیست
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 *       404:
 *         description: دسته‌بندی یافت نشد
 */