import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import User from "../User/userMd.js";
import Comment from "./commentMd.js";
import Course from "../Course/courseMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .filter()
    .search(["content"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "phoneNumber fullName role" },
      { path: "courseId", select: "title image" },
      {
        path: "replyIds",
        populate: { path: "userId", select: "phoneNumber fullName role" },
      },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});

export const getAllCommentOfCourse = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;

  const condition =
    req.role !== "admin" && req.role !== "superAdmin"
      ? { isPublished: true, courseId, isReply: false }
      : { courseId, isReply: false };

  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["content"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "phoneNumber fullName" },
      { path: "courseId", select: "title image" },
      {
        path: "replyIds",
        populate: { path: "userId", select: "phoneNumber fullName role" },
      },
    ]);

  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const { rate = null, content, courseId } = req.body;
  const { userId, role } = req;

  const user = await User.findById(userId);
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  let permissionToRate = false;
  const isBought = !!user.boughtCourseIds?.find(
    (item) => item.toString() === courseId.toString()
  );

  if (
    isBought &&
    !user.ratedCourseIds?.find(
      (item) => item.toString() === courseId.toString()
    )
  ) {
    permissionToRate = true;
  }

  const createData = {
    courseId,
    role,
    content,
    userId,
    isBought,
    isPublished: true,
  };

  if (permissionToRate && rate > 0 && rate <= 5) {
    createData.rate = rate;
  }

  const comment = await Comment.create(createData);

  if (permissionToRate && createData.rate) {
    const newAvg =
      (course.avgRating * course.ratingCount + rate) /
      (course.ratingCount + 1);

    course.avgRating = +newAvg.toFixed(2);
    course.ratingCount += 1;
    await course.save();

    user.ratedCourseIds.push(courseId);
    await user.save();
  }

  return res.status(201).json({
    success: true,
    data: comment,
    message: "نظر با موفقیت ثبت شد",
  });
});
export const reply = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const { userId, role } = req;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new HandleERROR("نظر یافت نشد", 404));
  }

  const isPublished =
    role === "student" || role === "instructor" ? false : true;

  const reply = await Comment.create({
    courseId: comment.courseId,
    userId,
    isReply: true,
    role,
    content,
    isPublished,
  });

  comment.replyIds.push(reply._id);
  await comment.save();

  return res.status(200).json({
    success: true,
    data: reply,
    message: "پاسخ شما برای این نظر با موفقیت ثبت شد",
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new HandleERROR("نظر یافت نشد", 404));
  }

  await Comment.deleteMany({
    _id: { $in: [...comment.replyIds, req.params.id] },
  });

  return res.status(200).json({
    success: true,
    message: "نظر با موفقیت حذف شد",
  });
});

export const changePublished = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new HandleERROR("نظر یافت نشد", 404));
  }

  comment.isPublished = !comment.isPublished;
  const newComment = await comment.save();

  return res.status(200).json({
    success: true,
    data: newComment,
    message: "نظر با موفقیت به روزرسانی شد",
  });
});