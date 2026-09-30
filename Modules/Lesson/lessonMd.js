import mongoose from "mongoose";
import slugify from "slugify";

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "دوره الزامی است"],
    },
    title: {
      type: String,
      required: [true, "عنوان درس الزامی است"],
      trim: true,
      minlength: [2, "عنوان باید حداقل 2 کاراکتر باشد"],
      maxlength: [150, "عنوان نمی‌تواند بیشتر از 150 کاراکتر باشد"],
    },
    slug: {
      type: String,
      index: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "توضیحات نمی‌تواند بیشتر از 1000 کاراکتر باشد"],
    },
    image: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      required: [true, "ویدیو درس الزامی است"],
    },
    videoTime: {
      type: Number,
      required: [true, "مدت زمان ویدیو الزامی است"],
      min: [1, "مدت زمان باید حداقل 1 دقیقه باشد"],
    },
    attachments: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

lessonSchema.pre("save", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "fa",
      trim: true,
    });
  }
});

lessonSchema.index({ courseId: 1, order: 1 });
lessonSchema.index({ courseId: 1, isPublished: 1 });

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;