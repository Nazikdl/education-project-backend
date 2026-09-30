import mongoose from "mongoose";
import DiscountCode from "../DiscountCode/discountMd.js";
const generateOrderCode = async (OD) => {
  let isUnique = false;
  let newCode = "";
  let order = await OD.model
    .findOne()
    .sort({ createdAt: -1 })
    .select("orderCode");

  while (!isUnique) {
    if (order) {
      const oldCode = order.orderCode.split("-");
      const year = new Date().getFullYear();
      if (oldCode[1] != year) {
        newCode = `ORD-${year}-000000001`;
      } else {
        const number = oldCode[2];
        const newNumber = parseInt(number) + 1;
        newCode = `ORD-${year}-${newNumber.toString().padStart(9, "0")}`;
      }
    } else {
      const year = new Date().getFullYear();
      newCode = `ORD-${year}-000000001`;
    }

    const existingCode = await OD.model.findOne({ orderCode: newCode });
    if (existingCode) {
      order = existingCode;
    } else {
      isUnique = true;
    }
  }

  return newCode;
};

const calculateOrderPrices = async (order) => {
  let totalPrice = 0;
  let finalPrice = 0;
  const items = order.items || [];
  for (let item of items) {
    const price = item.productVariantId.price || 0;
    const final = item.productVariantId.finalPrice || 0;
    const qty = item.cartQuantity || 1;
    totalPrice += price * qty;
    finalPrice += final * qty;
  }
  order.totalPrice = +totalPrice.toFixed(2);
  order.finalPrice = +finalPrice.toFixed(2);
  order.finalPriceAfterDiscount = order.finalPrice;
  order.freeShipping = false;
  if (order.discountCodeId) {
    const discountCode = await DiscountCode.findById(order.discountCodeId);
    if (!discountCode) return;
    if (discountCode.type == "fixed") {
      order.finalPriceAfterDiscount -= discountCode.value;
    } else {
      order.finalPriceAfterDiscount = +(
        order.finalPriceAfterDiscount *
        (1 - discountCode.value)
      ).toFixed(2);
    }
    order.freeShipping = discountCode.freeShipping;
  }
};
const stockIssueItemsSchema = new mongoose.Schema(
  {
    productVariantId: {
      type: Object,
      required: [true, "product variant is required"],
    },
    cartQuantity: {
      type: Number,
      required: [true, "cart quantity is required"],
    },
    sufficientQuantity: {
      type: Number,
      required: [true, "sufficient quantity is required"],
    },
  },
  { _id: false },
);
const itemSchema = new mongoose.Schema(
  {
    productVariantId: {
      type: Object,
      required: [true, "product variant is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product is required"],
    },
    cartQuantity: {
      type: Number,
      required: [true, "cart quantity is required"],
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "brand is required"],
    },
    categoryIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "category is required"],
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderCode: {
      type: String,
      unique: true,
    },
    totalPrice: {
      type: Number,
    },
    finalPrice: {
      type: Number,
    },
    finalPriceAfterDiscount: {
      type: Number,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    discountCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscountCode",
    },
    address: {
      type: Object,
      required: [true, "address is required"],
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "stockIssue"],
      default: "pending",
    },
    stockIssueItems: {
      type: [stockIssueItemsSchema],
      default: [],
    },
    items: {
      type: [itemSchema],
      default: [],
    },
    authority: {
      type: String,
      default: "",
    },
    refId: {
      type: String,
      default: "",
    },
    cashBackPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("validate", async function (next) {
  try {
    this.orderCode = await generateOrderCode(this);
    await calculateOrderPrices(this);
  } catch (error) {
    return next(error);
  }
  next();
});
orderSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    const updateData = update.$set || update;
    const currentOrder = await this.model.findOne(this.getQuery());
    if (!currentOrder) {
      return next(new Error("order not found"));
    }
    const order = {
      items: updateData.items || currentOrder.items,
      discountCodeId: updateData.discountCodeId || currentOrder.discountCodeId,
    };
    await calculateOrderPrices(order);
    this.set({
      totalPrice: order.totalPrice,
      finalPrice: order.finalPrice,
      finalPriceAfterDiscount: order.finalPriceAfterDiscount,
      freeShipping: order.freeShipping,
    });
    next();
  } catch (err) {
    return next(err);
  }
});
const Order = mongoose.model("Order", orderSchema);

export default Order;
