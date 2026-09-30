import { catchAsync, HandleERROR } from "vanta-api";
import Cart from "./cartMd.js";
import Course from "../Course/courseMd.js";
import User from "../User/userMd.js";

const updateCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate("items");

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  cart.items = cart.items.filter((course) => course && course.inStock);

  let totalPrice = 0;
  let finalPrice = 0;
  for (const course of cart.items) {
    totalPrice += course.price;
    finalPrice += course.finalPrice;
  }

  cart.totalPrice = totalPrice;
  cart.finalPrice = finalPrice;
  cart.totalDiscount = totalPrice - finalPrice;
  cart.cartQuantity = cart.items.length;

  if (cart.discountCode && cart.discountValue > 0) {
    cart.finalPriceAfterDiscount = Math.max(0, finalPrice - cart.discountValue);
  } else {
    cart.finalPriceAfterDiscount = finalPrice;
  }

  await cart.save();

  return await cart.populate({
    path: "items",
    select: "title image price finalPrice discountPercent slug inStock",
  });
};

export const getOne = catchAsync(async (req, res, next) => {
  const cart = await updateCart(req.userId);

  return res.status(200).json({
    success: true,
    data: {
      ...cart.toObject(),
      isEmpty: cart.items.length === 0,
    },
  });
});

export const addItem = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const { courseId } = req.body;

  if (!courseId) {
    return next(new HandleERROR("انتخاب دوره الزامی است", 400));
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  if (!course.inStock) {
    return next(new HandleERROR("این دوره ناموجود است", 400));
  }

  if (!course.isPublished || course.status !== "approved") {
    return next(new HandleERROR("این دوره قابل خریداری نیست", 400));
  }

  const user = await User.findById(userId).select("boughtCourseIds");
  const alreadyBought = user.boughtCourseIds
    .map(String)
    .includes(courseId.toString());

  if (alreadyBought) {
    return next(new HandleERROR("شما قبلاً این دوره را خریده‌اید", 400));
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const isExist = cart.items.map(String).includes(courseId.toString());
  if (isExist) {
    return next(new HandleERROR("این دوره قبلاً در سبد خرید شماست", 400));
  }

  cart.items.push(courseId);
  await cart.save();

  const updatedCart = await updateCart(userId);

  return res.status(200).json({
    success: true,
    data: {
      ...updatedCart.toObject(),
      isEmpty: updatedCart.items.length === 0,
    },
    message: "دوره با موفقیت به سبد خرید اضافه شد",
  });
});

// ==================== REMOVE ITEM ====================
export const remove = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const { courseId } = req.body;

  if (!courseId) {
    return next(new HandleERROR("انتخاب دوره الزامی است", 400));
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new HandleERROR("سبد خرید یافت نشد", 404));
  }

  const isExist = cart.items.map(String).includes(courseId.toString());
  if (!isExist) {
    return next(new HandleERROR("این دوره در سبد خرید شما نیست", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.toString() !== courseId.toString()
  );
  await cart.save();

  const updatedCart = await updateCart(userId);

  return res.status(200).json({
    success: true,
    data: {
      ...updatedCart.toObject(),
      isEmpty: updatedCart.items.length === 0,
    },
    message: "دوره با موفقیت از سبد خرید حذف شد",
  });
});

// ==================== CLEAR CART ====================
export const clearCart = catchAsync(async (req, res, next) => {
  const { userId } = req;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new HandleERROR("سبد خرید یافت نشد", 404));
  }

  cart.items = [];
  cart.totalPrice = 0;
  cart.finalPrice = 0;
  cart.totalDiscount = 0;
  cart.cartQuantity = 0;
  cart.discountCode = null;
  cart.discountValue = 0;
  cart.finalPriceAfterDiscount = 0;
  await cart.save();

  return res.status(200).json({
    success: true,
    data: {
      ...cart.toObject(),
      isEmpty: true,
    },
    message: "سبد خرید شما پاک شد",
  });
});