import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import mongoose from "mongoose";
import fs from "fs";
import { __dirname } from "./../../app.js";
import User from "../User/userMd.js";
import Comment from "../Comment/commentMd.js";
import Course from "./courseMd.js";
import Lesson from "../Lesson/lessonMd.js";

// ==================== GET ALL ====================
export const getAll = catchAsync(async (req, res, next) => {
  let condition = {};

  if (req.role === "superAdmin" || req.role === "admin") {
    condition = {};
  } else {
    condition = { isPublished: true, status: "approved" };
  }

  const features = new ApiFeatures(Course, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .search(["title"])
    .limitFields()
    .paginate()
    .populate([
      { path: "instructorId", select: "fullName phoneNumber" },
      { path: "categoryIds", select: "title" },
      { path: "lessonIds", select: "title duration isFree" },
    ]);

  const result = await features.execute();
  return res.status(200).json(result);
});

// ==================== GET MY COURSES ====================
export const getMyCourses = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Course, req.query, req.role)
    .addManualFilters({ instructorId: req.userId })
    .filter()
    .sort()
    .search(["title"])
    .limitFields()
    .paginate()
    .populate([
      { path: "categoryIds", select: "title" },
      { path: "lessonIds", select: "title duration isFree" },
    ]);

  const result = await features.execute();

  const stats = await Course.aggregate([
    {
      $match: {
        instructorId: new mongoose.Types.ObjectId(req.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCount = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  stats.forEach((s) => {
    statusCount[s._id] = s.count;
  });

  return res.status(200).json({
    ...result,
    stats: {
      ...statusCount,
      total: statusCount.pending + statusCount.approved + statusCount.rejected,
    },
  });
});

// ==================== GET ONE ====================
export const getOne = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  const isAdmin = req.role === "superAdmin" || req.role === "admin";

  const isOwnerInstructor =
    req.role === "instructor" &&
    req.userId &&
    course.instructorId.toString() === req.userId.toString();

  const isPublic = course.isPublished && course.status === "approved";

  if (!isAdmin && !isOwnerInstructor && !isPublic) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  const features = new ApiFeatures(Course, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "instructorId", select: "fullName phoneNumber" },
      { path: "categoryIds", select: "title" },
      { path: "lessonIds", select: "title duration isFree" },
      { path: "prerequisites", select: "title image price slug" },
    ]);

  const result = await features.execute();

  let isBought = false;
  let isRated = false;
  let isFavorite = false;

  if (req.userId) {
    const user = await User.findById(req.userId);

    isBought = !!user?.boughtCourseIds?.find(
      (item) => item?.toString() === req.params.id.toString()
    );

    isFavorite = !!user?.favoriteCourseIds?.find(
      (item) => item?.toString() === req.params.id.toString()
    );

    isRated = !!(await Comment.findOne({
      userId: req.userId,
      courseId: req.params.id,
      rating: { $ne: null },
    }));
  }

  return res.status(200).json({ ...result, isBought, isFavorite, isRated });
});

// ==================== CREATE ====================
export const create = catchAsync(async (req, res, next) => {
  const {
    slug,
    finalPrice,
    boughtCount,
    ratingCount,
    avgRating,
    instructorId,
    isPublished,
    status,
    ...otherData
  } = req.body;

  const isAdmin = req.role === "admin" || req.role === "superAdmin";

  const course = await Course.create({
    ...otherData,
    instructorId: req.userId,
    status: isAdmin ? "approved" : "pending",
    isPublished: isAdmin,
  });

  return res.status(201).json({
    success: true,
    data: course,
    message: isAdmin
      ? "دوره با موفقیت ایجاد و منتشر شد"
      : "دوره با موفقیت ایجاد شد و در انتظار تأیید ادمین است",
  });
});

// ==================== UPDATE ====================
export const update = catchAsync(async (req, res, next) => {
  const {
    slug,
    finalPrice,
    boughtCount,
    ratingCount,
    avgRating,
    isPublished,
    status,
    instructorId,
    ...otherData
  } = req.body;

  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  if (otherData.image && course.image && otherData.image !== course.image) {
    if (fs.existsSync(`${__dirname}/Public/${course.image}`)) {
      fs.unlinkSync(`${__dirname}/Public/${course.image}`);
    }
  }

  if (
    otherData.previewVideo &&
    course.previewVideo &&
    otherData.previewVideo !== course.previewVideo
  ) {
    if (fs.existsSync(`${__dirname}/Public/${course.previewVideo}`)) {
      fs.unlinkSync(`${__dirname}/Public/${course.previewVideo}`);
    }
  }

  Object.assign(course, otherData);
  await course.save();

  return res.status(200).json({
    success: true,
    data: course,
    message: "دوره با موفقیت به روز رسانی شد",
  });
});

// ==================== TOGGLE PUBLISH ====================
export const togglePublish = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  course.isPublished = !course.isPublished;
  course.status = course.isPublished ? "approved" : "rejected";
  await course.save();

  return res.status(200).json({
    success: true,
    message: course.isPublished
      ? "دوره با موفقیت منتشر شد"
      : "دوره از حالت انتشار خارج شد",
    data: course,
  });
});

// ==================== REMOVE ====================
export const remove = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  if (course.boughtCount > 0) {
    return next(
      new HandleERROR(
        "این دوره خریداری شده است و قابل حذف نیست. می‌توانید آن را غیرفعال کنید",
        400
      )
    );
  }

  await Comment.deleteMany({ courseId: req.params.id });
  await Lesson.deleteMany({ _id: { $in: course.lessonIds } });

  if (course.image && fs.existsSync(`${__dirname}/Public/${course.image}`)) {
    fs.unlinkSync(`${__dirname}/Public/${course.image}`);
  }

  if (
    course.previewVideo &&
    fs.existsSync(`${__dirname}/Public/${course.previewVideo}`)
  ) {
    fs.unlinkSync(`${__dirname}/Public/${course.previewVideo}`);
  }

  await Course.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: "دوره با موفقیت حذف شد",
  });
});

// ==================== TOGGLE FAVORITE ====================
export const toggleFavorite = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req;

  const user = await User.findById(userId);
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }

  const course = await Course.findById(id);
  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  const isExist = !!user.favoriteCourseIds?.find(
    (item) => item.toString() === id.toString()
  );

  if (isExist) {
    user.favoriteCourseIds = user.favoriteCourseIds.filter(
      (item) => item.toString() !== id.toString()
    );
  } else {
    user.favoriteCourseIds.push(id);
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: isExist
      ? "این دوره از لیست علاقه‌مندی‌ها حذف شد"
      : "این دوره به لیست علاقه‌مندی‌ها اضافه شد",
  });
});

// ==================== UPDATE LESSON PROGRESS ====================
export const updateLessonProgress = catchAsync(async (req, res, next) => {
  const { id: courseId, lessonId } = req.params;
  const { watchedSeconds } = req.body;
  const userId = req.userId;

  const lesson = await Lesson.findById(lessonId).select(
    "courseId videoTime"
  );
  if (!lesson) {
    return next(new HandleERROR("درس یافت نشد", 404));
  }

  if (lesson.courseId.toString() !== courseId.toString()) {
    return next(new HandleERROR("این درس متعلق به این دوره نیست", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }

  let courseProgress = user.progress.find(
    (p) => p.courseId.toString() === courseId.toString()
  );

  if (!courseProgress) {
    user.progress.push({
      courseId,
      lessons: [],
      percentage: 0,
      lastLessonId: lessonId,
      lastWatchedAt: new Date(),
    });
    courseProgress = user.progress[user.progress.length - 1];
  }

  let lessonProgress = courseProgress.lessons.find(
    (l) => l.lessonId.toString() === lessonId.toString()
  );

  if (!lessonProgress) {
    courseProgress.lessons.push({
      lessonId,
      watchedSeconds: watchedSeconds || 0,
      isCompleted: false,
      lastWatchedAt: new Date(),
    });
    lessonProgress =
      courseProgress.lessons[courseProgress.lessons.length - 1];
  } else {
    lessonProgress.watchedSeconds = Math.max(
      lessonProgress.watchedSeconds,
      watchedSeconds || 0
    );
    lessonProgress.lastWatchedAt = new Date();
  }

  const totalSeconds = (lesson.videoTime || 0) * 60;
  if (totalSeconds > 0 && lessonProgress.watchedSeconds >= totalSeconds * 0.9) {
    lessonProgress.isCompleted = true;
  }

  courseProgress.lastLessonId = lessonId;
  courseProgress.lastWatchedAt = new Date();

  await user.save();

  return res.status(200).json({
    success: true,
    message: "پیشرفت ذخیره شد",
    data: {
      courseId,
      lessonId,
      watchedSeconds: lessonProgress.watchedSeconds,
      isCompleted: lessonProgress.isCompleted,
    },
  });
});

// ==================== GET PROGRESS ====================
export const getProgress = catchAsync(async (req, res, next) => {
  const { id: courseId } = req.params;
  const userId = req.userId;

  const course = await Course.findById(courseId).select("lessonCount");
  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }

  let courseProgress = user.progress.find(
    (p) => p.courseId.toString() === courseId.toString()
  );

  if (!courseProgress) {
    user.progress.push({
      courseId,
      lessons: [],
      percentage: 0,
      lastLessonId: null,
      lastWatchedAt: null,
    });
    courseProgress = user.progress[user.progress.length - 1];
    await user.save();
  }

  const completedLessons = courseProgress.lessons.filter(
    (l) => l.isCompleted
  ).length;

  const totalLessons = course.lessonCount;

  const percentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (courseProgress.percentage !== percentage) {
    courseProgress.percentage = percentage;
    await user.save();
  }

  return res.status(200).json({
    success: true,
    data: {
      courseId,
      completedLessons,
      totalLessons,
      percentage,
      lastLessonId: courseProgress.lastLessonId,
      lastWatchedAt: courseProgress.lastWatchedAt,
      lessons: courseProgress.lessons,
    },
  });
});