import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import mongoose from "mongoose";
import Order from "./orderMd.js";
import Cart from "../Cart/cartMd.js";
import Course from "../Course/courseMd.js";
import User from "../User/userMd.js";
import DiscountCode from "../DiscountCode/discountCodeMd.js";
import { checkCode } from "../DiscountCode/discountCodeCn.js";
import {
  createPayment,
  verifyPayment,
  ZARINPAL,
} from "../../Services/ZarinpalService.js";

export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role !== "admin" && req.role !== "superAdmin"
      ? { userId: req.userId }
      : {};

  const features = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["orderCode"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "fullName phoneNumber" },
      { path: "discountCodeId", select: "code type value" },
    ]);

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role !== "admin" && req.role !== "superAdmin"
      ? { userId: req.userId, _id: req.params.id }
      : { _id: req.params.id };

  const features = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["orderCode"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "fullName phoneNumber" },
      { path: "discountCodeId", select: "code type value" },
    ]);

  const result = await features.execute();

  if (!result.data) {
    return next(new HandleERROR("سفارش یافت نشد", 404));
  }

  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  const { userId, orderCode, ...otherData } = req.body;

  const order = await Order.findByIdAndUpdate(req.params.id, otherData, {
    runValidators: true,
    new: true,
  });

  if (!order) {
    return next(new HandleERROR("سفارش یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: order,
    message: "سفارش با موفقیت به‌روزرسانی شد",
  });
});

export const requestPayment = catchAsync(async (req, res, next) => {
  const { userId } = req;

  const cart = await Cart.findOne({ userId }).populate("items");
  if (!cart || cart.items.length === 0) {
    return next(new HandleERROR("سبد خرید شما خالی است", 400));
  }

  for (const course of cart.items) {
    if (!course) {
      return next(new HandleERROR("یکی از دوره‌ها یافت نشد", 404));
    }
    if (!course.inStock) {
      return next(
        new HandleERROR(`دوره "${course.title}" ناموجود است`, 400)
      );
    }
    if (!course.isPublished || course.status !== "approved") {
      return next(
        new HandleERROR(`دوره "${course.title}" قابل خریداری نیست`, 400)
      );
    }
  }

  const user = await User.findById(userId).select("boughtCourseIds");
  const courseIds = cart.items.map((c) => c._id.toString());
  const alreadyBought = user.boughtCourseIds
    .map(String)
    .some((id) => courseIds.includes(id));

  if (alreadyBought) {
    return next(
      new HandleERROR("شما قبلاً یکی از این دوره‌ها را خریده‌اید", 400)
    );
  }

  let discountCodeId = null;
  if (cart.discountCode) {
    const discountCode = await DiscountCode.findById(cart.discountCode);
    if (!discountCode) {
      return next(new HandleERROR("کد تخفیف یافت نشد", 404));
    }

    const checkResult = checkCode(userId, discountCode, cart);
    if (!checkResult.success) {
      return next(new HandleERROR(checkResult.message, 400));
    }

    discountCodeId = discountCode._id;
  }

  const items = cart.items.map((course) => ({
    courseId: course._id,
    title: course.title,
    image: course.image,
    price: course.price,
    finalPrice: course.finalPrice,
    instructorId: course.instructorId,
  }));

  const order = await Order.create({
    userId,
    items,
    discountCodeId,
  });

  const bankReq = await createPayment(
    order.finalPriceAfterDiscount,
    `سفارش ${order.orderCode}`
  );

  if (bankReq.data.code !== 100) {
    await Order.findByIdAndDelete(order._id);
    return next(new HandleERROR("خطا در اتصال به درگاه پرداخت", 400));
  }

  order.authority = bankReq.data.authority;
  await order.save();

  return res.status(200).json({
    success: true,
    data: {
      orderCode: order.orderCode,
      bankUrl: ZARINPAL.GATEWAY + bankReq.data.authority,
      amount: order.finalPriceAfterDiscount,
    },
    message: "درخواست پرداخت با موفقیت ثبت شد",
  });
});

export const verify = catchAsync(async (req, res, next) => {
  const { authority } = req.body;

  const order = await Order.findOne({ authority });
  if (!order) {
    return next(new HandleERROR("سفارش یافت نشد", 400));
  }

  if (order.status !== "pending") {
    return next(new HandleERROR("این سفارش قبلاً پردازش شده است", 400));
  }

  const verifyResult = await verifyPayment(
    order.finalPriceAfterDiscount,
    order.authority
  );

  if (verifyResult.data.code !== 100 && verifyResult.data.code !== 101) {
    order.status = "failed";
    await order.save();
    return res.status(200).json({
      success: false,
      message: "پرداخت ناموفق بود",
    });
  }

  if (verifyResult.data.code === 101) {
    return res.status(200).json({
      success: true,
      message: "این پرداخت قبلاً تأیید شده است",
    });
  }

  if (order.discountCodeId) {
    const discount = await DiscountCode.findById(order.discountCodeId);
    if (discount) {
      discount.usedCount += 1;

      const existing = discount.userIdUsed.find(
        (item) => item.userId.toString() === order.userId.toString()
      );

      if (existing) {
        existing.count += 1;
      } else {
        discount.userIdUsed.push({ userId: order.userId, count: 1 });
      }

      await discount.save();
    }
  }

  const courseIds = order.items.map((item) => item.courseId);
  await User.findByIdAndUpdate(order.userId, {
    $addToSet: { boughtCourseIds: { $each: courseIds } },
  });

  await Course.updateMany(
    { _id: { $in: courseIds } },
    { $inc: { boughtCount: 1 } }
  );

  order.status = "success";
  order.refId = verifyResult.data.ref_id;
  order.paymentDate = new Date();
  await order.save();

  await Cart.findByIdAndUpdate(order.userId, {
    items: [],
    totalPrice: 0,
    finalPrice: 0,
    totalDiscount: 0,
    cartQuantity: 0,
    discountCode: null,
    discountValue: 0,
    finalPriceAfterDiscount: 0,
  });

  return res.status(200).json({
    success: true,
    data: {
      orderCode: order.orderCode,
      refId: verifyResult.data.ref_id,
    },
    message: "پرداخت با موفقیت تأیید شد",
  });
});