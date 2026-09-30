import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Category from "../Category/categoryMd.js";
import Course from "../Course/courseMd.js";
import Lesson from "../Lesson/lessonMd.js";

export const search = catchAsync(async (req, res, next) => {
  const condition = { isPublished: true };
  const role = req.role || 'student';

  const courseFeatures = new ApiFeatures(Course, req.query, role)
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
      { path: "prerequisites", select: "title image price slug" },
    ]);
  const course = await courseFeatures.execute();

  const categoriesFeatures = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["title"])
    .sort()
    .limitFields()
    .paginate()
    .populate([{ path: "supCategoryId" }, { path: "subCategoryIds" }]);
  const categories = await categoriesFeatures.execute();
  const lessonFeatures = new ApiFeatures(Lesson, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["title"])
    .sort()
    .limitFields()
    .paginate();
  const lesson = await lessonFeatures.execute();
  if (course.count == 0 && categories.count == 0 && lesson.count == 0) {
    return next(new HandleERROR("نتیجه ای یافت نشد", 404));
  }
  return res.status(200).json({
    success: true,
    data: {
      course,
      categories,
      lesson,
    },
  });
});
