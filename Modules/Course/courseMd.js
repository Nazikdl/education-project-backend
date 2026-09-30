import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "استاد دوره الزامی است"],
    },
    lessonIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
      default: [],
    },
    categoryIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
      default: [],
    },
    prerequisites: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
      default: [],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "عنوان دوره الزامی است"],
      unique: [true, "این عنوان قبلاً استفاده شده است"],
      minlength: [3, "عنوان باید حداقل 3 کاراکتر باشد"],
      maxlength: [150, "عنوان نمی‌تواند بیشتر از 150 کاراکتر باشد"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "توضیحات دوره الزامی است"],
      minlength: [10, "توضیحات باید حداقل 10 کاراکتر باشد"],
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    previewVideo: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    level: {
      type: String,
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message:
          "سطح دوره باید یکی از این مقادیر باشد: beginner, intermediate, advanced",
      },
      default: "beginner",
    },
    language: {
      type: String,
      default: "fa",
    },
    totalDuration: {
      type: Number,
      default: 0,
      min: [0, "مدت زمان نمی‌تواند منفی باشد"],
    },
    lessonCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد درس نمی‌تواند منفی باشد"],
    },
    boughtCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد خرید نمی‌تواند منفی باشد"],
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد امتیاز نمی‌تواند منفی باشد"],
    },
    avgRating: {
      type: Number,
      default: 0,
      min: [0, "میانگین امتیاز نمی‌تواند منفی باشد"],
      max: [5, "میانگین امتیاز نمی‌تواند بیشتر از 5 باشد"],
    },
    discountPercent: {
      type: Number,
      min: [0, "درصد تخفیف نمی‌تواند منفی باشد"],
      max: [100, "درصد تخفیف نمی‌تواند بیشتر از 100 باشد"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "قیمت دوره الزامی است"],
      min: [0, "قیمت نمی‌تواند منفی باشد"],
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
      min: [0, "قیمت نهایی نمی‌تواند منفی باشد"],
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message:
          "وضعیت دوره باید یکی از این مقادیر باشد: pending, approved, rejected",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

courseSchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "fa",
      trim: true,
    });
  }

  this.finalPrice = this.price - (this.price * this.discountPercent) / 100;
  this.isFree = this.finalPrice === 0;
  this.lessonCount = this.lessonIds.length;

  if (this.isModified("lessonIds") || this.isNew) {
    const Lesson = mongoose.model("Lesson");
    const lessons = await Lesson.find({
      _id: { $in: this.lessonIds },
    }).select("videoTime");
    this.totalDuration = lessons.reduce(
      (sum, l) => sum + (l.videoTime || 0),
      0
    );
  }
});

courseSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.title) {
    update.slug = slugify(update.title, {
      lower: true,
      strict: true,
      locale: "fa",
      trim: true,
    });
  }

  if (update.price !== undefined || update.discountPercent !== undefined) {
    const price = update.price ?? 0;
    const discount = update.discountPercent ?? 0;
    update.finalPrice = price - (price * discount) / 100;
    update.isFree = update.finalPrice === 0;
  }

  if (update.lessonIds) {
    update.lessonCount = update.lessonIds.length;
  }

  this.setUpdate(update);
});

courseSchema.index({ isPublished: 1, isFree: 1, createdAt: -1 });
courseSchema.index({ status: 1 });
courseSchema.index({ categoryIds: 1 });
courseSchema.index({ instructorId: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ avgRating: -1 });

const Course = mongoose.model("Course", courseSchema);
export default Course;