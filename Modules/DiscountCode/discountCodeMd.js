import mongoose from "mongoose";
const userUsedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  count: {
    type: Number,
    default: 1,
  },
});
const discountCodeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "type is required"],
    },
    value: {
      type: Number,
      min: [0, "min value is 0"],
      required: [true, "value is required"],
      validate: {
        validator: function (val) {
          if (this.type == "percentage") {
            return val <= 100;
          } else {
            return true;
          }
        },
        message: "for percentage type value must be lower or equal 100",
      },
    },
    startTime: {
      type: Date,
    },
    expireTime: {
      type: Date,
    },
    minPrice: {
      type: Number,
    },
    maxPrice: {
      type: Number,
    },
    code: {
      type: String,
      required: [true, "code is required"],
      unique: [true, "code already taken"],
      trim: true,
    },
    usageLimit: {
      type: Number,
      required: [true, "usage limit is required"],
      min: [1, "min usage limit is 1"],
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    userUsedLimit: {
      type: Number,
      required: [true, "usage used limit is required"],
      min: [1, "min usage used limit is 1"],
    },
    userIdUsed: {
      type: [userUsedSchema],
      default: [],
    },
   
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);
export default DiscountCode;
