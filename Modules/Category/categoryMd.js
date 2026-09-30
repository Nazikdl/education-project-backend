import mongoose from "mongoose";
import slugify from "slugify";

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان دسته الزامی است"],
      unique: [true, "این عنوان قبلاً استفاده شده است"],
      trim: true,
      minlength: [2, "عنوان باید حداقل 2 کاراکتر باشد"],
      maxlength: [50, "عنوان نمی‌تواند بیشتر از 50 کاراکتر باشد"],
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
    isPublished: {
      type: Boolean,
      default: true,
    },
    supCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategoryIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

CategorySchema.pre("save", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "fa",
      trim: true,
    });
  }
});

CategorySchema.index({ supCategoryId: 1 });
CategorySchema.index({ isPublished: 1, createdAt: -1 });

const Category = mongoose.model("Category", CategorySchema);
export default Category;