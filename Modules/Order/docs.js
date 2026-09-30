/**
 * @swagger
 * tags:
 *   name: Order
 *   description: مدیریت سفارش‌ها و پرداخت
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         courseId: { type: string }
 *         title: { type: string, example: "آموزش ری‌اکت پیشرفته" }
 *         image: { type: string, example: "courses/react.jpg" }
 *         price: { type: number, example: 500000 }
 *         finalPrice: { type: number, example: 400000 }
 *         instructorId: { type: string }
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         userId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             fullName: { type: string }
 *             phoneNumber: { type: string }
 *         orderCode:
 *           type: string
 *           example: "ORD-2024-000000001"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice: { type: number, example: 900000 }
 *         finalPrice: { type: number, example: 800000 }
 *         finalPriceAfterDiscount: { type: number, example: 720000 }
 *         discountCodeId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id: { type: string }
 *             code: { type: string }
 *             type: { type: string }
 *             value: { type: number }
 *         status:
 *           type: string
 *           enum: [pending, success, failed, canceled]
 *           example: success
 *         authority: { type: string }
 *         refId: { type: string, example: "1234567890" }
 *         paymentDate: { type: string, format: date-time, nullable: true }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     RequestPaymentResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         data:
 *           type: object
 *           properties:
 *             orderCode: { type: string, example: "ORD-2024-000000001" }
 *             bankUrl: { type: string, example: "https://www.zarinpal.com/pg/StartPay/..." }
 *             amount: { type: number, example: 720000 }
 *         message: { type: string, example: "درخواست پرداخت با موفقیت ثبت شد" }
 *
 *     VerifyPaymentInput:
 *       type: object
 *       required:
 *         - authority
 *       properties:
 *         authority:
 *           type: string
 *           example: "A00000000000000000000000000000000001"
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: دریافت لیست سفارش‌ها
 *     tags: [Order]
 *     description: |
 *       - کاربر عادی: فقط سفارش‌های خودش
 *       - ادمین و سوپرادمین: همه سفارش‌ها
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 1000 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, success, failed, canceled]
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: لیست سفارش‌ها
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
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: عدم دسترسی
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: درخواست پرداخت و ساخت سفارش
 *     tags: [Order]
 *     description: |
 *       سبد خرید کاربر را به سفارش تبدیل می‌کند و لینک پرداخت زرین‌پال برمی‌گرداند.
 *       - سبد خرید نباید خالی باشد
 *       - دوره‌ها باید موجود و قابل خرید باشند
 *       - کاربر نباید قبلاً این دوره‌ها را خریده باشد
 *       - اگه کد تخفیف توی سبد باشه، روی سفارش اعمال می‌شود
 *     responses:
 *       200:
 *         description: لینک پرداخت
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestPaymentResponse'
 *       400:
 *         description: خطا (سبد خالی، دوره ناموجود، خرید تکراری)
 *       401:
 *         description: عدم دسترسی
 */

/**
 * @swagger
 * /api/orders/verify:
 *   post:
 *     summary: تأیید پرداخت
 *     tags: [Order]
 *     description: |
 *       پس از بازگشت از درگاه، این روت را صدا بزنید.
 *       در صورت موفقیت:
 *       - دوره‌ها به کاربر اضافه می‌شوند
 *       - `boughtCount` دوره‌ها افزایش می‌یابد
 *       - کد تخفیف مصرف می‌شود
 *       - سبد خرید خالی می‌شود
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPaymentInput'
 *     responses:
 *       200:
 *         description: نتیجه تأیید پرداخت
 *       400:
 *         description: سفارش یافت نشد یا قبلاً پردازش شده
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: دریافت اطلاعات یک سفارش
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: اطلاعات سفارش
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: سفارش یافت نشد
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: به‌روزرسانی سفارش (فقط ادمین)
 *     tags: [Order]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, success, failed, canceled]
 *     responses:
 *       200:
 *         description: سفارش به‌روزرسانی شد
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین
 *       404:
 *         description: سفارش یافت نشد
 */