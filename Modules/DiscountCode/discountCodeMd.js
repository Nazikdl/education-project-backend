import mongoose from "mongoose";

const userUsedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "کاربر الزامی است"],
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

const discountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "کد تخفیف الزامی است"],
      unique: [true, "این کد قبلاً استفاده شده است"],
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: {
        values: ["percentage", "fixed"],
        message: "نوع کد باید percentage یا fixed باشد",
      },
      required: [true, "نوع کد الزامی است"],
    },
    value: {
      type: Number,
      min: [0, "مقدار نمی‌تواند منفی باشد"],
      required: [true, "مقدار کد الزامی است"],
      validate: {
        validator: function (val) {
          if (this.type === "percentage") {
            return val <= 100;
          }
          return true;
        },
        message: "برای نوع percentage، مقدار باید کمتر یا مساوی 100 باشد",
      },
    },
    startTime: {
      type: Date,
      default: null,
    },
    expireTime: {
      type: Date,
      default: null,
    },
    minPrice: {
      type: Number,
      min: [0, "حداقل قیمت نمی‌تواند منفی باشد"],
      default: 0,
    },
    maxPrice: {
      type: Number,
      min: [0, "حداکثر قیمت نمی‌تواند منفی باشد"],
      default: 0,
    },
    usageLimit: {
      type: Number,
      required: [true, "حداکثر استفاده الزامی است"],
      min: [1, "حداکثر استفاده باید حداقل 1 باشد"],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userUsedLimit: {
      type: Number,
      required: [true, "حداکثر استفاده هر کاربر الزامی است"],
      min: [1, "حداکثر استفاده هر کاربر باید حداقل 1 باشد"],
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
  { timestamps: true }
);

discountCodeSchema.index({ isPublished: 1, expireTime: -1 });

const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);
export default DiscountCode;