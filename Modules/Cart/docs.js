/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: مدیریت سبد خرید (هر کاربر فقط یک سبد خرید دارد)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         userId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id: { type: string }
 *               title: { type: string }
 *               image: { type: string }
 *               slug: { type: string }
 *               price: { type: number }
 *               finalPrice: { type: number }
 *               discountPercent: { type: number }
 *               inStock: { type: boolean }
 *         totalPrice:
 *           type: number
 *           example: 800000
 *         finalPrice:
 *           type: number
 *           example: 700000
 *         totalDiscount:
 *           type: number
 *           example: 100000
 *         cartQuantity:
 *           type: number
 *           example: 2
 *         isEmpty:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AddToCartInput:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *
 *     RemoveFromCartInput:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: دریافت سبد خرید کاربر
 *     tags: [Cart]
 *     description: |
 *       سبد خرید کاربر لاگین‌شده را برمی‌گرداند.
 *       - دوره‌های ناموجود خودکار از سبد حذف می‌شوند
 *       - فیلد `isEmpty` نشان می‌دهد سبد خالی است یا نه
 *     responses:
 *       200:
 *         description: سبد خرید
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: عدم دسترسی
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: افزودن دوره به سبد خرید
 *     tags: [Cart]
 *     description: |
 *       قوانین:
 *       - دوره باید `inStock: true` باشد
 *       - دوره باید `isPublished: true` و `status: "approved"` باشد
 *       - کاربر نباید قبلاً دوره را خریده باشد
 *       - دوره نباید قبلاً در سبد باشد
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartInput'
 *     responses:
 *       200:
 *         description: دوره به سبد اضافه شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: خطا (ناموجود، خریداری‌شده، تکراری)
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: دوره یافت نشد
 */

/**
 * @swagger
 * /api/cart:
 *   patch:
 *     summary: حذف دوره از سبد خرید
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveFromCartInput'
 *     responses:
 *       200:
 *         description: دوره از سبد حذف شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: سبد یا دوره یافت نشد
 */

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: پاک کردن کل سبد خرید
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: سبد خرید پاک شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: سبد خرید یافت نشد
 */