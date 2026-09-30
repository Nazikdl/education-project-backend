import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Course from "../Course/courseMd.js";
import Category from "../Category/categoryMd.js";
import Lesson from "../Lesson/lessonMd.js";

export const search = catchAsync(async (req, res, next) => {
  const isAdmin = req.role === "admin" || req.role === "superAdmin";

  const courseCondition = isAdmin
    ? {}
    : { isPublished: true, status: "approved" };

  const categoryCondition = isAdmin ? {} : { isPublished: true };
  const lessonCondition = isAdmin ? {} : { isPublished: true };

  const perPage = Math.min(parseInt(req.query.limit) || 10, 5);

  const courseFeatures = new ApiFeatures(
    Course,
    { ...req.query, limit: perPage },
    req.role
  )
    .addManualFilters(courseCondition)
    .filter()
    .sort()
    .search(["title", "description", "tags"])
    .limitFields()
    .paginate()
    .populate([
      { path: "instructorId", select: "fullName" },
      { path: "categoryIds", select: "title" },
    ]);

  const courseResult = await courseFeatures.execute();

  const categoriesFeatures = new ApiFeatures(
    Category,
    { ...req.query, limit: perPage },
    req.role
  )
    .addManualFilters(categoryCondition)
    .search(["title"])
    .sort()
    .limitFields()
    .paginate()
    .populate([{ path: "supCategoryId", select: "title" }]);

  const categoriesResult = await categoriesFeatures.execute();

  const lessonFeatures = new ApiFeatures(
    Lesson,
    { ...req.query, limit: perPage },
    req.role
  )
    .addManualFilters(lessonCondition)
    .search(["title", "description"])
    .sort()
    .limitFields()
    .paginate()
    .populate([{ path: "courseId", select: "title image slug" }]);

  const lessonResult = await lessonFeatures.execute();

  const courses = courseResult?.data || [];
  const categories = categoriesResult?.data || [];
  const lessons = lessonResult?.data || [];

  const courseCount =
    courseResult?.results || courseResult?.count || courses.length;
  const categoryCount =
    categoriesResult?.results || categoriesResult?.count || categories.length;
  const lessonCount =
    lessonResult?.results || lessonResult?.count || lessons.length;

  const totalResults = courseCount + categoryCount + lessonCount;

  if (totalResults === 0) {
    return next(new HandleERROR("نتیجه‌ای یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: {
      courses,
      categories,
      lessons,
    },
    results: {
      courses: courseCount,
      categories: categoryCount,
      lessons: lessonCount,
      total: totalResults,
    },
  });
});