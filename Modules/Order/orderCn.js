import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Order from "./orderMd.js";
import { updatedCart } from "../Cart/cartCn.js";
import Cart from "../Cart/cartMd.js";
import Discount from "../DiscountCode/discountMd.js";
import { checkCode } from "../DiscountCode/discountCn.js";
import Address from "../Address/addressMd.js";
import {
  createPayment,
  verifyPayment,
  ZARINPAL,
} from "../../Services/ZarinpalService.js";
import ProductVariant from "../ProductVariant/productVariantMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role != "admin" && req.role != "superAdmin"
      ? { userId: req.userId }
      : {};
  const feature = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["orderCode"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "userId",
        select: "fullName phoneNumber",
      },
      {
        path: "items.productId",
        select: "title images slug",
      },
      { path: "discountCodeId" },
    ]);
  const result = await feature.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role != "admin" && req.role != "superAdmin"
      ? { userId: req.userId, _id: req.params.id }
      : { _id: req.params.id };
  const feature = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["orderCode"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "userId",
        select: "fullName phoneNumber",
      },
      {
        path: "items.productId",
        select: "title images slug",
      },
      { path: "discountCodeId" },
    ]);
  const result = await feature.execute();
  return res.status(200).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  const { userId = null, orderCode = null, ...otherData } = req.body;
  const { id } = req.params;
  const order = await Order.findByIdAndUpdate(id, otherData, {
    runValidators: true,
    new: true,
  });
  return res.status(200).json({
    success: true,
    data: order,
    message: "order updated successfully",
  });
});

export const requestPayment = catchAsync(async (req, res, next) => {
  const { code = null, addressId } = req.body;
  const { userId } = req;
  const change = await updatedCart(userId);
  if (change) {
    return next(
      new HandleERROR(
        "you have some changes in your cart please check it again",
        400,
      ),
    );
  }
  const address = await Address.findById(addressId);
  if (!address) {
    return next(new HandleERROR("invalid address", 400));
  }
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productVariantId",
    populate: {
      path: "variantId",
    },
  });
  if (cart.items.length == 0) {
    return next(new HandleERROR("your cart is empty", 400));
  }
  let discountCodeId = null;
  if (code) {
    discountCodeId = await Discount.findOne({ code });
    if (!discountCodeId) {
      return next(new HandleERROR("invalid discount code", 400));
    }
    const checkDisCode = checkCode(userId, discountCodeId, cart);
    if (!checkDisCode.success) {
      return next(new HandleERROR(checkDisCode.message, 400));
    }
  }
  const order = await Order.create({
    userId,
    items: cart.items,
    address,
    discountCodeId,
  });
  const bankReq = await createPayment(
    order.finalPriceAfterDiscount,
    "i3center",
  );
  if (bankReq.data.code != 100) {
    await Order.findByIdAndDelete(order._id);
    return next(new HandleERROR("failed to request payment", 400));
  }
  order.authority = bankReq.data.authority;
  await order.save();
  return res.status(200).json({
    success: true,
    data: {
      bankUrl: ZARINPAL.GATEWAY + bankReq.data.authority,
      amount: order.finalPriceAfterDiscount,
    },
    message: "payment requested successfully",
  });
});
export const verify = catchAsync(async (req, res, next) => {
  const { authority } = req.body;
  const order = await Order.findOne({ authority });
  if (!order) {
    return next(new HandleERROR("invalid authority", 400));
  }
  if (order.status != "pending") {
    return next(new HandleERROR("order is not pending", 400));
  }
  const verifyResult = await verifyPayment(
    order.finalPriceAfterDiscount,
    order.authority,
  );
  if (verifyResult.data.code != 100 && verifyResult.data.code != 101) {
    order.status = "failed";
    await order.save();
    return res.status(200).json({
      success: false,
      message: "payment failed",
    });
  }
  if (verifyResult.data.code == 101) {
    return res.status(200).json({
      success: true,
      message: "payment already verified",
    });
  }
  if (order.discountCodeId) {
    const discount = await Discount.findById(order.discountCodeId);
    discount.usedCount++;
    let exist = false;
    discount.userIdUsed = discount.userIdUsed?.map((item) => {
      if (item.userId.toString() == order.userId.toString()) {
        exist = true;
        item.count++;
      }
      return item;
    });
    if (!exist) {
      discount.userIdUsed.push({ userId: order.userId, count: 1 });
    }
    await discount.save();
  }
  for (let item of order.items) {
    const productVariant = await ProductVariant.findById(
      item.productVariantId._id,
    );
    let boughtCount = item.cartQuantity;
    if (item.cartQuantity <= productVariant.quantity) {
      productVariant.quantity -= item.cartQuantity;
    }
    if (item.cartQuantity > productVariant.quantity) {
      boughtCount = productVariant.quantity;
      order.stockIssueItems.push({
        productVariantId: item.productVariantId,
        cartQuantity: item.cartQuantity,
        sufficientQuantity: productVariant.quantity,
      });
      order.items = order.items.filter((cartItem) => {
        if (
          cartItem.productVariantId._id.toString() ===
          item.productVariantId._id.toString()
        ) {
          cartItem.cartQuantity = boughtCount;
          if (cartItem.cartQuantity == 0) {
            return false;
          }
        }
        return cartItem;
      });
      order.status = "stockIssue";
      productVariant.quantity = 0;
    }
    productVariant.boughtCount += boughtCount;
    await productVariant.save();
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { boughtCount: boughtCount },
    });
    await User.findByIdAndUpdate(userId, {
      $push: { boughtProductIds: item.productId },
    });
  }
  let cashBack = 0;
  if (order.stockIssueItems?.length > 0) {
    order.stockIssueItems?.map((item) => {
      cashBack +=
        item.productVariantId?.finalPrice *
        (item.cartQuantity - item.sufficientQuantity);
    });
  }
  if (order.discountCodeId) {
    cashBack *= order.finalPriceAfterDiscount / order.finalPrice;
  }
  order.cashBack = cashBack;
  order.refId = verifyResult.data.ref_id;
  await order.save();
  await Cart.findByIdAndUpdate(order.userId, {
    items: [],
    totalPrice: 0,
    finalPrice: 0,
  });
  return res.status(200).json({
    success: true,
    data: {
      refId: verifyResult.data.ref_id,
    },
    message: "payment verified successfully",
  });
});

export const cronJobVerify = async () => {
  try {
    const orders = await Order.find({
      status: "pending",
      createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) },
    });
    for (let order of orders) {
      const verifyResult = await verifyPayment(
        order.finalPriceAfterDiscount,
        order.authority,
      );
      if (verifyResult.data.code != 100 && verifyResult.data.code != 101) {
        order.status = "failed";
        await order.save();
        return res.status(200).json({
          success: false,
          message: "payment failed",
        });
      }
      if (verifyResult.data.code == 101) {
        return res.status(200).json({
          success: true,
          message: "payment already verified",
        });
      }
      if (order.discountCodeId) {
        const discount = await Discount.findById(order.discountCodeId);
        discount.usedCount++;
        let exist = false;
        discount.userIdUsed = discount.userIdUsed?.map((item) => {
          if (item.userId.toString() == order.userId.toString()) {
            exist = true;
            item.count++;
          }
          return item;
        });
        if (!exist) {
          discount.userIdUsed.push({ userId: order.userId, count: 1 });
        }
        await discount.save();
      }
      for (let item of order.items) {
        const productVariant = await ProductVariant.findById(
          item.productVariantId._id,
        );
        let boughtCount = item.cartQuantity;
        if (item.cartQuantity <= productVariant.quantity) {
          productVariant.quantity -= item.cartQuantity;
        }
        if (item.cartQuantity > productVariant.quantity) {
          boughtCount = productVariant.quantity;
          order.stockIssueItems.push({
            productVariantId: item.productVariantId,
            cartQuantity: item.cartQuantity,
            sufficientQuantity: productVariant.quantity,
          });
          order.items = order.items.filter((cartItem) => {
            if (
              cartItem.productVariantId._id.toString() ===
              item.productVariantId._id.toString()
            ) {
              cartItem.cartQuantity = boughtCount;
              if (cartItem.cartQuantity == 0) {
                return false;
              }
            }
            return cartItem;
          });
          order.status = "stockIssue";
          productVariant.quantity = 0;
        }
        productVariant.boughtCount += boughtCount;
        await productVariant.save();
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { boughtCount: boughtCount },
        });
        await User.findByIdAndUpdate(userId, {
          $push: { boughtProductIds: item.productId },
        });
      }
      let cashBack = 0;
      if (order.stockIssueItems?.length > 0) {
        order.stockIssueItems?.map((item) => {
          cashBack +=
            item.productVariantId?.finalPrice *
            (item.cartQuantity - item.sufficientQuantity);
        });
      }
      if (order.discountCodeId) {
        cashBack *= order.finalPriceAfterDiscount / order.finalPrice;
      }
      order.cashBack = cashBack;
      order.refId = verifyResult.data.ref_id;
      await order.save();
      await Cart.findByIdAndUpdate(order.userId, {
        items: [],
        totalPrice: 0,
        finalPrice: 0,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
