import mongoose from "mongoose";

// ✅ پیشرفت هر درس
const lessonProgressSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "درس الزامی است"],
    },
    watchedSeconds: {
      type: Number,
      default: 0,
      min: [0, "زمان تماشا نمی‌تواند منفی باشد"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ✅ پیشرفت هر دوره
const progressSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "انتخاب دوره الزامی است"],
    },
    lessons: {
      type: [lessonProgressSchema],
      default: [],
    },
    percentage: {
      type: Number,
      default: 0,
      min: [0, "درصد نمی‌تواند منفی باشد"],
      max: [100, "درصد نمی‌تواند بیشتر از 100 باشد"],
    },
    lastLessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },
    lastWatchedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
      match: [/^09\d{9}$/, "شماره تلفن نامعتبر است"],
      required: [true, "شماره تلفن الزامی است"],
      unique: [true, "شماره تلفن قبلاً ثبت شده است"],
    },
    fullName: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin", "student", "instructor"],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratedCourseIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
      default: [],
    },
    favoriteCourseIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
      default: [],
    },
    boughtCourseIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
      default: [],
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    birthYear: {
      type: Date,
      default: null,
    },
    progress: {
      type: [progressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;