import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "انتخاب دوره الزامی است"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه کاربر الزامی است"],
    },
    replyIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      default: [],
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: [true, "متن پیام الزامی است"],
      trim: true,
      minlength: [2, "متن نظر باید حداقل 2 کاراکتر باشد"],
      maxlength: [1000, "متن نظر نمی‌تواند بیشتر از 1000 کاراکتر باشد"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    role: {
      type: String,
      enum: ["instructor", "admin", "superAdmin", "student"],
      default: "student",
    },
    isBought: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.index({ courseId: 1, isPublished: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ replyIds: 1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;