/**
 * @swagger
 * tags:
 *   name: DiscountCode
 *   description: مدیریت کدهای تخفیف
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DiscountCode:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         code:
 *           type: string
 *           example: "SUMMER2024"
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           example: percentage
 *         value:
 *           type: number
 *           example: 20
 *         startTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         expireTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         minPrice:
 *           type: number
 *           example: 0
 *         maxPrice:
 *           type: number
 *           example: 0
 *         usageLimit:
 *           type: number
 *           example: 100
 *         usedCount:
 *           type: number
 *           example: 5
 *         userUsedLimit:
 *           type: number
 *           example: 1
 *         userIdUsed:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   fullName: { type: string }
 *                   phoneNumber: { type: string }
 *               count:
 *                 type: number
 *                 example: 1
 *         isPublished:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateDiscountCodeInput:
 *       type: object
 *       required:
 *         - code
 *         - type
 *         - value
 *         - usageLimit
 *         - userUsedLimit
 *       properties:
 *         code:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           example: "SUMMER2024"
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           example: percentage
 *         value:
 *           type: number
 *           minimum: 0
 *           example: 20
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T00:00:00.000Z"
 *         expireTime:
 *           type: string
 *           format: date-time
 *           example: "2024-09-01T00:00:00.000Z"
 *         minPrice:
 *           type: number
 *           example: 100000
 *         maxPrice:
 *           type: number
 *           example: 5000000
 *         usageLimit:
 *           type: number
 *           minimum: 1
 *           example: 100
 *         userUsedLimit:
 *           type: number
 *           minimum: 1
 *           example: 1
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     UpdateDiscountCodeInput:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *         value:
 *           type: number
 *         startTime:
 *           type: string
 *           format: date-time
 *         expireTime:
 *           type: string
 *           format: date-time
 *         minPrice:
 *           type: number
 *         maxPrice:
 *           type: number
 *         usageLimit:
 *           type: number
 *         userUsedLimit:
 *           type: number
 *         isPublished:
 *           type: boolean
 *
 *     CheckDiscountCodeInput:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: "SUMMER2024"
 *
 *     CheckDiscountCodeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             discountCodeId: { type: string }
 *             code: { type: string, example: "SUMMER2024" }
 *             type: { type: string, example: "percentage" }
 *             value: { type: number, example: 20 }
 *             discountValue: { type: number, example: 80000 }
 *             priceBeforeDiscount: { type: number, example: 400000 }
 *             finalPriceAfterDiscount: { type: number, example: 320000 }
 *         message:
 *           type: string
 *           example: "کد تخفیف با موفقیت اعمال شد"
 */

/**
 * @swagger
 * /api/discount-code:
 *   get:
 *     summary: دریافت لیست کدهای تخفیف (فقط ادمین و سوپرادمین)
 *     tags: [DiscountCode]
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
 *         name: isPublished
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: لیست کدهای تخفیف
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
 *                     $ref: '#/components/schemas/DiscountCode'
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 */

/**
 * @swagger
 * /api/discount-code:
 *   post:
 *     summary: ایجاد کد تخفیف جدید (فقط ادمین و سوپرادمین)
 *     tags: [DiscountCode]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDiscountCodeInput'
 *     responses:
 *       201:
 *         description: کد تخفیف ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/DiscountCode'
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 */

/**
 * @swagger
 * /api/discount-code/check:
 *   post:
 *     summary: بررسی و اعمال کد تخفیف روی سبد خرید
 *     tags: [DiscountCode]
 *     description: |
 *       کد تخفیف را بررسی و روی سبد خرید کاربر اعمال می‌کند.
 *       کد در فیلد `discountCode` سبد خرید ذخیره می‌شود.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckDiscountCodeInput'
 *     responses:
 *       200:
 *         description: کد تخفیف با موفقیت اعمال شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckDiscountCodeResponse'
 *       400:
 *         description: کد نامعتبر، منقضی، یا شرایط برقرار نیست
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: کد تخفیف یا سبد خرید یافت نشد
 */

/**
 * @swagger
 * /api/discount-code/{id}:
 *   get:
 *     summary: دریافت یک کد تخفیف (فقط ادمین و سوپرادمین)
 *     tags: [DiscountCode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: اطلاعات کد تخفیف
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/DiscountCode'
 *       401:
 *         description: عدم دسترسی
 *       404:
 *         description: کد تخفیف یافت نشد
 */

/**
 * @swagger
 * /api/discount-code/{id}:
 *   patch:
 *     summary: به‌روزرسانی کد تخفیف (فقط ادمین و سوپرادمین)
 *     tags: [DiscountCode]
 *     description: |
 *       اگر کد قبلاً استفاده شده باشد، فیلدهای `code`, `type`, `value`, `usageLimit`, `userUsedLimit` قابل تغییر نیستند.
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
 *             $ref: '#/components/schemas/UpdateDiscountCodeInput'
 *     responses:
 *       200:
 *         description: کد تخفیف به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/DiscountCode'
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 *       404:
 *         description: کد تخفیف یافت نشد
 */

/**
 * @swagger
 * /api/discount-code/{id}:
 *   delete:
 *     summary: حذف کد تخفیف (فقط ادمین و سوپرادمین)
 *     tags: [DiscountCode]
 *     description: اگر کد حداقل یک بار استفاده شده باشد، قابل حذف نیست
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: کد تخفیف حذف شد
 *       400:
 *         description: کد استفاده شده و قابل حذف نیست
 *       401:
 *         description: عدم دسترسی
 *       403:
 *         description: فقط ادمین و سوپرادمین
 *       404:
 *         description: کد تخفیف یافت نشد
 */