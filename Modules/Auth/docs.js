/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: احراز هویت کاربران (ورود با رمز، ورود با OTP، فراموشی رمز)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *           description: "شماره تلفن ایرانی با فرمت 09xxxxxxxxx"
 *
 *     LoginWithPasswordInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - password
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         password:
 *           type: string
 *           example: "Pass1234"
 *
 *     LoginWithOtpInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "12345"
 *           description: "کد یکبار مصرف 4 تا 6 رقمی"
 *
 *     ResendCodeInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *
 *     ForgetPasswordInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *         - newPassword
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "12345"
 *         newPassword:
 *           type: string
 *           example: "NewPass123"
 *           description: "حداقل 8 کاراکتر، شامل حرف بزرگ، کوچک و عدد"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             userExist:
 *               type: boolean
 *               example: true
 *             password:
 *               type: boolean
 *               example: false
 *         message:
 *           type: string
 *           example: "کد یکبار مصرف ارسال شد"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             user:
 *               $ref: '#/components/schemas/User'
 *         message:
 *           type: string
 *           example: "ورود با رمزعبور با موفقیت انجام شد"
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: بررسی وجود کاربر و ارسال کد یکبار مصرف در صورت نیاز
 *     tags: [Auth]
 *     security: []
 *     description: |
 *       این روت برای مرحله اول ورود استفاده می‌شود:
 *       - اگر کاربر وجود داشته باشد و رمز داشته باشد → پیام "با رمز وارد شوید"
 *       - اگر کاربر وجود داشته باشد و رمز نداشته باشد → ارسال OTP
 *       - اگر کاربر وجود نداشته باشد → ارسال OTP برای ثبت‌نام
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthInput'
 *     responses:
 *       200:
 *         description: نتیجه بررسی
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: خطای اعتبارسنجی
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: خطا در ارسال پیامک
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/login-password:
 *   post:
 *     summary: ورود با شماره تلفن و رمز عبور
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginWithPasswordInput'
 *     responses:
 *       200:
 *         description: ورود موفق
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: خطای اعتبارسنجی
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: شماره تلفن یا رمز عبور اشتباه
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/login-otp:
 *   post:
 *     summary: ورود با شماره تلفن و رمز یکبار مصرف
 *     tags: [Auth]
 *     security: []
 *     description: |
 *       اگر کاربر وجود نداشته باشد، به صورت خودکار ثبت‌نام می‌شود و یک سبد خرید برایش ایجاد می‌شود.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginWithOtpInput'
 *     responses:
 *       200:
 *         description: ورود موفق
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: خطای اعتبارسنجی
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: کد نامعتبر یا منقضی شده
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: ارسال مجدد کد یکبار مصرف
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendCodeInput'
 *     responses:
 *       200:
 *         description: کد با موفقیت ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "رمز یکبار مصرف ارسال شد"
 *       400:
 *         description: خطای اعتبارسنجی
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: خطا در ارسال پیامک
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: فراموشی رمز عبور و تنظیم رمز جدید
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordInput'
 *     responses:
 *       200:
 *         description: رمز عبور با موفقیت تغییر کرد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "تغییر رمز عبور با موفقیت انجام شد"
 *       400:
 *         description: خطای اعتبارسنجی
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: کد نامعتبر یا منقضی شده
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: کاربر یافت نشد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */