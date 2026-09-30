import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import DiscountCode from "./discountCodeMd.js";
import Cart from "../Cart/cartMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(DiscountCode, req.query, req.role)
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

  const result = await features.execute();
  return res.status(200).json(result);
});

// ==================== GET ONE ====================
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(DiscountCode, req.query, req.role)
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

  const result = await features.execute();

  if (!result.data) {
    return next(new HandleERROR("کد تخفیف یافت نشد", 404));
  }

  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const { code, startTime, expireTime } = req.body;

  if (startTime && expireTime && new Date(startTime) >= new Date(expireTime)) {
    return next(
      new HandleERROR("زمان شروع باید قبل از زمان انقضا باشد", 400)
    );
  }

  const discount = await DiscountCode.create({
    ...req.body,
    code: code.toUpperCase().trim(),
  });

  return res.status(201).json({
    success: true,
    data: discount,
    message: "کد تخفیف با موفقیت ایجاد شد",
  });
});

export const update = catchAsync(async (req, res, next) => {
  const discount = await DiscountCode.findById(req.params.id);
  if (!discount) {
    return next(new HandleERROR("کد تخفیف یافت نشد", 404));
  }

  const {
    code,
    usedCount,
    userUsedLimit,
    userIdUsed,
    value,
    type,
    ...otherData
  } = req.body;

  let newDiscount;

  if (discount.usedCount > 0) {
    newDiscount = await DiscountCode.findByIdAndUpdate(
      req.params.id,
      otherData,
      { new: true, runValidators: true }
    );
  } else {
    newDiscount = await DiscountCode.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        code: code ? code.toUpperCase().trim() : undefined,
      },
      { new: true, runValidators: true }
    );
  }

  return res.status(200).json({
    success: true,
    data: newDiscount,
    message: "کد تخفیف با موفقیت به‌روزرسانی شد",
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const discount = await DiscountCode.findById(req.params.id);
  if (!discount) {
    return next(new HandleERROR("کد تخفیف یافت نشد", 404));
  }

  if (discount.usedCount > 0) {
    return next(
      new HandleERROR(
        "این کد قبلاً استفاده شده است و قابل حذف نیست. به جای آن، وضعیت انتشار را تغییر دهید",
        400
      )
    );
  }

  await DiscountCode.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: "کد تخفیف با موفقیت حذف شد",
  });
});

export const checkCode = (userId, discountCode, cart) => {
  const errors = [];
  const now = new Date();

  if (!discountCode.isPublished) {
    errors.push("کد تخفیف در دسترس نیست");
  }

  if (discountCode.startTime && new Date(discountCode.startTime) > now) {
    errors.push("کد تخفیف هنوز فعال نشده است");
  }

  if (discountCode.expireTime && new Date(discountCode.expireTime) < now) {
    errors.push("کد تخفیف منقضی شده است");
  }

  if (!cart || !cart.finalPrice || cart.finalPrice <= 0) {
    errors.push("سبد خرید شما خالی است");
  }

  if (discountCode.minPrice && cart?.finalPrice < discountCode.minPrice) {
    errors.push(`حداقل مبلغ سفارش برای این کد ${discountCode.minPrice} است`);
  }

  if (discountCode.maxPrice && cart?.finalPrice > discountCode.maxPrice) {
    errors.push(`حداکثر مبلغ سفارش برای این کد ${discountCode.maxPrice} است`);
  }

  if (discountCode.usedCount >= discountCode.usageLimit) {
    errors.push("ظرفیت استفاده از این کد تخفیف تکمیل شده است");
  }

  const userUsed = discountCode.userIdUsed?.find(
    (item) => item.userId.toString() === userId.toString()
  );

  if (userUsed && userUsed.count >= discountCode.userUsedLimit) {
    errors.push(
      `شما حداکثر ${discountCode.userUsedLimit} بار می‌توانید از این کد استفاده کنید`
    );
  }

  return {
    success: errors.length === 0,
    errors,
    message: errors.length === 0 ? "کد تخفیف معتبر است" : errors.join(" | "),
  };
};

export const checkDiscountCode = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const { code } = req.body;

  if (!code) {
    return next(new HandleERROR("کد تخفیف الزامی است", 400));
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new HandleERROR("سبد خرید یافت نشد", 404));
  }

  const discountCode = await DiscountCode.findOne({
    code: code.toUpperCase().trim(),
  });

  if (!discountCode) {
    return next(new HandleERROR("کد تخفیف نامعتبر است", 404));
  }

  const result = checkCode(userId, discountCode, cart);
  if (!result.success) {
    return next(new HandleERROR(result.message, 400));
  }

  let discountValue = 0;
  if (discountCode.type === "fixed") {
    discountValue = discountCode.value;
  } else {
    discountValue = +(cart.finalPrice * (discountCode.value / 100)).toFixed(2);
  }

  discountValue = Math.min(discountValue, cart.finalPrice);

  const finalPriceAfterDiscount = cart.finalPrice - discountValue;

  cart.discountCode = discountCode._id;
  cart.discountValue = discountValue;
  cart.finalPriceAfterDiscount = finalPriceAfterDiscount;
  await cart.save();

  return res.status(200).json({
    success: true,
    data: {
      discountCodeId: discountCode._id,
      code: discountCode.code,
      type: discountCode.type,
      value: discountCode.value,
      discountValue,
      priceBeforeDiscount: cart.finalPrice,
      finalPriceAfterDiscount,
    },
    message: "کد تخفیف با موفقیت اعمال شد",
  });
});