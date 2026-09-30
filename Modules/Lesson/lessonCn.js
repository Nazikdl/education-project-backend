import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import fs from "fs";
import { __dirname } from "./../../app.js";
import Course from "../Course/courseMd.js";
import Lesson from "./lessonMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "superAdmin" || req.role === "admin"
      ? {}
      : { isPublished: true };

  const features = new ApiFeatures(Lesson, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .search(["title"])
    .limitFields()
    .paginate()
    .populate([{ path: "courseId", select: "title image" }]);

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "superAdmin" || req.role === "admin"
      ? { _id: req.params.id }
      : { isPublished: true, _id: req.params.id };

  const features = new ApiFeatures(Lesson, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "courseId",
        select: "title image",
        populate: { path: "categoryIds", select: "image title" },
      },
    ]);

  const result = await features.execute();

  if (!result.data) {
    return next(new HandleERROR("این درس یافت نشد", 404));
  }

  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.body.courseId);
  if (!course) {
    return next(new HandleERROR("دوره یافت نشد", 404));
  }

  const lesson = await Lesson.create(req.body);

  await Course.findByIdAndUpdate(lesson.courseId, {
    $addToSet: { lessonIds: lesson._id },
  });

  return res.status(201).json({
    success: true,
    data: lesson,
    message: "درس با موفقیت ایجاد شد",
  });
});

export const update = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    return next(new HandleERROR("درس یافت نشد", 404));
  }

  if (lesson.image && req.body.image && req.body.image !== lesson.image) {
    if (fs.existsSync(`${__dirname}/Public/${lesson.image}`)) {
      fs.unlinkSync(`${__dirname}/Public/${lesson.image}`);
    }
  }

  Object.assign(lesson, req.body);
  await lesson.save();

  return res.status(200).json({
    success: true,
    data: lesson,
    message: "درس با موفقیت به روز رسانی شد",
  });
});

export const togglePublish = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    return next(new HandleERROR("درس یافت نشد", 404));
  }

  lesson.isPublished = !lesson.isPublished;
  await lesson.save();

  return res.status(200).json({
    success: true,
    message: lesson.isPublished
      ? "درس با موفقیت منتشر شد"
      : "درس از حالت انتشار خارج شد",
    data: lesson,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    return next(new HandleERROR("درس یافت نشد", 404));
  }

  await Course.findByIdAndUpdate(lesson.courseId, {
    $pull: { lessonIds: lesson._id },
  });
  if (lesson.image && fs.existsSync(`${__dirname}/Public/${lesson.image}`)) {
    fs.unlinkSync(`${__dirname}/Public/${lesson.image}`);
  }

  await Lesson.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: "درس با موفقیت حذف شد",
  });
});