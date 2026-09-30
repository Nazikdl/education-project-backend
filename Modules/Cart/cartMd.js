import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "کاربر الزامی است"],
      unique: true,
    },
    items: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    cartQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscountCode",
      default: null,
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalPriceAfterDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;