import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Cart from "./cartMd.js";
import Course from "../Course/courseMd.js";

export const updateCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate({
    path: "item.courseId",
  });
  cart.items = cart.items.filter((item) => {
    if (item.cartQuantity > item.productVariantId.quantity) {
      item.cartQuantity = item.productVariantId.quantity;
      if (item.cartQuantity == 0) {
        return false;
      }
    }
    return item;
  });
  //اگه دوره ناموجود بود
  let totalPrice = 0;
  let finalPrice = 0;
  for (let item of cart.items) {
    totalPrice += item.courseId.price * item.cartQuantity;
    finalPrice += item.courseId.finalPrice * item.cartQuantity;
  }
  cart.finalPrice = finalPrice;
  cart.totalPrice = totalPrice;
  await cart.save();
};
export const getOne = catchAsync(async (req, res, next) => {
  await updateCart(req.userId);
  const feature = new ApiFeatures(Cart, req.query, req.role)
    .addManualFilters({ userId: req.userId })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "items",
        populate: [
          { path: "courseId", select: "images title slug" },
          { path: "lessonIds", populate: { path: "title image" } },
          { path: "categoryIds", select: "image title" },
        ],
      },
    ]);
  const result = await feature.execute();
  return res.status(200).json(result);
});
export const clearCart = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const cart = await Cart.findOne({ userId });
  cart.items = [];
  cart.totalPrice = 0;
  cart.finalPrice = 0;
  const newCart = await cart.save();
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "سبد خرید شما پاک شد",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.courseId",
  });
  const { totalRemove = false, courseId = null } = req.body;
  if (!courseId) {
    return next(new HandleERROR("انتخاب دوره الزامی است", 400));
  }
  cart.items = cart.items.filter((item) => {
    if (item.courseId.toString() == courseId.toString()) {
      cart.totalPrice -= item.courseId.price;
      cart.finalPrice -= item.courseId.finalPrice;
      item.cartQuantity--;
      if (totalRemove || item.cartQuantity == 0) {
        return false;
      }
    }
    return item;
  });
  const newCart = await cart.save();
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "ایتم با موفقیت از سبد خرید شما حذف شد",
  });
});
export const addItem = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.courseId",
  });
  const { courseId = null } = req.body;
  if (!courseId) {
    return next(new HandleERROR("انتخاب دوره الزامی است", 400));
  }
  let isExist = false;
  let error = false;
  cart.items = cart.items.map((item) => {
    if (item.courseId._id.toString() == courseId.toString()) {
      isExist = true;
      cart.totalPrice += item.courseId.price;
      cart.finalPrice += item.courseId.finalPrice;
      item.cartQuantity++;
      if (item.cartQuantity > item.courseId.quantity) {
        error = true;
      }
    }
    return item;
  });
  const course = await Course.findById(courseId).populate({ path: "courseId" });
  if (error || course.quantity == 0) {
    return next(
      new HandleERROR(`max quantity of this item is ${course.quantity}`, 400),
    );
  }
  if (!isExist) {
    cart.items.push({
      courseId,
      lessonId: course.lessonIds._id,
      categoryIds: course.categoryIds,
      cartQuantity: 1,
    });
    cart.finalPrice += course.finalPrice;
    cart.totalPrice += course.price;
  }

  const newCart = await cart.save();
  await newCart.populate([
    { path: "courseId", select: "image title slug" },
    { path: "lessonIds", select: "title image" },
    { path: "categoryIds", select: "image title" },
  ]);
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "ایتم با موفقیت به سبد خرید اضافه شد",
  });
});
