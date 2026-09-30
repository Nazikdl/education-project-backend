import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import DiscountCode from "./discountCodeMd.js";
import Cart from "../Cart/cartMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const feature = new ApiFeatures(DiscountCode, req.query, req.role)
    .filter()
    .search(["code"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "userIdUsed",
        populate: { path: "userId", select: "fullName phoneNumber role" },
      },
    ]);
  const result = await feature.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const feature = new ApiFeatures(DiscountCode, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .search(["code"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "userIdUsed",
        populate: { path: "userId", select: "fullName phoneNumber role" },
      },
    ]);
  const result = await feature.execute();
  return res.status(200).json(result);
});
export const create = catchAsync(async (req, res, next) => {
  const discount = await DiscountCode.create(req.body);
  return res.status(201).json({
    success: true,
    data: discount,
    message: "discount code created successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const discount = await DiscountCode.findById(req.params.id);
  if (discount.usedCount > 0) {
    return next(
      new HandleERROR(
        "you can not delete code because this code used before by at least one user , change published instead",
        400,
      ),
    );
  }
  await DiscountCode.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    success: true,
    message: "discount code removed successfully",
  });
});
export const update = catchAsync(async (req, res, next) => {
  const discount = await DiscountCode.findById(req.params.id);
  const {
    code = null,
    usedCount = null,
    userUsedLimit = null,
    userIdUsed = null,
    value = null,
    type = null,
    ...otherData
  } = req.body;
  let newDiscount;
  if (discount.usedCount > 0) {
    newDiscount = await DiscountCode.findByIdAndUpdate(
      req.params.id,
      otherData,
      { new: true, runValidators: true },
    );
  } else {
    newDiscount = await DiscountCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
  }
  return res.status(200).json({
    success: true,
    data: newDiscount,
    message: "discount code updated successfully",
  });
});
export const checkCode = (userId, discountCode, cart) => {
  const err = [];
  const now = new Date();
  if (discountCode.expireTime && discountCode.expireTime < now) {
    err.push(`discount code expired at ${discountCode.expireTime}`);
  }
  if (discountCode.startTime && discountCode.startTime > now) {
    err.push(`discount code start at ${discountCode.startTime}`);
  }
  if (discountCode.minPrice && discountCode.minPrice > cart.finalPrice) {
    err.push(`min price for this code is ${discountCode.minPrice}`);
  }
  if (discountCode.maxPrice && discountCode.maxPrice < cart.finalPrice) {
    err.push(`max price for this code is ${discountCode.maxPrice}`);
  }
  if (discountCode.usedCount >= discountCode.usageLimit) {
    err.push(`limit use for this code is finished`);
  }
  if (!discountCode.isPublished) {
    err.push("discount code is not available");
  }
  const userUsed = discountCode.userIdUsed?.find(
    (item) => item.userId.toString() == userId.toString(),
  );
  if (userUsed && userUsed.count >= discountCode.userUsedLimit) {
    err.push(`user used limit is ${discountCode.userUsedLimit}`);
  }
  return {
    success: err.length == 0 ? true : false,
    message: err.join("-"),
  };
};
export const checkDiscountCode = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const cart = await Cart.findOne({ userId });
  const { code } = req.body;
  const discountCode = await DiscountCode.findOne({ code });
  if (!discountCode) {
    return next(new HandleERROR("invalid discount code", 404));
  }
  const result = checkCode(userId, discountCode, cart);
  if (!result.success) {
    return next(new HandleERROR(result.message, 400));
  }
  let discountValue = 0;
  if (discountCode.type === "fixed") {
    discountValue = discountCode.value;
  } else {
    discountValue = (cart.finalPrice * (discountCode.value / 100)).toFixed(2);
  }
  const finalPriceAfterDiscount = cart.finalPrice - discountValue;
  return res.status(200).json({
    success: true,
    data: {
      discountValue,
      finalPriceAfterDiscount,
    },
  });
});
