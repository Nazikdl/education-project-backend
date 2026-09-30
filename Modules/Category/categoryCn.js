import fs from "fs";
import { __dirname } from "../../app.js";
import Category from "./categoryMd.js";
import Course from "../Course/courseMd.js";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";

// ==================== GET ALL ====================
export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role !== "admin" && req.role !== "superAdmin"
      ? { isPublished: true }
      : {};

  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(condition)
    .search(["title"])
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([{ path: "supCategoryId", select: "title slug" }]);

  const result = await features.execute();
  return res.status(200).json(result);
});

// ==================== GET ONE ====================
export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role !== "admin" && req.role !== "superAdmin"
      ? { isPublished: true, _id: req.params.id }
      : { _id: req.params.id };

  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "supCategoryId", select: "title slug" },
      { path: "subCategoryIds", select: "title slug image" },
      {
        path: "courseIds",
        select: "title image price finalPrice slug avgRating",
      },
    ]);

  const result = await features.execute();
  return res.status(200).json(result);
});

// ==================== CREATE ====================
export const create = catchAsync(async (req, res, next) => {
  const { title, image, isPublished, supCategoryId, courseIds } = req.body;

  if (supCategoryId) {
    const parent = await Category.findById(supCategoryId);
    if (!parent) {
      return next(new HandleERROR("دسته‌بندی والد یافت نشد", 404));
    }
  }

  const category = await Category.create({
    title,
    image,
    isPublished,
    supCategoryId: supCategoryId || null,
    courseIds: courseIds || [],
  });

  if (category.supCategoryId) {
    await Category.findByIdAndUpdate(category.supCategoryId, {
      $addToSet: { subCategoryIds: category._id },
    });
  }

  return res.status(201).json({
    success: true,
    data: category,
    message: "دسته‌بندی با موفقیت اضافه شد",
  });
});

// ==================== UPDATE ====================
export const update = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new HandleERROR("دسته‌بندی یافت نشد", 404));
  }

  if (
    req.body.supCategoryId &&
    req.body.supCategoryId.toString() === req.params.id.toString()
  ) {
    return next(new HandleERROR("دسته‌بندی نمی‌تواند والد خودش باشد", 400));
  }

  if (req.body.supCategoryId) {
    const parent = await Category.findById(req.body.supCategoryId);
    if (!parent) {
      return next(new HandleERROR("دسته‌بندی والد یافت نشد", 404));
    }
  }

  const oldSupId = category.supCategoryId?.toString() || null;

  const { courseCount, ...otherData } = req.body;

  const newCategory = await Category.findByIdAndUpdate(
    req.params.id,
    otherData,
    {
      new: true,
      runValidators: true,
    }
  );

  const newSupId = newCategory?.supCategoryId?.toString() || null;

  if (oldSupId !== newSupId) {
    if (oldSupId) {
      await Category.findByIdAndUpdate(oldSupId, {
        $pull: { subCategoryIds: category._id },
      });
    }
    if (newSupId) {
      await Category.findByIdAndUpdate(newSupId, {
        $addToSet: { subCategoryIds: category._id },
      });
    }
  }

  if (
    category.image &&
    req.body.image &&
    req.body.image !== category.image &&
    fs.existsSync(`${__dirname}/Public/${category.image}`)
  ) {
    fs.unlinkSync(`${__dirname}/Public/${category.image}`);
  }

  return res.status(200).json({
    success: true,
    data: newCategory,
    message: "دسته‌بندی با موفقیت به‌روزرسانی شد",
  });
});

// ==================== REMOVE ====================
export const remove = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new HandleERROR("دسته‌بندی یافت نشد", 404));
  }

  const course = await Course.findOne({ categoryIds: req.params.id });
  if (course) {
    return next(
      new HandleERROR("این دسته‌بندی شامل دوره است و قابل حذف نیست", 400)
    );
  }

  const subCat = await Category.findOne({ supCategoryId: req.params.id });
  if (subCat) {
    return next(
      new HandleERROR("این دسته‌بندی شامل زیردسته است و قابل حذف نیست", 400)
    );
  }

  if (category.supCategoryId) {
    await Category.findByIdAndUpdate(category.supCategoryId, {
      $pull: { subCategoryIds: category._id },
    });
  }

  if (
    category.image &&
    fs.existsSync(`${__dirname}/Public/${category.image}`)
  ) {
    fs.unlinkSync(`${__dirname}/Public/${category.image}`);
  }

  await Category.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: "دسته‌بندی با موفقیت حذف شد",
  });
});