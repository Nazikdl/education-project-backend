import mongoose from "mongoose";
import DiscountCode from "../DiscountCode/discountCodeMd.js";

const generateOrderCode = async () => {
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}-`;

  const lastOrder = await mongoose
    .model("Order")
    .findOne({ orderCode: { $regex: `^${prefix}` } })
    .sort({ createdAt: -1 })
    .select("orderCode");

  let newNumber = 1;
  if (lastOrder) {
    const parts = lastOrder.orderCode.split("-");
    newNumber = parseInt(parts[2]) + 1;
  }

  return `${prefix}${newNumber.toString().padStart(9, "0")}`;
};

const calculateOrderPrices = async (order) => {
  let totalPrice = 0;
  let finalPrice = 0;

  const items = order.items || [];
  for (const item of items) {
    totalPrice += item.price || 0;
    finalPrice += item.finalPrice || 0;
  }

  order.totalPrice = +totalPrice.toFixed(2);
  order.finalPrice = +finalPrice.toFixed(2);
  order.finalPriceAfterDiscount = order.finalPrice;

  if (order.discountCodeId) {
    const discountCode = await DiscountCode.findById(order.discountCodeId);
    if (discountCode) {
      if (discountCode.type === "fixed") {
        order.finalPriceAfterDiscount -= discountCode.value;
      } else {
        order.finalPriceAfterDiscount = +(
          order.finalPriceAfterDiscount *
          (1 - discountCode.value / 100)
        ).toFixed(2);
      }

      order.finalPriceAfterDiscount = Math.max(
        0,
        order.finalPriceAfterDiscount
      );
    }
  }
};

const itemSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "دوره الزامی است"],
    },
    title: {
      type: String,
      required: [true, "عنوان دوره الزامی است"],
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "قیمت الزامی است"],
    },
    finalPrice: {
      type: Number,
      required: [true, "قیمت نهایی الزامی است"],
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "کاربر الزامی است"],
    },
    orderCode: {
      type: String,
      unique: true,
    },
    items: {
      type: [itemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    finalPriceAfterDiscount: {
      type: Number,
      default: 0,
    },
    discountCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscountCode",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "canceled"],
      default: "pending",
    },
    authority: {
      type: String,
      default: "",
    },
    refId: {
      type: String,
      default: "",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function () {
  if (this.isNew && !this.orderCode) {
    this.orderCode = await generateOrderCode();
  }
  await calculateOrderPrices(this);
});

orderSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  const updateData = update.$set || update;

  const currentOrder = await this.model.findOne(this.getQuery());
  if (!currentOrder) return;

  const order = {
    items: updateData.items || currentOrder.items,
    discountCodeId: updateData.discountCodeId ?? currentOrder.discountCodeId,
  };

  await calculateOrderPrices(order);

  this.set({
    totalPrice: order.totalPrice,
    finalPrice: order.finalPrice,
    finalPriceAfterDiscount: order.finalPriceAfterDiscount,
  });
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ authority: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;