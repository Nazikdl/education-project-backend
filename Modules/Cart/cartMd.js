import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    categoryIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    },
    lessonIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    },
   
  },
  { _id: false },
);
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [itemSchema],
      default: [],
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    finalPriceAfterDiscount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    cartQuantity: {
      type: Number,
      default: 1,
    },
  },

  { timestamps: true },
);
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
